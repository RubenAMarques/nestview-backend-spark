
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/AuthForm';
import { Header } from '@/components/Header';
import { ListingsView } from '@/components/ListingsView';
import { ListingForm } from '@/components/ListingForm';
import { AdminView } from '@/components/AdminView';

const Index = () => {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('listings');
  const [editingListing, setEditingListing] = useState(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const handleEditListing = (listing: any) => {
    setEditingListing(listing);
    setCurrentView('create');
  };

  const handleFormSuccess = () => {
    setEditingListing(null);
    setCurrentView('listings');
  };

  const handleFormCancel = () => {
    setEditingListing(null);
    setCurrentView('listings');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'listings' && (
          <ListingsView onEdit={handleEditListing} />
        )}
        
        {currentView === 'create' && (
          <ListingForm
            listing={editingListing}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
        
        {currentView === 'admin' && user.role === 'admin' && (
          <AdminView />
        )}
      </main>
    </div>
  );
};

export default Index;
