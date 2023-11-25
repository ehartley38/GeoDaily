import axios from "axios";

import { config } from "./config.js";

type ConvertedType = {
  latt: number;
  longt: number;
};

type CoordinatesType = {
  lat: number;
  lng: number;
};

// https://stackoverflow.com/questions/1773550/convert-xml-to-json-and-back-using-javascript
function parseXmlToJson(xml: string) {
  const json: any = {};
  for (const res of xml.matchAll(
    /(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm
  )) {
    const key = res[1] || res[3];
    const value = res[2] && parseXmlToJson(res[2]);
    json[key] = (value && Object.keys(value).length ? value : res[2]) || null;
  }
  return json;
}

const getRandomPoint = async () => {
  try {
    const response = await axios.get(
      "https://api.3geonames.org/?randomland=yes"
    );
    const converted: ConvertedType = parseXmlToJson(response.data);

    const lat = converted.latt;
    const lng = converted.longt;

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
