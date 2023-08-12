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

    const lat = location.geodata.major.latt._text;
    const lng = location.geodata.major.longt._text;

    return { lat: lat, lng: lng };
  } catch (err) {
    console.log(err);
  }
};

export const getValidStreetView = async (): Promise<CoordinatesType[]> => {
  try {
    while (true) {
      const coords = await getRandomPoint();
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/streetview/metadata?location=${
          coords!.lat
        },${coords!.lng}&radius=50000&source=outdoor&key=${config.MAPS_API_KEY}`
      );

      const streetViewData = response.data;

      if (streetViewData.status === "OK") {
        const year = parseInt(streetViewData.date.substring(0, 4));
        if (year > 2015) {
          console.log(streetViewData);
          return streetViewData.location;
        }
      }
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
