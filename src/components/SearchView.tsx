
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MobileListingCard } from './MobileListingCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { BottomSheet } from './BottomSheet';

interface SearchViewProps {
  onEdit?: (listing: any) => void;
}

export const SearchView = ({ onEdit }: SearchViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings-search', searchTerm, priceRange, bedrooms, bathrooms],
    queryFn: async () => {
      let query = supabase
        .from('listings')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`);
      }

      if (priceRange.min) {
        query = query.gte('price_eur', Number(priceRange.min));
      }
      if (priceRange.max) {
        query = query.lte('price_eur', Number(priceRange.max));
      }
      if (bedrooms) {
        query = query.eq('bedrooms', Number(bedrooms));
      }
      if (bathrooms) {
        query = query.eq('bathrooms', Number(bathrooms));
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    setBedrooms('');
    setBathrooms('');
  };

  const hasActiveFilters = priceRange.min || priceRange.max || bedrooms || bathrooms;

  return (
    <div className="flex-1 bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-4">Search Properties</h1>
        
        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search by location, title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>

        {/* Filter Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(true)}
            className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {[priceRange.min, priceRange.max, bedrooms, bathrooms].filter(Boolean).length}
              </span>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-gray-400 hover:text-white"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-lg">Searching...</div>
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 px-8">
            <Search className="w-16 h-16 text-gray-600 mb-4" />
            <div className="text-gray-400 text-lg text-center">No properties found</div>
            <div className="text-gray-500 text-sm text-center mt-2">
              Try adjusting your search criteria
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="text-gray-400 text-sm mb-4">
              {listings.length} propert{listings.length !== 1 ? 'ies' : 'y'} found
            </div>
            
            {listings.map((listing) => (
              <MobileListingCard
                key={listing.id}
                listing={listing}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filters Bottom Sheet */}
      <BottomSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Properties"
      >
        <div className="space-y-6">
          {/* Price Range */}
          <div>
            <label className="block text-white font-medium mb-3">Price Range (EUR)</label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Min price"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Input
                type="number"
                placeholder="Max price"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-white font-medium mb-3">Bedrooms</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((num) => (
                <Button
                  key={num}
                  variant={bedrooms === num.toString() ? "default" : "outline"}
                  onClick={() => setBedrooms(bedrooms === num.toString() ? '' : num.toString())}
                  className={`${
                    bedrooms === num.toString()
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-white font-medium mb-3">Bathrooms</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((num) => (
                <Button
                  key={num}
                  variant={bathrooms === num.toString() ? "default" : "outline"}
                  onClick={() => setBathrooms(bathrooms === num.toString() ? '' : num.toString())}
                  className={`${
                    bathrooms === num.toString()
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <Button
            onClick={() => setShowFilters(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Apply Filters
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
};
