
import React, { useState } from 'react';
import tyreImage from '../../assets/images/agecalc.png';

const TyreAgeCalculator = () => {
  const [code, setCode] = useState('');
  const [manufactureDate, setManufactureDate] = useState(null);
  const [replacementDate, setReplacementDate] = useState(null);
  const [error, setError] = useState('');

  const calculateDates = () => {
    if (code.length !== 4 || isNaN(code)) {
      setError('Please enter a valid 4-digit code.');
      return;
    }

    const week = parseInt(code.substring(0, 2), 10);
    const year = parseInt(`20${code.substring(2, 4)}`, 10);

    const manufactureDate = new Date(year, 0, (week - 1) * 7);
    const replacementDate = new Date(manufactureDate);
    replacementDate.setFullYear(replacementDate.getFullYear() + 5);

    setManufactureDate(manufactureDate);
    setReplacementDate(replacementDate);
    setError('');
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Tire Age Calculator</h2>
        <div className="flex flex-col md:flex-row items-center mb-8">
          <img src={tyreImage} alt="How to find the tyre code" className="w-full md:w-1/2 mb-4 md:mb-0 md:mr-6 rounded-lg" />
          <div className="w-full md:w-1/2">
            <label htmlFor="code" className="block text-xl mb-2 font-semibold">
              Enter 4 Digit Code
            </label>
            <div className="flex">
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-grow text-black px-4 py-2 border border-zinc-900 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 1522"
              />
              <button
                onClick={calculateDates}
                className="bg-black text-white font-bold py-2 px-6 rounded-r hover:bg-gray-700 transition duration-300"
              >
                Calculate
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
        {manufactureDate && replacementDate && (
          <div className="mt-8 bg-gray-700 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Results</h3>
            <div className="space-y-4">
              <p className="text-xl">
                <span className="font-semibold">Tire Manufactured on:</span>{' '}
                <span className="text-green-400">
                  {manufactureDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </p>
              <p className="text-xl">
                <span className="font-semibold">Start Consider Replacing on:</span>{' '}
                <span className="text-yellow-400">
                  {replacementDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </p>
            </div>
            <p className="text-sm mt-6 bg-gray-600 p-3 rounded">
              <span className="font-bold">Safety Note:</span> Always inspect your tires for cracks, low or high pressure, and depth of tread to avoid premature tire failure.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TyreAgeCalculator;