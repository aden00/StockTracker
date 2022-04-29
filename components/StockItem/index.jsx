import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import {
  getNonStockDetails,
  getStockDetails,
  getStockPriceAndPercentChange,
} from "../../services/requests";
import { useNavigation } from "@react-navigation/native";

const StockItem = ({ symbol }) => {
  const navigation = useNavigation();
  const [stockDetails, setStockDetails] = useState(null);
  const [stockPriceAndPercentageChange, setStockPriceAndPercentageChange] =
    useState(null);
  const [loading, setLoading] = useState(false);
  const fetchStockDetails = async () => {
    if (loading) return;
    setLoading(true);
    const response = await getStockDetails(symbol);
    if (Object.entries(response).length !== 0) {
      //check if the symbol is a stock or bonds/etf
      setStockDetails(response);
    } else {
      const response2 = await getNonStockDetails(symbol);
      setStockDetails(response2);
    }
    const res = await getStockPriceAndPercentChange(symbol);
    setStockPriceAndPercentageChange(res);
    setLoading(false);
  };
  useEffect(() => {
    fetchStockDetails();
  }, []);

  if (loading || !stockDetails || !stockPriceAndPercentageChange) {
    return (
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size={"large"} color="white" />
      </View>
    );
  }
  const { description } = stockDetails;
  const { name } = stockDetails;
  const currentPrice = stockPriceAndPercentageChange?.c;
  const pricePercentageChange = stockPriceAndPercentageChange?.dp;
  const percentageColor = pricePercentageChange > 0 ? "#16c784" : "#ea3943";
  const isPercentageUp = () => pricePercentageChange > 0;

  return (
    <>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() =>
          navigation.navigate("StockDetailsScreen", {
            id: symbol,
            name: name || description,
          })
        }
      >
        <View>
          <Text style={styles.companyName}>{name || description}</Text>
          <Text style={styles.symbol}>{symbol}</Text>
        </View>
        <View style={{ alignItems: "flex-end", marginLeft: "auto" }}>
          <Text style={styles.currentPrice}>${currentPrice.toFixed(2)}</Text>
          <View style={{ flexDirection: "row" }}>
            <AntDesign
              name={isPercentageUp() ? "caretup" : "caretdown"}
              size={15}
              color={percentageColor}
            />
            <Text
              style={{ ...styles.percentageChange, color: percentageColor }}
            >
              {pricePercentageChange.toFixed(2)}%
            </Text>
          </View>
        </View>
        {/* <View style={{ alignItems: "flex-end", marginLeft: "auto" }}>
        <Text style={styles.total}>$1084.59</Text>
        <Text style={styles.quantity}>1 TSLA</Text>
      </View> */}
      </TouchableOpacity>
    </>
  );
};

export default StockItem;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#282828",
    paddingVertical: 10,
    alignItems: "center",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  symbol: {
    color: "grey",
    fontWeight: "600",
  },
  currentPrice: {
    fontWeight: "bold",
    color: "white",
    fontSize: 15,
  },
  quantity: {
    fontWeight: "600",
    color: "grey",
  },
  percentageChange: {
    color: "#16c784",
    fontWeight: "500",
    marginLeft: 3,
  },
  total: {
    color: "white",
    fontWeight: "bold",
  },
});
