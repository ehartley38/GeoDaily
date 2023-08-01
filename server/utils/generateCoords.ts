const getRandomNumber = (min: number, max: number, decimalPlaces: number) => {
  const random = Math.random() * (max - min) + min;
  return random.toFixed(decimalPlaces);
};

export const genLatLngCoords = () => {
  const lat = getRandomNumber(-85, 85, 5);
  const lng = getRandomNumber(-180, 180, 5);

  return { lat: lat, lng: lng };
};
