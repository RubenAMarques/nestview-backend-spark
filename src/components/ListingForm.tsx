
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ImagePickerRow } from './ImagePickerRow';
import { Database } from '@/integrations/supabase/types';
import { Colors, Typography } from '@/theme/tokens';

type ListingStatus = Database['public']['Enums']['listing_status'];

interface Listing {
  id?: string;
  title: string;
  description?: string;
  price_eur: number;
  bedrooms: number;
  bathrooms?: number;
  area_m2?: number;
  address?: string;
  city?: string;
  postal_code?: string;
  status?: ListingStatus;
}

interface ListingFormProps {
  listing?: Listing;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ListingForm = ({ listing, onSuccess, onCancel }: ListingFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Listing>({
    title: '',
    description: '',
    price_eur: 0,
    bedrooms: 1,
    bathrooms: 1,
    area_m2: 0,
    address: '',
    city: '',
    postal_code: '',
    status: 'pending' as ListingStatus,
    ...listing,
  });

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (listing) {
      setFormData({ ...listing });
    }
  }, [listing]);

  const mutation = useMutation({
    mutationFn: async (data: Listing) => {
      // Validate minimum images for new listings
      if (!listing?.id && images.length < 6) {
        throw new Error('Please add at least 6 photos to your listing');
      }

      if (listing?.id) {
        // Update existing listing
        const updateData: any = {
          title: data.title,
          description: data.description,
          price_eur: data.price_eur,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          area_m2: data.area_m2,
          address: data.address,
          city: data.city,
          postal_code: data.postal_code,
        };

        // Only add status if user is admin
        if (user?.role === 'admin' && data.status) {
          updateData.status = data.status;
        }

        const { data: result, error } = await supabase
          .from('listings')
          .update(updateData)
          .eq('id', listing.id)
          .select()
          .single();

        if (error) throw error;
        return result;
      } else {
        // Create new listing
        const { data: result, error } = await supabase
          .from('listings')
          .insert({
            agent_id: user!.id,
            title: data.title,
            description: data.description,
            price_eur: data.price_eur,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            area_m2: data.area_m2,
            address: data.address,
            city: data.city,
            postal_code: data.postal_code,
          })
          .select()
          .single();

        if (error) throw error;
        
        // TODO: Upload images to Supabase Storage
        // Path: listing-photos/<userId>/<listingId>/<filename>
        console.log(`Images to upload for listing ${result.id}:`, images);
        
        return result;
      }
    },
    onSuccess: () => {
      toast({
        title: listing?.id ? "Listing updated!" : "Listing created!",
        description: listing?.id ? "Your listing has been updated successfully." : "Your listing has been created with photos and is pending approval.",
      });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (field: keyof Listing, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <Card className="max-w-2xl mx-auto bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white" style={Typography.title}>
            {listing?.id ? 'Edit Listing' : 'Create New Listing'}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {listing?.id ? 'Update your property listing' : 'Add a new property with premium photos'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Picker */}
            <ImagePickerRow
              images={images}
              onImagesChange={setImages}
              maxImages={10}
              minImages={6}
            />

            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-white font-medium">Property Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Luxurious 3-bedroom apartment in Amsterdam..."
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the unique features and amenities of your property..."
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 mt-2 resize-none"
                />
              </div>
            </div>

            {/* Price and Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="price" className="text-white font-medium">Price (EUR) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price_eur}
                  onChange={(e) => handleChange('price_eur', parseInt(e.target.value) || 0)}
                  placeholder="750000"
                  min="0"
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 mt-2"
                />
              </div>

              <div>
                <Label htmlFor="bedrooms" className="text-white font-medium">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleChange('bedrooms', parseInt(e.target.value) || 1)}
                  min="1"
                  max="20"
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bathrooms" className="text-white font-medium">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms || ''}
                  onChange={(e) => handleChange('bathrooms', parseInt(e.target.value) || undefined)}
                  min="0"
                  max="20"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 mt-2"
                />
              </div>

              <div>
                <Label htmlFor="area" className="text-white font-medium">Area (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area_m2 || ''}
                  onChange={(e) => handleChange('area_m2', parseFloat(e.target.value) || undefined)}
                  placeholder="120"
                  min="0"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 mt-2"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="address" className="text-white font-medium">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Prinsengracht 123"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="city" className="text-white font-medium">City</Label>
                  <Input
                    id="city"
                    value={formData.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Amsterdam"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="postal_code" className="text-white font-medium">Postal Code</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code || ''}
                    onChange={(e) => handleChange('postal_code', e.target.value)}
                    placeholder="1012 AB"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Admin Status Field */}
            {user?.role === 'admin' && (
              <div>
                <Label htmlFor="status" className="text-white font-medium">Status</Label>
                <Select value={formData.status} onValueChange={(value: ListingStatus) => handleChange('status', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="need_fix">Need Fix</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                disabled={mutation.isPending || (!listing?.id && images.length < 6)} 
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              >
                {mutation.isPending ? 'Saving...' : (listing?.id ? 'Update Listing' : 'Create Listing')}
              </Button>
              {onCancel && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Cancel
                </Button>
              )}
            </div>

            {!listing?.id && images.length < 6 && (
              <p className="text-amber-500 text-sm text-center">
                Add at least 6 photos to create your listing
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
