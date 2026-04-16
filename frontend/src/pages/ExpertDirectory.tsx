import { useQuery } from '@tanstack/react-query';
import { getExperts } from '../lib/api';
import { Link } from 'react-router-dom';
import { Mail, Phone, BookOpen, Shield, MapPin, ExternalLink } from 'lucide-react';

const ExpertDirectory = () => {
    const { data: experts, isLoading } = useQuery({
        queryKey: ['experts'],
        queryFn: getExperts,
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

    const getTierBadge = (role: string) => {
        switch (role) {
            case 'Expert': return { label: 'Tier 1 - Core Authority', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
            case 'AdvancedSupport': return { label: 'Tier 2 - Specialist', color: 'bg-purple-100 text-purple-800 border-purple-200' };
            case 'InternationalGateway': return { label: 'IGW Specialist', color: 'bg-orange-100 text-orange-800 border-orange-200' };
            case 'RegionalTechnician': return { label: 'Tier 3 - Field Tech', color: 'bg-gray-100 text-gray-700 border-gray-200' };
            case 'Admin': return { label: 'Administrator', color: 'bg-green-100 text-green-800 border-green-200' };
            default: return { label: 'Team Member', color: 'bg-gray-100 text-gray-700 border-gray-200' };
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Expert Directory</h1>
                <p className="text-gray-500">Ethio Telecom's 3-Tier Expertise Hierarchy & Tacit Knowledge Network</p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">Tier 1 - Core Authority</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-600">Tier 2 - Specialists</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600">IGW Team</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-600">Regional Technicians</span>
                </div>
            </div>

            {isLoading ? (
                <div className="text-gray-500 p-8 text-center">Loading experts...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {experts?.map((expert: any) => {
                        const tier = getTierBadge(expert.role);
                        const phone = mockPhoneNumbers[expert.email] || '+251 911 XXX XXX';
                        const location = mockLocations[expert.email] || 'Ethio Telecom';

                        return (
                            <div key={expert._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                                {/* Card Header */}
                                <div className="p-6 pb-4">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="relative">
                                            <div className={`w-16 h-16 ${getRoleBadgeColor(expert.role)} text-white rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg`}>
                                                {expert.name.charAt(0)}
                                            </div>
                                            {expert.role === 'Expert' && (
                                                <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 p-1.5 rounded-full shadow-md" title="Core Authority">
                                                    <Shield className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${tier.color}`}>
                                            {tier.label}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900">{expert.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{expert.department}</p>

                                    <div className="flex items-center space-x-2 mt-3 text-sm text-gray-500">
                                        <MapPin className="w-4 h-4" />
                                        <span>{location}</span>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="px-6 pb-4">
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                <Mail className="w-4 h-4 text-[#004B87]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-400">Email</p>
                                                <a href={`mailto:${expert.email}`} className="text-sm text-[#004B87] truncate hover:underline">
                                                    {expert.email}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                <Phone className="w-4 h-4 text-[#00A650]" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-400">Office</p>
                                                <p className="text-sm text-gray-900">{phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Footer */}
                                <div className="px-6 pb-6">
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center space-x-2">
                                            <div className="bg-[#004B87]/10 text-[#004B87] px-3 py-1.5 rounded-lg text-sm font-semibold">
                                                {expert.contributions || 0} Assets
                                            </div>
                                        </div>
                                        <Link 
                                            to={`/experts/${expert._id}`}
                                            className="flex items-center space-x-1 text-sm text-[#00A650] hover:text-[#007A30] font-medium transition-colors"
                                        >
                                            <span>View Profile</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Info Card */}
            <div className="bg-gradient-to-r from-[#004B87]/5 to-[#00A650]/5 rounded-xl p-6 border border-[#004B87]/10">
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#004B87]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-[#004B87]" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">The Tacit Knowledge Expert Link</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Every expert is linked to the Crown Jewels they've authored. Click "View Profile" to see their full contribution history 
                            and contact them directly for expert consultation. This simulates the "Side-by-Side Asking Culture" by connecting 
                            technicians with the specific expert who solved similar problems previously.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpertDirectory;
