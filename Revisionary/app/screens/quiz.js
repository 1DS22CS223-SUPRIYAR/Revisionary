import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";

const QuizPage = ({ onSubmit }) => {
  const { quiz, video_id } = useLocalSearchParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    if (quiz) {
      try {
        const parsedQuiz = JSON.parse(quiz);
        setQuizData(parsedQuiz);
      } catch (error) {
        console.error("Failed to parse quiz data:", error);
      }
    }
  }, [quiz]);

  if (!quizData) {
    return <div>Loading...</div>;
  }

  const currentQuestion = quizData.quiz[currentQuestionIndex];

  const handleOptionSelect = (option) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestionIndex]: option,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Submit the quiz and navigate to the results page
    onSubmit(selectedOptions);
    // Navigate to a results page and pass the selected options (answers)
    router.push({
      pathname: "/screens/quizResults", // Adjust based on your route
      query: { answers: JSON.stringify(selectedOptions) },
    });
  };

  // Convert the options object to an array
  const options = Object.values(currentQuestion.options);

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Quiz - Question {currentQuestionIndex + 1}</h1>
        <div className="text-sm">Video ID: {video_id}</div>
      </div>

      <div className="flex flex-col justify-center items-center p-6 bg-white shadow-md rounded-lg w-3/4 max-w-xl mx-auto mt-4">
        {/* Slider (Range Input) */}
        <input
          type="range"
          min="1"
          max={quizData.quiz.length}
          value={currentQuestionIndex + 1}
          onChange={(e) => setCurrentQuestionIndex(Number(e.target.value) - 1)}
          className="w-full mb-4"
        />

        <h2 className="text-black text-lg font-bold mb-4">{`Q${currentQuestionIndex + 1}: ${currentQuestion.question}`}</h2>

        <div className="space-y-2 w-full">
          {options.map((option, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg bg-gray-300 cursor-pointer ${
                selectedOptions[currentQuestionIndex] === option ? "bg-gray-500 text-white" : ""
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>

        {/* Bottom Bar (Navigation Buttons) */}
        <div className="flex justify-between mt-4 w-full">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            &larr; Previous
          </button>

          {currentQuestionIndex === quizData.quiz.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Save & Submit
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Next &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Bottom bar (optional, if you want to add a footer) */}
      <div className="bg-purple-600 text-white p-4 flex justify-center">
        <span>Footer content (e.g., additional links or information)</span>
      </div>
    </div>
  );
};

export default QuizPage;
