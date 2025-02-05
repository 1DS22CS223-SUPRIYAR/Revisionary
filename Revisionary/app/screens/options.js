import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomBar from '../components/bottom_bar';
import StatsIcons from '../components/stats_icons';

const SaveSummaryPage = () => {
  const router = useRouter(); 
  const { summary, video_id } = useLocalSearchParams(); 

  const handleSaveSummary = () => {
    console.log('Summary Saved');
    alert('Summary Saved Successfully!');
    router.push({
      pathname: '/',
    });
  };

  const handleSaveSummaryAndGenerateQuiz = async (video_id) => {
    print(video_id)
    if (!video_id) {
      alert("Error: No video ID found.");
      return;
    }
  
    try {
      const response = await fetch("http://192.168.200.158:5000/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ video_id: video_id }),
      });
  
      const data = await response.json();
  
      if (!response.ok || data.error) {
        alert(`Error: ${data.error || "Failed to generate quiz."}`);
        return;
      }
  
      console.log("Quiz Generated Successfully:", data.quiz);
      alert("Summary Saved & Quiz Generated Successfully!");
  
      const quiz = JSON.stringify(data.quiz);
      router.push({
        pathname: '/screens/quiz',
        params: { quiz, video_id },
      });
  
    } catch (error) {
      console.error("Error fetching quiz:", error);
      alert("An error occurred while generating the quiz. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push({ pathname: '/screens/summary', params: { summary, video_id } })}>
          <Icon name="arrow-left" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarText}>Revisionary</Text>
        <StatsIcons></StatsIcons>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.buttonBox}>
          <TouchableOpacity style={styles.button} onPress={handleSaveSummary}>
            <Text style={styles.buttonText}>SAVE SUMMARY</Text>
          </TouchableOpacity>
        
          <TouchableOpacity style={styles.button} onPress={() => handleSaveSummaryAndGenerateQuiz(video_id)}>
            <Text style={styles.buttonText}>SAVE AND GENERATE QUIZ</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Right Arrow Button */}
            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={() => {
                console.log("Next pressed, passing video_id:", video_id);
                router.push({
                  pathname: '/screens/summary',
                  params: { summary, video_id }
                });
              }}
            >
              <Icon name="arrow-left" size={36} color="black" />
            </TouchableOpacity>

      {/* Bottom Bar */}
      <BottomBar currentScreen="SaveSummary" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  buttonBox: {
    height: '75%',
    backgroundColor: '#E6E6FA',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    justifyContent:'center',
    alignItems: 'center',
    gap: 60
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#6849EF',
    padding: 15,
    borderRadius: 8,
    width: 250,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    position: 'absolute',
    left: 50,
    bottom: 70, 
    paddingVertical: 8,
    paddingHorizontal: 16, 
    elevation: 3,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 12,
    width: 70
  },
});

export default SaveSummaryPage;
