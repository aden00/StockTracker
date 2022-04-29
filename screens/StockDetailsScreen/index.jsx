import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import StockDetailsHeader from "./StockDetailsHeader";
import { symbolLookUp } from "../../services/requests";

const StockDetailsScreen = () => {
  const route = useRoute();
  const { id, name } = route.params;

  return (
    <View style={styles.container}>
      <StockDetailsHeader symbol={id} name={name} />

      <View>
        <Text style={styles.stockName}>{name}</Text>
        <Text style={styles.symbol}>{id}</Text>
      </View>
    </View>
  );
};

export default StockDetailsScreen;

const styles = StyleSheet.create({
  container: {},
  stockName: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 0.5,
    margin: 5,
    marginLeft: 10,
  },
  symbol: {
    color: "grey",
    fontWeight: "600",
    margin: 5,
    fontSize: 17,
    marginLeft: 10,
    marginTop: 0,
  },
});
