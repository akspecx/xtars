import React, { useState } from 'react';

// ========= TYPE DEFINITIONS ========= //
type PhysicsFact = {
  id: number;
  title: string;
  description: string;
  position: { top: string; left: string };
};

//export default WhyPhysics;

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

// ========= SVG ICONS ========= //
const FeatherIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2 h-8 w-8 text-gray-400">
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
    <line x1="16" y1="8" x2="2" y2="22"></line>
    <line x1="17.5" y1="15" x2="9" y2="15"></line>
  </svg>
);

const BowlingBallIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="inline-block mr-2 h-8 w-8 text-gray-700">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="15" cy="9" r="1" fill="white"></circle>
        <circle cx="9" cy="9" r="1" fill="white"></circle>
        <circle cx="12" cy="15" r="1" fill="white"></circle>
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6">
        <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 21l1.9-5.8 5.8-1.9-5.8-1.9L12 3z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
    </svg>
);


// ========= DATA CONSTANTS ========= //
const dropFacts: PhysicsFact[] = [
  { id: 1, title: 'Surface Tension', description: "Why is a drop round? Water molecules love to stick together, like they're holding hands!", position: { top: '20%', left: '75%' } },
  { id: 2, title: 'Gravity', description: "A force called Gravity is always pulling the drop down. It's the same force that keeps you on Earth!", position: { top: '80%', left: '50%' } },
  { id: 3, title: 'Light & Refraction', description: 'Rainbows in a sprinkler? That\'s light bending as it passes through water!', position: { top: '30%', left: '5%' } },
];

const initialQuizQuestion: QuizQuestion = {
    question: "On the moon (with no air), what hits the ground first if you drop a feather and a bowling ball?",
    options: ["The Feather", "The Bowling Ball", "They hit at the same time!"],
    correctAnswer: "They hit at the same time!"
};

// ========= HELPER COMPONENTS ========= //
const InfoCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-lg transform hover:scale-105 transition-transform duration-300 h-full">
        <h3 className="font-bold text-xl text-cyan-300 mb-2">{title}</h3>
        <p className="text-gray-200">{children}</p>
    </div>
);

// ========= MAIN APPLICATION COMPONENT ========= //
export default function WhyPhysics() {
  // State for various interactive parts of the app
  const [activeFact, setActiveFact] = useState<PhysicsFact | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  
  // State for Gemini "Ask the Universe" feature
  const [userQuestion, setUserQuestion] = useState('');
  const [geminiAnswer, setGeminiAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  // State for Gemini Dynamic Quiz feature
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestion>(initialQuizQuestion);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  // --- GEMINI API HANDLERS --- //

  const exponentialBackoff = async <T,>(apiCall: () => Promise<T>, maxRetries = 5): Promise<T> => {
    let delay = 1000;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await apiCall();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
    throw new Error("API call failed after multiple retries.");
  };

  const handleAskGemini = async () => {
    if (!userQuestion.trim() || isAsking) return;
    setIsAsking(true);
    setGeminiAnswer('');
    
    const prompt = `Explain the answer to this question like I'm a curious 12-year-old. Keep the explanation simple, exciting, and under 100 words. Question: "${userQuestion}"`;

    const apiCall = async () => {
        const apiKey = ""; // API key will be provided by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        const result = await response.json();
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
            setGeminiAnswer(text);
        } else {
            setGeminiAnswer("Sorry, I couldn't find an answer for that. Try asking in a different way!");
        }
    };

    try {
        await exponentialBackoff(apiCall);
    } catch (error) {
        console.error("Error fetching from Gemini API:", error);
        setGeminiAnswer("Oops! Something went wrong trying to connect to the universe's knowledge base. Please try again later.");
    } finally {
        setIsAsking(false);
    }
  };
  
  const generateNewQuizQuestion = async () => {
    setIsGeneratingQuiz(true);
    setAnswerState('unanswered');

    const prompt = `Generate a single, simple, multiple-choice physics trivia question suitable for a 12-year-old. The topic should be a fun fact about basic physics concepts like gravity, light, energy, or forces. Provide the response as a JSON object with keys: "question", "options" (an array of 4 strings), and "correctAnswer" (one of the strings from the options array).`;
    
    const schema = {
        type: "OBJECT",
        properties: {
            "question": { "type": "STRING" },
            "options": { "type": "ARRAY", "items": { "type": "STRING" } },
            "correctAnswer": { "type": "STRING" }
        },
        required: ["question", "options", "correctAnswer"]
    };

    const apiCall = async () => {
        const apiKey = ""; // API key will be provided by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json", responseSchema: schema }
            })
        });
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        const result = await response.json();
        const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
            const parsedJson = JSON.parse(jsonText);
            // Ensure options are shuffled for variety
            parsedJson.options.sort(() => Math.random() - 0.5);
            setQuizQuestion(parsedJson);
        } else {
            throw new Error("Invalid JSON response from API");
        }
    };

    try {
        await exponentialBackoff(apiCall);
    } catch (error) {
        console.error("Error generating quiz question:", error);
        // Fallback to initial question on error
        setQuizQuestion(initialQuizQuestion);
    } finally {
        setIsGeneratingQuiz(false);
    }
  };

  const handleQuizAnswer = (selectedAnswer: string) => {
    setAnswerState(selectedAnswer === quizQuestion.correctAnswer ? 'correct' : 'incorrect');
  };

  return (
    <div className="bg-gray-900 text-white font-sans antialiased">
      {/* ===== HERO SECTION ===== */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 z-0">
          <div id="stars" className="absolute inset-0"></div>
          <div id="stars2" className="absolute inset-0"></div>
        </div>
        <div className="relative z-10 text-center p-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400">
            Why Physics?
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Because it's the rulebook for everything... from the tiniest drop to the entire universe.
          </p>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-cyan-300 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 13 5 5 5-5M7 6l5 5 5-5"/></svg>
        </div>
      </header>

      <main className="py-20 px-4 md:px-8">
        
        {/* --- Sections from original app --- */}
        <section className="max-w-5xl mx-auto text-center mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Universe's Secret Rulebook 🤫</h2>
            <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
                Imagine the universe is a giant video game. Physics is the <strong className="text-cyan-300">source code</strong> that explains how everything works—why balls fall down, and how stars shine.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
                <InfoCard title="Matter">The "stuff" everything is made of, like the universe's LEGO bricks.</InfoCard>
                <InfoCard title="Energy">The "power" that makes stuff move and change, like batteries for the LEGOs.</InfoCard>
                <InfoCard title="Forces">The "pushes and pulls" that boss matter and energy around, like gravity.</InfoCard>
            </div>
        </section>

        <section className="max-w-5xl mx-auto mb-24">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">It All Starts Small... 💧</h2>
            <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop" alt="A colorful drop of liquid" className="w-full h-full object-cover rounded-full shadow-2xl shadow-cyan-500/20" onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x600/020617/38bdf8?text=Drop'; }}/>
                {dropFacts.map((fact) => (
                    <button key={fact.id} className="absolute w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-xl transform transition-all duration-300 hover:scale-125 hover:bg-cyan-400 z-20" style={{ top: fact.position.top, left: fact.position.left, transform: 'translate(-50%, -50%)' }} onMouseEnter={() => setActiveFact(fact)} onMouseLeave={() => setActiveFact(null)} aria-label={`Info about ${fact.title}`}>+</button>
                ))}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-11/12 md:w-full max-w-md p-4 bg-gray-800/80 backdrop-blur-lg rounded-lg border border-cyan-500/50 shadow-lg transition-all duration-300 ease-in-out z-30 ${activeFact ? 'opacity-100 translate-y-24' : 'opacity-0 translate-y-32 pointer-events-none'}`}>
                    {activeFact && (<><h3 className="font-bold text-cyan-300 text-lg">{activeFact.title}</h3><p className="text-gray-300 text-sm">{activeFact.description}</p></>)}
                </div>
            </div>
        </section>

        <section className="max-w-5xl mx-auto text-center mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">...And Gets Mind-Blowingly Big! 🌌</h2>
            <div className="grid md:grid-cols-3 gap-8">
                <InfoCard title="Gravity's Reach">That same <strong className="text-cyan-300">gravity</strong> that pulls a water drop also holds galaxies together!</InfoCard>
                <InfoCard title="Cosmic Light">The <strong className="text-cyan-300">light</strong> that bends in a drop is the same stuff that travels for millions of years from distant stars.</InfoCard>
                <InfoCard title="Stellar Energy">The <strong className="text-cyan-300">energy</strong> in a tiny atom is the same kind that powers our Sun and creates massive supernovas.</InfoCard>
            </div>
        </section>

        {/* ===== GEMINI: ASK THE UNIVERSE ===== */}
        <section className="max-w-3xl mx-auto mb-24">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">✨ Ask the Universe a Question</h2>
            <p className="text-lg text-gray-400 mb-8 text-center">Got a question about physics? Any question at all! Ask away.</p>
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-white/10">
                <textarea
                    className="w-full bg-gray-700/50 rounded-lg p-4 text-white placeholder-gray-400 border-2 border-transparent focus:border-purple-500 focus:outline-none focus:ring-0 transition-colors"
                    rows={3}
                    placeholder="e.g., Why is the sky blue?"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    disabled={isAsking}
                />
                <button
                    onClick={handleAskGemini}
                    disabled={isAsking || !userQuestion.trim()}
                    className="mt-4 w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg text-lg transform hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isAsking ? 'Thinking...' : 'Ask!'}
                </button>
                {isAsking && <div className="mt-4 text-center text-cyan-300">Communicating with the cosmos...</div>}
                {geminiAnswer && (
                    <div className="mt-6 p-4 bg-white/5 border border-cyan-400/30 rounded-lg">
                        <p className="text-gray-200 whitespace-pre-wrap">{geminiAnswer}</p>
                    </div>
                )}
            </div>
        </section>

        {/* ===== GEMINI: DYNAMIC QUIZ SECTION ===== */}
        <section className="max-w-3xl mx-auto mb-24">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">You're a Physicist Too! 🤔</h2>
            <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-white/10">
                <p className="text-lg font-semibold text-gray-300 text-center mb-6">{quizQuestion.question}</p>
                
                {answerState === 'unanswered' && (
                    <div className="grid sm:grid-cols-2 gap-4">
                        {quizQuestion.options.map((option, index) => (
                            <button key={index} onClick={() => handleQuizAnswer(option)} className="p-4 bg-gray-700 rounded-lg hover:bg-cyan-600 transition-colors duration-200 text-left">{option}</button>
                        ))}
                    </div>
                )}
                
                {answerState === 'correct' && (
                    <div className="p-4 bg-green-500/20 text-green-300 border border-green-500 rounded-lg text-center">
                        <h3 className="font-bold text-xl">✨ That's Right! ✨</h3>
                        <p className="mt-2">You just used physics!</p>
                    </div>
                )}

                {answerState === 'incorrect' && (
                    <div className="p-4 bg-red-500/20 text-red-300 border border-red-500 rounded-lg text-center">
                        <h3 className="font-bold text-xl">Not Quite!</h3>
                        <p className="mt-2">The correct answer was: <strong className="text-white">{quizQuestion.correctAnswer}</strong></p>
                    </div>
                )}
                
                <div className="mt-6 text-center">
                    <button 
                        onClick={generateNewQuizQuestion}
                        disabled={isGeneratingQuiz}
                        className="flex items-center justify-center w-full md:w-auto mx-auto bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold py-3 px-8 rounded-full text-lg transform hover:scale-110 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        <SparklesIcon />
                        {isGeneratingQuiz ? 'Generating...' : 'New Question'}
                    </button>
                </div>
            </div>
        </section>
        
        {/* ===== CALL TO ACTION SECTION ===== */}
        <section className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Physics is Your Superpower.</h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">It helps us build everything from smartphones and roller coasters to the spaceships that explore the universe.</p>
            <button className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold py-4 px-8 rounded-full text-xl transform hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300">
                Discover Your First Force
            </button>
        </section>
      </main>

      <style>{`
        @keyframes move-twink-back {
            from {background-position:0 0;}
            to {background-position:-10000px 5000px;}
        }
        #stars {
         background: transparent url('https://www.script-tutorials.com/demos/360/images/stars.png') repeat top center;
         animation: move-twink-back 200s linear infinite;
        }
        #stars2 {
         background: transparent url('https://www.script-tutorials.com/demos/360/images/twinkling.png') repeat top center;
         animation: move-twink-back 150s linear infinite;
        }
      `}</style>
    </div>
  );
}

