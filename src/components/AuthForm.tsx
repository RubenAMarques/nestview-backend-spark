
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS, ROLES, type AppRole } from '@/constants/roles';
import { ArrowRight, X } from 'lucide-react';

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
    <div className="min-h-screen relative bg-black overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80)',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Logo */}
        <div className="flex-1 flex items-center justify-center px-8">
          <h1 className="text-white text-4xl font-semibold tracking-tight text-center">
            Nest View
          </h1>
        </div>

        {/* Bottom Sheet */}
        <div className="px-6 pb-8">
          <Card className="w-full max-w-sm mx-auto bg-black/80 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardContent className="p-6">
              {/* Tab Switcher */}
              <div className="flex justify-center mb-6">
                <div className="flex bg-white/5 rounded-full p-1">
                  <button
                    onClick={() => setActiveTab('signin')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === 'signin'
                        ? 'bg-white text-black'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => setActiveTab('signup')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === 'signup'
                        ? 'bg-white text-black'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Create account
                  </button>
                </div>
              </div>

              {activeTab === 'signin' ? (
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <input
                        type="email"
                        placeholder="Enter email"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        className="w-full bg-transparent border-0 border-b border-white/20 text-white placeholder-white/50 py-3 text-lg focus:border-white focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        placeholder="Password"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        className="w-full bg-transparent border-0 border-b border-white/20 text-white placeholder-white/50 py-3 text-lg focus:border-white focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      type="submit"
                      disabled={signIn.isPending}
                      className="w-full bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-300 py-3 rounded-full font-medium flex items-center justify-center gap-2"
                    >
                      {signIn.isPending ? 'Signing in...' : 'Sign in'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    
                    <button
                      type="button"
                      onClick={() => setActiveTab('signup')}
                      className="w-full text-center text-orange-500 hover:text-orange-400 transition-colors text-sm"
                    >
                      Create account
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="First name"
                        value={signUpData.firstName}
                        onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                        className="bg-transparent border-0 border-b border-white/20 text-white placeholder-white/50 py-3 focus:border-white focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Last name"
                        value={signUpData.lastName}
                        onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                        className="bg-transparent border-0 border-b border-white/20 text-white placeholder-white/50 py-3 focus:border-white focus:outline-none transition-colors"
                      />
                    </div>
                    
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      className="w-full bg-transparent border-0 border-b border-white/20 text-white placeholder-white/50 py-3 text-lg focus:border-white focus:outline-none transition-colors"
                      required
                    />
                    
                    <input
                      type="password"
                      placeholder="Password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      className="w-full bg-transparent border-0 border-b border-white/20 text-white placeholder-white/50 py-3 text-lg focus:border-white focus:outline-none transition-colors"
                      required
                    />

                    <div>
                      <Select value={signUpData.role} onValueChange={(value: AppRole) => setSignUpData({ ...signUpData, role: value })}>
                        <SelectTrigger className="w-full bg-transparent border-0 border-b border-white/20 text-white py-3 focus:border-white rounded-none">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-800">
                          {ROLES.map((role) => (
                            <SelectItem key={role} value={role} className="text-white hover:bg-gray-800">
                              {ROLE_LABELS[role]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      type="submit"
                      disabled={signUp.isPending}
                      className="w-full bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-300 py-3 rounded-full font-medium flex items-center justify-center gap-2"
                    >
                      {signUp.isPending ? 'Creating account...' : 'Create account'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    
                    <button
                      type="button"
                      onClick={() => setActiveTab('signin')}
                      className="w-full text-center text-orange-500 hover:text-orange-400 transition-colors text-sm"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
