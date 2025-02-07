import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";

import { useEffect, useRef } from "react";

import { getBalai, getBalaiInfo } from "../utils/apis/api";
import generateColor from "../utils/formater/generateColor";

const App = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style:
        "https://api.maptiler.com/maps/openstreetmap/style.json?key=AW8IuG306IIk8kNdxEw6",
      center: [117.98723409125382, -3.1933697260734784],
      zoom: 5,
      attributionControl: false,
    });

    mapRef.current.on("load", () => {
      fetchBalaiData();
      fetchBalaiInfo();
    });

    return () => mapRef.current.remove();
  });

  const fetchBalaiData = async () => {
    try {
      const response = await getBalai();
      if (response && response.features) {
        addBalaiLayer(response);
      }
      console.log(response);
    } catch (error) {
      console.log("Error fetching Balai data:", error);
    }
  };

  const fetchBalaiInfo = async () => {
    try {
      const response = await getBalaiInfo();
      if (response && response.features) {
        addBalaiLayer(response);
      }
      console.log(response);
    } catch (error) {
      console.log("Error fetching Balai data:", error);
    }
  };

  const addBalaiLayer = (geojsonData) => {
    const map = mapRef.current;

    if (!map || !geojsonData) return;

    // Tambahkan sumber data
    map.addSource("balai", {
      type: "geojson",
      data: geojsonData,
    });

    // Tambahkan layer dengan warna berdasarkan id_balai
    map.addLayer({
      id: "balai-layer",
      type: "fill",
      source: "balai",
      paint: {
        "fill-color": [
          "match",
          ["get", "id_balai"],
          ...geojsonData.features.flatMap((feature) => [
            feature.properties.id_balai,
            generateColor(feature.properties.id_balai),
          ]),
          "#cccccc", // Warna default jika tidak cocok
        ],
        "fill-opacity": 0.6,
      },
    });

    // Tambahkan outline untuk fitur
    map.addLayer({
      id: "balai-border",
      type: "line",
      source: "balai",
      paint: {
        "line-color": "#000",
        "line-width": 1,
      },
    });
  };

  return (
    <div className="bg-slate-500 relative w-full h-screen">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default App;
