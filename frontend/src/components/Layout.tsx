import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, UploadCloud, Users, User, LogOut, Building2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const Layout = () => {
    const { logout, user } = useAuthStore();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: Home },
        { name: 'Library', path: '/library', icon: BookOpen },
        { name: 'Upload Center', path: '/upload', icon: UploadCloud },
        { name: 'Expert Directory', path: '/experts', icon: Users },
    ];

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'Admin': return 'bg-[#00A650]';
            case 'Expert': return 'bg-[#004B87]';
            case 'AdvancedSupport': return 'bg-purple-600';
            case 'InternationalGateway': return 'bg-orange-500';
            case 'RegionalTechnician': return 'bg-gray-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`fixed lg:relative z-50 h-full flex flex-col bg-gradient-to-b from-[#004B87] via-[#003A6A] to-[#002244] text-white transform transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'lg:-translate-x-0'} ${isHovered || sidebarOpen ? 'lg:w-64' : 'lg:w-20'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Sidebar Header */}
                <div className="h-20 px-4 flex items-center border-b border-white/10 flex-shrink-0">
                    <div className="w-12 h-12 bg-[#00A650] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ml-3 ${isHovered || sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                        <h1 className="text-lg font-bold tracking-tight whitespace-nowrap">UKG</h1>
                        <p className="text-[#00A650] text-xs font-medium whitespace-nowrap">Ethio Telecom</p>
                    </div>
                    <button 
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden ml-auto p-2 hover:bg-white/10 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation - Top */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center rounded-xl transition-all ${
                                    isActive
                                        ? 'bg-[#00A650] shadow-lg shadow-[#00A650]/30 font-semibold'
                                        : 'hover:bg-white/10'
                                }`}
                            >
                                <div className={`flex items-center justify-center py-3 ${isHovered || sidebarOpen ? 'px-4' : 'px-3'} ${isActive ? 'text-white' : 'text-white/70'}`}>
                                    <Icon className="w-6 h-6 flex-shrink-0" />
                                </div>
                                <span className={`whitespace-nowrap transition-all duration-300 ${isHovered || sidebarOpen ? 'opacity-100 ml-2' : 'opacity-0 w-0 overflow-hidden'}`}>
                                    {item.name}
                                </span>
                                {isActive && (isHovered || sidebarOpen) && (
                                    <div className="ml-auto w-2 h-2 bg-white rounded-full mr-4"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section - Bottom */}
                <div className="p-4 border-t border-white/10 flex-shrink-0">
                    <div className={`flex items-center rounded-xl mb-3 transition-all duration-300 ${isHovered || sidebarOpen ? 'bg-white/5 p-3' : 'p-2 justify-center'}`}>
                        <div className={`${getRoleBadgeColor(user?.role || '')} rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${isHovered || sidebarOpen ? 'w-10 h-10' : 'w-9 h-9'}`}>
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className={`overflow-hidden transition-all duration-300 ${isHovered || sidebarOpen ? 'w-auto opacity-100 ml-3' : 'w-0 opacity-0'}`}>
                            <p className="text-sm font-medium whitespace-nowrap">{user?.name}</p>
                            <p className="text-xs text-white/60 whitespace-nowrap">{user?.role}</p>
                        </div>
                    </div>
                    <div className={`space-y-1 transition-all duration-300 ${isHovered || sidebarOpen ? '' : 'flex flex-col items-center'}`}>
                        <Link 
                            to="/profile" 
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center rounded-lg hover:bg-white/10 text-sm transition-colors ${isHovered || sidebarOpen ? 'px-4 py-2.5' : 'px-2 py-2 justify-center'}`}
                        >
                            <User className="w-5 h-5 text-white/70 flex-shrink-0" />
                            <span className={`whitespace-nowrap transition-all duration-300 ${isHovered || sidebarOpen ? 'opacity-100 ml-3' : 'opacity-0 w-0 overflow-hidden'}`}>Profile</span>
                        </Link>
                        <button 
                            onClick={logout} 
                            className={`w-full flex items-center rounded-lg hover:bg-red-500/20 text-red-300 text-sm transition-colors ${isHovered || sidebarOpen ? 'px-4 py-2.5' : 'px-2 py-2 justify-center'}`}
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            <span className={`whitespace-nowrap transition-all duration-300 ${isHovered || sidebarOpen ? 'opacity-100 ml-3' : 'opacity-0 w-0 overflow-hidden'}`}>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className={`p-4 border-t border-white/10 text-center flex-shrink-0 transition-all duration-300 ${isHovered || sidebarOpen ? '' : 'px-2'}`}>
                    <p className={`text-white/40 text-xs transition-all duration-300 ${isHovered || sidebarOpen ? '' : 'text-center'}`}>
                        {isHovered || sidebarOpen ? '© 2026 Ethio Telecom' : '© 2026'}
                    </p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden bg-gradient-to-r from-[#004B87] to-[#003A6A] text-white p-4 flex items-center space-x-4 shadow-lg flex-shrink-0">
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 hover:bg-white/10 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#00A650] rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">UKG</h1>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto bg-gray-50 p-6 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
