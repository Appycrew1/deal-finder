"use client";

import { useState } from 'react';
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function DealFinder() {
  const [company, setCompany] = useState('');
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("SUPABASE URL:", supabaseUrl);

  const handleSearch = async () => {
    if (!company.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .ilike('company', `%${company}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDeals(data);
    } catch (error) {
      console.error("Error fetching deals:", error);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Deal Finder</h1>
      <div className="flex gap-2 mb-6">
        <Input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Enter company name (e.g., Nike)"
        />
        <Button onClick={handleSearch} disabled={loading || !company.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <div className="space-y-4">
        {deals.length > 0 ? (
          deals.map((deal, idx) => (
            <Card key={idx}>
              <CardContent className="p-4">
                <h2 className="font-semibold text-lg">{deal.title}</h2>
                <p className="text-sm text-gray-600">{deal.description}</p>
                {deal.code && (
                  <p className="mt-2 font-mono bg-gray-100 p-2 rounded">Code: {deal.code}</p>
                )}
                <a
                  href={deal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm"
                >
                  Visit Deal
                </a>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">No deals found. Try another company.</p>
        )}
      </div>
    </div>
  );
}
