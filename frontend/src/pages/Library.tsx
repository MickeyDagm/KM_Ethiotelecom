import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDocuments } from '../lib/api';
import { Link } from 'react-router-dom';
import { Search, Filter, Book, FileText, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const Library = () => {
    const [search, setSearch] = useState('');
    const [region, setRegion] = useState('');
    const [technology, setTechnology] = useState('');

    const { data: documents, isLoading } = useQuery({
        queryKey: ['documents', search, region, technology],
        queryFn: () => getDocuments({ search, region, technology }),
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Central Intelligence Library</h1>
                    <p className="text-gray-500">Intelligent Fetch & Regional Navigation Matrix</p>
                </div>

                <Link to="/upload" className="bg-[#004B87] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#003A6A] transition-colors inline-flex items-center space-x-2">
                    <Book className="w-4 h-4" />
                    <span>Contribute Asset</span>
                </Link>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder='Intelligent Fetch: Try "Somali Region Power Failure"...'
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004B87] outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#004B87]"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                    >
                        <option value="">All Regions</option>
                        <option value="Addis Ababa">Addis Ababa</option>
                        <option value="Somali">Somali</option>
                        <option value="North">North</option>
                    </select>
                    <select
                        className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#004B87]"
                        value={technology}
                        onChange={(e) => setTechnology(e.target.value)}
                    >
                        <option value="">All Tech</option>
                        <option value="Huawei">Huawei</option>
                        <option value="ZTE">ZTE</option>
                        <option value="5G">4G/5G</option>
                    </select>
                </div>
            </div>

            {/* Results grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Fetching records...</div>
                ) : documents?.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No structured intelligence found matching criteria.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {documents?.map((doc: any) => (
                            <Link key={doc._id} to={`/library/${doc._id}`} className="block p-4 md:p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg hidden sm:block">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: doc.content }}></p>
                                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                                                    {doc.type}
                                                </span>
                                                {doc.tags?.map((tag: any) => (
                                                    <span key={tag._id} className="px-2 py-1 bg-[#8CC63F]/10 text-[#00A650] rounded-md text-xs font-medium">
                                                        {tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                                            <span>{doc.author?.name}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">{format(new Date(doc.createdAt), 'MMM dd, yyyy')}</span>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Library;
