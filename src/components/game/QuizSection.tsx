export function QuizSection({
  question,
  answer,
  setQuestion,
  setAnswer,
  handleSubmitQuestion,
}: {
  question: string;
  answer: string;
  setQuestion: (question: string) => void;
  setAnswer: (answer: string) => void;
  handleSubmitQuestion: () => void;
}) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-lg border border-amber-200">
      <h2 className="text-xl font-bold text-amber-800 mb-6">
        Créez votre question
      </h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="question"
            className="block text-amber-700 font-medium"
          >
            Question
          </label>
          <div className="relative">
            <input
              id="question"
              type="text"
              className="w-full p-3 pr-10 text-black bg-white border border-amber-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 outline-none"
              placeholder="Entrez votre question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="answer" className="block text-amber-700 font-medium">
            Réponse
          </label>
          <div className="relative">
            <input
              id="answer"
              type="text"
              className="w-full p-3 pr-10 text-black bg-white border border-amber-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 outline-none"
              placeholder="Entrez votre réponse..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSubmitQuestion}
          disabled={!question || !answer}
          className={`w-full py-3 px-4 rounded-lg font-medium text-center transition-all duration-300 flex items-center justify-center space-x-2
            ${
              question && answer
                ? "bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white shadow-md hover:shadow-lg"
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
          <span>Soumettre la question</span>
        </button>
      </div>

      <div className="mt-4 text-xs text-amber-700 text-center">
        {!question && !answer
          ? "Remplissez les deux champs pour continuer"
          : !question
          ? "La question est requise"
          : !answer
          ? "La réponse est requise"
          : "Prêt à soumettre !"}
      </div>
    </div>
  );
}
