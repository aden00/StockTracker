import axios from "axios";

// export const getStockDetails = async (symbol) => {
//   try {
//     const options = {
//       method: "GET",
//       url: `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=TSLA`,s
//       headers: {
//         "x-api-key": "Brh8suXvO95XOE0Gfd7Oj5MlZzreyGD7a0EAOZyZ",
//       },
//     };
//     console.log("hi");
//     const response = await axios.request(options);

//     return response.data;
//   } catch (e) {
//     console.log(e);
//   }
// };

export const getStockDetails = async (symbol) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=c94kj02ad3if4j51699g`
    );

    return response.data;
  } catch (e) {
    console.log(e);
  }
};
export const getNonStockDetails = async (symbol) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/search?q=${symbol}&token=c94kj02ad3if4j51699g`
    );
    // console.log(response.data + " getnonstock");
    return response.data.result[0];
  } catch (e) {
    console.log(e);
  }
};
export const getStockPriceAndPercentChange = async (symbol) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=c94kj02ad3if4j51699g`
    );

    return response.data;
  } catch (e) {
    console.log(e);
  }
};
export const getMarketChart = async (symbol, range) => {
  const options = {
    method: "GET",
    url: "https://alpha-vantage.p.rapidapi.com/query",
    params: {
      interval: "15min",
      function: "TIME_SERIES_INTRADAY",
      symbol: symbol,
      datatype: "json",
      output_size: "compact",
    },
    headers: {
      "X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com",
      "X-RapidAPI-Key": "a8d020165fmsh47d9e862b281a74p11e097jsn1419cac9711d",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};

export const symbolLookUp = async (text) => {
  var id = -1;
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/search?q=${text}&token=c94kj02ad3if4j51699g`
    );
    const justUSStocksList = response.data.result.filter((el) => {
      return (
        el.symbol.includes(".") == false &&
        el.description.includes("Test") == false &&
        el.description.includes("TEST") == false
      );
    });

    // to make sure the symbol is not .HK/.UK/ just us
    const addedIDList = justUSStocksList.map((object) => {
      id = id + 1;
      // return {
      //   id: id,
      //   name: object.description,
      //   symbol: object.symbol,
      //   type: object.type,
      // };
      return {
        id: id,
        name: object.description,
        ...object,
      };
    });
    return addedIDList;
  } catch (error) {
    console.log(error);
  }
};

export const getAllStocks = async () => {
  try {
    const res = await axios.get(
      "https://finnhub.io/api/v1/stock/symbol?exchange=US&token=c94kj02ad3if4j51699g"
    );
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const getMultipleStocksPriceAndPercentChange = async (
  stockItemsList
) => {
  try {
    let priceList;
    let stringList = "";
    stockItemsList.forEach((element) => {
      console.log(element.symbol);
      stringList = stringList.concat("symbol=", element.symbol, "%7cstocks&");
    });
    console.log(stringList + "stringList");
    let link = `https://api.nasdaq.com/api/quote/watchlist?${stringList}`;
    console.log("link: " + link);
    const response = await axios.get(
      // `https://query1.finance.yahoo.com/v8/finance/chart/${element?.symbol}?region=HK&lang=zh-Hant-HK&includePrePost=false&interval=2m&useYfid=true&range=1d&corsDomain=hk.finance.yahoo.com&.tsrc=finance`
      link
      // https://api.nasdaq.com/api/quote/watchlist?symbol=TSLA%7cstocks&symbol=GOOG%7cstocks&symbol=TSLA%7cstocks&
    );
    console.log("priceList");
    priceList = response.data.data.map((el, index) => {
      el.id = stockItemsList[index].id;
      return el;
    });
    console.log(priceList);
    console.log("hi");

    return;
  } catch (e) {
    console.log(e);
  }
};

export const getMultipleStocksPriceAndPercentChange2 = async (
  stockItemsList,
  existingItemsList
) => {
  try {
    let priceList = [];
    let stringList = "";
    stockItemsList.forEach((element) => {
      console.log(element.symbol);
      stringList = stringList.concat("symbol=", element.symbol, "%7cstocks&");
    });
    console.log(stringList + "stringList");
    let link = `https://api.nasdaq.com/api/quote/watchlist?${stringList}`;
    console.log("link: " + link);
    const response = await axios.get(
      // `https://query1.finance.yahoo.com/v8/finance/chart/${element?.symbol}?region=HK&lang=zh-Hant-HK&includePrePost=false&interval=2m&useYfid=true&range=1d&corsDomain=hk.finance.yahoo.com&.tsrc=finance`
      link
      // https://api.nasdaq.com/api/quote/watchlist?symbol=TSLA%7cstocks&symbol=GOOG%7cstocks&symbol=TSLA%7cstocks&
    );
    console.log(response.data.data);

    return;
  } catch (e) {
    console.log(e);
  }
};
