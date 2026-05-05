'use client';

import { useEffect, useState } from 'react';
import { PropertySelector } from '@/app/components/gsc/selectors';
import { DateRangePicker } from '@/app/components/gsc/selectors';
import { TrendsChart } from '@/app/components/gsc/trends-chart';

interface Property {
  id: string;
  property_url: string;
  sync_status: string;
}

export default function GSCDashboard() {
  const [propertyId, setPropertyId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/admin/gsc/properties');
        const data = await res.json();
        setProperties(data.properties || []);
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

  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);

    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  }, []);

  if (loading || !propertyId) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">GSC Analytics</h1>
        <p className="text-gray-600 mt-2">Search performance and keyword rankings</p>
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

      {/* Trends Chart */}
      {propertyId && startDate && endDate && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Trends</h2>
          <TrendsChart
            propertyId={propertyId}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      )}
    </div>
  );
}
