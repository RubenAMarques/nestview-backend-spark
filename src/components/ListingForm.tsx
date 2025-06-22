
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
  status?: string;
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
    status: 'pending',
    ...listing,
  });

  useEffect(() => {
    if (listing) {
      setFormData({ ...listing });
    }
  }, [listing]);

  const mutation = useMutation({
    mutationFn: async (data: Listing) => {
      if (listing?.id) {
        // Update existing listing
        const { data: result, error } = await supabase
          .from('listings')
          .update({
            title: data.title,
            description: data.description,
            price_eur: data.price_eur,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            area_m2: data.area_m2,
            address: data.address,
            city: data.city,
            postal_code: data.postal_code,
            ...(user?.role === 'admin' && { status: data.status }),
          })
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
        return result;
      }
    },
    onSuccess: () => {
      toast({
        title: listing?.id ? "Listing updated!" : "Listing created!",
        description: listing?.id ? "Your listing has been updated successfully." : "Your listing has been created and is pending approval.",
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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{listing?.id ? 'Edit Listing' : 'Create New Listing'}</CardTitle>
        <CardDescription>
          {listing?.id ? 'Update your property listing' : 'Add a new property to your listings'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Beautiful 3-bedroom apartment..."
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the property..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (EUR) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price_eur}
                onChange={(e) => handleChange('price_eur', parseInt(e.target.value) || 0)}
                placeholder="500000"
                min="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => handleChange('bedrooms', parseInt(e.target.value) || 1)}
                min="1"
                max="20"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms || ''}
                onChange={(e) => handleChange('bathrooms', parseInt(e.target.value) || undefined)}
                min="0"
                max="20"
              />
            </div>

            <div>
              <Label htmlFor="area">Area (m²)</Label>
              <Input
                id="area"
                type="number"
                value={formData.area_m2 || ''}
                onChange={(e) => handleChange('area_m2', parseFloat(e.target.value) || undefined)}
                placeholder="120"
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Amsterdam"
              />
            </div>

            <div>
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                value={formData.postal_code || ''}
                onChange={(e) => handleChange('postal_code', e.target.value)}
                placeholder="1012 AB"
              />
            </div>
          </div>

          {user?.role === 'admin' && (
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="need_fix">Need Fix</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={mutation.isPending} className="flex-1">
              {mutation.isPending ? 'Saving...' : (listing?.id ? 'Update Listing' : 'Create Listing')}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
