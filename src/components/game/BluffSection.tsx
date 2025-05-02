// src/components/game/BluffSection.tsx
"use client";

import { useState } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";

type Props = {
  handleSubmitGuess: (bluff: string) => void;
  question: string;
  answer: string; // ✅ correct answer passed in
};

export function BluffSection({ handleSubmitGuess, question, answer }: Props) {
  const [bluff, setBluff] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isExactMatch, setIsExactMatch] = useState(false);

  const handleSubmit = () => {
    console.log("Submitted bluff:", bluff, "answer:", answer);
    if (bluff.trim().toLowerCase() === answer.toLowerCase()) {
      setIsExactMatch(true);
    } else if (bluff.trim().length > 0) {
      setIsExactMatch(false);
      handleSubmitGuess(bluff.trim());
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-lg border border-amber-200">
      <h2 className="text-xl font-bold text-amber-800 mb-4 text-center">
        Devine une réponse plausible
      </h2>

      <p className="text-sm text-amber-700 italic text-center mb-4">
        “{question}”
      </p>

      {submitted ? (
        <div className="text-center space-y-3">
          <CheckCircle className="w-6 h-6 mx-auto text-green-600" />
          <p className="text-gray-700">Ton bluff :</p>
          <p className="bg-white p-3 rounded-lg font-medium text-black">
            {bluff}
          </p>
          <p className="text-sm text-gray-500 italic">
            En attente des autres joueurs...
          </p>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={bluff}
            onChange={(e) => setBluff(e.target.value)}
            placeholder="Écris ta fausse réponse ici"
            className="w-full p-3 rounded-lg text-black bg-white border border-amber-300 shadow-sm focus:ring-2 focus:ring-amber-500 outline-none"
          />

          <button
            onClick={handleSubmit}
            className={`mt-4 w-full py-3 px-4 rounded-lg font-medium text-center transition-all duration-300 flex items-center justify-center space-x-2
              ${
                bluff.length > 0
                  ? "bg-amber-600 hover:bg-amber-500 text-white shadow-md hover:shadow-lg"
                  : "bg-amber-300 text-amber-100 cursor-not-allowed"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Soumettre le bluff</span>
          </button>

          {isExactMatch && (
            <p className="text-sm text-red-600 text-center mt-2 flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Tu as trouvé la bonne réponse ! Essaie un autre bluff 😏
            </p>
          )}
        </>
      )}
    </div>
  );
}
