
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Heart, Share, MapPin, Bed, Bath, Square, Phone, Mail, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PriceSparkline } from './PriceSparkline';
import { BottomSheet } from './BottomSheet';
import { Colors, Typography } from '@/theme/tokens';

interface ListingDetailProps {
  listingId: string;
  onClose: () => void;
}

export const ListingDetail = ({ listingId, onClose }: ListingDetailProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showContact, setShowContact] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  // Mock images for carousel
  const mockImages = [1, 2, 3, 4, 5, 6];

  // Fetch listing details
  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing-detail', listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', listingId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Check if favorited
  const { data: isFavorited = false } = useQuery({
    queryKey: ['is-favorited', listingId],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from('user_favourites')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', listingId);
      
      if (error) throw error;
      return data.length > 0;
    },
    enabled: !!user,
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in');
      
      if (isFavorited) {
        const { error } = await supabase
          .from('user_favourites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_favourites')
          .insert({ user_id: user.id, listing_id: listingId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['is-favorited', listingId] });
      queryClient.invalidateQueries({ queryKey: ['favorites-mobile'] });
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
        description: isFavorited ? "Property removed from your saved list" : "Property saved to your favorites",
      });
    },
  });

  if (isLoading || !listing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleContactCall = () => {
    window.location.href = 'tel:+31612345678';
  };

  const handleContactEmail = () => {
    const subject = `Inquiry about ${listing.title}`;
    const body = `Hi,\n\nI'm interested in the property "${listing.title}" listed at ${formatPrice(listing.price_eur)}.\n\nBest regards`;
    
    window.location.href = `mailto:agent@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockImages.length) % mockImages.length);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Photo Carousel */}
      <div className="relative h-80">
        {/* Current Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Square className="w-16 h-16 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-400">Photo {currentImageIndex + 1} of {mockImages.length}</p>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        {mockImages.length > 1 && (
          <>
            <Button
              onClick={prevImage}
              variant="glass"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              onClick={nextImage}
              variant="glass"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}
        
        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {mockImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-amber-500' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
        
        {/* Header Controls */}
        <div className="absolute top-12 left-4 right-4 flex justify-between items-center z-10">
          <Button
            onClick={onClose}
            variant="glass"
            size="sm"
            className="rounded-full p-3"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={() => toggleFavoriteMutation.mutate()}
              variant="glass"
              size="sm"
              className="rounded-full p-3"
            >
              <Heart className={`w-6 h-6 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </Button>
            <Button
              variant="glass"
              size="sm"
              className="rounded-full p-3"
            >
              <Share className="w-6 h-6 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Price and Title */}
        <div>
          <div className="text-3xl font-bold text-amber-500 mb-2">
            {formatPrice(listing.price_eur)}
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">
            {listing.title}
          </h1>
          {(listing.address || listing.city) && (
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-5 h-5" />
              <span>{[listing.address, listing.city].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="flex gap-6 py-4 border-y border-gray-800">
          <div className="flex items-center gap-2">
            <Bed className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-white font-medium">{listing.bedrooms}</div>
              <div className="text-xs text-gray-400">Bedroom{listing.bedrooms !== 1 ? 's' : ''}</div>
            </div>
          </div>
          {listing.bathrooms && (
            <div className="flex items-center gap-2">
              <Bath className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-white font-medium">{listing.bathrooms}</div>
                <div className="text-xs text-gray-400">Bathroom{listing.bathrooms !== 1 ? 's' : ''}</div>
              </div>
            </div>
          )}
          {listing.area_m2 && (
            <div className="flex items-center gap-2">
              <Square className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-white font-medium">{listing.area_m2}</div>
                <div className="text-xs text-gray-400">m²</div>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {listing.description && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">About This Property</h3>
            <p className="text-gray-300 leading-relaxed">{listing.description}</p>
          </div>
        )}

        {/* Price History Sparkline */}
        <PriceSparkline listingId={listingId} currentPrice={listing.price_eur} />

        {/* Contact Agent Buttons */}
        <div className="pt-4 space-y-3">
          <Button
            onClick={handleContactCall}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black rounded-full py-4 flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Call Agent
          </Button>
          <Button
            onClick={handleContactEmail}
            variant="outline"
            className="w-full border-gray-600 text-white hover:bg-gray-800 rounded-full py-4 flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Email Agent
          </Button>
        </div>
      </div>
    </div>
  );
};
