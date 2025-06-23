
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, LogOut, Settings, Home, BarChart3, Bell, Shield, Palette } from 'lucide-react';
import { ROLE_LABELS } from '@/constants/roles';

export const ProfileView = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut.mutate();
  };

  return (
    <div className="flex-1 bg-black flex flex-col">
      {/* Header - Clean black hero like Open */}
      <div className="px-6 pt-16 pb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
            <User className="w-10 h-10 text-white/80" />
          </div>
          <div className="flex-1">
            <h1 className="text-white text-2xl font-light mb-2" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
              {user?.first_name || user?.last_name 
                ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                : 'User'
              }
            </h1>
            <p className="text-white/60 text-base font-light mb-3">{user?.email}</p>
            <div className="inline-block bg-orange-500/20 text-orange-400 text-sm px-3 py-1.5 rounded-full border border-orange-500/30 font-medium">
              {user?.role ? ROLE_LABELS[user.role] : 'User'}
            </div>
          </div>
        </div>
      </div>

      {/* Content with refined spacing */}
      <div className="flex-1 px-6 space-y-8">
        {/* Agent Tools - More refined card */}
        {user?.role === 'agent' && (
          <div className="space-y-4">
            <h3 className="text-white/80 text-lg font-medium">Agent Tools</h3>
            <div className="space-y-3">
              <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 text-left transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Home className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">My Listings</p>
                    <p className="text-white/50 text-sm">Manage your properties</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 text-left transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Analytics</p>
                    <p className="text-white/50 text-sm">View performance data</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Settings Section */}
        <div className="space-y-4">
          <h3 className="text-white/80 text-lg font-medium">Settings</h3>
          <div className="space-y-3">
            {[
              { icon: Settings, title: 'Account Settings', subtitle: 'Manage your profile' },
              { icon: Bell, title: 'Notifications', subtitle: 'Manage alerts & updates' },
              { icon: Shield, title: 'Privacy & Security', subtitle: 'Control your data' },
              { icon: Palette, title: 'Appearance', subtitle: 'Customize your experience' },
            ].map(({ icon: Icon, title, subtitle }) => (
              <button key={title} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 text-left transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{title}</p>
                    <p className="text-white/50 text-sm">{subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sign Out - Open style pill button */}
      <div className="p-6 pt-8">
        <Button
          onClick={handleSignOut}
          disabled={signOut.isPending}
          className="w-full bg-transparent border border-white/30 text-white hover:bg-white hover:text-black transition-all duration-500 py-4 rounded-full font-medium text-base flex items-center justify-center gap-3"
        >
          <LogOut className="w-5 h-5" />
          {signOut.isPending ? 'Signing out...' : 'Sign Out'}
        </Button>
      </div>
    </div>
  );
};
