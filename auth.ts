import NextAuth, { CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'
import { rateLimit } from '@/lib/rate-limit'

class EmailNotVerifiedError extends CredentialsSignin {
  code = 'email_not_verified'
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = (credentials.email as string || '').trim().toLowerCase()

        // Rate limit: 10 attempts per email per 15 minutes
        const rl = await rateLimit(`login:${email}`, 10, 15 * 60 * 1000)
        if (!rl.allowed) return null

        const sql = neon(process.env.DATABASE_URL!)
        const rows = await sql`
          SELECT id, email, password_hash, email_verified, session_version
          FROM users
          WHERE email = ${email}
        `
        const user = rows[0]
        if (!user) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash as string,
        )
        if (!valid) return null

        // Block login if email not verified — throw distinct error with custom code
        if (user.email_verified === false) {
          throw new EmailNotVerifiedError()
        }

        return {
          id: user.id as string,
          email: user.email as string,
          sessionVersion: (user.session_version as number) ?? 0,
        }
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 30 * 60 },  // 30-minute session expiry
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.sessionVersion = (user as Record<string, unknown>).sessionVersion ?? 0
      }
      return token
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string

      // Validate session version — reject stale JWTs after password reset
      if (token.id && typeof token.sessionVersion === 'number') {
        try {
          const checkSql = neon(process.env.DATABASE_URL!)
          const rows = await checkSql`
            SELECT session_version FROM users WHERE id = ${token.id as string}
          `
          const dbVersion = (rows[0]?.session_version as number) ?? 0
          if (dbVersion > (token.sessionVersion as number)) {
            // Session invalidated — return empty session to force re-auth
            session.user.id = ''
            return session
          }
        } catch {
          // DB error — allow session to continue rather than lock out users
        }
      }

      return session
    },
  },
})
