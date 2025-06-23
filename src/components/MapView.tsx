
import { useState } from 'react';
import { InteractiveMap } from './InteractiveMap';
import { ListingDetail } from './ListingDetail';

interface MapViewProps {
  onEdit?: (listing: any) => void;
}

export const MapView = ({ onEdit }: MapViewProps) => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [showListingDetail, setShowListingDetail] = useState(false);

  const handleListingSelect = (listing: any) => {
    setSelectedListing(listing);
    setShowListingDetail(true);
  };

  const handleCloseDetail = () => {
    setShowListingDetail(false);
    setSelectedListing(null);
  };

  if (showListingDetail && selectedListing) {
    return (
      <ListingDetail
        listingId={selectedListing.id}
        onClose={handleCloseDetail}
      />
    );
  }

  return (
    <InteractiveMap
      onListingSelect={handleListingSelect}
      onEdit={onEdit}
    />
  );
};
