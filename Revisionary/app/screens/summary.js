import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Speech from 'expo-speech';  // Using Expo Speech for cross-platform support
import BottomBar from '../components/bottom_bar';

const SummaryPage = () => {
  const navigation = useNavigation();

  const summaryText = "This is a brief summary of the video content. It highlights the key points discussed and helps in quick revision.";

  // Function to handle text-to-speech using Expo Speech
  const readAloud = () => {
    Speech.speak(summaryText, {
      language: 'en',
      pitch: 1.0,
      rate: 1.0,
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
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

      {/* Body */}
      <View style={styles.body}>
        {/* Topic Name */}
        <Text style={styles.topicName}>Topic: Understanding AI</Text>

        {/* Summary Container */}
        <View style={styles.summaryBox}>
          {/* Summary Header with Icons */}
          <View style={styles.summaryHeader}>
            <Text style={styles.heading}>Video Summary</Text>
            <View style={styles.summaryIcons}>
              <TouchableOpacity onPress={readAloud}>
                <Icon name="volume-high" size={24} color="#6849EF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.starIcon}>
                <Icon name="star-outline" size={24} color="#6849EF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Summary Content */}
          <Text style={styles.summaryText}>{summaryText}</Text>
        </View>
      </View>

      {/* Right Arrow Button */}
      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={() => {
          console.log("Next pressed");
          // Example: navigation.navigate('NextScreen');
        }}
      >
        <Icon name="chevron-right" size={36} color="#6849EF" />
      </TouchableOpacity>

      {/* Bottom Bar */}
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  topicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6849EF',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#E6E6FA',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
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
  summaryText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'left',
  },
  nextButton: {
    position: 'absolute',
    right: 20,
    bottom: 70, // Position above the BottomBar
    backgroundColor: '#E6E6FA',
    padding: 10,
    borderRadius: 50,
    elevation: 3,
  },
});

export default SummaryPage;
