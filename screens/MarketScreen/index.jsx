import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect } from "react";
import StockItem from "../../components/StockItem";
import { useRoute } from "@react-navigation/native";
const marketSymbol = [
  "GOOG",
  "tsla",
  "aapl",
  "voo",
  "abc",
  "fb",
  "nflx",
  "twtr",
];
// const marketSymbol = ["voo"];

const MarketScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* <Text style={{ color: "#8CBBF1" }}>Portfolio</Text> */}
      {/* <View><Text style={{ color: "white" }}>Market</Text></View> */}
      <FlatList
        data={marketSymbol}
        renderItem={({ item }) => <StockItem symbol={item.toUpperCase()} />}
        style={{ flex: 1 }}
      />
      {/* <StockItem symbol="TSLA" /> */}
    </View>
  );
};

export default MarketScreen;

const styles = StyleSheet.create({});
