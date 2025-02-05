import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import StatsIcons from "./components/stats_icons";
import BottomBar from "./components/bottom_bar";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.title}>
          Welcome To{"\n"}
          <Text style={styles.visionary}>Re</Text>
          <Text style={styles.visionaryColored}>Visionary</Text>
        </Text>
        <StatsIcons fireCount={5} coinCount={10} /> {/* Example counts */}
      </View>

      {/* Start Learning Section */}
      <TouchableOpacity
        style={styles.startLearning}
        onPress={() => router.push("/screens/newvideo")}
      >
        <Text style={styles.learnText}>Start Learning</Text>
        <Image source={require('./assets/home.png')} style={styles.learnImage} />
      </TouchableOpacity>

    
        <Image
          source={require('./assets/cartoon.png')} // Replace with your actual image path
          style={styles.bottomImage}
        />
  

      {/* Bottom Bar */}
      <View style={styles.bottomBarWrapper}>
        <BottomBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start", // Ensures the content starts from top
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between", // Align left and right extremes
    alignItems: "center",
    width: "100%",
    height: 80,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  visionary: {
    color: "#000",
  },
  visionaryColored: {
    color: "#6849EF",
  },
  startLearning: {
    flexDirection: "row",
    backgroundColor: "#E8E4FD",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width: "90%",
    justifyContent: "space-between",
    height: 200
  },
  learnText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
  },
  learnImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    resizeMode: "contain",
  },
  scrollContainer: {
    flexGrow: 1, // Allow scrolling content to fill space between button and bottom bar
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomImage: {
    width: "50%", // Fills the available width
    height: 400, // Adjust the height as needed
    marginTop: 70,
  },
  bottomBarWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
   
  },
});
