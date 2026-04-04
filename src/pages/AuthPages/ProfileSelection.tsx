
import { useNavigate } from 'react-router';
import { useProfile, UserProfile as ContextProfile, ProfileType, AVATAR_OPTIONS } from '../../context/ProfileContext';
import { useState, useEffect } from 'react';
import { Plus, X, User, Loader2, Trash2 } from 'lucide-react';
import { App } from '@capacitor/app';
import { fetchUserProfiles, createProfile, deleteProfile } from '../../services/profileApi';
import KidAvatar from '../../x-tars/courses/CommonUtility/KidAvatar';

// API UserProfile type (with number id)
interface ApiUserProfile {
  id: number;
  name: string;
  type: ProfileType;
  subtitle: string;
  avatar: string;
  progress: number;
}

export default function ProfileSelection() {
  const { selectProfile: selectContextProfile, addProfile, removeProfile, availableProfiles: contextProfiles, setHasSelectedSessionProfile } = useProfile();
  const navigate = useNavigate();
  const [availableProfiles, setAvailableProfiles] = useState<ApiUserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<ProfileType>('KIDS');
  const [newAvatar, setNewAvatar] = useState<string>('bird');

  // Load profiles from backend on mount
  useEffect(() => {
    loadProfiles();
  }, []);

  // Handle device back button (Android/iOS)
  useEffect(() => {
    const handleBackButton = App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        navigate(-1);
      } else {
        App.exitApp();
      }
    });

    return () => {
      handleBackButton.then(listener => listener.remove());
    };
  }, [navigate]);

  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetchUserProfiles();
      if (response.success && response.data) {
        setAvailableProfiles(response.data);
      }
    } catch (error) {
      console.error('Failed to load profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSelect = async (profile: ApiUserProfile) => {
    console.log('Profile selected:', profile.name, profile.type);
    
    // Find existing profile in context by name+type
    const existingProfile = contextProfiles.find(
      p => p.name.toLowerCase() === profile.name.toLowerCase() && p.type === profile.type
    );

    if (existingProfile) {
      // Profile already in context — select it
      selectContextProfile(existingProfile.id);
      setHasSelectedSessionProfile(true);
    } else {
      // Profile not in context (e.g. ASPIRANTS added via API) — add and activate in one step
      console.log('Profile not in context, adding + activating:', profile.name, profile.type);
      addProfile(profile.name, profile.type, true);
    }
    
    // Navigate immediately — route guard bypasses checks via fromProfileSelection state
    const targetPath = profile.type === 'KIDS' ? '/games' : '/dashboard';
    console.log(`Navigating to ${targetPath} for profile type: ${profile.type}`);
    navigate(targetPath, { 
      replace: true,
      state: { fromProfileSelection: true }
    });
  };

  const handleAddProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && !isSaving) {
      setIsSaving(true);
      try {
        const response = await createProfile(newName.trim(), newType);
        if (response.success && response.data) {
          setAvailableProfiles([...availableProfiles, response.data]);
          // Add to context with chosen avatar
          addProfile(response.data.name, response.data.type, false, newAvatar);
          setIsAdding(false);
          setNewName('');
          setNewType('KIDS');
          setNewAvatar('bird');
        }
      } catch (error) {
        console.error('Failed to create profile:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleRemoveProfile = async (profileId: number) => {
    if (availableProfiles.length <= 1) {
      alert('You must have at least one profile');
      setIsRemoving(false);
      return;
    }
    
    try {
      const response = await deleteProfile(profileId);
      if (response.success) {
        const profileToRemove = availableProfiles.find(p => p.id === profileId);
        const updatedProfiles = availableProfiles.filter(p => p.id !== profileId);
        setAvailableProfiles(updatedProfiles);
        
        // Also remove from context if exists
        if (profileToRemove) {
          const contextProfile = contextProfiles.find(p => 
            p.name === profileToRemove.name && p.type === profileToRemove.type
          );
          if (contextProfile) {
            removeProfile(contextProfile.id);
          }
        }
        
        // If only one profile left, exit remove mode
        if (updatedProfiles.length <= 1) {
          setIsRemoving(false);
        }
      }
    } catch (error) {
      console.error('Failed to delete profile:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white font-outfit relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-500/20 blur-[120px]" />
         <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-theme-pink-500/20 blur-[120px]" />
      </div>

      {/* Fixed Header */}
      <div className="z-20 w-full px-4 pt-8 pb-4 bg-gradient-to-b from-gray-900 via-gray-900 to-transparent">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 tracking-tight text-center">Who's Learning Today?</h1>
        <p className="text-gray-400 text-base md:text-lg text-center px-4">Select a profile to tailor your educational journey.</p>
      </div>

      {/* Scrollable Content */}
      <div className="z-10 flex-1 overflow-y-auto px-4 pb-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-6">
            {/* Grid Layout - Responsive columns based on device width */}
            <div className="w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-5">
              {availableProfiles.map((profile) => (
                <div key={profile.id} className="relative group flex flex-col items-center">
                  {/* Delete Button - Only visible in remove mode */}
                  {isRemoving && availableProfiles.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveProfile(profile.id);
                      }}
                      className="absolute -top-1 -right-1 z-20 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center transition-all hover:bg-red-600 shadow-lg active:scale-90 animate-in fade-in zoom-in duration-200"
                      title="Remove Profile"
                    >
                      <X size={14} />
                    </button>
                  )}

                  <button
                    onClick={() => handleProfileSelect(profile)}
                    disabled={isRemoving}
                    className="flex flex-col items-center transition-transform duration-300 hover:scale-105 active:scale-95 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl md:rounded-3xl bg-gray-800 border-2 border-gray-700 flex flex-col items-center justify-center mb-2 md:mb-3 transition-all duration-300 group-hover:border-brand-400 group-hover:bg-gray-750 group-hover:shadow-[0_0_40px_rgba(70,95,255,0.25)] will-change-transform relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl group-hover:scale-110 transition-transform duration-500 relative z-10">{profile.avatar}</span>
                    </div>
                    <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-200 group-hover:text-white transition-colors truncate w-full text-center px-1">{profile.name}</h3>
                    <p className="text-[9px] sm:text-[10px] md:text-xs font-medium text-gray-500 mt-0.5 uppercase tracking-wider">{profile.type}</p>
                  </button>
                </div>
              ))}

              {/* Add Profile Card */}
              {!isAdding && !isRemoving && (
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setIsAdding(true)}
                    className="flex flex-col items-center group transition-transform duration-300 hover:scale-105 active:scale-95 w-full"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl md:rounded-3xl bg-gray-900/50 border-2 border-dashed border-gray-700 flex flex-col items-center justify-center mb-2 md:mb-3 transition-all duration-300 group-hover:border-brand-400 group-hover:bg-gray-800 group-hover:shadow-[0_0_40px_rgba(70,95,255,0.15)]">
                      <Plus className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-600 group-hover:text-brand-400 transition-colors" />
                    </div>
                    <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-500 group-hover:text-gray-300 transition-colors">Add</h3>
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 mt-0.5">New</p>
                  </button>
                </div>
              )}

              {/* Remove Profile Card */}
              {!isAdding && !isRemoving && availableProfiles.length > 1 && (
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setIsRemoving(true)}
                    className="flex flex-col items-center group transition-transform duration-300 hover:scale-105 active:scale-95 w-full"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl md:rounded-3xl bg-gray-900/50 border-2 border-dashed border-red-700/50 flex flex-col items-center justify-center mb-2 md:mb-3 transition-all duration-300 group-hover:border-red-400 group-hover:bg-gray-800 group-hover:shadow-[0_0_40px_rgba(239,68,68,0.15)]">
                      <Trash2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-600 group-hover:text-red-400 transition-colors" />
                    </div>
                    <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-500 group-hover:text-gray-300 transition-colors">Remove</h3>
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 mt-0.5">Delete</p>
                  </button>
                </div>
              )}
            </div>

            {/* Remove Mode Toolbar */}
            {isRemoving && (
              <div className="w-full max-w-sm bg-red-950/50 border border-red-500/50 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5 text-red-400" />
                    <p className="text-sm font-medium text-red-200">Tap profiles to delete them</p>
                  </div>
                  <button
                    onClick={() => setIsRemoving(false)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl font-medium text-sm transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Add Profile Form - Positioned separately */}
            {isAdding && (
              <div className="w-full max-w-sm bg-gray-800 p-6 md:p-8 rounded-3xl border border-gray-700 shadow-2xl relative animate-in fade-in zoom-in duration-300 mt-4">
                <button 
                  onClick={() => {
                    setIsAdding(false);
                    setNewName('');
                    setNewType('KIDS');
                    setNewAvatar('bird');
                  }}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                  disabled={isSaving}
                >
                  <X size={20} />
                </button>
                
                <form onSubmit={handleAddProfile} className="space-y-5">
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
                        disabled={isSaving}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {(['KIDS', 'STUDENTS', 'ASPIRANTS'] as ProfileType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewType(type)}
                          disabled={isSaving}
                          className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${
                            newType === type 
                              ? 'bg-brand-600 border-brand-500 text-white' 
                              : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-600'
                          } disabled:opacity-50`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    {/* Avatar Picker */}
                    <div>
                      <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Choose Avatar</p>
                      <div className="grid grid-cols-6 gap-1.5">
                        {AVATAR_OPTIONS.map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setNewAvatar(opt.id)}
                            disabled={isSaving}
                            className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all border-2 ${
                              newAvatar === opt.id
                                ? 'border-brand-500 bg-brand-600/20 shadow-md'
                                : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                            }`}
                          >
                            {opt.id === 'bird'
                              ? <KidAvatar avatar="bird" size={28} />
                              : <span style={{ fontSize: 22 }}>{opt.id}</span>
                            }
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-brand-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Profile'
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
