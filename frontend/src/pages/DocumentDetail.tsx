import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocumentById, addPerformanceLayer, updateDocument, getTags } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Tag, Clock, Send, MessageSquare, Edit, X, Save, Eye, User, Download, FileIcon, ArrowLeft, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

const API_BASE = import.meta.env.VITE_API_URL || '${API_BASE}';

interface Tag {
    _id: string;
    name: string;
    category: string;
}

const DocumentDetail = () => {
    const { id } = useParams();
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [note, setNote] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editType, setEditType] = useState('');
    const [editTechVersion, setEditTechVersion] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    const { data: doc, isLoading } = useQuery({
        queryKey: ['document', id],
        queryFn: () => getDocumentById(id as string),
        enabled: !!id,
    });

    const { data: tagsData } = useQuery<Tag[]>({
        queryKey: ['tags'],
        queryFn: getTags,
    });

    const mutation = useMutation({
        mutationFn: (newNote: string) => addPerformanceLayer(id as string, newNote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['document', id] });
            setNote('');
        },
    });

    const updateMutation = useMutation({
        mutationFn: (formData: FormData) => updateDocument(id as string, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['document', id] });
            setIsEditing(false);
        },
    });

    const handleAddLayer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!note.trim()) return;
        mutation.mutate(note);
    };

    const startEditing = () => {
        if (doc) {
            setEditTitle(doc.title);
            setEditContent(doc.content);
            setEditType(doc.type);
            setEditTechVersion(doc.technologyVersion);
            setSelectedTags(doc.tags?.map((t: any) => t._id) || []);
            setIsEditing(true);
        }
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', editTitle);
        formData.append('content', editContent);
        formData.append('type', editType);
        formData.append('technologyVersion', editTechVersion);
        formData.append('tags', JSON.stringify(selectedTags));
        formData.append('publishStatus', doc.publishStatus);
        formData.append('associatedVendor', doc.associatedVendor);
        updateMutation.mutate(formData);
    };

    const canEdit = user && ['Admin', 'Expert', 'AdvancedSupport', 'InternationalGateway'].includes(user.role);

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Crown Jewel...</div>;
    if (!doc) return <div className="p-8 text-center text-gray-500">Document not found</div>;

    const tagsByCategory: Record<string, Tag[]> = (tagsData || []).reduce((acc: Record<string, Tag[]>, tag: Tag) => {
        if (!acc[tag.category]) acc[tag.category] = [];
        acc[tag.category].push(tag);
        return acc;
    }, {});

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Back Button */}
            <Link 
                to="/library" 
                className="inline-flex items-center space-x-2 text-gray-500 hover:text-[#004B87] transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Library</span>
            </Link>

            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="text-3xl font-bold text-gray-900 w-full px-0 py-1 border-b-2 border-[#004B87] outline-none bg-transparent"
                            />
                        ) : (
                            <h1 className="text-3xl font-bold text-gray-900">{doc.title}</h1>
                        )}
                        <p className="text-sm font-medium text-gray-500 mt-2">
                            Technology: {isEditing ? (
                                <input
                                    type="text"
                                    value={editTechVersion}
                                    onChange={(e) => setEditTechVersion(e.target.value)}
                                    className="border border-gray-300 rounded px-2 py-0.5 text-sm"
                                />
                            ) : doc.technologyVersion}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                            {doc.type}
                        </span>
                        {canEdit && !isEditing && (
                            <button
                                onClick={startEditing}
                                className="p-2 text-gray-500 hover:text-[#004B87] hover:bg-gray-100 rounded-lg transition-colors"
                                title="Edit Document"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                    {doc.tags?.map((tag: any) => (
                        <span key={tag._id} className="flex items-center space-x-1 px-2.5 py-1 bg-[#8CC63F]/10 text-[#00A650] rounded-md text-xs font-medium">
                            <Tag className="w-3 h-3" />
                            <span>{tag.name}</span>
                        </span>
                    ))}
                    <span className="flex items-center space-x-1 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium border border-blue-200">
                        <span>Vendor: {doc.associatedVendor || 'Internal'}</span>
                    </span>
                </div>

                <div className="flex items-center space-x-6 mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span>{doc.views} views</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{format(new Date(doc.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MessageSquare className="w-4 h-4" />
                        <span>{doc.localPerformanceLayers?.length || 0} Layers</span>
                    </div>
                    {doc.author && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>By {doc.author.name}</span>
                        </div>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Document</h3>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Intelligence Type</label>
                        <select
                            value={editType}
                            onChange={(e) => setEditType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="Root Cause Analysis">Root Cause Analysis</option>
                            <option value="Maintenance Procedure">Maintenance Procedure</option>
                            <option value="Weekly Presentations">Weekly Presentations</option>
                            <option value="New Tech Adoption & Wiki Sprint">New Tech Adoption & Wiki Sprint</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                        <div className="space-y-2">
                            {Object.entries(tagsByCategory).map(([category, categoryTags]) => (
                                <div key={category}>
                                    <p className="text-xs font-semibold text-gray-500 uppercase">{category}</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {categoryTags.map((tag: Tag) => (
                                            <button
                                                key={tag._id}
                                                type="button"
                                                onClick={() => setSelectedTags(prev => 
                                                    prev.includes(tag._id) 
                                                        ? prev.filter(t => t !== tag._id)
                                                        : [...prev, tag._id]
                                                )}
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    selectedTags.includes(tag._id)
                                                        ? 'bg-[#00A650] text-white'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {tag.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full h-48 p-4 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                        >
                            <X className="w-4 h-4" /> Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={updateMutation.isPending}
                            className="px-4 py-2 bg-[#004B87] text-white rounded-lg flex items-center gap-2 hover:bg-[#003A6A]"
                        >
                            <Save className="w-4 h-4" /> {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2 pb-4 border-b border-gray-100">
                            <span className="w-1.5 h-6 bg-[#004B87] rounded-full"></span>
                            <span>Explicit Knowledge (Original Asset)</span>
                        </h3>

                        <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 flex flex-col min-h-[500px] p-4">
                            {doc.attachments && doc.attachments.length > 0 ? (
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between bg-white rounded-lg p-3 mb-4 border border-gray-200">
                                        <div className="flex items-center space-x-3">
                                            <FileIcon className="w-8 h-8 text-[#004B87]" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{doc.attachments[0].filename}</p>
                                                <p className="text-xs text-gray-500">Click Preview or Download to view</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {/* <button
                                                onClick={() => setShowPreview(!showPreview)}
                                                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>{showPreview ? 'Hide Preview' : 'Preview'}</span>
                                            </button> */}
                                            <a
                                                href={`${API_BASE}/api/documents/${doc._id}/download/0`}
                                                className="flex items-center space-x-2 px-3 py-2 bg-[#004B87] text-white rounded-lg hover:bg-[#003A6A] transition-colors text-sm font-medium"
                                            >
                                                <Download className="w-4 h-4" />
                                                <span>Download</span>
                                            </a>
                                        </div>
                                    </div>
                                    {showPreview ? (
                                        <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <iframe
                                                src={`${API_BASE}/api/documents/${doc._id}/preview/0`}
                                                className="w-full h-full min-h-[400px]"
                                                title="Asset Document"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200 text-gray-400">
                                            <ExternalLink className="w-16 h-16 mb-4 opacity-50" />
                                            <p className="mb-2">Click "Preview" to view the document inline</p>
                                            <p className="text-sm">or "Download" to save to your device</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <FileIcon className="w-16 h-16 mb-4 opacity-50" />
                                    <p className="mb-2">No explicit file uploaded.</p>
                                    <p className="text-sm">Rely on tacit knowledge heuristics.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2 border-b border-gray-100 pb-4">
                            <span className="w-1.5 h-6 bg-[#00A650] rounded-full"></span>
                            <span>Heuristic Logic / Expert Tips (Tacit Wisdom)</span>
                        </h3>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-8 h-8 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center font-bold">
                                    {doc.author?.name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-amber-900">{doc.author?.name} <span className="font-normal opacity-75">| {doc.author?.role}</span></p>
                                    {doc.author?.email && (
                                        <a href={`mailto:${doc.author.email}`} className="text-xs text-amber-700 hover:underline">
                                            {doc.author.email}
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div
                                className="prose max-w-none text-amber-900 text-sm mt-3 border-t border-amber-200/50 pt-3"
                                dangerouslySetInnerHTML={{ __html: doc.content }}
                            />
                        </div>

                        <div className="mt-8">
                            <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                <span className="w-1 h-5 bg-[#8CC63F] rounded-full"></span>
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

                            <form onSubmit={handleAddLayer} className="mt-4 flex space-x-3">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Add a contextual observation..."
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
                </div>
            </div>
        </div>
    );
};

export default DocumentDetail;
