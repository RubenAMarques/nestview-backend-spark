
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WebMapFallback } from './WebMapFallback';

interface MapProps {
  onListingSelect: (listing: any) => void;
  onEdit?: (listing: any) => void;
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

// Check if we're in a React Native environment
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

export const InteractiveMap = ({ onListingSelect, onEdit }: MapProps) => {
  // For web environment, use the fallback component
  if (!isReactNative) {
    return <WebMapFallback onListingSelect={onListingSelect} onEdit={onEdit} />;
  }

  // For React Native environment, we would use the actual map
  // Since we're in web preview mode, this will fallback to WebMapFallback
  return <WebMapFallback onListingSelect={onListingSelect} onEdit={onEdit} />;
};
