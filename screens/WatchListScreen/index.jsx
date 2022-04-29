import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AddItemsBar from "../../components/AddItemsBar";
import NewSearchBar from "../../components/NewSearchBar";

const WatchListScreen = () => {
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <NewSearchBar />
    </View>
  );
};

export default WatchListScreen;

const styles = StyleSheet.create({});
