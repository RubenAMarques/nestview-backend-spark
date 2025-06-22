
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriceSparklineProps {
  listingId: string;
  currentPrice: number;
}

export const PriceSparkline = ({ listingId, currentPrice }: PriceSparklineProps) => {
  const { data: priceHistory = [], isLoading } = useQuery({
    queryKey: ['price-history', listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listing_prices')
        .select('price_eur, changed_at')
        .eq('listing_id', listingId)
        .order('changed_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading || priceHistory.length < 2) {
    return (
      <div className="flex items-center gap-2 text-gray-400">
        <Minus className="w-4 h-4" />
        <span className="text-sm">No price history</span>
      </div>
    );
  }

  const chartData = priceHistory.map(item => ({
    price: item.price_eur,
    date: item.changed_at,
  }));

  const firstPrice = priceHistory[0]?.price_eur || currentPrice;
  const lastPrice = priceHistory[priceHistory.length - 1]?.price_eur || currentPrice;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = ((priceChange / firstPrice) * 100).toFixed(1);

  const isPositive = priceChange > 0;
  const isNegative = priceChange < 0;

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-medium">Price History</h4>
        <div className={`flex items-center gap-1 text-sm ${
          isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400'
        }`}>
          {isPositive && <TrendingUp className="w-4 h-4" />}
          {isNegative && <TrendingDown className="w-4 h-4" />}
          {!isPositive && !isNegative && <Minus className="w-4 h-4" />}
          <span>
            {priceChange > 0 ? '+' : ''}
            {priceChangePercent}%
          </span>
        </div>
      </div>

      <div className="h-12 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#10B981' : isNegative ? '#EF4444' : '#6B7280'}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs text-gray-400">
        {priceHistory.length} price updates since listing
      </div>
    </div>
  );
};
