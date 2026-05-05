/**
 * GET /api/admin/gsc/trends
 * Aggregate rankings by date (time-series for charts)
 * M027 Phase 2: Query API for SEO analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sql } from '@/lib/db';
import { getTrendsByDate } from '@/lib/gsc-queries';

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

    // Get trends
    const result = await getTrendsByDate(propertyId, startDate, endDate, {
      groupBy: (url.searchParams.get('groupBy') || 'date') as any,
      query: url.searchParams.get('query') || undefined,
      metric: (url.searchParams.get('metric') || 'clicks') as any,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Trends query error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Query failed' },
      { status: 500 }
    );
  }
}
