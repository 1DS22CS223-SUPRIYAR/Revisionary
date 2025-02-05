import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import BottomBar from "../components/bottom_bar"; // ✅ Ensure BottomBar is correctly imported
import * as Progress from "react-native-progress"; // ✅ Import Progress Bar
import StatsIcons from "../components/stats_icons";

const QuizPage = ({ onSubmit }) => {
  const router = useRouter();
  const { quiz, video_id } = useLocalSearchParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({}); // Store indices here
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    if (quiz) {
      try {
        setQuizData(JSON.parse(quiz));
      } catch (error) {
        console.error("Failed to parse quiz data:", error);
      }
    }
  }, [quiz]);

  if (!quizData || !quizData.quiz || quizData.quiz.length === 0) {
    return <Text>Loading...</Text>; // ✅ Prevents crash if data is missing
  }

  const currentQuestion = quizData?.quiz?.[currentQuestionIndex] || {}; // ✅ Avoids undefined errors
  const options = Object.values(currentQuestion.options || {});
  const progress = (currentQuestionIndex + 1) / quizData.quiz.length; // ✅ Calculate progress percentage

  const handleOptionSelect = (index) => { // Now stores the index
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestionIndex]: index, // Store the index of the selected option
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
    console.log("quizData.quiz before stringify:", quizData.quiz);
    console.log(selectedOptions); // This will now show the indices of selected options

    router.push({
      pathname: "/screens/analytics",
      params: { answers: JSON.stringify(selectedOptions), video_id, quiz_data: quiz}, // ✅ Passes video_id to next page
    });
  };
  const allQuestionsAnswered = quizData.quiz.every((_, index) => selectedOptions[index] !== undefined);

  return (
    <View style={styles.container}>
   
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarText}>Quiz</Text>
       <StatsIcons></StatsIcons>
      </View>


      <View style={styles.quizContainer1}> 
    
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} of {quizData.quiz.length}
          </Text>
          <Progress.Bar
            progress={progress}
            width={null} // Takes full width
            height={12}
            borderRadius={8}
            borderWidth={0}
            color="#747474" // ✅ Dark Gray
            unfilledColor="#EAECF0" // ✅ Light Gray
          />
        </View>
        
        <View style={styles.quizContainer}>
          <Text style={styles.questionText}>{`${currentQuestion.question}`}</Text>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOptions[currentQuestionIndex] === index && styles.selectedOption, // Compare with index
              ]}
              onPress={() => handleOptionSelect(index)} // Pass index here
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePrevious} disabled={currentQuestionIndex === 0} style={styles.navButton}>
          <Icon name="arrow-left" size={30} color="black" />
        </TouchableOpacity>

        {currentQuestionIndex === quizData.quiz.length - 1 ? (
          <View style={{ alignItems: "center" }}>
          {!allQuestionsAnswered && <Text style={{ color: "red", marginBottom: 5 }}>Please answer all questions before submitting.</Text>}
          <TouchableOpacity 
            onPress={handleSubmit} 
            style={[styles.navButton, styles.submitButton, !allQuestionsAnswered && { opacity: 0.5 }]} 
            disabled={!allQuestionsAnswered} // ✅ Now correctly disables the button
          >
            <Icon name="check" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
        ) : (
          <TouchableOpacity onPress={handleNext} style={styles.navButton}>
            <Icon name="arrow-right" size={30} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Bar */}
      <BottomBar currentScreen="Quiz" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.02, 
    shadowRadius: 2,
    elevation: 2, 
  },
  topBarText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  iconsContainer: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 10,
  },
  progressContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  progressText: {
    textAlign: "left",
    marginTop: 5,
    fontSize: 16,
    color: "#4B4B4B", // ✅ Dark Gray
  },
  quizContainer: {
    flex: 1,
    margin: 20,
    padding: 20,
    backgroundColor: "#E6E6FA",
    borderRadius: 10,
    elevation: 3,
    justifyContent: "center",
  },
  quizContainer1: {
    flex: 1,
    margin: 20,
    padding: 20,
    backgroundColor: "#E6E6FA",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "left",
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F8F9FB", // ✅ Updated background color
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: "#4B4B4B", // ✅ Dark Gray
  },
  optionText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "left"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 100,
    marginBottom: 20,
  },
  navButton: {
    borderWidth: 1,
    borderRadius:12,
    borderColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: "#533ABF",
    borderWidth: 0,
    borderColor: "#533ABF",
    width: 70,
    paddingVertical: 8,
    paddingHorizontal: 16,
    
  },
});

export default QuizPage;
