   window.addEventListener("DOMContentLoaded", () => {
    loadCryptoMarket(); // fungsi fetch dari CoinGecko
  });
  
  // top 5 crypto
  
  const coins = ["bitcoin", "ethereum", "binancecoin", "ripple", "solana"];

  async function fetchPrices() {
    const usdResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coins.join(",")}&order=market_cap_desc&sparkline=false`
    );

    const idrResponse = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(",")}&vs_currencies=idr`
    );

    const usdData = await usdResponse.json();
    const idrData = await idrResponse.json();

    const container = document.getElementById("crypto-container");
    container.innerHTML = "";

    usdData.forEach(coin => {
      const priceUSD = coin.current_price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
      });

      const priceIDR = idrData[coin.id].idr.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR"
      });

      const percent = coin.price_change_percentage_24h;
      const color = percent >= 0 ? "limegreen" : "tomato";
      const percentDisplay = `${percent.toFixed(2)}%`;

      const box = document.createElement("div");
      box.className = "box";
      box.innerHTML = `
        <div class="icon-crypto">
          <div class="crypto-price">
            <h3>${coin.name}</h3>
            <p>${priceUSD}<br><small>${priceIDR}</small></p>
            <p style="color:${color}; font-weight:bold;">${percentDisplay}</p>
          </div>
          <img src="${coin.image}" alt="${coin.name}" width="50" />
        </div>
      `;
      container.appendChild(box);
    });
  }

  fetchPrices();
  setInterval(fetchPrices, 30000);


// market 
const marketData = [
    { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
    { id: "ethereum", symbol: "ETH", name: "Ethereum" },
    { id: "tether", symbol: "USDT", name: "Tether" },
    { id: "ripple", symbol: "XRP", name: "XRP" },
    { id: "binancecoin", symbol: "BNB", name: "Binance" },
    { id: "solana", symbol: "SOL", name: "Solana" },
    { id: "usd-coin", symbol: "USDC", name: "USDC" },
    { id: "tron", symbol: "TRX", name: "TRON" },
    { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
    { id: "hyperliquid", symbol: "HYPE", name: "Hyperliquid" }
  ];

  async function fetchMarketData() {
    const ids = marketData.map(c => c.id).join(',');
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();

      const exchangeRate = await fetch("https://api.coingecko.com/api/v3/exchange_rates");
      const exchangeData = await exchangeRate.json();
      const usdToIdr = exchangeData.rates.idr.value;

      const rows = document.querySelectorAll(".market-price");

      data.forEach((coin, i) => {
        const row = rows[i];
        if (!row) return;

        // HARGA
        const priceUSD = coin.current_price;
        const priceIDR = priceUSD * usdToIdr;
        const price = document.createElement("p");
        price.textContent = `${priceIDR.toLocaleString("id-ID", { style: "currency", currency: "IDR" })} / $${priceUSD.toFixed(2)}`;
        row.children[2].replaceWith(price);

        // PERUBAHAN PERSENTASE
        const percent = coin.price_change_percentage_24h;
        const percentElem = document.createElement("p");
        percentElem.textContent = `${percent.toFixed(2)}%`;
        percentElem.style.color = percent >= 0 ? "limegreen" : "red";
        row.children[3].replaceWith(percentElem);

        // MARKET CAP
        const marketCap = document.createElement("p");
        marketCap.textContent = "$" + coin.market_cap.toLocaleString("en-US");
        row.children[4].replaceWith(marketCap);
      });

    } catch (error) {
      console.error("Gagal memuat data crypto:", error);
    }
  }

  fetchMarketData();
  setInterval(fetchMarketData, 30000);

 
