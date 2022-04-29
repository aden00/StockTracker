import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const SearchItem = ({ item }) => {
  const navigation = useNavigation();
  const { description, displaySymbol, id, name, primary, symbol, type } = item;
  // console.log(item);
  return (
    <TouchableOpacity
      style={styles.searchItem}
      onPress={() => {
        navigation.navigate("AddNewAssetsScreen", { stockDetails: item });
      }}
    >
      <FontAwesome
        style={styles.itemIcon}
        name="search"
        size={22}
        color="white"
      />
      <Text style={{ fontWeight: "bold", color: "white" }}>
        {name}: {symbol}
      </Text>
    </TouchableOpacity>
  );
};

export default SearchItem;

const styles = StyleSheet.create({
  searchItem: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginLeft: 16,
  },
  itemIcon: {
    marginHorizontal: 15,
  },
});
