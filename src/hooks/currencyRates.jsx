import React, { useEffect, useState } from "react";

const currencyRates = () => {
  const [exchangeRates, setExchangeRates] = useState({
    PKR: 0,
    EUR: 0,
    GBP: 0,
    USD: 0,
    AED: 0,
  });

  useEffect(() => {
    const fetchDollarRate = async () => {
      try {
        const response = await fetch("");
        // https://v6.exchangerate-api.com/v6/9f8daea350a3e0335db1697e/latest/PKR

        const data = await response.json();

        const usdToPkr = 1 / data.conversion_rates.USD;
        const eurToPkr = 1 / data.conversion_rates.EUR;
        const gbpToPkr = 1 / data.conversion_rates.GBP;
        const aedToPkr = 1 / data.conversion_rates.AED;

        console.log("Live Exchange Rates:", {
          usdToPkr,
          eurToPkr,
          gbpToPkr,
          aedToPkr,
        });

        setExchangeRates({
          PKR: usdToPkr.toFixed(2),
          EUR: eurToPkr.toFixed(2),
          GBP: gbpToPkr.toFixed(2),
          USD: usdToPkr.toFixed(2),
          AED: aedToPkr.toFixed(2),
        });
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchDollarRate();
  }, []);

  return exchangeRates;
};

export default currencyRates;
