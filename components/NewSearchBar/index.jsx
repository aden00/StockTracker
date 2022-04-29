import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  TextInput,
  View,
  Text,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Animated, { EasingNode } from "react-native-reanimated";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { symbolLookUp } from "../../services/requests";
import SearchItem from "../SearchItem";

// import { useSelector, useDispatch } from "react-redux";

// import { searchRoutes } from "../Store/actions/routes";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const { Value, timing } = Animated;

const inputBoxTraslateX = new Value(width);
const backButtonOpacity = new Value(0);
const contentTraslateY = new Value(height);
const contentOpacity = new Value(0);

const NewSearchBar = ({ title, navigation }) => {
  const [isFocused, setisFocused] = useState(false);
  const [keyword, setkeyword] = useState("");
  const [searchItems, setSearchItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const inputRef = useRef();
  //   const dispatch = useDispatch();
  //   const routes = useSelector((state) => state.routes.routes);
  //   const searchedRoutes = useSelector((state) => state.routes.searchedRoutes);

  // const showSearchResults = async(text) => {
  //   setkeyword(text);
  //   const searchResult = routes.filter((route) => {
  //     return route.title.toLowerCase().includes(text.toLowerCase());
  //   });
  //   dispatch(searchRoutes(searchResult));
  // };

  const fetchSymbolLookUp = async (keyword) => {
    setNoResult(false);
    if (!keyword) {
      setkeyword("");
      setSearchItems([]);
      return;
    }
    setkeyword(keyword);
    // const timeOutId = setTimeout(async () => {
    try {
      setLoading(true);
      const response = await symbolLookUp(keyword);
      setSearchItems(response);
      if (response.length == 0) {
        setNoResult(true);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
    // }, 1000);
    // return () => clearTimeout(timeOutId);
  };
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      fetchSymbolLookUp(keyword);
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [keyword]);

  const makeSearch = () => {
    // const searchResult = routes.filter((route) => {
    //   return route.title.toLowerCase().includes(searchTerm.toLowerCase());
    // });

    dispatch(searchRoutes(searchResult));
  };

  // ANIMATION TO START ///////////////////////////////////////////////////////

  const onFocus = () => {
    setisFocused(true);
    const inputBoxTraslateXconfig = {
      toValue: 0,
      duration: 200,
      easing: EasingNode.inOut(EasingNode.ease),
    };
    const backButtonOpacityConfig = {
      toValue: 1,
      duration: 200,
      easing: EasingNode.inOut(EasingNode.ease),
    };

    //CONTENT
    const contentTraslateYconfig = {
      toValue: 0,
      duration: 200,
      easing: EasingNode.inOut(EasingNode.ease),
    };

    const contentOpacityConfig = {
      toValue: 1,
      duration: 200,
      easing: EasingNode.inOut(EasingNode.ease),
    };

    //RUN ANIMATIONS
    timing(inputBoxTraslateX, inputBoxTraslateXconfig).start();
    timing(backButtonOpacity, backButtonOpacityConfig).start();
    timing(contentTraslateY, contentTraslateYconfig).start();
    timing(contentOpacity, contentOpacityConfig).start();

    inputRef.current.focus();
  };

  // ANIMATION TO EXIT ///////////////////////////////////////////////////////

  const onBlur = () => {
    setisFocused(false);
    const inputBoxTraslateXconfig = {
      duration: 200,
      toValue: width,
      easing: EasingNode.inOut(EasingNode.ease),
    };
    const backButtonOpacityConfig = {
      duration: 50,
      toValue: 0,
      easing: EasingNode.inOut(EasingNode.ease),
    };

    //CONTENT
    const contentTraslateYconfig = {
      duration: 50,
      toValue: height,
      easing: EasingNode.inOut(EasingNode.ease),
    };

    const contentOpacityConfig = {
      duration: 200,
      toValue: 0,
      easing: EasingNode.inOut(EasingNode.ease),
    };

    //RUN ANIMATIONS
    timing(inputBoxTraslateX, inputBoxTraslateXconfig).start();
    timing(backButtonOpacity, backButtonOpacityConfig).start();
    timing(contentTraslateY, contentTraslateYconfig).start();
    timing(contentOpacity, contentOpacityConfig).start();

    inputRef.current.blur();
  };

  return (
    <>
      {loading ? (
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
      ) : (
        <></>
      )}
      {/* <View style={{ zIndex: 1000, height: 90 }}>
        <View style={styles.header}>
          <View>
            <TouchableOpacity activeOpacity={1} underlayColor={"#ccd0d5"}>
              <MaterialIcons name="menu" size={35} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{ paddingLeft: 10, flex: 1, justifyContent: "center" }}>
            <Text style={{ fontSize: 20 }}>{title}</Text>
          </View>
          <TouchableHighlight
            activeOpacity={1}
            underlayColor={"#ccd0d5"}
            onPress={onFocus}
            style={{ borderRadius: 40, padding: 7 }}
          >
            <FontAwesome name="search" size={22} color="#000000" />
          </TouchableHighlight>
          <Animated.View
            style={[
              styles.inputBox,
              { transform: [{ translateX: inputBoxTraslateX }] },
            ]}
          >
            <Animated.View style={{ opacity: backButtonOpacity }}>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor={"#ccd0d5"}
                onPress={onBlur}
                style={styles.backIconBox}
              >
                <MaterialIcons name="chevron-left" size={24} color="black" />
              </TouchableHighlight>
            </Animated.View>
            <TextInput
              style={styles.input}
              ref={inputRef}
              placeholder="Buscar"
              clearButtonMode="always"
              value={keyword}
              onChangeText={setkeyword}
              onSubmitEditing={() => "makeSearch(keyword)"}
            />
          </Animated.View>
        </View>
      </View> */}
      <SafeAreaView style={styles.headerSafeView}>
        <View style={styles.header}>
          <View style={styles.innerHeader}>
            <View>
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 20 }}
              >
                你的資產
              </Text>
            </View>
            <TouchableHighlight
              activeOpacity={1}
              underlayColor={"#ccd0d5"}
              onPress={onFocus}
              style={styles.searchIconBox}
            >
              <>
                <Text style={{ fontWeight: "bold" }}>新增</Text>
                <MaterialIcons name="add" size={22} color="black" />
              </>
            </TouchableHighlight>
            <Animated.View
              style={[
                styles.inputBox,
                { transform: [{ translateX: inputBoxTraslateX }] },
              ]}
            >
              <Animated.View style={{ opacity: backButtonOpacity }}>
                <TouchableHighlight
                  activeOpacity={1}
                  underlayColor={"#ccd0d5"}
                  onPress={onBlur}
                  style={styles.backIconBox}
                >
                  <Entypo name="chevron-left" size={24} color="white" />
                </TouchableHighlight>
              </Animated.View>
              <TextInput
                ref={inputRef}
                placeholder="輸入股票代號"
                clearButtonMode="always"
                value={keyword}
                onChangeText={(text) => {
                  setkeyword(text);
                }}
                style={styles.input}
              />
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>

      {/* CONTENIDO DE LA BUSQUEDA */}

      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentOpacity,
            transform: [{ translateY: contentTraslateY }],
            paddingTop: 100,
          },
        ]}
      >
        <>
          {keyword === "" ? (
            <View style={styles.insertTextToSearchContainer}>
              <FontAwesome
                style={{ paddingBottom: 15 }}
                name="search"
                size={32}
                color="#ccc"
              />
              <Text style={styles.normalText}>輸入你想要添加的股票代號</Text>
            </View>
          ) : noResult ? (
            <View style={styles.insertTextToSearchContainer}>
              <FontAwesome
                style={{ paddingBottom: 15 }}
                name="search"
                size={32}
                color="#ccc"
              />
              <Text style={styles.normalText}>
                沒有符合'{keyword}'的搜尋結果
              </Text>
            </View>
          ) : (
            <View style={styles.scrollview}>
              <FlatList
                renderItem={({ item }) => {
                  return <SearchItem item={item} />;
                }}
                data={searchItems}
                // ListFooterComponent={() => (
                //   <View style={styles.insertTextToSearchContainer}>
                //     <Text style={{ alignSelf: "center" }}>
                //       沒有符合你的搜尋結果？
                //     </Text>
                //     <Text style={{ alignSelf: "center" }}>
                //       嘗試輸入代號而不是公司名字
                //     </Text>
                //   </View>
                // )}
              />
            </View>
          )}
        </>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  //   header: {
  //     paddingTop: 40,
  //     paddingBottom: 10,
  //     justifyContent: "center",
  //     paddingHorizontal: 16,
  //     flexDirection: "row",
  //     justifyContent: "space-between",
  //     alignItems: "center",
  //     // borderWidth: 1,
  //     // borderColor: "blue",
  //   },
  //   backIconBox: {
  //     width: 40,
  //     height: 40,
  //     borderRadius: 40,
  //     backgroundColor: "#ccc",
  //     flexDirection: "row",
  //     justifyContent: "center",
  //     alignItems: "center",
  //     marginRight: 5,
  //   },
  //   inputBox: {
  //     height: 50,
  //     flexDirection: "row",
  //     alignItems: "flex-end",
  //     position: "absolute",
  //     top: 28,
  //     left: 16,
  //     width: width - 30,
  //   },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    backgroundColor: "#ccc",
    alignItems: "center",
  },
  content: {
    width: width,
    height: height - 55,
    position: "absolute",
    left: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: "#121212",
  },
  insertTextToSearchContainer: {
    // height: height,
    flex: 1,
    paddingTop: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#121212",
    opacity: 0.95,
  },
  scrollview: {
    width: width,
    opacity: 0.95,
    backgroundColor: "#121212",
    flex: 1,
  },
  searchItem: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginLeft: 16,
  },
  itemIcon: {
    marginLeft: 15,
  },
  headerSafeView: {
    zIndex: 1000,
  },
  header: {
    height: 50,
    paddingHorizontal: 16,
    borderBottomColor: "#282828",
    borderBottomWidth: 1,
  },
  innerHeader: {
    flex: 1,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    paddingHorizontal: 16,
  },
  searchIconBox: {
    width: 80,
    height: 40,
    borderRadius: 40,
    backgroundColor: "#e4e6eb",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  inputBox: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#121212",
    width: width - 32,
  },
  backIconBox: {
    width: 40,
    height: 40,
    borderRadius: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  input: {
    backgroundColor: "#e4e6eb",
    flex: 1,
    height: 40,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  normalText: {
    color: "white",
  },
});

export default NewSearchBar;
