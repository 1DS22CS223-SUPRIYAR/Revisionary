import React ,  { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Speech from 'expo-speech';  
import BottomBar from '../components/bottom_bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import StatsIcons from '../components/stats_icons';

const SummaryPage = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Retrieve summary and video_id from previous screen
  const { summary, video_id } = useLocalSearchParams();

  // Function to handle text-to-speech using Expo Speech
  const readAloud = () => {
    if (isSpeaking) {
      // If speech is already playing, stop it
      Speech.stop();
      setIsSpeaking(false); // Update state to reflect that speech has stopped
    } else {
      // If speech is not playing, start it
      Speech.speak(summary, {
        language: 'en',
        pitch: 1.0,
        rate: 1.0,
      });
      setIsSpeaking(true); // Update state to reflect that speech is playing
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="black" />
        </TouchableOpacity>
       
        <StatsIcons></StatsIcons>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Topic Name */}
        {/* <Text style={styles.header}>Summary</Text> */}

        {/* Summary Container (Purple Box) */}
        <ScrollView style={styles.summaryBox}>
          {/* Summary Header with Icons */}
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

          {/* Summary Content */}
          <Text style={styles.summaryText}>{summary}</Text>
        </ScrollView>
      </View>

      {/* Right Arrow Button */}
      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={() => {
          console.log("Next pressed, passing video_id:", video_id);
          router.push({
            pathname: '/screens/options',
            params: { summary, video_id }
          });
        }}
      >
        <Icon name="arrow-right" size={36} color="black" />
      </TouchableOpacity>

      {/* Bottom Bar */}
      <BottomBar currentScreen="Summary" />
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
  header: { 
    fontSize: 24, // Header font size
    padding: 5
  },
  summaryBox: {
    backgroundColor: '#E6E6FA',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 5, // Adds a gap between the summary and the arrow button
    maxHeight: 500, // Limit the height of the scrollable area if needed
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
    right: 50,
    bottom: 70, 
    paddingVertical: 8,
    paddingHorizontal: 16, 
    elevation: 3,
    borderWidth: 1,
    borderRadius:12,
    borderColor: "black",
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  
});

export default SummaryPage;
