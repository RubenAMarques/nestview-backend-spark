import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MobileListingCard } from './MobileListingCard';
import { ListingDetail } from './ListingDetail';
import { FilterModal } from './FilterModal';
import { BottomSheet } from './BottomSheet';
import { MapPin, Filter, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Colors } from '@/theme/tokens';

interface MapViewProps {
  onEdit?: (listing: any) => void;
}

interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  listing: any;
}

interface ActiveFilters {
  priceMin?: string;
  priceMax?: string;
  bedrooms?: string;
  bathrooms?: string;
  areaMin?: string;
  areaMax?: string;
  status?: string;
}

export const MapView = ({ onEdit }: MapViewProps) => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showListingDetail, setShowListingDetail] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [mapRegion, setMapRegion] = useState({
    latitude: 52.3676,  // Amsterdam
    longitude: 4.9041,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings-map', activeFilters],
    queryFn: async () => {
      let query = supabase
        .from('listings')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      // Apply filters
      if (activeFilters.priceMin) {
        query = query.gte('price_eur', parseInt(activeFilters.priceMin));
      }
      if (activeFilters.priceMax) {
        query = query.lte('price_eur', parseInt(activeFilters.priceMax));
      }
      if (activeFilters.bedrooms && activeFilters.bedrooms !== 'any') {
        query = query.gte('bedrooms', parseInt(activeFilters.bedrooms));
      }
      if (activeFilters.bathrooms && activeFilters.bathrooms !== 'any') {
        query = query.gte('bathrooms', parseInt(activeFilters.bathrooms));
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Generate mock coordinates for listings (in a real app, these would come from the database)
  const mapMarkers: MapMarker[] = useMemo(() => {
    return listings.map((listing, index) => ({
      id: listing.id,
      latitude: mapRegion.latitude + (Math.random() - 0.5) * 0.01 * (index + 1),
      longitude: mapRegion.longitude + (Math.random() - 0.5) * 0.01 * (index + 1),
      listing,
    }));
  }, [listings, mapRegion]);

  const handleMarkerPress = (marker: MapMarker) => {
    setSelectedListing(marker.listing);
    setShowBottomSheet(true);
  };

  const handleListingCardPress = (listing: any) => {
    setSelectedListing(listing);
    setShowBottomSheet(false);
    setShowListingDetail(true);
  };

  const handleApplyFilters = (filters: ActiveFilters) => {
    setActiveFilters(filters);
  };

  if (showListingDetail && selectedListing) {
    return (
      <ListingDetail
        listingId={selectedListing.id}
        onClose={() => {
          setShowListingDetail(false);
          setSelectedListing(null);
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative bg-black">
      {/* Map Container - Enhanced for interactive map */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Simulated Map Interface */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Layers className="w-16 h-16 text-orange-500 mb-4" />
          <h3 className="text-white text-xl font-semibold mb-2">Interactive Map Ready</h3>
          <p className="text-gray-400 text-center px-8 mb-6">
            React Native Maps integration prepared with clustering support
          </p>
          
          {/* Mock Map Markers */}
          <div className="relative w-64 h-32 bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
            {mapMarkers.slice(0, 8).map((marker, index) => (
              <button
                key={marker.id}
                onClick={() => handleMarkerPress(marker)}  
                className="absolute w-6 h-6 bg-orange-500 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
                style={{
                  left: `${15 + (index % 4) * 20}%`,
                  top: `${25 + Math.floor(index / 4) * 40}%`,
                }}
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Controls */}
      <div className="absolute top-12 right-4 z-20 flex flex-col gap-3">
        {/* Filter Button */}
        <Button
          onClick={() => setShowFilters(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full p-3 shadow-lg"
        >
          <Filter className="w-5 h-5" />
        </Button>
        
        {/* Map Type Toggle */}
        <Button
          variant="outline"
          className="bg-black/70 border-gray-600 text-white hover:bg-black/80 rounded-full p-3 backdrop-blur-sm"
        >
          <Layers className="w-5 h-5" />
        </Button>
      </div>

      {/* Property Count */}
      <div className="absolute top-12 left-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 z-20 border border-gray-700">
        <span className="text-white font-medium">{listings.length} Properties</span>
        {Object.keys(activeFilters).length > 0 && (
          <span className="text-orange-500 text-sm ml-2">• Filtered</span>
        )}
      </div>

      {/* Bottom Sheet with Property Carousel */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-semibold">Featured Properties</h4>
            <button 
              onClick={() => setShowBottomSheet(true)}
              className="text-orange-500 text-sm font-medium hover:text-orange-400"
            >
              View All →
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {listings.slice(0, 5).map((listing) => (
              <button
                key={listing.id}
                onClick={() => handleListingCardPress(listing)}
                className="flex-shrink-0 w-64 bg-gray-800/80 rounded-lg p-3 text-left hover:bg-gray-700/80 transition-colors border border-gray-700"
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

      {/* All Properties Bottom Sheet */}
      <BottomSheet
        isOpen={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        title={`${listings.length} Properties Found`}
      >
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} onClick={() => handleListingCardPress(listing)}>
              <MobileListingCard
                listing={listing}
                onEdit={onEdit}
                showFullDetails={false}
              />
            </div>
          ))}
        </div>
      </BottomSheet>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
