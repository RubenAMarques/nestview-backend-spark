import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type ListingStatus = Database['public']['Enums']['listing_status'];

export const AdminView = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingListings = [], isLoading } = useQuery({
    queryKey: ['admin-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          users (
            first_name,
            last_name,
            email
          )
        `)
        .in('status', ['pending', 'need_fix'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data: listings, error } = await supabase
        .from('listings')
        .select('status');

      if (error) throw error;

      const stats = listings.reduce((acc, listing) => {
        acc[listing.status] = (acc[listing.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return stats;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ListingStatus }) => {
      const { error } = await supabase
        .from('listings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      toast({
        title: "Status updated",
        description: "Listing status has been updated successfully.",
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'need_fix':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats && Object.entries(stats).map(([status, count]) => (
          <Card key={status}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 capitalize">
                    {status.replace('_', ' ')}
                  </p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
                {getStatusIcon(status)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Listings */}
      <Card>
        <CardHeader>
          <CardTitle>Listings Requiring Review</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingListings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No listings requiring review
            </div>
          ) : (
            <div className="space-y-4">
              {pendingListings.map((listing) => (
                <div key={listing.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{listing.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Agent: {listing.users?.first_name} {listing.users?.last_name} ({listing.users?.email})
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{formatPrice(listing.price_eur)}</span>
                        <span>{listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}</span>
                        {listing.bathrooms && (
                          <span>{listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}</span>
                        )}
                        {listing.area_m2 && <span>{listing.area_m2}m²</span>}
                      </div>
                    </div>
                    <Badge className={`
                      ${listing.status === 'pending' ? 'bg-blue-100 text-blue-800' : ''}
                      ${listing.status === 'need_fix' ? 'bg-yellow-100 text-yellow-800' : ''}
                    `}>
                      {listing.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  {listing.description && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {listing.description}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateStatusMutation.mutate({ id: listing.id, status: 'approved' })}
                      disabled={updateStatusMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatusMutation.mutate({ id: listing.id, status: 'need_fix' })}
                      disabled={updateStatusMutation.isPending}
                      className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Need Fix
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatusMutation.mutate({ id: listing.id, status: 'rejected' })}
                      disabled={updateStatusMutation.isPending}
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
