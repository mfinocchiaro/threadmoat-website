/**
 * GET /api/admin/gsc/rankings
 * Query top-performing keywords and their rankings over time
 * M027 Phase 2: Query API for SEO analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sql } from '@/lib/db';
import { getRankingsByQuery } from '@/lib/gsc-queries';

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query params
    const url = new URL(request.url);
    const propertyId = url.searchParams.get('propertyId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    if (!propertyId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required params: propertyId, startDate, endDate' },
        { status: 400 }
      );
    }

    // Verify user owns this property
    const property = await sql`
      SELECT id FROM gsc_properties
      WHERE id = ${propertyId} AND user_id = ${session.user.id}
    `;

    if (!property.length) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Get rankings
    const result = await getRankingsByQuery(propertyId, startDate, endDate, {
      query: url.searchParams.get('query') || undefined,
      page: url.searchParams.get('page') || undefined,
      limit: parseInt(url.searchParams.get('limit') || '50'),
      offset: parseInt(url.searchParams.get('offset') || '0'),
      sortBy: (url.searchParams.get('sortBy') || 'ctr') as any,
      sortOrder: (url.searchParams.get('sortOrder') || 'desc') as any,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Rankings query error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Query failed' },
      { status: 500 }
    );
  }
}
