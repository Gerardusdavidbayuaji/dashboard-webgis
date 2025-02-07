import { useEffect, useRef, useState, useCallback } from "react";

import { getBalai, getBalaiInfo } from "../utils/apis/api";
import generateColor from "../utils/formater/generateColor";

import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";

const App = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [, setSelectedBalai] = useState(null);

  // Menggunakan useCallback untuk menghindari re-render berulang
  const fetchBalaiData = useCallback(async () => {
    try {
      const response = await getBalai();
      if (response && response.features) {
        addBalaiLayer(response);
      }
    } catch (error) {
      console.error("Error fetching Balai data:", error);
    }
  }, []);

  const fetchBalaiInfo = useCallback(async () => {
    try {
      const response = await getBalaiInfo();
      if (response && response.features) {
        addBalaiInfoLayer(response);
      }
    } catch (error) {
      console.error("Error fetching Balai info:", error);
    }
  }, []);

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
  }, [fetchBalaiData, fetchBalaiInfo]); // Memasukkan dependensi yang diperlukan

  const addBalaiLayer = (geojsonData) => {
    const map = mapRef.current;

    if (!map || !geojsonData) return;

    const uniqueBalaiIds = Array.from(
      new Set(
        geojsonData.features.map((feature) => feature.properties.id_balai)
      )
    );

    map.addSource("balai", {
      type: "geojson",
      data: geojsonData,
    });

    map.addLayer({
      id: "balai-layer",
      type: "fill",
      source: "balai",
      paint: {
        "fill-color": [
          "match",
          ["get", "id_balai"],
          ...uniqueBalaiIds.flatMap((id) => [id, generateColor(id)]),
          "#cccccc",
        ],
        "fill-opacity": 0.6,
      },
    });

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

  const addBalaiInfoLayer = (geojsonData) => {
    const map = mapRef.current;

    if (!map || !geojsonData) return;

    map.addSource("balai-info", {
      type: "geojson",
      data: geojsonData,
    });

    map.addLayer({
      id: "balai-info-layer",
      type: "circle",
      source: "balai-info",
      paint: {
        "circle-radius": 8,
        "circle-color": "#ff0000",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });

    map.on("click", "balai-info-layer", (e) => {
      const balaiId = e.features[0].properties.id_balai;
      setSelectedBalai(balaiId);

      const uniqueBalaiIds = Array.from(
        new Set(
          geojsonData.features.map((feature) => feature.properties.id_balai)
        )
      );

      // Perbarui warna area balai dengan filter unik
      map.setPaintProperty("balai-layer", "fill-color", [
        "match",
        ["get", "id_balai"],
        balaiId,
        "#ff0000",
        ...uniqueBalaiIds.flatMap((id) => [id, generateColor(id)]),
        "#cccccc",
      ]);

      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          `<h3 style="margin: 0; font-size: 16px;">Peringatan</h3>
          <p style="margin: 5px 0;">Anda telah memilih balai dengan ID: <strong>${balaiId}</strong></p>`
        )
        .addTo(map);
    });

    map.on("mouseenter", "balai-info-layer", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "balai-info-layer", () => {
      map.getCanvas().style.cursor = "";
    });
  };

  return (
    <div className="bg-slate-500 relative w-full h-screen">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default App;
