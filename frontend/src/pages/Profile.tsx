import { useAuthStore } from '../store/authStore';

const Profile = () => {
    const { user } = useAuthStore();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-[#004B87]/10 text-[#004B87] rounded-full flex items-center justify-center text-4xl font-bold mb-4">
                    {user?.name?.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-[#00A650] font-medium mt-1">{user?.role}</p>
                <p className="text-gray-500 mt-2">{user?.department} Team</p>
                <p className="text-sm text-gray-400 mt-4">{user?.email}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">Your Permissions</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                    {user?.role === 'RegionalTechnician' ? (
                        <li className="flex items-start">
                            <span className="text-[#00A650] mr-2">✓</span>
                            Can read all documents and add Local Performance Layers
                        </li>
                    ) : (
                        <>
                            <li className="flex items-start">
                                <span className="text-[#00A650] mr-2">✓</span>
                                Can read all documents and add Local Performance Layers
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#00A650] mr-2">✓</span>
                                Can upload new Crown Jewels via Upload Center
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#00A650] mr-2">✓</span>
                                Can run Wiki-Sprints and document Initial Discoveries
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Profile;
