
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, LogOut, Settings, Home, Plus } from 'lucide-react';

export const ProfileView = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut.mutate();
  };

  return (
    <div className="flex-1 bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* User Info Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">
                  {user?.first_name || user?.last_name 
                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                    : 'User'
                  }
                </CardTitle>
                <p className="text-gray-400">{user?.email}</p>
                <div className="mt-1">
                  <span className="inline-block bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                    {user?.role || 'agent'}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Role-specific Actions */}
        {user?.role === 'agent' && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Home className="w-5 h-5" />
                Agent Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                My Listings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <Settings className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Settings Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Account Settings
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Notifications
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Privacy & Security
            </Button>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <Button
              onClick={handleSignOut}
              variant="destructive"
              className="w-full"
              disabled={signOut.isPending}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {signOut.isPending ? 'Signing out...' : 'Sign Out'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
