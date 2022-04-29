import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Dimensions,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import SearchableDropDown from "react-native-searchable-dropdown";
import {
  getAllStocks,
  getStockPriceAndPercentChange,
  symbolLookUp,
} from "../../services/requests";
import AddItemsBar from "../../components/AddItemsBar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Button } from "react-native";
import uuid from "react-native-uuid";
import { LogBox } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { usePortfolio } from "../../Contexts/PortfolioContext";

const AddNewAssetsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { description, displaySymbol, id, name, symbol, type } =
    route.params.stockDetails;
  const { portfolioItems, storePortfolioItems, getPortfolioItems } =
    usePortfolio();

  const [stockDetails, setStockDetails] = useState(route.params.stockDetails);

  const [stockPriceDetails, setStockPriceDetails] = useState({});
  const [quantity, setQuantity] = useState("");
  const [boughtPrice, setBoughtPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [isPriceNowPressed, setIsPriceNowPressed] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // const [date, setDate] = useState("2016-05-15");
  const fetchStockPriceDetails = async () => {
    const response = await getStockPriceAndPercentChange(stockDetails?.symbol);
    setStockPriceDetails(response);
  };
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    if (show) {
      setShow(false);
    }
    if (!show) {
      setShow(true);
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  useEffect(() => {
    fetchStockPriceDetails();
  }, []);
  useEffect(() => {
    LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);
  }, []);
  useEffect(() => {
    if (!isPriceNowPressed && boughtPrice !== "") {
      //如果顯示現價 同埋多過0蚊 就令他顯示還原
      setIsPriceNowPressed(true);
    }
    if (isPriceNowPressed && boughtPrice == "") {
      //如果現在顯示還原 同埋0蚊 就令他顯示現價
      setIsPriceNowPressed(false);
    }
  }, [boughtPrice]);
  const width = Dimensions.get("window").width;
  const percentageColor = stockPriceDetails?.dp > 0 ? "#16c784" : "#ea3943";
  const incrementFunc = () => {
    const newquant = quantity == "" ? 1 : parseFloat(quantity) + 1;
    setQuantity(newquant.toString());
  };
  const decrementFunc = () => {
    const newquant =
      quantity == "0" || quantity == "" || parseFloat(quantity) - 1 == 0
        ? ""
        : parseFloat(quantity) - 1;
    setQuantity(newquant.toString());
  };
  const canBeConfirmedCheck = () => {
    if (quantity == "" || boughtPrice == "") {
      return false;
    }
    return true;
  };
  const showDateInChi = () => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };
  const onPressAddNewStock = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const newPortfolioItem = {
      id: name + uuid.v4(),
      name: name,
      symbol: symbol,
      boughtPrice: boughtPrice,
      datePurchased: date,
      quantityPurchased: quantity,
    };
    await storePortfolioItems(newPortfolioItem);
    console.log(newPortfolioItem);
    setLoading(false);
    setModalVisible(!modalVisible);
    navigation.goBack();
  };
  if (loading) {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000,
        }}
      >
        <ActivityIndicator size={"large"} color="white" />
      </View>
    );
  }
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setModalVisible(false);
      }}
    >
      <ScrollView>
        <View>
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
                    <Text style={styles.modalText}>
                      購入股票: {name} ({symbol})
                    </Text>
                    <Text style={styles.modalText}>
                      購入價錢: ${boughtPrice}
                    </Text>
                    <Text style={styles.modalText}>購入股數: {quantity}</Text>
                    <Text style={styles.modalText}>
                      購入日期: {showDateInChi()}
                    </Text>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={onPressAddNewStock}
                    >
                      <Text style={styles.textStyle}>確定新增</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
          <Text style={styles.stockName}>{name}</Text>
          <View style={styles.subheader}>
            <Text style={styles.symbol}>{symbol}</Text>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <AntDesign
                name={stockPriceDetails?.dp > 0 ? "caretup" : "caretdown"}
                size={12}
                color={percentageColor}
                style={{ alignSelf: "flex-end" }}
              />
              <Text
                style={{ ...styles.percentageChange, color: percentageColor }}
              >
                {stockPriceDetails?.dp?.toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>
            ${stockPriceDetails?.c?.toFixed(2)}
          </Text>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.priceBoughtContainer}>
            <Text style={styles.instruction}>請輸入買入價位:</Text>
            <View style={styles.priceBoughtEnterContainer}>
              <Text style={{ color: "white", fontSize: 60 }}>$</Text>
              <TextInput
                value={boughtPrice}
                placeholder={"0"}
                keyboardType="numeric"
                style={{ color: "white", fontSize: 60 }}
                placeholderTextColor="grey"
                onChangeText={setBoughtPrice}
              />
              <TouchableOpacity
                style={styles.priceNowButtonContainer}
                onPress={() => {
                  if (isPriceNowPressed) {
                    //如果按還原
                    setBoughtPrice("");
                  }
                  if (!isPriceNowPressed) {
                    //如果按現價
                    setBoughtPrice(stockPriceDetails?.c?.toFixed(2).toString());
                  }
                }}
              >
                <Text style={styles.priceNowButtonText}>
                  {isPriceNowPressed ? "還原" : "現價"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.priceBoughtContainer}>
            <Text style={styles.instruction}>請輸入買入股數:</Text>
            <View style={styles.priceBoughtEnterContainer}>
              <TextInput
                value={quantity}
                placeholder={"0"}
                keyboardType="numeric"
                style={{ color: "white", fontSize: 60 }}
                onChangeText={setQuantity}
                placeholderTextColor="grey"
              />
              <Text
                style={{
                  ...styles.quantitySymbol,
                  color: quantity == "" || !quantity ? "grey" : "white",
                }}
              >
                {symbol}
              </Text>
              <View style={styles.arrowsContainer}>
                <TouchableOpacity
                  style={styles.arrowButtonContainer}
                  onPress={incrementFunc}
                >
                  <Entypo name="chevron-up" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.arrowButtonContainer}
                  onPress={decrementFunc}
                >
                  <Entypo name="chevron-down" size={24} color="white" />
                </TouchableOpacity>
              </View>
              {/* <TouchableOpacity
                style={styles.priceNowButtonContainer}
                onPress={() => {
                  setQuantity("");
                }}
              >
                <Text style={styles.priceNowButtonText}>還原</Text>
              </TouchableOpacity> */}
            </View>
          </View>
          <View style={styles.selectedDateContainer}>
            <Text style={styles.instruction}>請輸入買入日期:</Text>
            <Text style={styles.selectedDateText}>{showDateInChi()}</Text>
            <View style={styles.selectedDateEnterContainer}>
              <View>
                <View style={{ backgroundColor: "#121212" }}>
                  <Button
                    onPress={showDatepicker}
                    title={show ? "收回" : "選擇日期"}
                  />
                </View>

                <View style={{ backgroundColor: "white" }}>
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode={mode}
                      is24Hour={true}
                      onChange={onChange}
                      style={{ position: "relative" }}
                      maximumDate={new Date()}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
          <View style={styles.confirmContainer}>
            <TouchableOpacity
              style={{
                ...styles.confirmButton,
                backgroundColor: canBeConfirmedCheck() ? "#2196F3" : "grey",
              }}
              onPress={() => {
                canBeConfirmedCheck()
                  ? setModalVisible(true)
                  : alert("請輸入全部資料");
              }}
            >
              <Text style={styles.confirmText}>確定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default AddNewAssetsScreen;

const styles = StyleSheet.create({
  stockName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 0.5,
    margin: 5,
    marginLeft: 10,
  },
  symbol: {
    color: "grey",
    fontWeight: "600",
    marginRight: 4,
    fontSize: 14,
  },
  mainContainer: {
    borderTopColor: "#282828",
    borderWidth: 1,
    marginTop: 5,
    paddingTop: 15,
  },
  percentageBox: {
    flexDirection: "row",
  },
  percentageChange: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 1,
  },
  currentPrice: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    marginLeft: 10,
  },
  subheader: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  priceBoughtContainer: {
    alignSelf: "center",
    alignItems: "center",
  },
  priceBoughtEnterContainer: {
    flexDirection: "row",
  },
  instruction: { color: "white", fontWeight: "bold", fontSize: 20 },
  priceNowButtonContainer: {
    backgroundColor: "#1c1c1c",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 5,
    alignSelf: "center",
    marginLeft: 20,
  },
  priceNowButtonText: {
    fontWeight: "bold",
    color: "white",
  },
  quantitySymbol: {
    color: "grey",
    fontSize: 20,
    alignSelf: "center",
    marginLeft: 10,
  },
  arrowButtonContainer: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 5,
    alignSelf: "center",
    marginLeft: 20,
  },
  arrowsContainer: {
    // marginRight: 20,
  },
  selectedDateEnterContainer: {
    justifyContent: "center",
  },
  selectedDateContainer: {
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },
  selectedDateText: {
    fontWeight: "bold",
    fontSize: 25,
    color: "white",
    marginTop: 10,
  },

  confirmButton: {
    margin: 5,
    marginHorizontal: 30,
    paddingVertical: 7,
    borderRadius: 5,
  },
  confirmText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 25,
    alignSelf: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
    backgroundColor: "#2196F3",
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
