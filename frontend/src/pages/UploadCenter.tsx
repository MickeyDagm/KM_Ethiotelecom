import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { createDocument, getTags, checkDuplicate } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Upload, AlertTriangle, Tag as TagIcon } from 'lucide-react';

const INTELLIGENCE_TYPES = [
    'Root Cause Analysis',
    'Maintenance Procedure',
    'Weekly Presentations',
    'New Tech Adoption & Wiki Sprint'
];

const VENDORS = ['Internal', 'Huawei', 'ZTE', 'Ericsson'];

interface Tag {
    _id: string;
    name: string;
    category: string;
}

const UploadCenter = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('Root Cause Analysis');
    const [techVersion, setTechVersion] = useState('');
    const [associatedVendor, setAssociatedVendor] = useState('Internal');
    const [file, setFile] = useState<File | null>(null);
    const [verifiedDuplicate, setVerifiedDuplicate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [duplicateWarning, setDuplicateWarning] = useState(false);
    
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const data = await getTags();
                setTags(data);
            } catch (err) {
                console.error('Failed to fetch tags:', err);
            }
        };
        fetchTags();
    }, []);

    const tagsByCategory = tags.reduce((acc, tag) => {
        if (!acc[tag.category]) acc[tag.category] = [];
        acc[tag.category].push(tag);
        return acc;
    }, {} as Record<string, Tag[]>);

    const checkDuplicateAPI = async () => {
        if (!title || !type || !techVersion) return;
        try {
            const data = await checkDuplicate(title, type, techVersion);
            setDuplicateWarning(data.isDuplicate);
        } catch(e) {
            console.error('Duplicate check error: ', e);
        }
    };

    const handleTagToggle = (tagId: string) => {
        setSelectedTags(prev => 
            prev.includes(tagId) 
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handleSubmit = async (e: React.FormEvent, status: string = 'Published') => {
        e.preventDefault();
        if (!verifiedDuplicate && status === 'Published') return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('type', type);
            formData.append('technologyVersion', techVersion);
            formData.append('associatedVendor', associatedVendor);
            formData.append('publishStatus', status);
            formData.append('tags', JSON.stringify(selectedTags));
            if (file) {
                formData.append('attachments', file);
            }

            await createDocument(formData);
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            navigate('/library');
        } catch (err) {
            console.error(err);
            alert('Failed to upload. Check console or backend logs.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (user?.role === 'RegionalTechnician') {
        return (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">
                You do not have permission to upload Crown Jewels. You may only add Local Performance Layers to existing records.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Upload Center</h1>
                <p className="text-gray-500">Contribute new intelligence and living documentation.</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-amber-800">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-semibold text-sm">Duplicate Prevention Gate</h4>
                    <p className="text-sm mt-1">
                        Before proceeding, you must explicitly state the Technology Version below and verify this issue hasn't been archived by another Regional Team or the Expert Group.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Title</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004B87] outline-none"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={checkDuplicateAPI}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Intelligence Type</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004B87] outline-none"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            onBlur={checkDuplicateAPI}
                        >
                            {INTELLIGENCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Technology / Version (Required)</label>
                        <input
                            type="text"
                            placeholder="e.g. ZTE Core v19"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004B87] outline-none"
                            value={techVersion}
                            onChange={(e) => setTechVersion(e.target.value)}
                            onBlur={checkDuplicateAPI}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Associated Vendor</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004B87] outline-none"
                            value={associatedVendor}
                            onChange={(e) => setAssociatedVendor(e.target.value)}
                        >
                            {VENDORS.map(v => <option key={v} value={v}>{v === 'Internal' ? 'Internal (Ethio Telecom)' : v}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Asset File (PDF, Excel, Word)</label>
                        <input
                            type="file"
                            className="w-full px-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004B87] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#004B87] file:text-white hover:file:bg-[#003A6A]"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <TagIcon className="w-4 h-4" />
                        Contextual Tags (Regional Navigation Matrix)
                    </label>
                    <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                        {Object.entries(tagsByCategory).map(([category, categoryTags]) => (
                            <div key={category}>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{category}</p>
                                <div className="flex flex-wrap gap-2">
                                    {categoryTags.map((tag) => (
                                        <button
                                            key={tag._id}
                                            type="button"
                                            onClick={() => handleTagToggle(tag._id)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                                selectedTags.includes(tag._id)
                                                    ? 'bg-[#00A650] text-white'
                                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#00A650]'
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

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Heuristic Logic / Solution</label>
                    <textarea
                        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004B87] outline-none resize-none"
                        placeholder="Write down the exact heuristic intelligence to share with the rest of Ethio Telecom..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="duplicateCheck"
                        className="w-5 h-5 text-[#004B87] rounded focus:ring-[#004B87]"
                        checked={verifiedDuplicate}
                        onChange={(e) => setVerifiedDuplicate(e.target.checked)}
                        required
                    />
                    <label htmlFor="duplicateCheck" className="text-sm font-medium text-gray-700 cursor-pointer">
                        I verify that I have searched the Library (Intelligent Fetch) and this is NOT a duplicate submission of the specified Technology Version.
                    </label>
                </div>

                {duplicateWarning && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3 text-red-800">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-sm">Duplicate Detected!</h4>
                            <p className="text-sm mt-1">
                                An asset with this Title, Intelligence Type, and Technology Version already exists. Please review the Library before submitting to avoid redundancy.
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e as any, 'Draft')}
                        disabled={isSubmitting || !title || !content}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save as Draft
                    </button>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e as any, 'Published')}
                        disabled={!verifiedDuplicate || isSubmitting || duplicateWarning || !title || !content}
                        className="bg-[#004B87] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#003A6A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {isSubmitting ? 'Uploading...' : (
                            <>
                                <Upload className="w-4 h-4" />
                                <span>Upload to Gateway</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadCenter;
