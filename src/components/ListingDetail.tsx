
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Heart, Share, MapPin, Bed, Bath, Square, Phone, Mail, User } from 'lucide-react';
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
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

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

  const handleContactSubmit = () => {
    // Open email client with pre-filled data
    const subject = `Inquiry about ${listing.title}`;
    const body = `Hi,\n\nI'm interested in the property "${listing.title}" listed at ${formatPrice(listing.price_eur)}.\n\n${contactForm.message}\n\nBest regards,\n${contactForm.name}\nPhone: ${contactForm.phone}`;
    
    window.location.href = `mailto:agent@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    toast({
      title: "Opening email client",
      description: "Your message has been prepared in your default email app",
    });
    
    setShowContact(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with Image Gallery */}
      <div className="relative h-80">
        {/* Placeholder for image gallery */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Square className="w-16 h-16 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-400">Property Gallery</p>
            <p className="text-sm text-gray-500">6+ photos when available</p>
          </div>
        </div>
        
        {/* Header Controls */}
        <div className="absolute top-12 left-4 right-4 flex justify-between items-center z-10">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={() => toggleFavoriteMutation.mutate()}
              variant="ghost"
              size="sm"
              className="bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70"
            >
              <Heart className={`w-6 h-6 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70"
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
          <div className="text-3xl font-bold text-orange-500 mb-2" style={Typography.hero}>
            {formatPrice(listing.price_eur)}
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2" style={Typography.title}>
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

        {/* Contact Agent Button */}
        <div className="pt-4">
          <Button
            onClick={() => setShowContact(true)}
            className="w-full bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors rounded-full py-4 flex items-center justify-center gap-2"
            style={{ fontSize: '16px', fontWeight: '500' }}
          >
            <User className="w-5 h-5" />
            Contact Agent
            <span className="ml-2">→</span>
          </Button>
        </div>
      </div>

      {/* Contact Agent Bottom Sheet */}
      <BottomSheet
        isOpen={showContact}
        onClose={() => setShowContact(false)}
        title="Contact Agent"
      >
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            Get in touch with the listing agent for more information about this property.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Your Name</label>
              <Input
                value={contactForm.name}
                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white font-medium mb-2">Phone</label>
                <Input
                  value={contactForm.phone}
                  onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+31 6 12345678"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Message</label>
              <Textarea
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="I'm interested in this property and would like to schedule a viewing..."
                rows={4}
                className="bg-gray-800 border-gray-700 text-white resize-none"
              />
            </div>
            
            <Button
              onClick={handleContactSubmit}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
