import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomBar from '../components/bottom_bar'; 
import { useRouter } from 'expo-router';
import axios from 'axios';
import StatsIcons from '../components/stats_icons';

function FlashCardPage() {
  const navigation = useNavigation();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [flashcardsGenerated, setFlashcardsGenerated] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!youtubeUrl) {
      alert('Please enter a valid YouTube URL.');
      return;
    }

    try {
      console.log('Sending YouTube URL to backend:', youtubeUrl);

      // Send POST request to Flask backend
      const response = await axios.post('http://127.0.0.1:5000/summary', {
        youtube_url: youtubeUrl
      });

      // Handle response based on different scenarios
      if (response.data.error) {
        alert(response.data.error);
        return;
      }

      console.log('Summary received:', response.data.summary);
      console.log('Video_id:', response.data.video_id);

      // Store the summary in state or context if needed
      setFlashcardsGenerated(true);
      setYoutubeUrl('');

      // Navigate to summary screen
      router.push({
        pathname: '/screens/summary',
        params: {
          summary: response.data.summary,
          video_id: response.data.video_id
        }
      });

    } catch (error) {
      console.error('Error processing YouTube URL:', error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with an error status
        alert(`Error: ${error.response.data.error || "Something went wrong!"}`);
      } else if (error.request) {
        // No response from server
        alert("No response from server. Please check your connection.");
      } else {
        // Other errors
        alert("An unexpected error occurred. Please try again.");
      }
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
        <View style={styles.text}>
          <Text style={styles.title}>Enter YouTube Video URL</Text>
        </View>
        <View style={styles.inputContainer}>
          <Icon name="youtube" size={24} color="#FF6347" style={styles.youtubeIcon} />
          <TextInput
            style={styles.input}
            value={youtubeUrl}
            onChangeText={setYoutubeUrl} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleGenerate}>
          <Text style={styles.buttonText}>GENERATE</Text>
        </TouchableOpacity>

        <Image source={require('../assets/generate.jpg')} style={styles.image} />

        <View style={styles.adContainer}>
          <Text>Ad Placeholder</Text>
        </View>

        {flashcardsGenerated && (
          <Text style={styles.flashcardsText}>Flashcards have been generated!</Text>
        )}
      </View>
        
      {/* Bottom Bar */}
      <BottomBar currentScreen="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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
    flex: 1, // Ensure the body occupies the full vertical space
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#E6E6FA',
  },
  youtubeIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    width: '100%',
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#6849EF',
    padding: 15,
    borderRadius: 8,
    width: 179,
    height: 39,
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 14, // Reduced text size for the "GENERATE" button
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  adContainer: {
    height: 68,
    width: '100%',
    backgroundColor: '#DCDCDC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  flashcardsText: {
    fontSize: 18,
    color: '#32CD32',
  },
});

export default FlashCardPage;
