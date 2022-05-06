import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ScrollView,
  SafeAreaView,
  Modal,
  Pressable,
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
import { LogBox } from "react-native";
import { Entypo } from "@expo/vector-icons";

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
  const [currentBalance, setCurrentBalance] = useState(0);
  const [boughtBalance, setBoughtBalance] = useState(0);
  const [allTimeChange, setAllTimeChange] = useState(0);
  const [allTimePercentage, setAllTimePercentage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [finishCaluculating, setFinishCaluculating] = useState(false);
  const calculateCurrentBalance = (priceList) => {
    let currentBalance = 0;
    priceList?.forEach((element, index) => {
      //slice the price from $300 to 300
      currentBalance +=
        parseFloat(element.lastSalePrice.slice(1)) *
        parseFloat(portfolioItems[index].quantityPurchased);
    });
    setCurrentBalance(parseFloat(currentBalance.toFixed(2)));
    return parseFloat(currentBalance.toFixed(2));
  };

  const calculateBoughtBalance = () => {
    let boughtBalance = 0;
    portfolioItems.forEach((element, index) => {
      //slice the price from $300 to 300
      boughtBalance +=
        parseFloat(element.boughtPrice) * parseFloat(element.quantityPurchased);
    });
    setBoughtBalance(parseFloat(boughtBalance.toFixed(2)));
    return parseFloat(boughtBalance.toFixed(2));
  };
  // portfolioItems
  //   .reduce(
  //     (total, currentPortfolioItem) =>
  //       total +
  //       currentPortfolioItem?.quantityPurchased *
  //         currentPortfolioItem?.boughtPrice,
  //     0
  //   )
  //   .toFixed(2);
  const calculateAllTimeChange = () => {
    setAllTimeChange(parseFloat((currentBalance - boughtBalance).toFixed(2)));
  };
  const calculateAllTimePercentage = () => {
    if (boughtBalance == 0) {
      return;
    }
    setAllTimePercentage(
      parseFloat(
        (((currentBalance - boughtBalance) / boughtBalance) * 100).toFixed(2)
      )
    );
  };
  const percentageColor =
    allTimePercentage > 0
      ? "#16c784"
      : allTimePercentage < 0
      ? "#ea3943"
      : "grey";
  const calculateOverallData = (priceList) => {
    setPortfolioItemsPriceDetails(priceList);
    setFinishCaluculating(false);
    calculateCurrentBalance(priceList);
    calculateBoughtBalance();
    // calculateAllTimePercentage();
    // calculateAllTimeChange();
    setFinishCaluculating(true);
  };
  const calculateAllThings = async () => {
    let list = [];
    for (let i = 0; i < portfolioItems.length; i++) {
      // wait for the promise to resolve before advancing the for loop
      list.push(portfolioItems[i].symbol);
    }
    //get the list of symbol of bought price

    const priceList = await getMultipleStocksPriceAndPercentChange(list);
    calculateOverallData(priceList);
  };
  useEffect(() => {
    if (finishCaluculating) {
      calculateAllTimePercentage();
      calculateAllTimeChange();
    }
  }, [finishCaluculating]);

  useEffect(() => {
    calculateAllThings();
  }, [portfolioItems]);
  useEffect(() => {
    // getPortfolioItemsPriceDetails();
  }, [portfolioItemsPriceDetails]);
  useEffect(() => {
    // call a final calculate function
    calculateAllThings();
  }, []);
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);
  // useEffect(() => {
  //   setPortfolioItemsPriceDetails([]);
  //   setportfolioItems([]);
  //   AsyncStorage.clear();
  // }, []);
  const onAddBtnPressed = (data) => {
    console.log(data);
  };
  const showDeleteModal = (basicData, priceData) => {
    setModalVisible();
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Entypo
                      name="cross"
                      size={30}
                      color="black"
                      style={{ alignSelf: "flex-start", marginBottom: 15 }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalText,
                      fontWeight: "bold",
                      alignSelf: "center",
                    }}
                  >
                    股票明細
                  </Text>
                  <Text style={styles.modalText}>購入股票:</Text>
                  <Text style={styles.modalText}>購入價錢: $</Text>
                  <Text style={styles.modalText}>購入股數: </Text>
                  <Text style={styles.modalText}>購入日期:</Text>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => console.log("hi")}
                  >
                    <Text style={styles.textStyle}>確定刪除股票</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        {/* <AddItemsBar /> */}
        <NewSearchBar func={onAddBtnPressed} />
        <ScrollView style={{ padding: 10 }}>
          {finishCaluculating ? (
            <View style={styles.balanceHeader}>
              <View>
                <Text style={styles.currentBalance}>現有資金</Text>
                <Text style={styles.totalAmount}>
                  {/* ${calculateCurrentBalance()}
                   */}
                  ${currentBalance}
                </Text>
                <Text
                  style={{
                    ...styles.allTimeChange,
                    color: percentageColor,
                  }}
                >
                  {allTimeChange > 0 ? "+$" : allTimeChange < 0 ? "-$" : ""}
                  {Math.abs(allTimeChange)}{" "}
                  {allTimeChange > 0
                    ? "(總利潤)"
                    : allTimeChange < 0
                    ? "(總虧損)"
                    : ""}
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
                    allTimePercentage > 0
                      ? "caretup"
                      : allTimePercentage < 0
                      ? "caretdown"
                      : "minus"
                  }
                  size={17}
                  color="white"
                />
                <Text style={styles.percentageChange}>
                  {allTimePercentage}%
                </Text>
              </View>
            </View>
          ) : (
            <></>
          )}

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
                {portfolioItemsPriceDetails?.length > 0 ? (
                  <FlatList
                    data={portfolioItemsPriceDetails}
                    renderItem={({ item, index }) => (
                      <PortfolioItem
                        symbol={portfolioItems[index].symbol}
                        portfolioItem={portfolioItems[index]}
                        priceDetails={portfolioItemsPriceDetails[index]}
                        setModal={showDeleteModal}
                      />
                    )}
                  />
                ) : (
                  <></>
                )}
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
        </ScrollView>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    height: 400,
    width: 300,
    margin: 40,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#ea3943",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    alignSelf: "flex-start",
  },
});
