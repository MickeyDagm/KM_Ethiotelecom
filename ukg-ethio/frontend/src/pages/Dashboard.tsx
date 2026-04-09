import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, BookOpen, Clock, Users } from 'lucide-react';

const Dashboard = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['analytics'],
        queryFn: getAnalytics,
    });

    const stats = [
        { label: 'Vendor Escalations Reduced', value: '25%', icon: Activity },
        { label: 'Avg Time to Competency', value: '3.5 mo', icon: Clock },
        { label: 'Expert Hours Saved/Wk', value: '8+', icon: Users },
        { label: 'Crown Jewels Indexed', value: '142', icon: BookOpen },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Contribution Analytics Dashboard</h1>
                <p className="text-gray-500">Overview of UKG usage and strategic benefits.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                            <div className="p-3 bg-blue-50 text-[#004B87] rounded-lg">
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

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Fetched Strategic Assets</h2>
                {isLoading ? (
                    <div className="h-64 flex items-center justify-center text-gray-400">Loading...</div>
                ) : (
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.topDocs || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="title" tick={{ fontSize: 12 }} tickFormatter={(val) => val.substring(0, 15) + '...'} />
                                <YAxis />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                                <Bar dataKey="views" fill="#004B87" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
