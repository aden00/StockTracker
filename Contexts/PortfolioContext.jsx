import { StyleSheet, Text, View } from "react-native";
import React, { useContext, createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PortfolioContext = createContext();

export const usePortfolio = () => useContext(PortfolioContext);

const PortfolioProvider = ({ children }) => {
  const [portfolioItems, setportfolioItems] = useState([]);

  const storePortfolioItems = async (newItem) => {
    try {
      const newPortfolioItems = [...portfolioItems, newItem];
      const jsonVal = JSON.stringify(newPortfolioItems);
      await AsyncStorage.setItem("@portfolio_items", jsonVal);
      setportfolioItems(newPortfolioItems);
    } catch (e) {
      console.log(e);
    }
  };
  const getPortfolioItems = async () => {
    try {
      const jsonVal = await AsyncStorage.getItem("@portfolio_items");
      setportfolioItems(jsonVal !== null ? JSON.parse(jsonVal) : []);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getPortfolioItems();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        portfolioItems,
        storePortfolioItems,
        getPortfolioItems,
        setportfolioItems,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export default PortfolioProvider;

const styles = StyleSheet.create({});
