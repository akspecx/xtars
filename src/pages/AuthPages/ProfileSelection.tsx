
import { useNavigate } from 'react-router';
import { useProfile, UserProfile, ProfileType } from '../../context/ProfileContext';
import { useState } from 'react';
import { Plus, X, User } from 'lucide-react';

export default function ProfileSelection() {
  const { selectProfile, availableProfiles, addProfile, removeProfile } = useProfile();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<ProfileType>('KIDS');

  const handleProfileSelect = (profile: UserProfile) => {
    selectProfile(profile.id);
    if (profile.type === 'KIDS') {
      navigate('/games');
    } else {
      navigate('/dashboard');
    }
  };

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      addProfile(newName.trim(), newType);
      setIsAdding(false);
      setNewName('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-outfit relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-500/20 blur-[120px]" />
         <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-theme-pink-500/20 blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-4xl px-6 py-12 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Who's Learning Today?</h1>
        <p className="text-gray-400 mb-16 text-lg">Select a profile to tailor your educational journey.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 w-full place-items-center max-w-5xl">
          {availableProfiles.map((profile) => (
            <div key={profile.id} className="relative group w-full flex flex-col items-center">
              {/* Delete Button (Only for added profiles, or all if you want) */}
              <button
                onClick={() => removeProfile(profile.id)}
                className="absolute -top-2 -right-2 z-20 size-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                title="Remove Profile"
              >
                <X size={16} />
              </button>

              <button
                onClick={() => handleProfileSelect(profile)}
                className="flex flex-col items-center transition-transform duration-300 hover:scale-105 active:scale-95 w-full"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gray-800 border-2 border-gray-700 flex flex-col items-center justify-center mb-4 transition-all duration-300 group-hover:border-brand-400 group-hover:bg-gray-750 group-hover:shadow-[0_0_40px_rgba(70,95,255,0.25)] will-change-transform relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-500 relative z-10">{profile.avatar}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-200 group-hover:text-white transition-colors">{profile.name}</h3>
                <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-widest">{profile.subtitle}</p>
              </button>
            </div>
          ))}

          {/* Add Profile Card */}
          {availableProfiles.length < 3 && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex flex-col items-center group transition-transform duration-300 hover:scale-105 active:scale-95 w-full"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gray-900/50 border-2 border-dashed border-gray-700 flex flex-col items-center justify-center mb-4 transition-all duration-300 group-hover:border-brand-400 group-hover:bg-gray-800 group-hover:shadow-[0_0_40px_rgba(70,95,255,0.15)]">
                <Plus className="w-12 h-12 text-gray-600 group-hover:text-brand-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-500 group-hover:text-gray-300 transition-colors">Add Profile</h3>
              <p className="text-sm text-gray-600 mt-1">Upto 3 Profiles</p>
            </button>
          )}

          {/* Add Profile Form */}
          {isAdding && (
            <div className="w-full max-w-sm bg-gray-800 p-8 rounded-[2.5rem] border border-gray-700 shadow-2xl relative animate-in fade-in zoom-in duration-300">
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <form onSubmit={handleAddProfile} className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1">New Profile</h3>
                  <p className="text-sm text-gray-400">Personalize your journey</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 size-5" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Enter Name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                      maxLength={15}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(['KIDS', 'STUDENTS', 'ASPIRANTS'] as ProfileType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewType(type)}
                        className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${
                          newType === type 
                            ? 'bg-brand-600 border-brand-500 text-white' 
                            : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-brand-600/20 active:scale-95"
                >
                  Create Profile
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
