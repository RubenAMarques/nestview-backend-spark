
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS, ROLES, type AppRole } from '@/constants/roles';
import { ArrowRight } from 'lucide-react';
import { Typography } from '@/theme/tokens';

export const AuthForm = () => {
  const { signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
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
      {/* Hero Background with Gradient */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Logo/Brand - Enhanced typography */}
        <div className="flex-1 flex items-center justify-center px-8 pt-20">
          <h1 
            className="text-white text-center"
            style={{
              ...Typography.hero,
              fontSize: '40px',
              letterSpacing: '-0.03em',
            }}
          >
            Nest View
          </h1>
        </div>

        {/* Authentication Card */}
        <div className="px-6 pb-12">
          <div className="w-full max-w-sm mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
            <div className="p-8">
              {/* Tab Switcher */}
              <div className="flex justify-center mb-12">
                <div className="flex bg-white/5 rounded-full p-1 backdrop-blur-sm border border-white/10">
                  <button
                    onClick={() => setActiveTab('signin')}
                    className={`px-8 py-3 rounded-full transition-all duration-300 ${
                      activeTab === 'signin'
                        ? 'bg-white text-black shadow-lg font-medium'
                        : 'text-white/70 hover:text-white font-normal'
                    }`}
                    style={{ fontSize: '15px' }}
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => setActiveTab('signup')}
                    className={`px-8 py-3 rounded-full transition-all duration-300 ${
                      activeTab === 'signup'
                        ? 'bg-white text-black shadow-lg font-medium'
                        : 'text-white/70 hover:text-white font-normal'
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
                    <div>
                      <input
                        type="email"
                        placeholder="Enter email"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        className="w-full bg-transparent border-0 border-b border-white/20 text-white placeholder-white/50 py-4 text-lg focus:border-white focus:outline-none transition-colors font-light"
                        style={{ fontSize: '16px' }}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        placeholder="Password"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        className="w-full bg-transparent border-0 border-b border-white/20 text-white placeholder-white/50 py-4 text-lg focus:border-white focus:outline-none transition-colors font-light"
                        style={{ fontSize: '16px' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-6 pt-4">
                    <Button
                      type="submit"
                      disabled={signIn.isPending}
                      variant="ghost"
                      className="w-full py-4 rounded-full text-white border-white/30 hover:bg-white hover:text-black transition-all duration-500 shadow-lg backdrop-blur-sm"
                      style={{ fontSize: '16px', fontWeight: '500', minHeight: '52px' }}
                    >
                      {signIn.isPending ? 'Signing in...' : 'Sign in'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    
                    <button
                      type="button"
                      onClick={() => setActiveTab('signup')}
                      className="w-full text-center text-orange-500 hover:text-orange-400 transition-colors font-light"
                      style={{ fontSize: '14px' }}
                    >
                      Create account
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
                        className="bg-transparent border-0 border-b border-white/20 text-white placeholder-white/50 py-4 focus:border-white focus:outline-none transition-colors font-light"
                        style={{ fontSize: '16px' }}
                      />
                      <input
                        type="text"
                        placeholder="Last name"
                        value={signUpData.lastName}
                        onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                        className="bg-transparent border-0 border-b border-white/20 text-white placeholder-white/50 py-4 focus:border-white focus:outline-none transition-colors font-light"
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                    
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      className="w-full bg-transparent border-0 border-b border-white/20 text-white placeholder-white/50 py-4 text-lg focus:border-white focus:outline-none transition-colors font-light"
                      style={{ fontSize: '16px' }}
                      required
                    />
                    
                    <input
                      type="password"
                      placeholder="Password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      className="w-full bg-transparent border-0 border-b border-white/20 text-white placeholder-white/50 py-4 text-lg focus:border-white focus:outline-none transition-colors font-light"
                      style={{ fontSize: '16px' }}
                      required
                    />

                    <div>
                      <Select value={signUpData.role} onValueChange={(value: AppRole) => setSignUpData({ ...signUpData, role: value })}>
                        <SelectTrigger className="w-full bg-transparent border-0 border-b border-white/20 text-white py-4 focus:border-white rounded-none">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1E1E1E] border-white/10 backdrop-blur-xl">
                          {ROLES.map((role) => (
                            <SelectItem key={role} value={role} className="text-white hover:bg-white/10 focus:bg-white/10">
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
                      variant="ghost"
                      className="w-full py-4 rounded-full text-white border-white/30 hover:bg-white hover:text-black transition-all duration-500 shadow-lg backdrop-blur-sm"
                      style={{ fontSize: '16px', fontWeight: '500', minHeight: '52px' }}
                    >
                      {signUp.isPending ? 'Creating account...' : 'Create account'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    
                    <button
                      type="button"
                      onClick={() => setActiveTab('signin')}
                      className="w-full text-center text-orange-500 hover:text-orange-400 transition-colors font-light"
                      style={{ fontSize: '14px' }}
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
