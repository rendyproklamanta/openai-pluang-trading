require('dotenv').config();
const axios = require('axios');

// 🔑 Fungsi untuk mendapatkan header yang sama
function getRequestHeaders() {
  return {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9,id;q=0.8',
    'authorization': `Bearer ${process.env.PLUANG_API_TOKEN}`,
    'origin': 'https://trade.pluang.com',
    'referer': 'https://trade.pluang.com/',
    'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    'x-device-id': 'web-7cd7c9b1-4fa9-44cb-a40e-350839c6e886',
    'x-language-code': 'id',
    'x-platform': 'desktop-web',
    'x-request-id': '6ee959c9-55dd-45ea-aeee-5022823f7e20'
  };
}

// ✅ Fetch Technical Indicator Data (Cryptocurrency & Global Stock)
async function fetchTechnicalIndicator(category, symbolOrId) {
  let url;

  if (category === 'cryptocurrency') {
    url = `https://api-pluang.pluang.com/api/v4/technical-indicators/summary?assetCategory=cryptocurrency&timeFrame=DAILY&assetSymbol=${symbolOrId}`;
  } else if (category === 'global_stock') {
    url = `https://api-pluang.pluang.com/api/v4/technical-indicators/summary?assetCategory=global_stock&timeFrame=DAILY&assetId=${symbolOrId}`;
  } else {
    throw new Error('Invalid asset category. Use "cryptocurrency" or "global_stock".');
  }

  try {
    const response = await axios.get(url, { headers: getRequestHeaders() });

    if (response.data && response.data.data) {
      const data = response.data.data;

      // 🔥 Hapus popUpTitle dan popUpDescription dari indicators
      const cleanedIndicators = data.oscillators.indicators.map(indicator => {
        const { popUpTitle, popUpDescription, ...rest } = indicator;
        return rest;
      });

      // 🔥 Hapus properti color dari supportAndResistance
      const cleanedSupportResistance = data.supportAndResistance.indicators.map(indicator => {
        const { color, ...rest } = indicator;
        return rest;
      });

      // ✅ Format response
      return {
        symbolOrId,
        category: data.assetCategory,
        timeFrame: data.timeFrame,
        overallSummary: {
          signal: data.overallSummary.signal,
          buy: data.overallSummary.buyCount,
          sell: data.overallSummary.sellCount,
          neutral: data.overallSummary.neutralCount
        },
        movingAverages: {
          signal: data.movingAverages.movingAveragesSummary.signal,
          buy: data.movingAverages.movingAveragesSummary.buyCount,
          sell: data.movingAverages.movingAveragesSummary.sellCount,
          neutral: data.movingAverages.movingAveragesSummary.neutralCount
        },
        oscillators: {
          signal: data.oscillators.oscillatorsSummary.signal,
          buy: data.oscillators.oscillatorsSummary.buyCount,
          sell: data.oscillators.oscillatorsSummary.sellCount,
          neutral: data.oscillators.oscillatorsSummary.neutralCount,
          indicators: cleanedIndicators
        },
        supportAndResistance: cleanedSupportResistance
      };
    } else {
      throw new Error('Technical indicator data not found.');
    }
  } catch (error) {
    if (error.response) {
      console.error('API Response Error:', error.response.data);
    }
    throw new Error(`Error fetching technical indicator: ${error.message}`);
  }
}



// ✅ Fetch harga terkini kripto (BTC, SOL, dll)
async function fetchCryptoCurrentPrice(symbol) {
  const today = new Date().toISOString().split('T')[0];
  const url = `https://api-pluang.pluang.com/api/v4/asset/cryptocurrency/price/ohlcStatsByDateRange/${symbol}?timeFrame=DAILY&startDate=${today}T00:00:00.000Z`;

  try {
    const response = await axios.get(url, { headers: getRequestHeaders() });

    if (response.data && response.data.data && response.data.data.length > 0) {
      const priceData = response.data.data[0];

      return {
        symbol: priceData.cryptoCurrencySymbol,
        open: priceData.openMidPrice,
        high: priceData.highMidPrice,
        low: priceData.lowMidPrice,
        close: priceData.closeMidPrice,
        volume: priceData.volume
      };
    } else {
      throw new Error('Crypto price data not found.');
    }
  } catch (error) {
    if (error.response) {
      console.error('API Response Error:', error.response.data);
    }
    throw new Error(`Error fetching crypto price: ${error.message}`);
  }
}

// ✅ Fetch harga terkini saham global
async function fetchStockCurrentPrice(assetId) {
  const url = `https://api-pluang.pluang.com/api/v4/asset/global-stock/price/currentPriceByStockIds?globalStockIds=${assetId}`;

  try {
    const response = await axios.get(url, { headers: getRequestHeaders() });

    if (response.data && response.data.data && response.data.data[assetId]) {
      const priceData = response.data.data[assetId];

      return {
        assetId: priceData.id,
        midPrice: priceData.midPrice,
        sellPrice: priceData.sellPrice,
        buyBackPrice: priceData.buyBackPrice,
        oneDayPercentageChange: priceData.oneDayPercentageChange,
        previousClosePrice: priceData.prevClosePrice,
        oneDayChange: priceData.oneDayChange
      };
    } else {
      throw new Error('Stock price data not found.');
    }
  } catch (error) {
    if (error.response) {
      console.error('API Response Error:', error.response.data);
    }
    throw new Error(`Error fetching stock price: ${error.message}`);
  }
}

// ✅ Fetch Portfolio Data
async function fetchPluangPortfolio() {
  const url = 'https://api-pluang.pluang.com/api/v4/portfolio/asset-holdings?isTodayReturn=true&pageSize=50&page=1&currency=USD&category=all&sortKey=value_desc';

  try {
    const response = await axios.get(url, { headers: getRequestHeaders() });

    if (response.data && response.data.data) {
      const data = response.data.data;

      const assetValue = {
        netValue: data.totalValueAndProfit[0].spread[0].formattedValue,
        idrBalance: data.totalValueAndProfit[0].spread[1].formattedValue,
        usdBalance: data.totalValueAndProfit[0].spread[2].formattedValue
      };

      const unrealizedProfitLoss = {
        totalProfitLoss: data.totalValueAndProfit[1].formattedValue,
        assetProfitLoss: data.totalValueAndProfit[1].spread[0].formattedValue,
        exchangeRateProfitLoss: data.totalValueAndProfit[1].spread[1].formattedValue
      };

      const assetCategories = {};
      data.assetCategories.forEach((category) => {
        category.assetCategoryData.forEach((asset) => {
          assetCategories[asset.tileInfo.symbol] = {
            name: asset.tileInfo.name,
            symbol: asset.tileInfo.symbol,
            value_idr: asset.display.valueAndProfit.value,
            totalQuantity: parseFloat(asset.display.valueAndProfit.totalQuantity).toFixed(8),
            profitLoss: asset.display.valueAndProfit.profitValue,
            percentageChange: asset.display.valueAndProfit.percentage
          };
        });
      });

      return {
        assetValue,
        unrealizedProfitLoss,
        assetCategories
      };
    } else {
      throw new Error('Portfolio data not found.');
    }
  } catch (error) {
    if (error.response) {
      console.error('API Response Error:', error.response.data);
    }
    throw new Error(`Error fetching portfolio: ${error.message}`);
  }
}

// ✅ Fetch Transaction History
async function fetchTransactionHistory(transactionStatus = 'successful', transactionTypes = ['buy', 'sell']) {
  const maxPages = 20;
  let currentPage = 1;
  let allTransactions = {};
  let fxRateInfo = null;

  try {
    while (currentPage <= maxPages) {
      const url = `https://api-pluang.pluang.com/api/v4/asset/transaction-history-new?page=${currentPage}&transactionStatus=${transactionStatus}&transactionType=${transactionTypes.join('&transactionType=')}`;

      const response = await axios.get(url, { headers: getRequestHeaders() });

      if (response.data && response.data.data) {
        const data = response.data.data;
        data.transactions.forEach((transaction) => {
          const assetSymbol = transaction.assetSymbol.toUpperCase();
          const formattedTransaction = {
            id: transaction.id,
            assetSymbol: transaction.assetSymbol,
            assetOrderType:transaction.assetOrderType,
            aksi: transaction.action,
            kategori: transaction.category,
            jumlah_stock: transaction.assetQuantity,
            mata_uang: transaction.currency || transaction.paymentChannel,
            waktu_order: transaction.date,
            biaya_transaksi: transaction.fee,
            kurs_fx: transaction.fxRate,
            harga_order: transaction.orderPrice,
            total_jumlah: transaction.totalAmount
          };

          if (!allTransactions[assetSymbol]) {
            allTransactions[assetSymbol] = [];
          }

          allTransactions[assetSymbol].push(formattedTransaction);
        });

        if (!fxRateInfo && data.fxRateInfo) {
          fxRateInfo = {
            title: data.fxRateInfo.title,
            description: data.fxRateInfo.description
          };
        }

        if (currentPage >= data.totalPageCount) {
          break; // Stop jika sudah mencapai halaman terakhir
        }
      } else {
        break; // Stop jika tidak ada data transaksi
      }

      currentPage++;
    }

    return {
      totalFetchedPages: currentPage - 1,
      totalTransactions: Object.keys(allTransactions).reduce((acc, key) => acc + allTransactions[key].length, 0),
      transactions: allTransactions,
      fxRateInfo
    };
  } catch (error) {
    if (error.response) {
      console.error('API Response Error:', error.response.data);
    }
    throw new Error(`Error fetching transaction history: ${error.message}`);
  }
}





module.exports = {
  fetchTechnicalIndicator,
  fetchCryptoCurrentPrice,
  fetchStockCurrentPrice,
  fetchPluangPortfolio,
  fetchTransactionHistory  // 🚀 Tambahkan fungsi baru ke ekspor
};
