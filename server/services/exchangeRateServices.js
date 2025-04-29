export const convertINRtoUSD = async (amountInINR) => {
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATE_API_KEY}/pair/INR/USD/${amountInINR}`
  );
  const { conversion_result, result } = await response.json();

  if (result !== "success") {
    throw new Error("Currency conversion failed");
  }

  return conversion_result.toFixed(2);
};
