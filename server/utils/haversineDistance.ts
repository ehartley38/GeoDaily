type markerType = {
  lat: number;
  lng: number;
};

// https://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3
// To use kilometers, set R = 6371.0710

const rad = (x: number) => {
  return (x * Math.PI) / 180;
};

export const haversine_distance = (mk1: markerType, mk2: markerType) => {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(mk2.lat - mk1.lat);
  var dLong = rad(mk2.lng - mk1.lng);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(mk1.lat)) *
      Math.cos(rad(mk2.lat)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};
