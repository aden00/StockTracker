import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import StockItem from "./components/StockItem";
import Navigation from "./navigation";
import "react-native-gesture-handler";
import PortfolioProvider from "./Contexts/PortfolioContext";
export default function App() {
  return (
    <NavigationContainer
      theme={{
        colors: {
          background: "#121212",
        },
      }}
    >
      <PortfolioProvider>
        <View style={styles.container}>
          <Navigation />
        </View>
      </PortfolioProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    flex: 1,
  },
});
