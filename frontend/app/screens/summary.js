import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Speech from 'expo-speech';  
import BottomBar from '../components/bottom_bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import axios from 'axios';
import StatsIcons from '../components/stats_icons';

const SummaryPage = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flashcards, setFlashcards] = useState([]);

  const { summary, video_id } = useLocalSearchParams();

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        // Check if summary is an array or a string
        if (Array.isArray(summary)) {
          setFlashcards(summary);
        } else if (typeof summary === 'string') {
          // Split the string into an array of sentences or paragraphs
          setFlashcards(summary.split(',,'));
        } else {
          console.error('Invalid summary format');
        }
      } catch (error) {
        console.error('Error setting flashcards:', error);
      }
    };

    fetchFlashcards();
  }, [summary]);

  const readAloud = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      Speech.speak(flashcards[currentIndex], {
        language: 'en',
        pitch: 1.0,
        rate: 1.0,
      });
      setIsSpeaking(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push({
        pathname: '/screens/options',
        params: { summary, video_id }
      });
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
   
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push("/screens/newvideo")}>
          <Icon name="arrow-left" size={28} color="black" />
        </TouchableOpacity>
        <View style={styles.iconsContainer}>
         <StatsIcons></StatsIcons>
        </View>
      </View>

      <View style={styles.body}>
      <Text style={styles.header}>Summary</Text>
      <View style={styles.summaryBox}>
        <View style={styles.summaryHeader}>
          <View style={styles.summaryIcons}>
            <TouchableOpacity onPress={readAloud}>
              <Icon name={isSpeaking ? "volume-off" : "volume-high"} size={24} color="#6849EF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.starIcon}>
              <Icon name="star-outline" size={24} color="#6849EF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.flashcard} >
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
          <View style={{ flex: 1, justifyContent: "center" }}> 
              <Text style={styles.flashcardText}>{flashcards[currentIndex]}</Text>
          </View>
          </ScrollView>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleBack} disabled={currentIndex === 0} style = {styles.navigationButtons}>
          <Icon name="arrow-left" size={36} color={currentIndex === 0 ? "#ccc" : "black"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style = {styles.navigationButtons}>
          <Icon name="arrow-right" size={36} color="black" />
        </TouchableOpacity>
      </View>
    </View>

    <BottomBar currentScreen="Summary" />
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: { 
    fontSize: 24, // Header font size
    padding: 5
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
  iconsContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
  },
  body: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  topicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6849EF',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  summaryBox: {
    backgroundColor: '#E6E6FA',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 20,
    height: "80%", // Fixed height for the container
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'right',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6849EF',
  },
  summaryIcons: {
    flexDirection: 'row',
  },
  starIcon: {
    marginLeft: 10,
  },
  
  
  flashcard: {
   
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    height: "90%", // Set a fixed height to maintain consistency
    justifyContent: "center", 
    alignItems: "center",  // Center horizontally
  },
  flashcardText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'left',
    textAlignVertical: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 100,
    marginBottom: 20,
  },
  navigationButtons: {
    borderWidth: 1,
    borderRadius:12,
    borderColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SummaryPage;