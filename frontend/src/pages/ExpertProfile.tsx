import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getExpertById } from '../lib/api';
import { Phone, Building2, Calendar, Shield, BookOpen, Award, Users, ArrowLeft, MapPin, FileText } from 'lucide-react';

const ExpertProfile = () => {
    const { id } = useParams();
    
    const { data: expert, isLoading } = useQuery({
        queryKey: ['expert', id],
        queryFn: () => getExpertById(id as string),
        enabled: !!id,
    });

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

    const getTierInfo = (role: string) => {
        switch (role) {
            case 'Expert': return { tier: 'Tier 1 - Core Authority', access: 'Full - Read, Write & Manage' };
            case 'AdvancedSupport': return { tier: 'Tier 2 - Specialist', access: 'Full - Read, Write & Manage' };
            case 'InternationalGateway': return { tier: 'IGW Specialist', access: 'Full - Read, Write & Manage' };
            case 'RegionalTechnician': return { tier: 'Tier 3 - Field Tech', access: 'Limited - Read & Annotate' };
            case 'Admin': return { tier: 'Administrator', access: 'Full - All Access' };
            default: return { tier: 'Team Member', access: 'Standard' };
        }
    };

    const mockPhoneNumbers: Record<string, string> = {
        'admin@ethiotelecom.et': '+251 911 234 567',
        'abebe.b@ethiotelecom.et': '+251 911 345 678',
        'tirunesh.d@ethiotelecom.et': '+251 911 456 789',
        'kenenisa.b@ethiotelecom.et': '+251 911 567 890',
        'haile.g@ethiotelecom.et': '+251 911 678 901',
        'fatuma.r@ethiotelecom.et': '+251 911 789 012',
    };

    const mockLocations: Record<string, string> = {
        'admin@ethiotelecom.et': 'Addis Ababa HQ',
        'abebe.b@ethiotelecom.et': 'Backbone Center',
        'tirunesh.d@ethiotelecom.et': 'IT O&M HQ',
        'kenenisa.b@ethiotelecom.et': 'Addis Ababa Support',
        'haile.g@ethiotelecom.et': 'IGW Facility',
        'fatuma.r@ethiotelecom.et': 'Somali Region',
    };

    const mockJoinedDates: Record<string, string> = {
        'admin@ethiotelecom.et': 'January 2022',
        'abebe.b@ethiotelecom.et': 'March 2020',
        'tirunesh.d@ethiotelecom.et': 'June 2019',
        'kenenisa.b@ethiotelecom.et': 'August 2021',
        'haile.g@ethiotelecom.et': 'February 2020',
        'fatuma.r@ethiotelecom.et': 'May 2023',
    };

    const mockEmployeeIds: Record<string, string> = {
        'admin@ethiotelecom.et': 'ET-1001',
        'abebe.b@ethiotelecom.et': 'ET-2003',
        'tirunesh.d@ethiotelecom.et': 'ET-2005',
        'kenenisa.b@ethiotelecom.et': 'ET-3012',
        'haile.g@ethiotelecom.et': 'ET-4008',
        'fatuma.r@ethiotelecom.et': 'ET-5019',
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#004B87] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!expert) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Expert not found</p>
                <Link to="/experts" className="text-[#004B87] hover:underline mt-2 inline-block">
                    Back to Expert Directory
                </Link>
            </div>
        );
    }

    const RoleIcon = getRoleIcon(expert.role);
    const tierInfo = getTierInfo(expert.role);
    const phone = mockPhoneNumbers[expert.email] || '+251 911 XXX XXX';
    const location = mockLocations[expert.email] || 'Ethio Telecom';
    const joinedDate = mockJoinedDates[expert.email] || 'Unknown';
    const employeeId = mockEmployeeIds[expert.email] || 'ET-XXXX';

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <Link 
                to="/experts" 
                className="inline-flex items-center space-x-2 text-gray-500 hover:text-[#004B87] transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Expert Directory</span>
            </Link>

            {/* Profile Header Card */}
            <div className="bg-gradient-to-r from-[#004B87] to-[#003A6A] rounded-2xl shadow-lg overflow-hidden">
                <div className="p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="relative">
                        <div className={`w-32 h-32 ${getRoleBadgeColor(expert.role)} text-white rounded-2xl flex items-center justify-center text-5xl font-bold shadow-xl flex items-center justify-center`}>
                            {expert.name?.charAt(0) || '?'}
                        </div>
                        {expert.role === 'Expert' && (
                            <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 p-2 rounded-xl shadow-lg" title="Core Authority">
                                <Shield className="w-6 h-6" />
                            </div>
                        )}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                            <h2 className="text-3xl font-bold text-white">{expert.name}</h2>
                            <span className={`${getRoleBadgeColor(expert.role)} text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center space-x-1`}>
                                <RoleIcon className="w-4 h-4" />
                                <span>{expert.role}</span>
                            </span>
                        </div>
                        <p className="text-white/80 mt-1">{getRoleDescription(expert.role)}</p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                            <div className="flex items-center space-x-2 text-white/70 text-sm">
                                <Building2 className="w-4 h-4" />
                                <span>{expert.department}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-white/70 text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>{location}</span>
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
                            <a href={`mailto:${expert.email}`} className="text-sm text-[#004B87] hover:underline">{expert.email}</a>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Phone (Office)</p>
                            <p className="text-sm text-gray-900">{phone}</p>
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
                            <p className="text-sm text-gray-900 font-mono">{employeeId}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Joined</p>
                            <p className="text-sm text-gray-900">{joinedDate}</p>
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
                            <p className="text-sm text-gray-900">{tierInfo.tier}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Access Level</p>
                            <p className="text-sm text-[#00A650] font-medium">{tierInfo.access}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contribution Stats */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-[#00A650]" />
                    <span>Knowledge Contributions</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-[#004B87]/5 to-[#004B87]/10 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-[#004B87]">{expert.contributions || 0}</div>
                        <p className="text-sm text-gray-500 mt-1">Total Assets Authored</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#00A650]/5 to-[#00A650]/10 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-[#00A650]">{expert.contributions ? expert.contributions * 45 + 120 : 0}</div>
                        <p className="text-sm text-gray-500 mt-1">Total Views Received</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-yellow-600">{expert.contributions ? expert.contributions * 15 + 85 : 0}</div>
                        <p className="text-sm text-gray-500 mt-1">Utility Score</p>
                    </div>
                </div>
            </div>

            {/* Expert Expertise */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span>Areas of Expertise</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                    {expert.role === 'Expert' && (
                        <>
                            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Vendor Escalations</span>
                            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Critical Decision Making</span>
                            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Network Architecture</span>
                            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Root Cause Analysis</span>
                        </>
                    )}
                    {expert.role === 'AdvancedSupport' && (
                        <>
                            <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Network Stability</span>
                            <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Advanced Troubleshooting</span>
                            <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Performance Optimization</span>
                        </>
                    )}
                    {expert.role === 'InternationalGateway' && (
                        <>
                            <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">IGW Management</span>
                            <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">International Connectivity</span>
                            <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">Global Internet Ingress</span>
                        </>
                    )}
                    {expert.role === 'RegionalTechnician' && (
                        <>
                            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">Regional Support</span>
                            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">Local Performance</span>
                            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">Field Operations</span>
                        </>
                    )}
                    {expert.role === 'Admin' && (
                        <>
                            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">System Administration</span>
                            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">User Management</span>
                            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">Access Control</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExpertProfile;
