const {
  fetchTechnicalIndicator,
  fetchCryptoCurrentPrice,
  fetchStockCurrentPrice,
  fetchPluangPortfolio
} = require('./src/pluangApi');
const { sendPromptToOpenAI } = require('./src/openai');
const SYMBOLS = {
  BTC: {
    type: 'cryptocurrency',
    id: 'BTC'
  },
  ETH: {
    type: 'cryptocurrency',
    id: 'ETH'
  },
  SOL: {
    type: 'cryptocurrency',
    id: 'SOL'
  },
  XRP: {
    type: 'cryptocurrency',
    id: 'XRP'
  },
  TRX: {
    type: 'cryptocurrency',
    id: 'TRX'
  },
  S: {
    type: 'cryptocurrency',
    id: 'S'
  },
  JCI: {
    type: 'global_stock',
    id: '10260'
  },
  AAPL: {
    type: 'global_stock',
    id: '10003'
  },
  ISRG: {
    type: 'global_stock',
    id: '10401'
  },
  VRSN: {
    type: 'global_stock',
    id: '10586'
  },
  NVDA: {
    type: 'global_stock',
    id: '10058'
  },
  MSFT: {
    type: 'global_stock',
    id: '10004'
  },
  GOOG: {
    type: 'global_stock',
    id: '10006'
  },
  META: {
    type: 'global_stock',
    id: '10005'
  },
  LLY: {
    type: 'global_stock',
    id: '10312'
  },
  PG: {
    type: 'global_stock',
    id: '10018'
  },
  WMT: {
    type: 'global_stock',
    id: '10312'
  },
  BABA: {
    type: 'global_stock',
    id: '10000'
  },
  JPM: {
    type: 'global_stock',
    id: '10007'
  },
  V: {
    type: 'global_stock',
    id: '10011'
  },
  BAC: {
    type: 'global_stock',
    id: '10023'
  }
};

// ✅ Pisahkan aset berdasarkan jenis
const cryptoSymbols = {};
const globalStockSymbols = {};
for (const [symbol, info] of Object.entries(SYMBOLS)) {
  if (info.type === 'cryptocurrency') {
    cryptoSymbols[symbol] = info;
  } else if (info.type === 'global_stock') {
    globalStockSymbols[symbol] = info;
  }
}
(async () => {
  try {
    // ✅ Fetch Portfolio Data
    const portfolio = await fetchPluangPortfolio();
    //console.log(portfolio);

    //const results = {};

    // ✅ Fetch Technical Indicator (AAPL Global Stock)
    //const aaplIndicator = await fetchTechnicalIndicator('global_stock', '10003');
    //console.log(aaplIndicator);
    
    // ✅ Fetch Stock Price (AAPL)
    //const aaplPrice = await fetchStockCurrentPrice('10003');
    //console.log(aaplPrice);


    // ✅ Fetch Crypto Prices (BTC, SOL)
    //const btcPrice = await fetchCryptoCurrentPrice('BTC');
    //console.log(btcPrice);
  
    // ✅ Fetch Crypto Prices (BTC, SOL)
    //const btcIndicator = await fetchTechnicalIndicator('cryptocurrency', 'BTC');
    //console.log(btcIndicator);
    
    /*const response = await sendPromptToOpenAI(`
      
      Hari ini : ${today}

      Portfolio : ${JSON.stringify(portfolio, null, 2)}

      ${JSON.stringify(btcIndicator, null, 2)}

    `);*/
    
    /*for (const [symbol, info] of Object.entries(globalStockSymbols)) {
      

      console.log(`Analisis saham untuk: ${symbol}`);

      const today     = new Date().toISOString().split("T")[0];
      const price     = await fetchStockCurrentPrice(info.id);
      const Indicator = await fetchTechnicalIndicator('global_stock', info.id);
      

      const response  = await sendPromptToOpenAI(`
      Hari ini           : ${today}
      Harga hari ini     : ${JSON.stringify(price, null, 2)}
      Indikator Teknikal (1H/1JAM) : ${JSON.stringify(Indicator, null, 2)}
      aset yang dimiliki : ${JSON.stringify(portfolio.assetCategories[symbol], null, 2)}

      `);
      console.log('\n💡 Jawaban dari OpenAI:\n', response);
    }*/
    for (const [symbol, info] of Object.entries(cryptoSymbols)) {
      console.log(`Analisis kripto untuk: ${symbol}`);
      const today     = new Date().toISOString().split("T")[0];
      const price     = await fetchCryptoCurrentPrice(symbol);
      const Indicator = await fetchTechnicalIndicator('cryptocurrency', symbol);
      const response  = await sendPromptToOpenAI(`
      Hari ini           : ${today}
      Harga hari ini     : ${JSON.stringify(price, null, 2)}
      Indikator Teknikal (1H/1JAM) : ${JSON.stringify(Indicator, null, 2)}
      aset yang dimiliki : ${JSON.stringify(portfolio.assetCategories[symbol], null, 2)}
      `);
      console.log('\n💡 Jawaban dari OpenAI:\n', response);
    }
   

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();
