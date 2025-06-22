
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ListingCard } from './ListingCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ListingsViewProps {
  onEdit?: (listing: any) => void;
}

export const ListingsView = ({ onEdit }: ListingsViewProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings', searchTerm, statusFilter, priceRange],
    queryFn: async () => {
      let query = supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply search filter
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`);
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Apply price range filter
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        if (max) {
          query = query.gte('price_eur', min).lte('price_eur', max);
        } else {
          query = query.gte('price_eur', min);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_favourites')
        .select('listing_id')
        .eq('user_id', user.id);
      if (error) throw error;
      return data.map(f => f.listing_id);
    },
    enabled: !!user,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const isFavorited = favorites.includes(listingId);
      
      if (isFavorited) {
        const { error } = await supabase
          .from('user_favourites')
          .delete()
          .eq('user_id', user!.id)
          .eq('listing_id', listingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_favourites')
          .insert({ user_i d: user!.id, listing_id: listingId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({
        title: "Success",
        description: "Favorites updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriceRange('all');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading listings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="need_fix">Need Fix</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-200000">€0 - €200k</SelectItem>
                <SelectItem value="200000-500000">€200k - €500k</SelectItem>
                <SelectItem value="500000-1000000">€500k - €1M</SelectItem>
                <SelectItem value="1000000">€1M+</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters}>
              <Filter className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {listings.length} Listing{listings.length !== 1 ? 's' : ''} Found
        </h2>
      </div>

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No listings found</div>
          <div className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onEdit={onEdit}
              onToggleFavorite={user ? (listingId) => toggleFavoriteMutation.mutate(listingId) : undefined}
              isFavorited={favorites.includes(listing.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
