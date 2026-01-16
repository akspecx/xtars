import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, Users, RotateCw, Award } from 'lucide-react';

const CircularArrangementModule = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "What is Circular Arrangement?",
      icon: <RotateCw className="w-12 h-12 text-blue-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-lg">Circular arrangement is a logical reasoning concept where people or objects are placed around a circle, like sitting around a round table or standing in a ring.</p>
          
          <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 text-lg">Why is it Important?</h3>
            <p className="text-blue-800 mb-2">Circular arrangement questions test your ability to:</p>
            <ul className="list-disc list-inside text-blue-800 space-y-1 ml-4">
              <li>Understand relative positions (left, right, opposite)</li>
              <li>Visualize spatial relationships</li>
              <li>Solve step-by-step using given clues</li>
            </ul>
          </div>

          <div className="flex justify-center my-6">
            <svg viewBox="0 0 250 250" className="w-80 h-80">
              <circle cx="125" cy="125" r="80" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="5,5"/>
              <text x="125" y="125" textAnchor="middle" fill="#3b82f6" fontSize="14" fontWeight="bold">Round Table</text>
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const angle = (i * 60 - 90) * Math.PI / 180;
                const x = 125 + 80 * Math.cos(angle);
                const y = 125 + 80 * Math.sin(angle);
                const names = ['A', 'B', 'C', 'D', 'E', 'F'];
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="25" fill="#3b82f6"/>
                    <text x={x} y={y + 6} textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">
                      {names[i]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="text-center text-gray-600 italic">6 people sitting around a circular table</p>
        </div>
      )
    },
    {
      title: "Understanding Positions in a Circle",
      icon: <Users className="w-12 h-12 text-purple-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-lg">In circular arrangement, we describe positions relative to each other:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
              <h4 className="font-semibold text-green-900 mb-2">🔄 Clockwise</h4>
              <p className="text-green-800">Moving in the direction of clock hands (left to right when facing center)</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
              <h4 className="font-semibold text-blue-900 mb-2">🔄 Anti-clockwise</h4>
              <p className="text-blue-800">Moving opposite to clock hands (right to left when facing center)</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
              <h4 className="font-semibold text-yellow-900 mb-2">👈 Immediate Left</h4>
              <p className="text-yellow-800">The person sitting directly to your left (anti-clockwise neighbor)</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-300">
              <h4 className="font-semibold text-orange-900 mb-2">👉 Immediate Right</h4>
              <p className="text-orange-800">The person sitting directly to your right (clockwise neighbor)</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-300 md:col-span-2">
              <h4 className="font-semibold text-purple-900 mb-2">⚡ Opposite/Across</h4>
              <p className="text-purple-800">The person sitting directly across from you (works only with even number of people)</p>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <svg viewBox="0 0 300 300" className="w-full max-w-md">
              <circle cx="150" cy="150" r="90" fill="none" stroke="#9ca3af" strokeWidth="2" strokeDasharray="5,5"/>
              
              <circle cx="150" cy="60" r="30" fill="#ef4444"/>
              <text x="150" y="68" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">You</text>
              
              <circle cx="228" cy="105" r="25" fill="#3b82f6"/>
              <text x="228" y="112" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Right</text>
              
              <circle cx="72" cy="105" r="25" fill="#8b5cf6"/>
              <text x="72" y="112" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Left</text>
              
              <circle cx="150" cy="240" r="25" fill="#10b981"/>
              <text x="150" y="247" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Opposite</text>
            </svg>
          </div>
        </div>
      )
    },
    {
      title: "Key Concepts - Facing Direction",
      icon: <BookOpen className="w-12 h-12 text-green-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-lg">One crucial aspect of circular arrangement is understanding the facing direction:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
              <h3 className="font-semibold text-blue-900 mb-3 text-lg text-center">Facing the Center</h3>
              <div className="flex justify-center mb-3">
                <svg viewBox="0 0 200 200" className="w-full h-48">
                  <circle cx="100" cy="100" r="60" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
                  {[0, 1, 2, 3].map((i) => {
                    const angle = (i * 90 - 90) * Math.PI / 180;
                    const x = 100 + 60 * Math.cos(angle);
                    const y = 100 + 60 * Math.sin(angle);
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="20" fill="#3b82f6"/>
                      </g>
                    );
                  })}
                  <circle cx="100" cy="100" r="8" fill="#ef4444"/>
                </svg>
              </div>
              <ul className="text-blue-800 space-y-2">
                <li className="flex items-start"><span className="mr-2">✓</span>Left means anti-clockwise</li>
                <li className="flex items-start"><span className="mr-2">✓</span>Right means clockwise</li>
              </ul>
            </div>

            <div className="bg-red-50 p-6 rounded-lg border-2 border-red-300">
              <h3 className="font-semibold text-red-900 mb-3 text-lg text-center">Facing Outside</h3>
              <div className="flex justify-center mb-3">
                <svg viewBox="0 0 200 200" className="w-full h-48">
                  <circle cx="100" cy="100" r="60" fill="#fee2e2" stroke="#ef4444" strokeWidth="2"/>
                  {[0, 1, 2, 3].map((i) => {
                    const angle = (i * 90 - 90) * Math.PI / 180;
                    const x = 100 + 60 * Math.cos(angle);
                    const y = 100 + 60 * Math.sin(angle);
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="20" fill="#ef4444"/>
                      </g>
                    );
                  })}
                  <circle cx="100" cy="100" r="8" fill="#3b82f6"/>
                </svg>
              </div>
              <ul className="text-red-800 space-y-2">
                <li className="flex items-start"><span className="mr-2">✓</span>Left means clockwise (reversed!)</li>
                <li className="flex items-start"><span className="mr-2">✓</span>Right means anti-clockwise (reversed!)</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-400 mt-4">
            <p className="text-yellow-900 font-semibold text-center">
              ⚠️ Always check the facing direction first! It changes everything!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Solving Step-by-Step",
      icon: <Award className="w-12 h-12 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-lg font-semibold text-gray-800">Follow these steps to solve any circular arrangement problem:</p>
          
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-900 mb-2">Step 1: Draw a Circle</h4>
              <p className="text-blue-800">Always start by drawing a circle. Mark positions clearly.</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-bold text-purple-900 mb-2">Step 2: Check Facing Direction</h4>
              <p className="text-purple-800">Are people facing center or outside? This determines left/right.</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <h4 className="font-bold text-green-900 mb-2">Step 3: Place the First Person</h4>
              <p className="text-green-800">Start with the person mentioned first or with the most information.</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-bold text-yellow-900 mb-2">Step 4: Use Clues One by One</h4>
              <p className="text-yellow-800">Place others based on their relationship (left/right/opposite) to already placed people.</p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <h4 className="font-bold text-red-900 mb-2">Step 5: Verify Your Answer</h4>
              <p className="text-red-800">Check if all given conditions are satisfied in your arrangement.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-100 to-pink-100 p-6 rounded-lg border-2 border-orange-300 mt-6">
            <h4 className="font-bold text-orange-900 mb-3 text-center">Pro Tips 💡</h4>
            <ul className="space-y-2 text-orange-800">
              <li className="flex items-start"><span className="mr-2 text-xl">👉</span>Use abbreviations or initials to save time</li>
              <li className="flex items-start"><span className="mr-2 text-xl">👉</span>Mark arrows for clockwise direction</li>
              <li className="flex items-start"><span className="mr-2 text-xl">👉</span>Cross-check with all clues before finalizing</li>
              <li className="flex items-start"><span className="mr-2 text-xl">👉</span>If stuck, try different starting positions</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Practice Example",
      icon: <Users className="w-12 h-12 text-teal-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-teal-50 p-6 rounded-lg border-2 border-teal-300">
            <h3 className="font-semibold text-teal-900 mb-4 text-lg">Example Problem:</h3>
            <p className="text-teal-800 mb-4">Five friends A, B, C, D, and E are sitting around a circular table facing the center.</p>
            <ul className="list-disc list-inside text-teal-800 space-y-2 ml-4">
              <li>A is sitting to the immediate right of B</li>
              <li>C is sitting opposite to A</li>
              <li>D is sitting to the immediate left of B</li>
              <li>Who is sitting to the immediate right of D?</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
            <h4 className="font-semibold text-gray-900 mb-4">Step-by-Step Solution:</h4>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</span>
                <p className="text-gray-700">Draw a circle and mark 5 positions. People are facing center.</p>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</span>
                <p className="text-gray-700">Start with B at any position. A is to the immediate right of B (clockwise from B).</p>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</span>
                <p className="text-gray-700">C is opposite to A. With 5 people, opposite means 2 positions away. Place C.</p>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</span>
                <p className="text-gray-700">D is to immediate left of B (anti-clockwise from B).</p>
              </div>

              <div className="flex justify-center my-4">
                <svg viewBox="0 0 250 250" className="w-80 h-80">
                  <circle cx="125" cy="125" r="80" fill="none" stroke="#14b8a6" strokeWidth="3"/>
                  
                  <circle cx="125" cy="45" r="25" fill="#3b82f6"/>
                  <text x="125" y="53" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">B</text>
                  
                  <circle cx="194" cy="88" r="25" fill="#8b5cf6"/>
                  <text x="194" y="96" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">A</text>
                  
                  <circle cx="56" cy="162" r="25" fill="#ef4444"/>
                  <text x="56" y="170" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">C</text>
                  
                  <circle cx="56" cy="88" r="25" fill="#10b981"/>
                  <text x="56" y="96" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">D</text>
                  
                  <circle cx="194" cy="162" r="25" fill="#f59e0b"/>
                  <text x="194" y="170" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">E</text>
                </svg>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-400">
                <p className="font-bold text-green-900 text-lg mb-2">Answer: B</p>
                <p className="text-green-800">To the immediate right of D (clockwise from D when facing center) is B!</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Common Question Types",
      icon: <BookOpen className="w-12 h-12 text-pink-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-lg font-semibold text-gray-800 mb-4">You will encounter these types of questions:</p>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-5 rounded-lg border-2 border-blue-300">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">1️⃣</span> Direct Position Questions
              </h4>
              <p className="text-blue-800 mb-2">Example: Who is sitting to the right of A?</p>
              <p className="text-blue-700 text-sm italic">Strategy: Draw the arrangement and identify the position directly</p>
            </div>

            <div className="bg-green-50 p-5 rounded-lg border-2 border-green-300">
              <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">2️⃣</span> Counting Questions
              </h4>
              <p className="text-green-800 mb-2">Example: How many people are sitting between A and B?</p>
              <p className="text-green-700 text-sm italic">Strategy: Count in both directions and pick the shorter path</p>
            </div>

            <div className="bg-purple-50 p-5 rounded-lg border-2 border-purple-300">
              <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">3️⃣</span> Opposite Position Questions
              </h4>
              <p className="text-purple-800 mb-2">Example: Who is sitting opposite to C?</p>
              <p className="text-purple-700 text-sm italic">Strategy: Only works with even number of people</p>
            </div>

            <div className="bg-orange-50 p-5 rounded-lg border-2 border-orange-300">
              <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">4️⃣</span> Neighbor Questions
              </h4>
              <p className="text-orange-800 mb-2">Example: Who are the immediate neighbors of D?</p>
              <p className="text-orange-700 text-sm italic">Strategy: Identify the person on both left and right sides</p>
            </div>

            <div className="bg-red-50 p-5 rounded-lg border-2 border-red-300">
              <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">5️⃣</span> Conditional Questions
              </h4>
              <p className="text-red-800 mb-2">Example: If A and B exchange positions, who will be to the left of C?</p>
              <p className="text-red-700 text-sm italic">Strategy: Make the change and redraw if needed</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Key Points to Remember",
      icon: <Award className="w-12 h-12 text-indigo-600" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Master These Concepts!</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
              <span className="text-2xl">👁️</span>
              <div>
                <p className="font-semibold text-indigo-900">Facing Direction Matters</p>
                <p className="text-indigo-700">Always check if people are facing center or outside - it reverses left and right!</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <span className="text-2xl">🔄</span>
              <div>
                <p className="font-semibold text-green-900">Clockwise equals Right (facing center)</p>
                <p className="text-green-700">When facing center, moving clockwise means going to the right</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <span className="text-2xl">✏️</span>
              <div>
                <p className="font-semibold text-yellow-900">Always Draw</p>
                <p className="text-yellow-700">Do not try to solve in your head - draw a circle and mark positions</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="font-semibold text-red-900">Opposite Only for Even Numbers</p>
                <p className="text-red-700">Direct opposite position only exists when there is an even number of people</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-semibold text-purple-900">Start with Maximum Info</p>
                <p className="text-purple-700">Begin with the person who has the most connections mentioned</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-pink-50 p-4 rounded-lg border-l-4 border-pink-500">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-pink-900">Verify All Conditions</p>
                <p className="text-pink-700">After solving, check that your arrangement satisfies all given clues</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-lg mt-6 text-center">
            <p className="text-xl font-bold mb-2">🎉 You are Ready to Solve!</p>
            <p className="mb-4">Practice different types of problems to build confidence</p>
            <p className="text-sm text-blue-100">Remember: Draw, Check Direction, Place Step-by-Step, Verify!</p>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-3xl font-bold text-center mb-2">Circular Arrangement</h1>
            <p className="text-center text-blue-100">Logical Reasoning Module</p>
          </div>

          <div className="bg-gray-200 h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            ></div>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              {slides[currentSlide].icon}
              <h2 className="text-2xl font-bold text-gray-800">{slides[currentSlide].title}</h2>
            </div>
            
            <div className="min-h-96">
              {slides[currentSlide].content}
            </div>
          </div>

          <div className="bg-gray-50 p-6 flex justify-between items-center border-t">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                currentSlide === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="text-center">
              <p className="text-gray-600 font-medium">
                Slide {currentSlide + 1} of {slides.length}
              </p>
            </div>

            <button
              onClick={nextSlide}
              className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 shadow-lg hover:shadow-xl transition-all"
            >
              {currentSlide === slides.length - 1 ? 'Start Again' : 'Next'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularArrangementModule;