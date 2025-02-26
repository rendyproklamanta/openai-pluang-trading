require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ Fungsi untuk mengirim prompt dengan function calling
async function sendPromptToOpenAI(prompt, marketData, model = 'gpt-4-1106-preview', temperature = 0.1) {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: `Bayangkan anda ada di posisi saya dan anda lebih tau untuk masa depan. anda memperkirakan dengan strategi trading Mean Reversion , Breakout Trading , Momentum Trading dan bahkan teknik yang anda ciptakan sendiri.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature,
      functions: [
        {
          name: "executeOrder",
          description: "Eksekusi order trading crypto dengan metode Market, Limit, Stop, atau Stop-Limit.",
          parameters: {
            type: "object",
            properties: {
              method: { 
                type: "string", 
                enum: ["Market", "Limit", "Stop", "Stop-Limit","null"], 
                description: "pilih anda akan mengunakan market/limit/stop/stop-limit. jika hold maka null" 
              },
              price: { 
                type: ["null", "number"], 
                description: `Harga order untuk Limit atau Stop-Limit, null untuk Market.`
              },
              xxxx: { 
                type: ["null", "number"], 
                description: `hitung kerugian jika menjual.`
              },
              amountIDR: { 
                type: "number", 
                description: `Informasi Saldo IDR untuk kripto (BTC,ETH,XRP) dan USD untuk saham AS (AAPL,NVDA,META). ` 
              },
              stopLoss: { 
                type: ["null", "number"], 
                description: "Harga yang ditentukan untuk membatasi kerugian , null jika tidak digunakan." 
              },
              takeProfit: { 
                type: ["null", "number"], 
                description: "Harga yang dituju untuk mengambil keuntungan , null jika tidak digunakan." 
              },
              priceEntry: {
                type: ["null", "number"], 
                description: "Harga yang disarankan untuk membuka posisi (beli atau jual) , null jika tidak digunakan." 
              },
              action: {
                type: "string",
                enum: ["BUY", "SELL", "HOLD"],
                description: "Keputusan trading berdasarkan analisis, apakah BUY, SELL, atau HOLD."
              },
              portfolioBalance: {
                type: "number",
                description: `Jumlah yang dimiliki dalam wallet sebelum order.`
              },
              reason: {
                type: "string",
                description: "Analisis Singkat."
              },
              all_assets: {
                type: "string",
                description: "Seluruh aset."
              },
              marketDataCrypto: {
                type: "object",
                properties: {
                  symbol: { type: "string", description: `Simbol aset. (hanya untuk kripto)` },
                  open: { type: "number", description: "Harga pembukaan (open price) (hanya untuk kripto , jika bukan kripto gunakan null)." },
                  high: { type: "number", description: "Harga tertinggi (high price) (hanya untuk kripto , jika bukan kripto gunakan null)." },
                  low: { type: "number", description: "Harga terendah (low price) (hanya untuk kripto , jika bukan kripto gunakan null)." },
                  close: { type: "number", description: "Harga penutupan (close price) (hanya untuk kripto , jika bukan kripto gunakan null)." },
                  volume: { type: ["null","number"], description: "Volume perdagangan. jika tidak ada gunakan null (hanya untuk kripto , jika bukan kripto gunakan null)" }
                },
                description: "Informasi harga terkini untuk analisis trading."
              },
              marketDataAS: {
                type: "object",
                properties: {
                  symbol: { type: "string", description: `Simbol aset. (hanya untuk SAHAM AS)` },
                  mid: { type: "number", description: "Harga tengah (Mid Price) (hanya untuk saham AS , jika bukan SAHAM AS gunakan null)." },
                  sell: { type: "number", description: "Harga Jual (Sell price) (hanya untuk saham AS , jika bukan SAHAM AS gunakan null)." },
                  close: { type: "number", description: "Harga penutupan (close price) (hanya untuk saham AS , jika bukan SAHAM AS gunakan null)." }
                },
                description: "Informasi harga terkini untuk analisis trading."
              }
            },
            required: ["method","price","amountIDR","stopLoss","takeProfit","priceEntry","action","portfolioBalance","reason","all_assets","marketDataCrypto","marketDataAS","xxxx"]
          }
        }
      ],
      function_call: { name: "executeOrder" } // ✅ Paksa function_call agar digunakan
    }); 

    // ✅ Mengecek apakah OpenAI memberikan function_call
    if (response.choices && response.choices.length > 0) {
      const messageContent = response.choices[0].message;

      if (messageContent.function_call) {
        const structuredData = JSON.parse(messageContent.function_call.arguments);
        return structuredData;
      } else {
        throw new Error("❌ OpenAI tidak memanggil function_call. Mungkin prompt atau parameter kurang jelas.");
      }
    } else {
      throw new Error('❌ Tidak ada respons yang valid dari OpenAI.');
    }
  } catch (error) {
    console.error('❌ Error fetching response from OpenAI:', error);
    throw error;
  }
}

module.exports = {
  sendPromptToOpenAI
};
