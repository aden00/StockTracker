import React, { useRef } from "react";

import {
  SafeAreaView,
  Dimensions,
  StyleSheet,
  View,
  TextInput,
  Image,
  ScrollView,
  TouchableHighlight,
  Text,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import Animated, { EasingNode, EasingNodeNode } from "react-native-reanimated";

const { Value, timing } = Animated;

//cal window size
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

//declare component

class AddItemsBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
      keyword: "",
    };
    this._input_box_translate_x = new Value(width);
    this._back_button_opacity = new Value(0);
    this._content_translate_y = new Value(height);
    this._content_opacity = new Value(0);
  }
  _onFocus = () => {
    //update state
    this.setState({ isFocused: true });

    const input_box_translate_x_config = {
      duration: 200,
      toValue: 0,
      easing: EasingNode.inOut(EasingNode.ease),
    };

    const back_button_opacity_config = {
      duration: 200,
      toValue: 1,
      easing: EasingNode.inOut(EasingNode.ease),
    };
    const content_translate_y_config = {
      duration: 0,
      toValue: 0,
      easing: EasingNode.inOut(EasingNode.ease),
    };
    const content_opacity_config = {
      duration: 200,
      toValue: 1,
      easing: EasingNode.inOut(EasingNode.ease),
    };

    //run animation
    timing(this._input_box_translate_x, input_box_translate_x_config).start();
    timing(this._back_button_opacity, back_button_opacity_config).start();
    timing(this._content_translate_y, content_translate_y_config).start();
    timing(this._content_opacity, content_opacity_config).start();

    this.refs.input.focus();
  };
  _onBlur = () => {
    //update state
    this.setState({ isFocused: false });

    const input_box_translate_x_config = {
      duration: 200,
      toValue: width,
      easing: EasingNode.inOut(EasingNode.ease),
    };

    const back_button_opacity_config = {
      duration: 50,
      toValue: 0,
      easing: EasingNode.inOut(EasingNode.ease),
    };
    const content_translate_y_config = {
      duration: 0,
      toValue: height,
      easing: EasingNode.inOut(EasingNode.ease),
    };
    const content_opacity_config = {
      duration: 200,
      toValue: 0,
      easing: EasingNode.inOut(EasingNode.ease),
    };

    //run animation
    timing(this._input_box_translate_x, input_box_translate_x_config).start();
    timing(this._back_button_opacity, back_button_opacity_config).start();
    timing(this._content_translate_y, content_translate_y_config).start();
    timing(this._content_opacity, content_opacity_config).start();

    this.refs.input.blur();
  };
  render() {
    return (
      <>
        <SafeAreaView style={styles.headerSafeView}>
          <View style={styles.header}>
            <View style={styles.innerHeader}>
              <View>
                <Text style={{ color: "white", fontWeight: "bold" }}>資產</Text>
              </View>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor={"#ccd0d5"}
                onPress={this._onFocus}
                style={styles.searchIconBox}
              >
                <FontAwesome name="search" size={22} color="white" />
              </TouchableHighlight>
              <Animated.View
                style={[
                  styles.inputBox,
                  { transform: [{ translateX: this._input_box_translate_x }] },
                ]}
              >
                <Animated.View style={{ opacity: this._back_button_opacity }}>
                  <TouchableHighlight
                    activeOpacity={1}
                    underlayColor={"#ccd0d5"}
                    onPress={this._onBlur}
                    style={styles.backIconBox}
                  >
                    <Entypo name="chevron-left" size={24} color="#000000" />
                  </TouchableHighlight>
                </Animated.View>
                <TextInput
                  ref="input"
                  placeholder="Search for Symbol"
                  clearButtonMode="always"
                  value={this.state.keyword}
                  onChangeText={(val) => this.setState({ keyword: val })}
                  style={styles.input}
                />
              </Animated.View>
            </View>
          </View>
        </SafeAreaView>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: this._content_opacity,
              transform: [{ translateY: this._content_translate_y }],
            },
          ]}
        >
          <SafeAreaView style={styles.contentSafeAreaView}>
            <View style={styles.contentInner}>
              <View style={styles.seperator}>
                {this.state.keyword === "" ? (
                  <View style={styles.imagePlaceholderContainer}>
                    <Image
                      source={require("../../assets/download (1).png")}
                      style={styles.imagePlaceholder}
                    />
                    <Text style={styles.imagePlaceholderText}>
                      Enter few words to search...
                    </Text>
                  </View>
                ) : (
                  <ScrollView style={styles.scrollView}>
                    <View style={styles.searchItem}>
                      <FontAwesome
                        style={styles.itemIcon}
                        name="search"
                        size={22}
                        color="#cccccc"
                      />
                      <Text>Fake Result 1</Text>
                    </View>
                    <View style={styles.searchItem}>
                      <FontAwesome
                        style={styles.itemIcon}
                        name="search"
                        size={22}
                        color="#cccccc"
                      />
                      <Text>Fake Result 2</Text>
                    </View>
                    <View style={styles.searchItem}>
                      <FontAwesome
                        style={styles.itemIcon}
                        name="search"
                        size={22}
                        color="#cccccc"
                      />
                      <Text>Fake Result 3</Text>
                    </View>
                    <View style={styles.searchItem}>
                      <FontAwesome
                        style={styles.itemIcon}
                        name="search"
                        size={22}
                        color="#cccccc"
                      />
                      <Text>Fake Result 4</Text>
                    </View>
                    <View style={styles.searchItem}>
                      <FontAwesome
                        style={styles.itemIcon}
                        name="search"
                        size={22}
                        color="#cccccc"
                      />
                      <Text>Fake Result 5</Text>
                    </View>
                  </ScrollView>
                )}
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>
      </>
    );
  }
}
export default AddItemsBar;

const styles = StyleSheet.create({
  headerSafeView: {
    zIndex: 1000,
  },
  header: {
    height: 50,
    paddingHorizontal: 16,
  },
  innerHeader: {
    flex: 1,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    backgroundColor: "red",
  },
  searchIconBox: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "#e4e6eb",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inputBox: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "white",
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
  content: {
    width: width,
    height: height,
    position: "absolute",
    left: 0,
    bottom: 0,
    zIndex: 999,
  },
  contentSafeAreaView: {
    flex: 1,
    backgroundColor: "white",
  },
  contentInner: {
    flex: 1,
    paddingTop: 50,
  },
  seperator: {
    marginTop: 5,
    height: 1,
    backgroundColor: "#e4e6eb",
  },
  imagePlaceholderContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginTop: "-50%",
  },
  imagePlaceholder: {
    width: 150,
    height: 113,
    alignSelf: "center",
  },
  imagePlaceholderText: { textAlign: "center", color: "gray", marginTop: 5 },
  searchItem: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e6e4eb",
    marginLeft: 16,
  },
  itemIcon: {
    marginLeft: 16,
  },
  scrollView: {
    backgroundColor: "red",
    height: 500,
    width: "100%",
  },
});
