import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FlashCardPage = () => {
  const navigation = useNavigation();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [flashcardsGenerated, setFlashcardsGenerated] = useState(false);

  const handleGenerateFlashCards = () => {
    if (youtubeUrl) {
      setFlashcardsGenerated(true);
      console.log('Generating flashcards for:', youtubeUrl);
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
        <View style={styles.inputContainer}>
          <Icon name="youtube" size={24} color="#FF6347" style={styles.youtubeIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter YouTube URL"
            value={youtubeUrl}
            onChangeText={setYoutubeUrl}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleGenerateFlashCards}>
          <Text style={styles.buttonText}>Generate Flash Cards</Text>
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
      <View style={styles.bottomBar}>
        <Icon name="book" size={28} color="#FF6347" />
        <Icon name="diamond" size={28} color="#FF6347" />
        <Icon name="home" size={28} color="#00BFFF" />
        <Icon name="information-outline" size={28} color="#FF6347" />
        <Icon name="account" size={28} color="#FF6347" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // New background shade
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 15,
    backgroundColor: '#6849EF', // Deep purple for the top bar
  },
  topBarText: {
    color: '#FFFFFF', // White text
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
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#E6E6FA', // Light purple shade
  },
  youtubeIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#000', // Text color
  },
  button: {
    backgroundColor: '#6849EF', // Deep purple for the button
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  adContainer: {
    height: 50,
    width: '100%',
    backgroundColor: '#DCDCDC', // Light gray for the ad container
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  flashcardsText: {
    fontSize: 18,
    color: '#32CD32', // Lime green for generated flashcards text
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#6849EF', // Deep purple for the bottom bar
  },
});

export default FlashCardPage;
