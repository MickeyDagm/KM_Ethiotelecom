import { useQuery } from '@tanstack/react-query';
import { getExperts } from '../lib/api';
import { Mail, Phone, BookOpen, UserCheck, Shield } from 'lucide-react';

const ExpertDirectory = () => {
    const { data: experts, isLoading } = useQuery({
        queryKey: ['experts'],
        queryFn: getExperts,
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Expert Directory</h1>
                <p className="text-gray-500">Mapping of Ethio Telecom's 3-Tier Expertise Hierarchy</p>
            </div>

            {isLoading ? (
                <div className="text-gray-500 p-8 text-center">Loading experts...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {experts?.map((expert: any) => (
                        <div key={expert._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                            <div className="relative">
                                <div className="w-24 h-24 bg-[#004B87]/10 text-[#004B87] rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                                    {expert.name.charAt(0)}
                                </div>
                                {expert.role === 'Expert' && (
                                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 p-1.5 rounded-full shadow-sm" title="Core Authority">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-gray-900">{expert.name}</h3>
                            <p className="text-sm font-medium text-[#00A650] mb-1">{expert.role}</p>
                            <p className="text-xs text-gray-500 mb-4">{expert.department}</p>

                            <div className="w-full pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                                <div className="flex space-x-3">
                                    <a href={`mailto:${expert.email}`} className="text-gray-400 hover:text-gray-900">
                                        <Mail className="w-5 h-5" />
                                    </a>
                                    <button className="text-gray-400 hover:text-gray-900">
                                        <Phone className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex items-center space-x-1 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{expert.contributions} Docs</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExpertDirectory;
