import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AddItemsBar from "../../components/AddItemsBar";
import NewSearchBar from "../../components/NewSearchBar";
import { AntDesign } from "@expo/vector-icons";
import { usePortfolio } from "../../Contexts/PortfolioContext";
import StockItem from "../../components/StockItem";
import {
  getMultipleStocksPriceAndPercentChange,
  getStockPriceAndPercentChange,
} from "../../services/requests";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PortfolioItem from "../../components/PortfolioItem";
const PortfolioScreen = () => {
  const navigation = useNavigation();
  const {
    portfolioItems,
    storePortfolioItems,
    getPortfolioItems,
    setportfolioItems,
  } = usePortfolio();
  const [portfolioItemsPriceDetails, setPortfolioItemsPriceDetails] = useState(
    []
  );
  const setPriceState = async (res) => {
    return new Promise((resolve) => {
      setPortfolioItemsPriceDetails(res);
    });
  };
  const getPortfolioItemsPriceDetails = async () => {
    // if (portfolioItemsPriceDetails?.length !== 0) {

    //   return;
    // }
    const res = await getMultipleStocksPriceAndPercentChange(portfolioItems);
    await setPriceState(res);
  };

  const getCurrentBalance = () => {
    portfolioItems.forEach((currentPortfolioItem, index) => {
      console.log(index);
      console.log(portfolioItemsPriceDetails);
    });
  };
  // portfolioItems
  //   .reduce(
  //     (total, currentPortfolioItem) =>
  //       total +
  //       currentPortfolioItem?.quantityPurchased *
  //         parseFloat(
  //           portfolioItemsPriceDetails[
  //             portfolioItems.indexOf(currentPortfolioItem)
  //           ]?.lastSalePrice.slice(1)
  //         ),
  //     0
  //   )
  //   .toFixed(2);
  const getBoughtBalance = () => {};
  // portfolioItems
  //   .reduce(
  //     (total, currentPortfolioItem) =>
  //       total +
  //       currentPortfolioItem?.quantityPurchased *
  //         currentPortfolioItem?.boughtPrice,
  //     0
  //   )
  //   .toFixed(2);
  const getAllTimeChange = () => {
    // const boughtBalance = getBoughtBalance();
    // const currentBalance = getCurrentBalance();
    // return (currentBalance - boughtBalance).toFixed(2);
  };
  const getAllTimePercentage = () => {
    // const boughtBalance = getBoughtBalance();
    // if (boughtBalance == 0) return;
    // return ((getAllTimeChange() / boughtBalance) * 100).toFixed(2);
  };
  const percentageColor =
    getAllTimePercentage() > 0
      ? "#16c784"
      : getAllTimePercentage() < 0
      ? "#ea3943"
      : "grey";

  useEffect(() => {
    getPortfolioItemsPriceDetails();
  }, [portfolioItems]);
  useEffect(() => {
    // getPortfolioItemsPriceDetails();
  }, [portfolioItemsPriceDetails]);
  useEffect(() => {
    // getPortfolioItemsPriceDetails();
    console.log(portfolioItems);
  }, []);
  // useEffect(() => {
  //   setPortfolioItemsPriceDetails([]);
  //   setportfolioItems([]);
  //   AsyncStorage.clear();
  // }, []);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        {/* <AddItemsBar /> */}
        <NewSearchBar />
        <View style={{ padding: 10 }}>
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.currentBalance}>現有資金</Text>
              <Text style={styles.totalAmount}>${getCurrentBalance()}</Text>
              <Text style={{ ...styles.allTimeChange, color: percentageColor }}>
                {getAllTimeChange()} (總利潤)
              </Text>
            </View>
            <View
              style={{
                ...styles.percentageBox,
                backgroundColor: percentageColor,
              }}
            >
              <AntDesign
                name={
                  getAllTimePercentage() > 0
                    ? "caretup"
                    : getAllTimePercentage() < 0
                    ? "caretdown"
                    : "minus"
                }
                size={17}
                color="white"
              />
              <Text style={styles.percentageChange}>
                {getAllTimePercentage()}%
              </Text>
            </View>
          </View>
          <Text style={styles.yourAssets}>資產細節</Text>

          {/* bottom of flat list  */}
          <View
            style={{
              marginVertical: 15,
              backgroundColor: "#181818",
              borderRadius: 20,
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}
          >
            {portfolioItems.length !== 0 ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 10,
                  }}
                >
                  <Text style={styles.colText}>股票名稱</Text>
                  <Text style={styles.colText}>買入價</Text>
                  <Text style={styles.colText}>現價</Text>
                </View>
                <FlatList
                  data={portfolioItems}
                  renderItem={({ item, index }) => (
                    <PortfolioItem
                      symbol={item.symbol}
                      portfolioItems={portfolioItems[index]}
                    />
                  )}
                />
              </>
            ) : (
              <Text
                style={{
                  color: "white",
                  paddingVertical: 20,
                  alignSelf: "center",
                  fontSize: 20,
                  fontWeight: "500",
                }}
              >
                暫時沒有資產
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.addNewAssetsContainer}
            // onPress={() => navigation.navigate("AddNewAssetsScreen")}
          >
            <Text style={styles.addNewAssets}>新增資產</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PortfolioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  yourAssets: {
    color: "white",
    fontWeight: "700",
    fontSize: 25,
    letterSpacing: 0.5,
    padding: 5,
  },
  totalAmount: {
    fontSize: 40,
    fontWeight: "700",
    color: "white",
    letterSpacing: 1,
    paddingBottom: 4,
  },
  currentBalance: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    paddingBottom: 2,
  },
  addNewAssetsContainer: {
    backgroundColor: "#828282",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingVertical: 10,
  },
  addNewAssets: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  percentageBox: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 10,
    backgroundColor: "#ea3943",
    padding: 7,
    borderRadius: 5,
    marginRight: 3,
  },
  percentageChange: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 3,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#282828",
    borderBottomWidth: 0.5,
    paddingBottom: 15,
    marginBottom: 5,
  },
  colText: {
    color: "white",
    paddingBottom: 10,
    paddingTop: 15,
    alignSelf: "flex-start",
    fontSize: 15,
    fontWeight: "500",
    borderRightColor: "white",
    borderRightWidth: 0.5,
  },
  allTimeChange: {
    fontSize: 18,
    fontWeight: "500",
  },
});
