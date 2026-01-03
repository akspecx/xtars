import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sun, Droplets, Rainbow, Zap, Star } from 'lucide-react';

interface TabProps {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

const Light = () => {
  const [activeTab, setActiveTab] = useState('introduction');
  const [quizAnswers, setQuizAnswers] = useState({
    q1: '',
    q2: '',
    q3: ''
  });

  const handleAnswerSelect = (question: string, answer: string) => {
    setQuizAnswers(prev => ({
      ...prev,
      [question]: answer
    }));
  };

  const tabs: TabProps[] = [
    { id: 'introduction', label: 'Introduction', icon: Sun },
    { id: 'sources', label: 'Light Sources', icon: Star },
    { id: 'properties', label: 'Properties', icon: Rainbow },
    { id: 'funExperiments', label: 'Fun Experiments', icon: Droplets }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-6"
        >
          Let's Explore the World of Light! 🌟
        </motion.h1>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-500 text-white shadow-lg scale-105' 
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-8">
          {activeTab === 'introduction' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                What is Light? 💡
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Light is what helps us see the wonderful world around us! It's a form of energy that travels in straight lines and can be both natural (like sunlight) and artificial (like bulbs).
              </p>
              <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-600 dark:text-blue-300 mb-2">
                  Did you know? 🤔
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Light travels at an amazing speed of 300,000 kilometers per second! That's like going around the Earth 7.5 times in just one second!
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'sources' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Sources of Light 🌞
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold text-yellow-600 dark:text-yellow-300 mb-2">
                    Natural Sources
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    <li>The Sun</li>
                    <li>Stars</li>
                    <li>Lightning</li>
                    <li>Fireflies</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold text-purple-600 dark:text-purple-300 mb-2">
                    Artificial Sources
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    <li>Light Bulbs</li>
                    <li>Candles</li>
                    <li>Torches</li>
                    <li>TV Screens</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'properties' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Amazing Properties of Light 🌈
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-600 dark:text-green-300 mb-2">
                    1. Light Travels in Straight Lines
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    That's why we can't see around corners without mirrors!
                  </p>
                </div>
                <div className="bg-pink-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-pink-600 dark:text-pink-300 mb-2">
                    2. Light Can Be Reflected
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Just like when you see yourself in a mirror!
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-600 dark:text-orange-300 mb-2">
                    3. Light Can Be Split into Colors
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    That's how we see rainbows after it rains!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'funExperiments' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Let's Do Some Experiments! 🔬
              </h2>
              
              <div className="space-y-6">
                <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-indigo-600 dark:text-indigo-300 mb-2">
                    Make Your Own Rainbow 🌈
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    You'll need:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-2">
                    <li>A glass of water</li>
                    <li>White paper</li>
                    <li>Sunlight</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300">
                    Place the glass of water near a window where sunlight can shine through it. Hold the white paper on the other side and watch the rainbow appear!
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                    Quick Quiz! 🎯
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                      <p className="font-medium text-gray-800 dark:text-white mb-2">
                        1. What helps us see objects?
                      </p>
                      <div className="space-y-2">
                        {['Light', 'Sound', 'Heat'].map((answer) => (
                          <button
                            key={answer}
                            onClick={() => handleAnswerSelect('q1', answer)}
                            className={`w-full p-2 text-left rounded ${
                              quizAnswers.q1 === answer 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
                            }`}
                          >
                            {answer}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button 
            onClick={() => {
              const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1].id);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === tabs[0].id 
                ? 'invisible' 
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Previous
          </button>
          <button 
            onClick={() => {
              const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
              if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1].id);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === tabs[tabs.length - 1].id 
                ? 'invisible' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Light;