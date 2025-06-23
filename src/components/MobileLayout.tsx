
import { useState } from 'react';
import { Home, Search, Plus, Heart, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { AuthForm } from '@/components/AuthForm';
import { MapView } from '@/components/MapView';
import { SearchView } from '@/components/SearchView';
import { ListingForm } from '@/components/ListingForm';
import { FavoritesView } from '@/components/FavoritesView';
import { ProfileView } from '@/components/ProfileView';

type TabType = 'map' | 'search' | 'add' | 'favorites' | 'profile';

export const MobileLayout = () => {
  const { user, isLoading } = useAuth();
  const currentUser = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('map');
  const [editingListing, setEditingListing] = useState(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-white text-lg font-light">Loading...</div>
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

  const isAgent = currentUser?.role === 'agent' || currentUser?.role === 'admin';

  const tabs = [
    { id: 'map' as TabType, icon: Home, label: 'Map' },
    { id: 'search' as TabType, icon: Search, label: 'Search' },
    ...(isAgent ? [{ id: 'add' as TabType, icon: Plus, label: 'Add' }] : []),
    { id: 'favorites' as TabType, icon: Heart, label: 'Saved' },
    { id: 'profile' as TabType, icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* Premium Bottom Navigation */}
      <div className="relative">
        {/* Blur backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
        
        {/* Navigation content */}
        <div className="relative border-t border-white/5 px-6 py-4 safe-area-bottom">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {tabs.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-col items-center py-2 px-3 rounded-2xl transition-all duration-300 min-w-[64px] min-h-[52px] group ${
                  activeTab === id
                    ? 'text-orange-500'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                <div className={`relative transition-all duration-300 ${
                  activeTab === id ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  <Icon 
                    className={`w-6 h-6 mb-1 transition-all duration-300 ${
                      activeTab === id ? 'stroke-2' : 'stroke-1.5'
                    }`} 
                  />
                  {/* Active indicator */}
                  {activeTab === id && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full" />
                  )}
                </div>
                <span className={`text-xs font-medium transition-all duration-300 ${
                  activeTab === id ? 'opacity-100 font-semibold' : 'opacity-60'
                }`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
