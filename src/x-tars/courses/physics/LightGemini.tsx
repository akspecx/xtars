import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Star, Zap, Globe } from 'lucide-react';

// Kid-friendly Class 6 Light lesson - LightGemini
const LightGemini: React.FC = () => {
  const [tab, setTab] = useState<'intro' | 'sources' | 'props' | 'experiments' | 'quiz'>('intro');
  const [answers, setAnswers] = useState<{ [k: string]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (q: string, a: string) => {
    setAnswers(prev => ({ ...prev, [q]: a }));
  };

  const quizQuestions = [
    {
      id: 'q1',
      q: 'Which of these helps us see objects?',
      options: ['Sound', 'Light', 'Smell'],
      correct: 'Light',
      tip: 'Think: how do you know where a toy is in a dark room?'
    },
    {
      id: 'q2',
      q: 'What happens when light hits a smooth mirror?',
      options: ['It bends a lot', 'It disappears', 'It reflects (bounces back)'],
      correct: 'It reflects (bounces back)',
      tip: 'Look at your face in the mirror — what do you see?'
    },
    {
      id: 'q3',
      q: 'Which object can split white light into colors?',
      options: ['A chair', 'A prism or raindrops', 'A window curtain'],
      correct: 'A prism or raindrops',
      tip: 'Remember the rainbow after the rain?'
    }
  ];

  const score = quizQuestions.reduce((s, q) => s + (answers[q.id] === q.correct ? 1 : 0), 0);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-yellow-50 via-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto">
        <motion.header initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center text-yellow-800 dark:text-yellow-300">
            Light (Class 6) — Fun & Easy with LightGemini
          </h1>
          <p className="mt-2 text-center text-gray-700 dark:text-gray-300">
            Simple explanations, real-world examples, and quick experiments your students will love.
          </p>
        </motion.header>

        <nav className="flex justify-center gap-3 flex-wrap mb-6">
          {[
            { id: 'intro', label: 'Introduction', icon: Sun },
            { id: 'sources', label: 'Sources', icon: Star },
            { id: 'props', label: 'Properties', icon: Zap },
            { id: 'experiments', label: 'Experiments', icon: Globe },
            { id: 'quiz', label: 'Quiz', icon: (() => () => <span>❓</span>)() }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id as any); setShowResults(false); }}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${tab === t.id ? 'bg-yellow-500 text-white shadow' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            >
              <t.icon className="inline-block mr-2" /> {t.label}
            </button>
          ))}
        </nav>

        <section className="space-y-6">
          {tab === 'intro' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">What is Light?</h2>
              <p className="mt-2 text-gray-700 dark:text-gray-300">Light is a form of energy that helps us see. It travels in straight lines and can come from the Sun or bulbs.</p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-yellow-50 rounded">
                  <h3 className="font-semibold">Fun Fact</h3>
                  <p className="text-sm text-gray-700">Light from the Sun reaches Earth in about 8 minutes — so when we see sunlight, we are seeing the Sun as it was 8 minutes ago!</p>
                </div>
                <div className="p-4 bg-blue-50 rounded">
                  <h3 className="font-semibold">Real world example</h3>
                  <p className="text-sm text-gray-700">When you switch on a torch in a dark room, the light helps you find your toys — that is light helping you see.</p>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'sources' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">Sources of Light</h2>
              <p className="mt-2 text-gray-700 dark:text-gray-300">Sources are of two types: Natural and Artificial.</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded bg-yellow-50">
                  <h4 className="font-semibold">Natural</h4>
                  <ul className="list-disc pl-5 text-gray-700"><li>Sun</li><li>Stars</li><li>Lightning</li></ul>
                </div>
                <div className="p-4 rounded bg-white">
                  <h4 className="font-semibold">Artificial</h4>
                  <ul className="list-disc pl-5 text-gray-700"><li>Bulbs</li><li>LED lights</li><li>Flame (candle)</li></ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-indigo-50 rounded">
                <h4 className="font-semibold">Class activity</h4>
                <p className="text-sm text-gray-700">Ask students to list 3 light sources in their home and classify them as natural/artificial.</p>
              </div>
            </motion.div>
          )}

          {tab === 'props' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">Important Properties</h2>
              <ol className="list-decimal pl-5 mt-3 space-y-3 text-gray-700">
                <li>
                  Travels in straight lines — show with a flashlight and cardboard with a small hole.
                </li>
                <li>
                  Reflection — when light bounces back from a smooth surface (mirrors).
                </li>
                <li>
                  Refraction — bending of light when it goes from one medium to another (water-glass-air). Simple demo: straight straw in a glass of water looks bent.
                </li>
                <li>
                  Dispersion — splitting of white light into colors (prism or raindrops make rainbows).
                </li>
              </ol>

              <div className="mt-4 p-4 bg-green-50 rounded">
                <h4 className="font-semibold">Real world example</h4>
                <p className="text-sm text-gray-700">Why does the spoon look bent in a glass of water? Because light bends (refracts) when it moves from air to water.</p>
              </div>
            </motion.div>
          )}

          {tab === 'experiments' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">Simple Experiments (Safe for class)</h2>
              <ul className="mt-3 list-disc pl-5 text-gray-700 space-y-3">
                <li><strong>Make a rainbow:</strong> Use a glass of water and white paper in sunlight. Tilt the glass and find the colors.</li>
                <li><strong>Shadow play:</strong> Use a torch and toys to create big and small shadows. Walk closer/farther to see change.</li>
                <li><strong>Mirror reflection:</strong> Use a small mirror to reflect sunlight onto a wall — trace the spot.</li>
              </ul>

              <div className="mt-4 p-4 bg-purple-50 rounded">
                <h4 className="font-semibold">Safety tip</h4>
                <p className="text-sm text-gray-700">Never look directly at the Sun. For rainbow experiments, use sunlight indirectly through glass.</p>
              </div>
            </motion.div>
          )}

          {tab === 'quiz' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">Quick Quiz</h2>
              <p className="mt-2 text-sm text-gray-600">Choose the best answer. After answering, click "Show Results" to see the score and tips.</p>

              <div className="mt-4 space-y-4">
                {quizQuestions.map(q => (
                  <div key={q.id} className="p-3 border rounded">
                    <div className="font-medium text-gray-800">{q.q}</div>
                    <div className="mt-2 flex flex-col gap-2">
                      {q.options.map(opt => (
                        <button
                          key={opt}
                          className={`text-left p-2 rounded ${answers[q.id] === opt ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                          onClick={() => handleAnswer(q.id, opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {answers[q.id] && <div className="mt-2 text-sm text-gray-600">Tip: {q.tip}</div>}
                  </div>
                ))}

                <div className="flex items-center gap-3 mt-4">
                  <button onClick={() => setShowResults(true)} className="px-4 py-2 bg-yellow-500 text-white rounded">Show Results</button>
                  <button onClick={() => { setAnswers({}); setShowResults(false); }} className="px-4 py-2 bg-gray-200 rounded">Reset</button>
                </div>

                {showResults && (
                  <div className="mt-4 p-4 bg-green-50 rounded">
                    <div className="font-semibold">Your Score: {score} / {quizQuestions.length}</div>
                    <div className="mt-2 text-sm text-gray-700">
                      {quizQuestions.map(q => (
                        <div key={q.id} className="mt-1">
                          <strong>{q.q}</strong>
                          <div>Correct: {q.correct}</div>
                          <div>Your answer: {answers[q.id] ?? '—'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </section>

        <footer className="mt-6 flex justify-between">
          <div />
          <div className="text-sm text-gray-600">Made for curious minds — LightGemini ✨</div>
        </footer>
      </div>
    </div>
  );
}

export default LightGemini;