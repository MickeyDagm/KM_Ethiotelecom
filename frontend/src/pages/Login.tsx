import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { login as apiLogin } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const data = await apiLogin({ email, password });
            setAuth(data.user, data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#004B87] via-[#003A6A] to-[#002244] p-12 flex-col justify-between relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 rounded-full border-4 border-white/30"></div>
                    <div className="absolute bottom-40 right-10 w-96 h-96 rounded-full border-4 border-white/20"></div>
                    <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full border-4 border-[#00A650]/30"></div>
                </div>

                <div className="relative z-10">
                    {/* Logo */}
                    <div className="flex items-center space-x-4 mb-16">
                        <div className="w-16 h-16 bg-[#00A650] rounded-xl flex items-center justify-center shadow-lg">
                            <Building2 className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Ethio Telecom</h1>
                            <p className="text-white/70 text-sm">Digital Ethiopia 2030</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl font-bold text-white leading-tight">
                                Unified Knowledge Gateway
                            </h2>
                            <p className="text-white/80 text-lg mt-4 leading-relaxed">
                                Transforming reactive maintenance into proactive knowledge architecture. 
                                Internalizing crown jewel expertise for technical sovereignty.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                                <Shield className="w-8 h-8 text-[#00A650] mb-3" />
                                <h3 className="text-white font-semibold">Technical Sovereignty</h3>
                                <p className="text-white/60 text-sm mt-1">Internalize crown jewel expertise</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                                <Building2 className="w-8 h-8 text-[#00A650] mb-3" />
                                <h3 className="text-white font-semibold">3-Tier Hierarchy</h3>
                                <p className="text-white/60 text-sm mt-1">Expert, Advanced & Regional teams</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-white/50 text-sm">
                    © 2026 Ethio Telecom - IT Operations & Maintenance
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
                        <div className="w-12 h-12 bg-[#00A650] rounded-xl flex items-center justify-center shadow-lg">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[#004B87]">Ethio Telecom</h1>
                            <p className="text-xs text-gray-500">UKG - Knowledge Gateway</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                            <p className="text-gray-500 mt-2">Sign in to access your knowledge hub</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <Lock className="w-4 h-4 text-red-600" />
                                </div>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A650] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                                    placeholder="name@ethiotelecom.et"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A650] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-[#00A650] to-[#007A30] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00A650]/30 transition-all disabled:opacity-70 flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        <span>Sign In</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-center text-sm text-gray-500 mb-3">Demo Credentials</p>
                            <div className="grid grid-cols-1 gap-2 text-xs">
                                <div className="bg-gray-50 rounded-lg p-3 flex justify-between">
                                    <span className="text-gray-500">Global Admin:</span>
                                    <span className="text-gray-700 font-mono">admin@ethiotelecom.et</span>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 flex justify-between">
                                    <span className="text-gray-500">Core Expert:</span>
                                    <span className="text-gray-700 font-mono">abebe.b@ethiotelecom.et</span>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 flex justify-between">
                                    <span className="text-gray-500">Regional Tech:</span>
                                    <span className="text-gray-700 font-mono">fatuma.r@ethiotelecom.et</span>
                                </div>
                                <div className="text-center text-gray-400 mt-2">Password: password123</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
