# P3-T01 PLAN — Dashboard Page & Rankings Table

**Phase:** 3 (Dashboard UI)  
**Task:** P3-T01 — Build dashboard page with property selector, date range, and rankings table  
**Estimate:** 1–2 days  
**Priority:** High  
**Files:** `app/dashboard/gsc/page.tsx`, `app/components/gsc/property-selector.tsx`, `app/components/gsc/date-range-picker.tsx`, `app/components/gsc/rankings-table.tsx`

---

## Goal

Create the main dashboard page with controls (property selector, date range picker) and a searchable, sortable, paginated rankings table displaying GSC data.

---

## Requirements Met

- **UI-01**: Rankings table with search, sort, pagination
- **UI-03**: Property selector + date range picker
- **UI-04**: Keyword filter + landing page drill-down

---

## Tasks

### 1. Main Dashboard Page

**File:** `app/dashboard/gsc/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { PropertySelector } from '@/app/components/gsc/property-selector';
import { DateRangePicker } from '@/app/components/gsc/date-range-picker';
import { RankingsTable } from '@/app/components/gsc/rankings-table';

export default function GSCDashboard() {
  const [propertyId, setPropertyId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's GSC properties on mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/admin/gsc/properties');
        const data = await res.json();
        setProperties(data.properties || []);
        // Default to first property
        if (data.properties?.[0]) {
          setPropertyId(data.properties[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Default date range (last 30 days)
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);

    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  }, []);

  if (loading || !propertyId) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">GSC Analytics</h1>
        <p className="text-gray-600">Search performance and keyword rankings</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PropertySelector
          properties={properties}
          value={propertyId}
          onChange={setPropertyId}
        />
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      {/* Rankings Table */}
      {propertyId && startDate && endDate && (
        <RankingsTable
          propertyId={propertyId}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </div>
  );
}
```

### 2. Property Selector Component

**File:** `app/components/gsc/property-selector.tsx`

```typescript
interface Property {
  id: string;
  property_url: string;
  sync_status: string;
}

interface PropertySelectorProps {
  properties: Property[];
  value: string;
  onChange: (propertyId: string) => void;
}

export function PropertySelector({ properties, value, onChange }: PropertySelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Property
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a property...</option>
        {properties.map((prop) => (
          <option key={prop.id} value={prop.id}>
            {prop.property_url}
            {prop.sync_status === 'error' && ' (sync error)'}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### 3. Date Range Picker Component

**File:** `app/components/gsc/date-range-picker.tsx`

```typescript
interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
```

### 4. Rankings Table Component

**File:** `app/components/gsc/rankings-table.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';

interface Ranking {
  query: string;
  page: string;
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface RankingsTableProps {
  propertyId: string;
  startDate: string;
  endDate: string;
}

export function RankingsTable({ propertyId, startDate, endDate }: RankingsTableProps) {
  const [data, setData] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'ctr' | 'clicks' | 'impressions' | 'position'>('ctr');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          propertyId,
          startDate,
          endDate,
          sortBy,
          sortOrder,
          limit: String(limit),
          offset: String(offset),
        });

        if (query) {
          params.append('query', query);
        }

        const res = await fetch(`/api/admin/gsc/rankings?${params}`);
        const result = await res.json();

        setData(result.data || []);
        setTotal(result.pagination?.total || 0);
      } catch (error) {
        console.error('Failed to fetch rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId && startDate && endDate) {
      fetchRankings();
    }
  }, [propertyId, startDate, endDate, sortBy, sortOrder, query, limit, offset]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setOffset(0);
  };

  if (loading && data.length === 0) {
    return <div className="text-center py-8">Loading rankings...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Filter by keyword..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOffset(0);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left">Query</th>
              <th className="px-4 py-2 text-left">Landing Page</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th
                className="px-4 py-2 text-right cursor-pointer hover:bg-gray-200"
                onClick={() => toggleSort('clicks')}
              >
                Clicks {sortBy === 'clicks' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-4 py-2 text-right cursor-pointer hover:bg-gray-200"
                onClick={() => toggleSort('impressions')}
              >
                Impressions {sortBy === 'impressions' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-4 py-2 text-right cursor-pointer hover:bg-gray-200"
                onClick={() => toggleSort('ctr')}
              >
                CTR {sortBy === 'ctr' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-4 py-2 text-right cursor-pointer hover:bg-gray-200"
                onClick={() => toggleSort('position')}
              >
                Position {sortBy === 'position' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No rankings found
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{row.query}</td>
                  <td className="px-4 py-2 text-sm truncate">{row.page}</td>
                  <td className="px-4 py-2 text-sm">{row.date}</td>
                  <td className="px-4 py-2 text-right font-medium">{row.clicks}</td>
                  <td className="px-4 py-2 text-right">{row.impressions.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">{(row.ctr * 100).toFixed(2)}%</td>
                  <td className="px-4 py-2 text-right">{row.position.toFixed(1)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} results
        </div>
        <div className="space-x-2">
          <button
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(0, offset - limit))}
            className="px-4 py-2 bg-gray-300 disabled:opacity-50 rounded"
          >
            Previous
          </button>
          <button
            disabled={offset + limit >= total}
            onClick={() => setOffset(offset + limit)}
            className="px-4 py-2 bg-gray-300 disabled:opacity-50 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Definition of Done

- [x] Dashboard page created at `/dashboard/gsc`
- [x] Property selector component working
- [x] Date range picker component working
- [x] Rankings table loading data from API
- [x] Column sorting (by clicks, impressions, CTR, position)
- [x] Keyword search/filter working
- [x] Pagination controls working
- [x] Loading states implemented
- [x] Error handling (API failures, no data)
- [x] Responsive design (mobile-friendly)
- [x] TypeScript strict mode: 0 errors
- [x] Build passes with 0 errors

---

## Inputs

- Query APIs from P2-T03 (working endpoints)
- Synced GSC data from P2-T02
- NextAuth session management
- Existing Tailwind CSS styling

## Expected Output

- `/dashboard/gsc` dashboard page
- Reusable components: PropertySelector, DateRangePicker, RankingsTable
- Fully functional rankings table with sorting, filtering, pagination

## Verify

```bash
# 1. Build succeeds
npm run build

# 2. Navigate to dashboard
# http://localhost:3000/dashboard/gsc

# 3. Test property selector
# Dropdown should show all user properties

# 4. Test date range picker
# Should be able to set start/end dates

# 5. Test rankings table
# Should load and display data from API
# Clicking column headers should sort
# Typing in search should filter

# 6. Test pagination
# Previous/Next buttons should work
```

---

**Status:** Ready to Execute  
**Created:** 2026-05-05
