import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { createDocument } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertTriangle } from 'lucide-react';

const UploadCenter = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('Root Cause Analysis');
    const [techVersion, setTechVersion] = useState('');
    const [associatedVendor, setAssociatedVendor] = useState('Internal');
    const [publishStatus, setPublishStatus] = useState('Published');
    const [file, setFile] = useState<File | null>(null);
    const [verifiedDuplicate, setVerifiedDuplicate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [duplicateWarning, setDuplicateWarning] = useState(false);

    // Duplicate logic check
    const checkDuplicate = async () => {
        if (!title || !type || !techVersion) return;
        try {
            const url = `http://localhost:5000/api/documents/check-duplicate?title=${encodeURIComponent(title)}&type=${encodeURIComponent(type)}&technologyVersion=${encodeURIComponent(techVersion)}`;
            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // assuming token might be needed if authenticated, but maybe standard api handles it. we can also just use existing api lib if we exposed it, but fetch is quick. Assuming no auth requirement for check-duplicate or we can use our lib API
                }
            });
            const data = await res.json();
            setDuplicateWarning(data.isDuplicate);
        } catch(e) {
            console.error('Duplicate check error: ', e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!verifiedDuplicate) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('type', type);
            formData.append('technologyVersion', techVersion);
            formData.append('associatedVendor', associatedVendor);
            formData.append('publishStatus', publishStatus);
            if (file) {
                formData.append('attachments', file);
            }
            // Would normally append contextual tags and attachments here too

            await createDocument(formData);
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
                        onBlur={checkDuplicate}
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
                            onBlur={checkDuplicate}
                        >
                            <option value="Root Cause Analysis">Root Cause Analysis</option>
                            <option value="Maintenance Procedure">Maintenance Procedure</option>
                            <option value="Weekly Presentations">Weekly Presentations</option>
                            <option value="New Tech Adoption">New Tech Adoption & Wiki Sprint</option>
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
                            onBlur={checkDuplicate}
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
                            <option value="Internal">Internal (Ethio Telecom)</option>
                            <option value="Huawei">Huawei</option>
                            <option value="ZTE">ZTE</option>
                            <option value="Ericsson">Ericsson</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Asset File (PDF, Excel, Word)</label>
                        <input
                            type="file"
                            className="w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004B87] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#004B87] file:text-white hover:file:bg-[#003A6A]"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                        />
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
                        onClick={(e) => { setPublishStatus('Draft'); handleSubmit(e); }}
                        disabled={isSubmitting}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save as Draft
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { setPublishStatus('Published'); handleSubmit(e); }}
                        disabled={!verifiedDuplicate || isSubmitting || duplicateWarning}
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
