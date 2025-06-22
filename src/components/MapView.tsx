
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MobileListingCard } from './MobileListingCard';
import { BottomSheet } from './BottomSheet';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  onEdit?: (listing: any) => void;
}

export const MapView = ({ onEdit }: MapViewProps) => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

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
      <div className="flex-1 bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative bg-gray-900">
      {/* Temporary Map Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center">
        <MapPin className="w-16 h-16 text-blue-400 mb-4" />
        <h3 className="text-white text-xl font-semibold mb-2">Interactive Map</h3>
        <p className="text-gray-400 text-center px-8">
          Map integration coming next. Tap a property below to preview.
        </p>
      </div>

      {/* Floating property count */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2">
        <span className="text-white font-medium">{listings.length} Properties</span>
      </div>

      {/* Quick property preview grid at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4">
          <h4 className="text-white font-semibold mb-3">Recent Properties</h4>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {listings.slice(0, 5).map((listing) => (
              <button
                key={listing.id}
                onClick={() => handleListingSelect(listing)}
                className="flex-shrink-0 w-48 bg-gray-700/80 rounded-lg p-3 text-left hover:bg-gray-600/80 transition-colors"
              >
                <div className="text-blue-400 font-bold text-lg mb-1">
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

      {/* Bottom Sheet for Selected Listing */}
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
