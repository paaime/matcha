export const convertPrice = (price) => {
  // Remove any commas and convert to a number
  const numericPrice = Number(price.replace(',', ''));

  // Convert the number to the desired format (e.g., 9.99 or 10.00)
  const formattedPrice = (numericPrice / 100).toFixed(2);

  return formattedPrice;
};
