import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, UploadCloud, Users, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Layout = () => {
    const { logout, user } = useAuthStore();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: Home },
        { name: 'Library', path: '/library', icon: BookOpen },
        { name: 'Upload Center', path: '/upload', icon: UploadCloud },
        { name: 'Expert Directory', path: '/experts', icon: Users },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="group w-20 hover:w-64 bg-[#004B87] text-white hidden md:flex flex-col transition-[width] duration-300 overflow-hidden whitespace-nowrap z-50">
                <div className="p-6 h-24 flex flex-col justify-center relative">
                    <div className="absolute left-6 text-2xl font-bold tracking-tight transition-opacity duration-300 group-hover:opacity-0">
                        UKG
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h1 className="text-2xl font-bold tracking-tight">UKG</h1>
                        <p className="text-sm opacity-80 mt-1 text-[#00A650]">Ethio Telecom</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-0 px-3 py-3 rounded-lg transition-colors relative ${isActive
                                    ? 'bg-white/20 font-medium'
                                    : 'hover:bg-white/10'
                                    }`}
                            >
                                <div className="w-6 flex justify-center items-center flex-shrink-0">
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                </div>
                                <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/20">
                    <div className="flex items-center space-x-0 px-2 py-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold flex-shrink-0">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-4 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs opacity-80 truncate">{user?.role}</p>
                        </div>
                    </div>
                    <div className="mt-2 space-y-1">
                        <Link to="/profile" className="flex items-center space-x-0 px-3 py-2 rounded-lg hover:bg-white/10 text-sm transition-colors">
                            <div className="w-6 flex justify-center flex-shrink-0">
                                <User className="w-4 h-4" />
                            </div>
                            <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">Profile</span>
                        </Link>
                        <button onClick={logout} className="w-full flex items-center space-x-0 px-3 py-2 rounded-lg hover:bg-white/10 text-sm text-left transition-colors">
                            <div className="w-6 flex justify-center flex-shrink-0">
                                <LogOut className="w-4 h-4" />
                            </div>
                            <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-[#004B87] text-white p-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">UKG</h1>
                    <button onClick={logout} className="p-2">
                        <LogOut className="w-5 h-5" />
                    </button>
                </header>

                <div className="flex-1 overflow-auto bg-gray-50 p-6 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
