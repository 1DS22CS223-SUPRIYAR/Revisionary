import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import FlashCardPage from './screens/newvideo';

const App = () => {
  const [showFlashCards, setShowFlashCards] = useState(false);

  return (
    <View style={styles.container}>
      {showFlashCards ? (
        <FlashCardPage />
      ) : (
        <View>
          <Button 
            title="Go to Flash Cards"
            onPress={() => setShowFlashCards(true)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
