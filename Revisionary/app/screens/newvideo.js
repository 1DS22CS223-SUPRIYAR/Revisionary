import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomBar from '../components/bottom_bar'; 
import { useRouter } from 'expo-router';

const FlashCardPage = () => {
  const navigation = useNavigation();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [flashcardsGenerated, setFlashcardsGenerated] = useState(false);
  const router = useRouter();

  const handleGenerate = () => {
    if (youtubeUrl) {
      setFlashcardsGenerated(true);
      console.log('Generating flashcards for:', youtubeUrl);
      setYoutubeUrl('');
      router.push('/screens/summary')
    } else {
      alert('Please enter a valid YouTube URL.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarText}>Revisionary</Text>
        <View style={styles.iconsContainer}>
          <Icon name="diamond" size={24} color="#fff" style={styles.icon} />
          <Icon name="fire" size={24} color="#fff" style={styles.icon} />
        </View>
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
            onChangeText={setYoutubeUrl}
          />
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
    flex: 1, // Ensure the body occupies the full vertical space
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
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
