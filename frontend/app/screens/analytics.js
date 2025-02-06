import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import BottomBar from "../components/bottom_bar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import StatsIcons from "../components/stats_icons";

const AnalyticsPage = () => {
  const router = useRouter();
  const { answers, quiz_data } = useLocalSearchParams();
  const [parsedAnswers, setParsedAnswers] = useState(null);
  const [parsedQuizData, setParsedQuizData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (answers && quiz_data) {
        if (typeof answers === "string") {
          const parsedAns = JSON.parse(answers);
          setParsedAnswers(parsedAns);
        } else {
          setError("Answers is not a valid JSON string.");
        }
        setParsedQuizData(JSON.parse(quiz_data).quiz);
      } else {
        setError("Missing quiz data or answers.");
      }
    } catch (error) {
      setError("Failed to parse quiz data or answers.");
      console.error("Parsing error:", error);
    }
  }, [answers, quiz_data]);

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!parsedQuizData || !parsedAnswers) {
    return <Text style={styles.errorText}>Loading quiz data...</Text>;
  }

  const correctCount = Object.keys(parsedAnswers || {}).filter((key) => {
    const selectedAnswer = parsedAnswers[key];
    let selectedLetter = "";

    switch (selectedAnswer) {
      case 0: selectedLetter = "A"; break;
      case 1: selectedLetter = "B"; break;
      case 2: selectedLetter = "C"; break;
      case 3: selectedLetter = "D"; break;
      default: selectedLetter = ""; break;
    }

    return selectedLetter === parsedQuizData[key]?.correct_answer;
  }).length;

  const incorrectCount = parsedQuizData ? parsedQuizData.length - correctCount : 0;
  const scorePercentage = (correctCount / parsedQuizData.length) * 100;

  const getScoreAndRevisionMessages = () => {
    if (scorePercentage >= 80) return { scoreMessage: "🏆 Outstanding!", revisionMessage: "Next review in 7 days." };
    if (scorePercentage >= 50) return { scoreMessage: "🔥 Well Done!", revisionMessage: "Review again in 3 days." };
    return { scoreMessage: "💡 Keep Trying!", revisionMessage: "Let's Revise tomorrow." };
  };

  const { scoreMessage, revisionMessage } = getScoreAndRevisionMessages();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Icon name="arrow-left" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarText}>Quiz</Text>
        <View style={styles.iconsContainer}>
         <StatsIcons></StatsIcons>
        </View>
      </View>
      <Text style={styles.header}>Quiz Analytics</Text>

      <View style={styles.scoreContainer}>
        <Image source={require('../assets/analytics.png') } style={styles.image} />
        <View style={styles.scoreDetails}>
          <Text style={styles.scoreText}>{scoreMessage}</Text>
          <Text style={styles.scoreText}>You got {correctCount}/{parsedQuizData.length} correct!</Text>
          <Text style={styles.revisionText}>{revisionMessage}</Text>
        </View>
      </View>

      <Text style={styles.subHeader}>Quiz Results</Text>
      <ScrollView style={styles.scrollView}>
        {parsedQuizData.map((question, index) => {
          const selectedAnswer = parsedAnswers ? parsedAnswers[index] : null;
          let selectedLetter = ["A", "B", "C", "D"][selectedAnswer] || "";
          const isCorrect = selectedLetter === question.correct_answer;

          return (
            <View key={index} style={styles.questionContainer}>
              <Text style={styles.question}>{question?.question}</Text>
              <Text style={[styles.selectedAnswer, isCorrect ? styles.correctBackground : styles.incorrectBackground]}>
                {question.options[selectedAnswer] || "No Answer Selected"}
              </Text>
              {!isCorrect && <Text style={styles.correctAnswer}>Correct Answer: {question.options[question.correct_answer.charCodeAt(0) - 65]}</Text>}
            </View>
          );
        })}
      </ScrollView>

      <BottomBar currentScreen="Summary" />
    </View>
  );
};

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 5,
  
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
    header: { 
      fontSize: 24, 
      padding: 5
    },
    subHeader: { 
        fontSize: 22, 
        padding: 5
    },
    scoreContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
      padding: 10,
      backgroundColor: "#E8E4FD",
      borderRadius: 8,
      elevation: 3,
      paddingHorizontal: 15
    },
    image: {
      width: 120,
      height: 100,
      borderRadius: 40,
    },
    scorePhrase: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        color: "#333",
    },
    scoreDetails: {
      marginLeft: 15,
    },
    scoreText: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#222",
    },
    revisionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
    },
    scrollView: {
      flex: 1,
      
    },
    questionContainer: {
      marginBottom: 20,
      padding: 15,
      backgroundColor: "#E8E4FD", 
      borderRadius: 8,
      elevation: 3,
    },
    correctBackground: {
      backgroundColor: "#C0EBA6",
    },
    incorrectBackground: {
        backgroundColor: "#FF8A8A"
    },
    question: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#333",
    },
    selectedAnswer: {
      fontSize: 16,
      marginBottom: 10,
      color: "black",
      padding: 5
    },
    correctAnswer: {
      fontSize: 16,
      fontWeight: "bold",
    },
    correct: {
      color: "#E0FBE2",
    },
    incorrect: {
      color: "#FF8A8A",
    },
    errorText: {
      color: "red",
      textAlign: "center",
      fontSize: 18,
      marginTop: 20,
    },
  });
export default AnalyticsPage;
