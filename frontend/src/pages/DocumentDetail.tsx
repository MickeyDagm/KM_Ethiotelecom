import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocumentById, addPerformanceLayer } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { User, Tag, Clock, MapPin, Send, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

const DocumentDetail = () => {
    const { id } = useParams();
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [note, setNote] = useState('');

    const { data: doc, isLoading } = useQuery({
        queryKey: ['document', id],
        queryFn: () => getDocumentById(id as string),
        enabled: !!id,
    });

    const mutation = useMutation({
        mutationFn: (newNote: string) => addPerformanceLayer(id as string, newNote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['document', id] });
            setNote('');
        },
    });

    const handleAddLayer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!note.trim()) return;
        mutation.mutate(note);
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Crown Jewel...</div>;
    if (!doc) return <div className="p-8 text-center text-gray-500">Document not found</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {doc.type}
                    </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 pr-24">{doc.title}</h1>
                <p className="text-sm font-medium text-gray-500 mt-2">Technology: {doc.technologyVersion}</p>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                    {doc.tags?.map((tag: any) => (
                        <span key={tag._id} className="flex items-center space-x-1 px-2.5 py-1 bg-[#8CC63F]/10 text-[#00A650] rounded-md text-xs font-medium">
                            <Tag className="w-3 h-3" />
                            <span>{tag.name}</span>
                        </span>
                    ))}
                </div>

                <div className="flex items-center space-x-6 mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{format(new Date(doc.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MessageSquare className="w-4 h-4" />
                        <span>{doc.localPerformanceLayers?.length || 0} Layers</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                            <span className="w-1.5 h-6 bg-[#00A650] rounded-full"></span>
                            <span>Primary Strategic Asset</span>
                        </h3>
                        <div
                            className="prose max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: doc.content }}
                        />
                    </div>

                    {/* Local Performance Layers Container */}
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                            <span className="w-1.5 h-6 bg-[#8CC63F] rounded-full"></span>
                            <span>Local Performance Layers</span>
                        </h3>

                        <div className="space-y-4 mb-6">
                            {doc.localPerformanceLayers?.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No region-specific performance notes added yet.</p>
                            ) : (
                                doc.localPerformanceLayers?.map((layer: any, idx: number) => (
                                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-6 h-6 rounded-full bg-[#00A650]/20 flex items-center justify-center text-[#00A650] text-xs font-bold">
                                                    {layer.authorId?.name?.charAt(0) || 'U'}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{layer.authorId?.name}</span>
                                                <span className="text-xs text-gray-500">• {layer.authorId?.role}</span>
                                            </div>
                                            <span className="text-xs text-gray-400">{format(new Date(layer.createdAt), 'MMM dd, yyyy')}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 pl-8">{layer.note}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add Layer Form */}
                        <form onSubmit={handleAddLayer} className="mt-6 flex space-x-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Add a contextual observation for your region..."
                                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A650] outline-none text-sm"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    disabled={mutation.isPending}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={mutation.isPending || !note.trim()}
                                className="bg-[#004B87] text-white px-4 py-2 rounded-lg hover:bg-[#003A6A] transition-colors disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar: Tacit Knowledge Expert Link */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Tacit Knowledge Link</h3>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#004B87] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-3 shadow-md">
                                {doc.author?.name?.charAt(0)}
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">{doc.author?.name}</h4>
                            <p className="text-sm font-medium text-[#00A650] mb-1">{doc.author?.role}</p>
                            <div className="flex items-center space-x-1 text-xs text-gray-500 mb-4 justify-center">
                                <MapPin className="w-3 h-3" />
                                <span>{doc.author?.department}</span>
                            </div>

                            <div className="w-full pt-4 border-t border-gray-100">
                                <Link to={`/experts`} className="w-full flex items-center justify-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-200">
                                    <User className="w-4 h-4" />
                                    <span>View Full Profile</span>
                                </Link>
                                <div className="mt-3 text-xs text-gray-500">
                                    Contact this authority to absorb unwritten heuristics regarding '{doc.title}'.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentDetail;
