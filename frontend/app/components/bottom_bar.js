import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomBar = ({ currentScreen }) => {
  const navigation = useNavigation();

  const tabs = [
    { name: 'Library', icon: 'book' },
    { name: 'Subscription', icon: 'diamond' },
    { name: 'index', icon: 'home' },
    { name: 'Info', icon: 'information-outline' },
    { name: 'Profile', icon: 'account' },
  ];

  return (
    <View style={styles.bottomBar}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.name} onPress={() => navigation.navigate(tab.name)} style={styles.tab}>
          <Icon
            name={tab.icon}
            size={28}
            color={tab.name === currentScreen ? '#fff':'#F5F5F5'} 
          />
          {tab.name === currentScreen && <View style={styles.underline} />} 
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#6849EF',
  },
  tab: {
    alignItems: 'center',
  },
  underline: {
    width: 25,
    height: 3,
    backgroundColor: '#fff',
    marginTop: 2,
  },
});

export default BottomBar;
