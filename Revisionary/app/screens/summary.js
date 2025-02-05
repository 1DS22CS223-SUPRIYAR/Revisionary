import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Speech from 'expo-speech';  
import BottomBar from '../components/bottom_bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import axios from 'axios';

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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarText}>Summary</Text>
        <View style={styles.iconsContainer}>
          <Icon name="diamond" size={24} color="#fff" style={styles.icon} />
          <Icon name="fire" size={24} color="#fff" style={styles.icon} />
        </View>
      </View>

      <View style={styles.body}>
      <Text style={styles.topicName}>Topic: Understanding AI</Text>
      <View style={styles.summaryBox}>
        <View style={styles.summaryHeader}>
          <Text style={styles.heading}>Video Summary</Text>
          <View style={styles.summaryIcons}>
            <TouchableOpacity onPress={readAloud}>
              <Icon name={isSpeaking ? "volume-off" : "volume-high"} size={24} color="#6849EF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.starIcon}>
              <Icon name="star-outline" size={24} color="#6849EF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.flashcard}>
          <ScrollView>
            <Text style={styles.flashcardText}>{flashcards[currentIndex]}</Text>
          </ScrollView>
        </View>
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity onPress={handleBack} disabled={currentIndex === 0}>
          <Icon name="arrow-left" size={36} color={currentIndex === 0 ? "#ccc" : "#6849EF"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <Icon name="arrow-right" size={36} color="#6849EF" />
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
    backgroundColor: '#F5F5F5',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 15,
    backgroundColor: '#6849EF',
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
    maxHeight: 400,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  flashcardText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default SummaryPage;