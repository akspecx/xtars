import React, { useState, useEffect } from 'react';

type ParentalGateProps = {
  onSuccess: () => void;
  onClose: () => void;
};

const ParentalGate: React.FC<ParentalGateProps> = ({ onSuccess, onClose }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Generate two random numbers between 1 and 10
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(answer, 10) === num1 + num2) {
      onSuccess();
    } else {
      setError('That\'s not quite right. Please try again.');
      setAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Are you a grown-up?</h2>
        <p className="mb-4">To continue, please answer this question:</p>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-center text-2xl mb-4">
            <span>{num1}</span>
            <span className="mx-2">+</span>
            <span>{num2}</span>
            <span className="mx-2">=</span>
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-20 border-2 border-gray-300 rounded-lg text-center"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex justify-center gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParentalGate;
