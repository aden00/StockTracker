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
import {
  KeyboardTrackingView,
  KeyboardAwareInsetsView,
  KeyboardRegistry,
  KeyboardAccessoryView,
  KeyboardUtils,
} from "react-native-ui-lib/keyboard";
import { Drawer } from "react-native-ui-lib";
const PortfolioItem = ({ symbol, portfolioItem, priceDetails, setModal }) => {
  const navigation = useNavigation();
  const [stockDetails, setStockDetails] = useState(null);
  const [stockPriceAndPercentageChange, setStockPriceAndPercentageChange] =
    useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getPercentageChange();
  }, []);
  const [percentageChange, setPercentageChange] = useState(0);
  const { lastSalePrice } = priceDetails;
  const { boughtPrice, quantityPurchased, datePurchased, name } = portfolioItem;
  // if (loading || !stockDetails || !stockPriceAndPercentageChange) {
  //   return (
  //     <View
  //       style={{
  //         position: "absolute",
  //         left: 0,
  //         right: 0,
  //         top: 0,
  //         bottom: 0,
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <ActivityIndicator size={"large"} color="white" />
  //     </View>
  //   );
  // }
  // const { description } = stockDetails;
  // const { name } = stockDetails;
  // const currentPrice = stockPriceAndPercentageChange?.c;
  // const pricePercentageChange = stockPriceAndPercentageChange?.dp;
  const getPercentageChange = () => {
    setPercentageChange(
      parseFloat(
        (
          ((parseFloat(lastSalePrice.slice(1)) - parseFloat(boughtPrice)) /
            parseFloat(boughtPrice)) *
          100
        ).toFixed(2)
      )
    );
  };
  const percentageColor =
    percentageChange > 0
      ? "#16c784"
      : percentageChange < 0
      ? "#ea3943"
      : "grey";

  return (
    <>
      <Drawer
        rightItems={[
          {
            text: "查看更多",
            background: "transparent",
            onPress: () =>
              navigation.navigate("StockDetailsScreen", {
                id: symbol,
                name: name,
              }),
          },
        ]}
        leftItem={{
          text: "刪除股票",
          background: "#ea3943",
          onPress: () => setModal(true),
        }}
        itemsTintColor="white"
        style={{
          backgroundColor: "#121212",
        }}
      >
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() =>
            navigation.navigate("StockDetailsScreen", {
              id: symbol,
              name: name,
            })
          }
        >
          <View style={styles.companyNameContainer}>
            <Text style={styles.companyName}>{name}</Text>
            <Text style={styles.symbol}>{symbol}</Text>
          </View>
          <View style={{ marginLeft: "auto" }}>
            <Text style={styles.boughtPrice}>${boughtPrice}</Text>
            <Text style={styles.symbol}>{quantityPurchased}股</Text>
          </View>
          <View style={{ alignItems: "flex-end", marginLeft: "auto" }}>
            <Text style={styles.currentPrice}>{lastSalePrice}</Text>
            <View style={{ flexDirection: "row" }}>
              <AntDesign
                name={
                  percentageChange > 0
                    ? "caretup"
                    : percentageChange < 0
                    ? "caretdown"
                    : "minus"
                }
                size={15}
                color={percentageColor}
              />
              <Text
                style={{ ...styles.percentageChange, color: percentageColor }}
              >
                {percentageChange}%
              </Text>
            </View>
          </View>
          {/* <TouchableOpacity style={{ width: "10%", marginLeft: 10 }}>
          <Text style={{ color: "#2196F3" }}>更多</Text>
        </TouchableOpacity>
        <View style={{ alignItems: "flex-end", marginLeft: "auto" }}>
          <Text style={styles.total}>$1084.59</Text>
          <Text style={styles.quantity}>1 TSLA</Text>
        </View> */}
        </TouchableOpacity>
      </Drawer>
    </>
  );
};

export default PortfolioItem;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#282828",
    paddingVertical: 10,
    alignItems: "center",
  },
  companyName: {
    fontSize: 13,
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
  boughtPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "white",
  },
  companyNameContainer: {
    width: "30%",
  },
});
