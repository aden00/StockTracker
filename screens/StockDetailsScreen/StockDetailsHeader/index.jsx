import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { getMarketChart } from "../../../services/requests";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const StockDetailsHeader = ({ symbol, name }) => {
  //   useEffect(() => {
  //     getMarketChart(symbol, 0);
  //   }, []);
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          flexDirection: "row",
        }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={27} color="white" />
        <Text
          style={{
            color: "white",
            fontWeight: "600",
            alignSelf: "center",
            fontSize: 16,
          }}
        >
          Back
        </Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.title}>{symbol}</Text>
      </View>
      <TouchableOpacity style={styles.star}>
        <FontAwesome5 name="star" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default StockDetailsHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#181818",
    flexDirection: "row",
    paddingBottom: 10,
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#282828",
    paddingTop: 30,
    paddingHorizontal: 10,
    width: "100%",
    justifyContent: "space-between",
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
    alignSelf: "center",

    paddingRight: 35,
  },
});
