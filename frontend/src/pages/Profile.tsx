import { useAuthStore } from '../store/authStore';
import { Mail, Phone, Building2, Calendar, Shield, BookOpen, Award, Users } from 'lucide-react';

const Profile = () => {
    const { user } = useAuthStore();

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'Admin': return 'bg-[#00A650]';
            case 'Expert': return 'bg-yellow-500';
            case 'AdvancedSupport': return 'bg-purple-600';
            case 'InternationalGateway': return 'bg-orange-500';
            case 'RegionalTechnician': return 'bg-gray-500';
            default: return 'bg-gray-400';
        }
    };

    const getRoleDescription = (role: string) => {
        switch (role) {
            case 'Admin': return 'System Administrator with full access to all features and user management capabilities.';
            case 'Expert': return 'Core Authority - Senior specialist responsible for high-level vendor escalations and critical decision making.';
            case 'AdvancedSupport': return 'Specialist managing critical network stability and advanced troubleshooting.';
            case 'InternationalGateway': return 'IGW Specialist securing Ethiopia\'s global internet ingress and international connectivity.';
            case 'RegionalTechnician': return 'Field technician contributing local performance insights and regional documentation.';
            default: return 'Team member';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'Admin': return Shield;
            case 'Expert': return Award;
            case 'AdvancedSupport': return BookOpen;
            case 'InternationalGateway': return Building2;
            case 'RegionalTechnician': return Users;
            default: return Users;
        }
    };

    const RoleIcon = getRoleIcon(user?.role || '');

    const mockJoinedDate = 'March 2024';
    const mockEmployeeId = `ET-${Math.floor(Math.random() * 9000) + 1000}`;
    const mockExtension = `+251 ${Math.floor(Math.random() * 900) + 100}`;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header Card */}
            <div className="bg-gradient-to-r from-[#004B87] to-[#003A6A] rounded-2xl shadow-lg overflow-hidden">
                <div className="p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="relative">
                        <div className="w-32 h-32 bg-white/20 backdrop-blur-sm text-white rounded-2xl flex items-center justify-center text-5xl font-bold shadow-xl">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-2 -right-2 ${getRoleBadgeColor(user?.role || '')} text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center space-x-1`}>
                            <RoleIcon className="w-3 h-3" />
                            <span>{user?.role}</span>
                        </div>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-3xl font-bold text-white">{user?.name}</h2>
                        <p className="text-white/80 mt-1">{getRoleDescription(user?.role || '')}</p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                            <div className="flex items-center space-x-2 text-white/70 text-sm">
                                <Building2 className="w-4 h-4" />
                                <span>{user?.department}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-white/70 text-sm">
                                <Mail className="w-4 h-4" />
                                <span>{user?.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Contact Information */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>Contact Information</span>
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-gray-400">Email</p>
                            <a href={`mailto:${user?.email}`} className="text-sm text-[#004B87] hover:underline">{user?.email}</a>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Phone (Office)</p>
                            <p className="text-sm text-gray-900">{mockExtension}</p>
                        </div>
                    </div>
                </div>

                {/* Employment Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Employment Details</span>
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-gray-400">Employee ID</p>
                            <p className="text-sm text-gray-900 font-mono">{mockEmployeeId}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Joined</p>
                            <p className="text-sm text-gray-900">{mockJoinedDate}</p>
                        </div>
                    </div>
                </div>

                {/* Role Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>Role Summary</span>
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-gray-400">Tier</p>
                            <p className="text-sm text-gray-900">
                                {user?.role === 'Expert' ? 'Tier 1 - Core Authority' :
                                 user?.role === 'AdvancedSupport' ? 'Tier 2 - Specialist' :
                                 user?.role === 'InternationalGateway' ? 'Tier 2 - IGW Specialist' :
                                 user?.role === 'RegionalTechnician' ? 'Tier 3 - Field Technician' :
                                 'Tier 0 - Administrator'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Access Level</p>
                            <p className="text-sm text-[#00A650] font-medium">
                                {user?.role === 'RegionalTechnician' ? 'Limited - Read & Annotate' : 'Full - Read, Write & Manage'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Permissions Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-[#00A650]" />
                    <span>Your Permissions & Capabilities</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user?.role === 'RegionalTechnician' ? (
                        <>
                            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-semibold text-green-800">Can Access</span>
                                </div>
                                <ul className="text-sm text-green-700 space-y-1 ml-4">
                                    <li>• View all published Crown Jewels</li>
                                    <li>• Search via Intelligent Fetch</li>
                                    <li>• Add Local Performance Layers</li>
                                    <li>• Download attached assets</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    <span className="text-sm font-semibold text-gray-600">Cannot Access</span>
                                </div>
                                <ul className="text-sm text-gray-500 space-y-1 ml-4">
                                    <li>• Upload new Crown Jewels</li>
                                    <li>• Edit existing documents</li>
                                    <li>• Delete any content</li>
                                    <li>• Manage users</li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-semibold text-green-800">Can Access</span>
                                </div>
                                <ul className="text-sm text-green-700 space-y-1 ml-4">
                                    <li>• View & search all Crown Jewels</li>
                                    <li>• Upload new knowledge assets</li>
                                    <li>• Edit & update documents</li>
                                    <li>• Add Local Performance Layers</li>
                                    <li>• Run Wiki-Sprints</li>
                                    <li>• Download & manage assets</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                    <span className="text-sm font-semibold text-amber-800">Knowledge Responsibilities</span>
                                </div>
                                <ul className="text-sm text-amber-700 space-y-1 ml-4">
                                    <li>• Document Root Cause Analysis</li>
                                    <li>• Create Weekly Presentations</li>
                                    <li>• Lead New Tech Adoptions</li>
                                    <li>• Mentor regional teams</li>
                                    <li>• Ensure BSC compliance</li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
