import axios from "axios";

export const getBalai = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/geoserver/demo_swasembada/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=demo_swasembada%3Abbws&outputFormat=application%2Fjson"
    );
    return response.data;
  } catch (error) {
    throw Error(error);
  }
};

export const getBalaiInfo = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/geoserver/demo_swasembada/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=demo_swasembada%3Ainformasi_balai&outputFormat=application%2Fjson"
    );
    return response.data;
  } catch (error) {
    throw Error(error);
  }
};
