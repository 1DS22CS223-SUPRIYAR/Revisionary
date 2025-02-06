import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const StatsIcons = () => {
  return (
    <View style={styles.container}>
    {/* Fire Container */}
    <View style={styles.iconBox}>
      <Text style={styles.countText}>8</Text> {/* Fixed value */}
      <Icon name="fire" size={20} color="orange" />
    </View>
      {/* Coin Container */}
      <View style={styles.iconBox}>
        <Text style={styles.countText}>12</Text> {/* Fixed value */}
        <Icon name="diamond" size={20} color="#FFD700" />
    </View>

      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#9580F4", // Purple background
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  countText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5,
  },
});

export default StatsIcons;
