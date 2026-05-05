/**
 * GET /api/admin/gsc/properties
 * Fetch all GSC properties for the authenticated user
 * M027 Phase 3: Dashboard support endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[GSC Properties API] User ID:', session.user.id, 'Email:', session.user.email);

    // Fetch all properties for this user
    const properties = await sql`
      SELECT id, property_url, sync_status, last_synced_at
      FROM gsc_properties
      WHERE user_id = ${session.user.id}
      ORDER BY last_synced_at DESC NULLS LAST
    `;

    console.log('[GSC Properties API] Found properties:', properties?.length || 0);

    return NextResponse.json({
      properties: properties || [],
      count: (properties || []).length,
    });
  } catch (error) {
    console.error('Properties query error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Query failed' },
      { status: 500 }
    );
  }
}
