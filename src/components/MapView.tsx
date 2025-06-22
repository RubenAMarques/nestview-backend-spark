
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MobileListingCard } from './MobileListingCard';
import { BottomSheet } from './BottomSheet';
import { MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapViewProps {
  onEdit?: (listing: any) => void;
}

export const MapView = ({ onEdit }: MapViewProps) => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings-map'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleListingSelect = (listing: any) => {
    setSelectedListing(listing);
    setShowBottomSheet(true);
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative bg-black">
      {/* Map Container - Ready for react-native-maps integration */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center">
        <MapPin className="w-16 h-16 text-orange-500 mb-4" />
        <h3 className="text-white text-xl font-semibold mb-2">Interactive Map</h3>
        <p className="text-gray-400 text-center px-8">
          Map integration ready. Property markers will cluster here.
        </p>
      </div>

      {/* Floating Filter Button */}
      <div className="absolute top-12 right-4 z-20">
        <Button
          onClick={() => setShowFilters(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full p-3 shadow-lg"
        >
          <Filter className="w-5 h-5" />
        </Button>
      </div>

      {/* Property Count */}
      <div className="absolute top-12 left-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 z-20">
        <span className="text-white font-medium">{listings.length} Properties</span>
      </div>

      {/* Bottom Sheet with Property Carousel */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-4">
          <h4 className="text-white font-semibold mb-3">Featured Properties</h4>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {listings.slice(0, 5).map((listing) => (
              <button
                key={listing.id}
                onClick={() => handleListingSelect(listing)}
                className="flex-shrink-0 w-64 bg-gray-800/80 rounded-lg p-3 text-left hover:bg-gray-700/80 transition-colors"
              >
                <div className="text-orange-500 font-bold text-lg mb-1">
                  €{listing.price_eur.toLocaleString()}
                </div>
                <div className="text-white font-medium text-sm mb-1 truncate">
                  {listing.title}
                </div>
                <div className="text-gray-400 text-xs">
                  {listing.bedrooms} bed • {listing.bathrooms || 0} bath
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listing Detail Bottom Sheet */}
      <BottomSheet
        isOpen={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        title="Property Details"
      >
        {selectedListing && (
          <MobileListingCard
            listing={selectedListing}
            onEdit={onEdit}
            showFullDetails={true}
          />
        )}
      </BottomSheet>
    </div>
  );
};
