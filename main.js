const {
  fetchTechnicalIndicator,
  fetchCryptoCurrentPrice,
  fetchStockCurrentPrice,
  fetchPluangPortfolio,
  fetchTransactionHistory
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

    const portfolio           = await fetchPluangPortfolio();
    const transactionHistory  = await fetchTransactionHistory();
    const pricenow            = await fetchStockCurrentPrice(globalStockSymbols['AAPL'].id);
    const teknik              = await fetchTechnicalIndicator('global_stock', globalStockSymbols['AAPL'].id);
    
    const supportResistanceText = teknik.supportAndResistance.map(sr => `${sr.title}: Rp${sr.value.toLocaleString()}`).join("\n  ");
 

    const prompt = `
Anda telah ${transactionHistory.transactions['AAPL']['0'].aksi} ${transactionHistory.transactions['AAPL']['0'].assetSymbol} sebanyak ${transactionHistory.transactions['AAPL']['0'].jumlah_stock} dengan harga market ${transactionHistory.transactions['AAPL']['0'].harga_order} dengan nilai ${transactionHistory.transactions['AAPL']['0'].total_jumlah} pada ${transactionHistory.transactions['AAPL']['0'].waktu_order} dan anda dikenakan biaya transaksi ${transactionHistory.transactions['AAPL']['0'].biaya_transaksi}

Informasi Saldo anda : 
- Saldo Rupiah : ${portfolio.assetValue.idrBalance}
- Saldo USD : ${portfolio.assetValue.usdBalance}
- Seluruh aset : ${portfolio.assetValue.netValue}

Informasi Saham dimiliki : 

Nama perusahaan : ${portfolio.assetCategories['AAPL'].name}
- Simbol ticker saham  : ${portfolio.assetCategories['AAPL'].symbol}
- Nilai total investasi : ${portfolio.assetCategories['AAPL'].value_idr}
- Jumlah saham yang dimiliki : ${portfolio.assetCategories['AAPL'].totalQuantity}
- Keuntungan dalam Rupiah dan persentase pertumbuhan dibandingkan harga beli : ${portfolio.assetCategories['AAPL'].profitLoss}
- Persentase kenaikan nilai portofolio berdasarkan harga saham saat ini dibandingkan harga beli : ${portfolio.assetCategories['AAPL'].percentageChange}


Harga terkini (AAPL):
- Harga tengah: Rp ${pricenow.midPrice.toLocaleString()}
- Harga jual: Rp ${pricenow.sellPrice.toLocaleString()}
- Harga beli: Rp ${pricenow.buyBackPrice.toLocaleString()}
- Persentase perubahan harga dalam 24: ${pricenow.oneDayPercentageChange.toLocaleString()}
- Harga penutupan pada sesi perdagangan sebelumnya: ${pricenow.previousClosePrice.toLocaleString()} 
- Perubahan nominal harga dalam 24 jam terakhir: ${pricenow.oneDayChange.toLocaleString()} 

Indikator teknikal :
- Time Frame: ${teknik.timeFrame}
- Oscillators: 
  ${supportResistanceText}
- Moving Averages: 
  - signal  : ${teknik.movingAverages.signal.toLocaleString()}
  - buy     : ${teknik.movingAverages.buy.toLocaleString()}
  - sell    : ${teknik.movingAverages.sell.toLocaleString()}
  - neutral : ${teknik.movingAverages.neutral.toLocaleString()}
- Overall Summary: 
  - signal  : ${teknik.overallSummary.signal.toLocaleString()}
  - buy     : ${teknik.overallSummary.buy.toLocaleString()}
  - sell    : ${teknik.overallSummary.sell.toLocaleString()}
  - neutral : ${teknik.overallSummary.neutral.toLocaleString()}

`;
  const response = await sendPromptToOpenAI(prompt,pricenow);
  console.log(response);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();
(async () => {
  try {

    const portfolio           = await fetchPluangPortfolio();
    const transactionHistory  = await fetchTransactionHistory();
    const pricenow            = await fetchCryptoCurrentPrice('BTC');
    const teknik              = await fetchTechnicalIndicator('cryptocurrency','BTC');
    
    const supportResistanceText = teknik.supportAndResistance.map(sr => `${sr.title}: Rp${sr.value.toLocaleString()}`).join("\n  ");

    const prompt = `
Anda telah ${transactionHistory.transactions['BTC']['0'].aksi} ${transactionHistory.transactions['BTC']['0'].assetSymbol} sebanyak ${transactionHistory.transactions['BTC']['0'].jumlah_stock} dengan harga market ${transactionHistory.transactions['BTC']['0'].harga_order} dengan nilai ${transactionHistory.transactions['BTC']['0'].total_jumlah} pada ${transactionHistory.transactions['BTC']['0'].waktu_order} dan anda dikenakan biaya transaksi ${transactionHistory.transactions['BTC']['0'].biaya_transaksi}

Informasi Saldo anda : 
- Saldo Rupiah : ${portfolio.assetValue.idrBalance}
- Saldo USD : ${portfolio.assetValue.usdBalance}
- Seluruh aset : ${portfolio.assetValue.netValue}

Harga terkini (${pricenow.symbol}):
- Harga Pembukaan: Rp ${pricenow.open.toLocaleString()}
- Harga Tertinggi: Rp ${pricenow.high.toLocaleString()}
- Harga Terendah: Rp ${pricenow.low.toLocaleString()}
- Harga Penutupan: Rp ${pricenow.close.toLocaleString()}
- Volume Perdagangan: ${pricenow.volume.toLocaleString()} 

Indikator teknikal BTC:
- Time Frame: ${teknik.timeFrame}
- Oscillators: 
  ${supportResistanceText}
- Moving Averages: 
  - signal  : ${teknik.movingAverages.signal.toLocaleString()}
  - buy     : ${teknik.movingAverages.buy.toLocaleString()}
  - sell    : ${teknik.movingAverages.sell.toLocaleString()}
  - neutral : ${teknik.movingAverages.neutral.toLocaleString()}
- Overall Summary: 
  - signal  : ${teknik.overallSummary.signal.toLocaleString()}
  - buy     : ${teknik.overallSummary.buy.toLocaleString()}
  - sell    : ${teknik.overallSummary.sell.toLocaleString()}
  - neutral : ${teknik.overallSummary.neutral.toLocaleString()}

`;
    const response = await sendPromptToOpenAI(prompt,pricenow);
    console.log(response);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();
