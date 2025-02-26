# 🚀 Pluang Trading Bot dengan OpenAI

**Pluang Trading Bot** adalah bot trading otomatis yang menghubungkan **API Pluang** dengan **OpenAI** untuk memberikan analisis pasar dan rekomendasi trading secara cerdas. Bot ini mengambil data harga aset (seperti kripto dan saham global) dari platform Pluang, melakukan analisis teknikal, lalu memanfaatkan AI (ChatGPT) untuk menyarankan tindakan trading (contoh: beli, jual, atau tahan) beserta alasannya.  

## ✨ Fitur Utama

- 📊 **Integrasi Pluang API**: Mengambil harga terkini berbagai aset kripto dan saham global.
- ⚡ **Analisis Teknikal**: Mendapatkan indikator teknikal harian seperti Moving Averages dan Support & Resistance.
- 🧠 **Rekomendasi AI**: Menggunakan OpenAI untuk memberikan keputusan trading berdasarkan data terkini.
- 🛡 **Manajemen Risiko**: Menyediakan level stop-loss dan take-profit untuk meminimalisir risiko trading.
- 🔗 **Format JSON Terstruktur**: Hasil rekomendasi dari AI disusun dalam format JSON yang mudah dibaca dan diinterpretasikan.

## 📌 Cara Kerja

1. **Pengumpulan Data** – Bot mengambil harga terkini, indikator teknikal, dan informasi portofolio dari Pluang API.
2. **Penyusunan Prompt AI** – Data dikompilasi menjadi prompt yang dikirim ke OpenAI untuk analisis.
3. **Analisis AI** – OpenAI mengevaluasi pasar dan memberikan saran trading berdasarkan strategi yang telah ditentukan.
4. **Hasil Output** – Bot mencetak hasil rekomendasi AI dalam format JSON, berisi aksi trading, harga target, dan alasan di balik keputusan tersebut.

## 🛠 Instalasi dan Penggunaan

### 1️⃣ **Kloning Repository**
```bash
git clone https://github.com/sukacode-id/pluang-trading.git
cd pluang-trading
```

### 2️⃣ **Instal Dependensi**
```bash
npm install
```

### 3️⃣ **Konfigurasi API Keys**
Buat file `.env` dan isi dengan API Key Anda:
```ini
PLUANG_API_TOKEN=<token_API_Pluang_Anda>
OPENAI_API_KEY=<API_key_OpenAI_Anda>
```

### 4️⃣ **Menjalankan Bot**
Untuk menjalankan bot, gunakan perintah berikut:
```bash
npm run start
```
Untuk mode pengembangan:
```bash
npm run dev
```
Untuk mode produksi:
```bash
npm run prod
```

## 📂 Struktur Proyek
```plaintext
📁 pluang-trading-bot
├── 📄 main.js               # File utama untuk menjalankan bot
├── 📄 run.js                # File untuk eksekusi multi-aset
├── 📂 src/
│   ├── 📄 openai.js         # Modul komunikasi dengan OpenAI
│   ├── 📄 pluangApi.js      # Modul komunikasi dengan API Pluang
├── 📄 package.json          # Metadata dan dependencies proyek
├── 📄 .env                  # File konfigurasi API Keys (jangan dibagikan)
```

## ⚠️ Disclaimer
> **Trading memiliki risiko tinggi.** Gunakan bot ini sebagai alat bantu analisis, bukan sebagai keputusan utama investasi Anda. Semua keputusan tetap menjadi tanggung jawab pengguna.

📜 **Lisensi**: MIT | **Kontribusi** dipersilakan! 🚀
