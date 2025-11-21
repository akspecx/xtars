import { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useAuth } from "../context/AuthContext";

interface FeedbackFormData {
  name: string;
  email: string;
  learningExperience: number;
  contentUnderstanding: number;
  gamesExperience: number;
  overallExperience: number;
  difficultyLevel: string;
  favoriteFeature: string;
  suggestions: string;
  additionalComments: string;
}

export default function FeedBackComponent() {
  const { user } = useAuth();
  const [form, setForm] = useState<FeedbackFormData>({ 
    name: '', 
    email: '', 
    learningExperience: 0,
    contentUnderstanding: 0,
    gamesExperience: 0,
    overallExperience: 0,
    difficultyLevel: '',
    favoriteFeature: '',
    suggestions: '',
    additionalComments: ''
  });
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill form with user data from Google Sign-In
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    // Validate required fields
    if (form.learningExperience === 0 || form.contentUnderstanding === 0 || 
        form.gamesExperience === 0 || form.overallExperience === 0 || 
        !form.suggestions.trim() || form.suggestions.trim().length < 10) {
      setStatus('validation-error');
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData object for better compatibility with Google Apps Script
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('learningExperience', `Rating: ${form.learningExperience}`);
      formData.append('contentUnderstanding', `Rating: ${form.contentUnderstanding}`);
      formData.append('gamesExperience', `Rating: ${form.gamesExperience}`);
      formData.append('overallExperience', `Rating: ${form.overallExperience}`);
      formData.append('difficultyLevel', form.difficultyLevel);
      formData.append('favoriteFeature', form.favoriteFeature);
      formData.append('suggestions', form.suggestions);
      formData.append('additionalComments', form.additionalComments);

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzw5vRNBPuAg_p6TnWCVhylOzjdzGSlac8xUtrWMUYCXqZAWTgGVDD-sbj6S9rY5SII/exec",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response data:', result);

      if (result.result === "success") {
        setStatus("success");
        setForm({
          name: user?.name || '',
          email: user?.email || '',
          learningExperience: 0,
          contentUnderstanding: 0,
          gamesExperience: 0,
          overallExperience: 0,
          difficultyLevel: '',
          favoriteFeature: '',
          suggestions: '',
          additionalComments: ''
        });
      } else {
        console.error('Server returned error:', result.message);
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("network-error");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'success':
        return (
          <div className="flex items-center gap-2 p-4 text-green-700 bg-green-100 border border-green-200 rounded-lg dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Thank you! Your feedback has been submitted successfully.</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 p-4 text-red-700 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>There was an error submitting your feedback. Please try again.</span>
          </div>
        );
      case 'network-error':
        return (
          <div className="flex items-center gap-2 p-4 text-yellow-700 bg-yellow-100 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Network error. Please check your connection and try again.</span>
          </div>
        );
      case 'validation-error':
        return (
          <div className="flex items-center gap-2 p-4 text-red-700 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Please fill in all required fields, provide ratings for all categories, and write at least 10 characters for suggestions.</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <PageMeta
        title="Feedback | XTARS - Share Your Thoughts"
        description="Send us your feedback, suggestions, or questions. We value your input to improve XTARS."
      />
      
      {/* <PageBreadcrumb pageTitle="Feedback" /> */}
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              We'd Love Your Feedback
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              Your thoughts and suggestions help us improve XTARS. Share your experience with us!
            </p>
          </div>

          {/* Feedback Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!!user}
                    required
                    className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:bg-gray-600 dark:disabled:text-gray-400"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
                {user && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Email pre-filled from Google Sign-In
                  </p>
                )}
              </div>

              {/* Learning Experience Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  How would you rate your overall learning experience? <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setForm({ ...form, learningExperience: rating })}
                      className={`p-2 rounded-full transition-colors ${
                        form.learningExperience >= rating
                          ? 'text-yellow-400 hover:text-yellow-500'
                          : 'text-gray-300 dark:text-gray-600 hover:text-gray-400'
                      }`}
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {form.learningExperience > 0 ? `${form.learningExperience}/5` : 'Not rated'}
                  </span>
                </div>
              </div>

              {/* Content Understanding Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  How easy was it to understand the content? <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setForm({ ...form, contentUnderstanding: rating })}
                      className={`p-2 rounded-full transition-colors ${
                        form.contentUnderstanding >= rating
                          ? 'text-green-400 hover:text-green-500'
                          : 'text-gray-300 dark:text-gray-600 hover:text-gray-400'
                      }`}
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {form.contentUnderstanding > 0 ? `${form.contentUnderstanding}/5` : 'Not rated'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  (1 = Very difficult, 5 = Very easy)
                </p>
              </div>

              {/* Games Experience Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  How would you rate the interactive games and activities? <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setForm({ ...form, gamesExperience: rating })}
                      className={`p-2 rounded-full transition-colors ${
                        form.gamesExperience >= rating
                          ? 'text-purple-400 hover:text-purple-500'
                          : 'text-gray-300 dark:text-gray-600 hover:text-gray-400'
                      }`}
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {form.gamesExperience > 0 ? `${form.gamesExperience}/5` : 'Not rated'}
                  </span>
                </div>
              </div>

              {/* Overall Experience Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  What's your overall experience with XTARS? <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setForm({ ...form, overallExperience: rating })}
                      className={`p-2 rounded-full transition-colors ${
                        form.overallExperience >= rating
                          ? 'text-blue-400 hover:text-blue-500'
                          : 'text-gray-300 dark:text-gray-600 hover:text-gray-400'
                      }`}
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {form.overallExperience > 0 ? `${form.overallExperience}/5` : 'Not rated'}
                  </span>
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label htmlFor="difficultyLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How would you describe the difficulty level?
                </label>
                <select
                  id="difficultyLevel"
                  name="difficultyLevel"
                  value={form.difficultyLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                >
                  <option value="">Select difficulty level</option>
                  <option value="too-easy">Too Easy</option>
                  <option value="just-right">Just Right</option>
                  <option value="challenging">Challenging but Good</option>
                  <option value="too-difficult">Too Difficult</option>
                </select>
              </div>

              {/* Favorite Feature */}
              <div>
                <label htmlFor="favoriteFeature" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What's your favorite feature or aspect of XTARS?
                </label>
                <input
                  type="text"
                  id="favoriteFeature"
                  name="favoriteFeature"
                  placeholder="e.g., Interactive games, Course content, User interface..."
                  value={form.favoriteFeature}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
              </div>

              {/* Suggestions */}
              <div>
                <label htmlFor="suggestions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Any suggestions for improvement? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="suggestions"
                  name="suggestions"
                  rows={4}
                  placeholder="Share your ideas on how we can make XTARS better..."
                  value={form.suggestions}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-colors"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {form.suggestions.trim().length}/10 characters minimum
                </p>
              </div>

              {/* Additional Comments */}
              <div>
                <label htmlFor="additionalComments" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Comments
                </label>
                <textarea
                  id="additionalComments"
                  name="additionalComments"
                  rows={3}
                  placeholder="Anything else you'd like to share..."
                  value={form.additionalComments}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors dark:focus:ring-offset-gray-800"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Feedback
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Status Message */}
            {status && (
              <div className="mt-6">
                {getStatusMessage()}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Need immediate assistance?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <a
                href="mailto:support@xtars.in"
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                support@xtars.in
              </a>
              <span className="hidden sm:block text-gray-400">•</span>
              <span className="text-gray-600 dark:text-gray-400">
                We typically respond within 24 hours
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

