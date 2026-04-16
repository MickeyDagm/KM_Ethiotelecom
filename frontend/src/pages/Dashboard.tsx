import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, BookOpen, FileText, Lightbulb, Presentation } from 'lucide-react';

const Dashboard = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['analytics'],
        queryFn: getAnalytics,
    });

    const stats = [
        { 
            label: 'Total Crown Jewels', 
            value: data?.totalDocs || 0, 
            icon: BookOpen,
            color: 'bg-blue-50 text-[#004B87]'
        },
        { 
            label: 'Total Views', 
            value: data?.totalViews || 0, 
            icon: Activity,
            color: 'bg-[#00A650]/10 text-[#00A650]'
        },
        { 
            label: 'RCA Documents', 
            value: data?.rcaCount || 0, 
            icon: FileText,
            color: 'bg-amber-50 text-amber-600'
        },
        { 
            label: 'Tech Adoptions', 
            value: data?.newTechCount || 0, 
            icon: Lightbulb,
            color: 'bg-purple-50 text-purple-600'
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Contribution Analytics Dashboard</h1>
                <p className="text-gray-500">Strategic benefits from knowledge internalization.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Fetched Strategic Assets</h2>
                    {isLoading ? (
                        <div className="h-64 flex items-center justify-center text-gray-400">Loading...</div>
                    ) : data?.topDocs?.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>
                    ) : (
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.topDocs || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="title" tick={{ fontSize: 10 }} tickFormatter={(val) => val.substring(0, 12) + '...'} />
                                    <YAxis />
                                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ fontSize: 12 }} />
                                    <Bar dataKey="views" fill="#004B87" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">BSC Compliance Metrics</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Presentation className="w-5 h-5 text-[#004B87]" />
                                <span className="text-sm font-medium text-gray-700">Weekly Presentations</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{data?.weeklyCount || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-amber-600" />
                                <span className="text-sm font-medium text-gray-700">Root Cause Analysis</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{data?.rcaCount || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Lightbulb className="w-5 h-5 text-[#00A650]" />
                                <span className="text-sm font-medium text-gray-700">New Tech Adoptions</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{data?.newTechCount || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
