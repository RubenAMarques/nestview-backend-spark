
import { useState } from 'react';
import { Home, Search, Plus, Heart, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/AuthForm';
import { MapView } from '@/components/MapView';
import { SearchView } from '@/components/SearchView';
import { ListingForm } from '@/components/ListingForm';
import { FavoritesView } from '@/components/FavoritesView';
import { ProfileView } from '@/components/ProfileView';

type TabType = 'map' | 'search' | 'add' | 'favorites' | 'profile';

export const MobileLayout = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('map');
  const [editingListing, setEditingListing] = useState(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const handleEditListing = (listing: any) => {
    setEditingListing(listing);
    setActiveTab('add');
  };

  const handleFormSuccess = () => {
    setEditingListing(null);
    setActiveTab('map');
  };

  const handleFormCancel = () => {
    setEditingListing(null);
    setActiveTab('map');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return <MapView onEdit={handleEditListing} />;
      case 'search':
        return <SearchView onEdit={handleEditListing} />;
      case 'add':
        return (
          <ListingForm
            listing={editingListing}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        );
      case 'favorites':
        return <FavoritesView onEdit={handleEditListing} />;
      case 'profile':
        return <ProfileView />;
      default:
        return <MapView onEdit={handleEditListing} />;
    }
  };

  const isAgent = user?.role === 'agent';

  const tabs = [
    { id: 'map' as TabType, icon: Home, label: 'Map' },
    { id: 'search' as TabType, icon: Search, label: 'Search' },
    ...(isAgent ? [{ id: 'add' as TabType, icon: Plus, label: 'Add' }] : []),
    { id: 'favorites' as TabType, icon: Heart, label: 'Favorites' },
    { id: 'profile' as TabType, icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gray-900 border-t border-gray-800 px-2 py-2 safe-area-bottom">
        <div className="flex justify-around items-center">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                activeTab === id
                  ? 'text-orange-500 bg-gray-800'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
