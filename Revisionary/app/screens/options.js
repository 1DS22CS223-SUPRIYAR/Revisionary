import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomBar from '../components/bottom_bar'; 
import { useRouter, useLocalSearchParams } from 'expo-router';

const SaveSummaryPage = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { summary, video_id } = useLocalSearchParams();

  const handleSaveSummary = () => {
    console.log('Summary Saved');
    alert('Summary Saved Successfully!');
  };

  const handleSaveSummaryAndGenerateQuiz = () => {
    console.log('Summary Saved & Quiz Generated');
    alert('Summary Saved & Quiz Generated Successfully!');
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push({pathname:'/screens/summary', params: {summary, video_id}})}>
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
        <View style={styles.buttonBox}>
        <TouchableOpacity style={styles.button} onPress={handleSaveSummary}>
          <Text style={styles.buttonText}>SAVE SUMMARY</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleSaveSummaryAndGenerateQuiz}>
          <Text style={styles.buttonText}>SAVE AND GENERATE QUIZ</Text>
        </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity 
            style={styles.previousButton} 
            onPress={() => {
              console.log("Previous pressed");
              router.push({pathname:'/screens/summary', params: {summary, video_id}});
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  previousButton: {
    position: 'absolute',
    left: 50,
    bottom: 70, // Position above the BottomBar
    paddingVertical: 8,
    paddingHorizontal: 16, // Makes it a rounded rectangle
    elevation: 3,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 12, // Rounded rectangle shape
    backgroundColor: 'transparent', // No background
  },
});

export default SaveSummaryPage;
