import { cookies } from 'next/headers'
import { neon } from '@neondatabase/serverless'

export default async function TestSessionPage() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  const sessionToken = cookieStore.get('threadmoat_session')?.value
  
  let sessionInfo = null
  let error = null
  
  if (sessionToken) {
    try {
      const sql = neon(process.env.DATABASE_URL!)
      const result = await sql`
        SELECT u.email, u.company_name, s.expires_at 
        FROM sessions s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.token = ${sessionToken} AND s.expires_at > NOW()
      `
      sessionInfo = result[0] || null
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error'
    }
  }
  
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Session Debug Page</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">All Cookies:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(allCookies.map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' })), null, 2)}
        </pre>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Session Token:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm">
          {sessionToken ? sessionToken.substring(0, 20) + '...' : 'NOT FOUND'}
        </pre>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Session Info from DB:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm">
          {error ? `Error: ${error}` : sessionInfo ? JSON.stringify(sessionInfo, null, 2) : 'No valid session found'}
        </pre>
      </div>
      
      <a href="/auth/login" className="text-blue-600 underline">Go to Login</a>
    </div>
  )
}
