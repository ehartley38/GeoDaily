const axios = require("axios").default;
let convert = require("xml-js");
const config = require("./config");

type CoordinatesType = {
  lat: number;
  lng: number;
};

const getRandomPoint = async () => {
  try {
    const response = await axios.get(
      "https://api.3geonames.org/?randomland=yes"
    );

    const location = convert.xml2js(response.data, {
      compact: true,
      spaces: 4,
    });

    const lat = location.geodata.nearest.latt._text;
    const lng = location.geodata.nearest.longt._text;

    return { lat: lat, lng: lng };
  } catch (err) {
    console.log(err);
  }
};

export const getValidStreetView = async (): Promise<CoordinatesType[]> => {
  try {
    while (true) {
      const coords = await getRandomPoint();
      const streetViewData = await axios.get(
        `https://maps.googleapis.com/maps/api/streetview/metadata?location=${
          coords!.lat
        },${coords!.lng}&radius=50000&key=${config.MAPS_API_KEY}`
      );

      if (streetViewData.data.status === "OK") {
        return [streetViewData.data.location];
      }
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
