
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS, ROLES, type AppRole } from '@/constants/roles';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Typography } from '@/theme/tokens';

export const AuthForm = () => {
  const { signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'buyer' as AppRole,
  });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    signIn.mutate(signInData);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    signUp.mutate(signUpData);
  };

  return (
    <div className="min-h-screen relative bg-[#0F0F0F] overflow-hidden">
      {/* Premium background with calming gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22m36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6">
        {/* App branding - elegant serif typography */}
        <div className="text-center mb-16">
          <h1 
            className="text-white text-center mb-4"
            style={{
              ...Typography.hero,
              fontSize: '48px',
              fontWeight: '300',
              letterSpacing: '-0.02em',
            }}
          >
            Nest View
          </h1>
          <p 
            className="text-white/60 max-w-xs mx-auto"
            style={Typography.body}
          >
            Premium real estate discovery platform
          </p>
        </div>

        {/* Authentication Card */}
        <div className="w-full max-w-sm mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
            {/* Tab Switcher */}
            <div className="flex justify-center mb-12">
              <div className="flex bg-white/5 rounded-2xl p-1 backdrop-blur-sm border border-white/10">
                <button
                  onClick={() => setActiveTab('signin')}
                  className={`px-8 py-3 rounded-xl transition-all duration-300 font-medium ${
                    activeTab === 'signin'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-white/70 hover:text-white'
                  }`}
                  style={{ fontSize: '15px' }}
                >
                  Sign in
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`px-8 py-3 rounded-xl transition-all duration-300 font-medium ${
                    activeTab === 'signup'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-white/70 hover:text-white'
                  }`}
                  style={{ fontSize: '15px' }}
                >
                  Create account
                </button>
              </div>
            </div>

            {activeTab === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-8">
                <div className="space-y-6">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      className="w-full h-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 px-4 focus:border-white focus:bg-white/10 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                      style={{ fontSize: '16px' }}
                      required
                    />
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      className="w-full h-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 px-4 pr-12 focus:border-white focus:bg-white/10 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                      style={{ fontSize: '16px' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                  <Button
                    type="submit"
                    disabled={signIn.isPending}
                    variant="premium"
                    size="touch"
                    className="w-full rounded-2xl"
                    style={{ fontSize: '16px', fontWeight: '600', minHeight: '52px' }}
                  >
                    {signIn.isPending ? 'Signing in...' : 'Sign in'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <button
                    type="button"
                    onClick={() => setActiveTab('signup')}
                    className="w-full text-center text-white/60 hover:text-white transition-colors"
                    style={{ fontSize: '14px' }}
                  >
                    Don't have an account? Create one
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First name"
                      value={signUpData.firstName}
                      onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                      className="h-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 px-4 focus:border-white focus:bg-white/10 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                      style={{ fontSize: '16px' }}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={signUpData.lastName}
                      onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                      className="h-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 px-4 focus:border-white focus:bg-white/10 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                      style={{ fontSize: '16px' }}
                      required
                    />
                  </div>
                  
                  <input
                    type="email"
                    placeholder="Email address"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    className="w-full h-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 px-4 focus:border-white focus:bg-white/10 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    style={{ fontSize: '16px' }}
                    required
                  />
                  
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      className="w-full h-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 px-4 pr-12 focus:border-white focus:bg-white/10 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                      style={{ fontSize: '16px' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div>
                    <Select value={signUpData.role} onValueChange={(value: AppRole) => setSignUpData({ ...signUpData, role: value })}>
                      <SelectTrigger className="w-full h-12 bg-white/5 border border-white/20 rounded-xl text-white focus:border-white focus:bg-white/10 backdrop-blur-sm">
                        <SelectValue placeholder="I am a..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1E1E1E] border-white/10 backdrop-blur-xl rounded-xl">
                        {ROLES.map((role) => (
                          <SelectItem key={role} value={role} className="text-white hover:bg-white/10 focus:bg-white/10 rounded-lg">
                            {ROLE_LABELS[role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                  <Button
                    type="submit"
                    disabled={signUp.isPending}
                    variant="premium"
                    size="touch"
                    className="w-full rounded-2xl"
                    style={{ fontSize: '16px', fontWeight: '600', minHeight: '52px' }}
                  >
                    {signUp.isPending ? 'Creating account...' : 'Create account'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <button
                    type="button"
                    onClick={() => setActiveTab('signin')}
                    className="w-full text-center text-white/60 hover:text-white transition-colors"
                    style={{ fontSize: '14px' }}
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
