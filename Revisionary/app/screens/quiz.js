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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-purple-600 p-6 rounded-lg shadow-lg w-3/4 max-w-xl">
        {/* Slider (Range Input) */}
        <input
          type="range"
          min="1"
          max={quizData.quiz.length}
          value={currentQuestionIndex + 1}
          onChange={(e) => setCurrentQuestionIndex(Number(e.target.value) - 1)}
          className="w-full mb-4"
        />

        <h2 className="text-white text-lg font-bold mb-4">{`Q${currentQuestionIndex + 1}: ${currentQuestion.question}`}</h2>

        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
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

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            Previous
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
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
