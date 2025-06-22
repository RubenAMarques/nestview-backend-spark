
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Home, Plus, User, LogOut } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Header = ({ currentView, onViewChange }: HeaderProps) => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">RealEstate Pro</h1>
            <nav className="hidden md:flex space-x-4">
              <Button
                variant={currentView === 'listings' ? 'default' : 'ghost'}
                onClick={() => onViewChange('listings')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Listings
              </Button>
              <Button
                variant={currentView === 'create' ? 'default' : 'ghost'}
                onClick={() => onViewChange('create')}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Listing
              </Button>
              {user?.role === 'admin' && (
                <Button
                  variant={currentView === 'admin' ? 'default' : 'ghost'}
                  onClick={() => onViewChange('admin')}
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Admin
                </Button>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Welcome, {user?.first_name || user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={() => signOut.mutate()}>
              <LogOut className="w-4 h-4" />
            </Button>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="sm">
                  Menu
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                  <SheetDescription>Choose a section to navigate to</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-4">
                  <Button
                    variant={currentView === 'listings' ? 'default' : 'ghost'}
                    onClick={() => onViewChange('listings')}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Home className="w-4 h-4" />
                    Listings
                  </Button>
                  <Button
                    variant={currentView === 'create' ? 'default' : 'ghost'}
                    onClick={() => onViewChange('create')}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Plus className="w-4 h-4" />
                    Add Listing
                  </Button>
                  {user?.role === 'admin' && (
                    <Button
                      variant={currentView === 'admin' ? 'default' : 'ghost'}
                      onClick={() => onViewChange('admin')}
                      className="flex items-center gap-2 justify-start"
                    >
                      <User className="w-4 h-4" />
                      Admin
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
