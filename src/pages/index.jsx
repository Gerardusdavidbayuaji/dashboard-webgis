import { useEffect, useRef, useState, useCallback } from "react";

import { getBalai, getBalaiInfo } from "../utils/apis/api";
import generateColor from "../utils/formater/generateColor";

import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";

const App = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [, setSelectedBalai] = useState(null);

  const fetchBalaiInfo = useCallback(async () => {
    try {
      const response = await getBalaiInfo();

      if (response && response.features) {
        addBalaiInfoLayer(response);
      }
    } catch (error) {
      console.error("Upss, error fetching balai point:", error);
    }
  }, []);

  const fetchBalaiData = useCallback(async () => {
    try {
      const response = await getBalai();
      if (response && response.features) {
        addBalaiLayer(response);
      }
    } catch (error) {
      console.error("Upss, error fetching balai area:", error);
    }
  }, []);

  useEffect(() => {
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [117.98723409125382, -3.1933697260734784],
      zoom: 5,
      attributionControl: false,
    });

    mapRef.current.on("load", () => {
      fetchBalaiInfo();
      fetchBalaiData();
    });

    return () => mapRef.current.remove();
  }, [fetchBalaiInfo, fetchBalaiData]);

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
        "circle-radius": 5,
        "circle-color": "#ff6200",
        "circle-stroke-width": 1,
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

      const uniqueBalaiIdsFiltered = uniqueBalaiIds.filter(
        (id) => id !== balaiId
      );
      const colorMapping = uniqueBalaiIdsFiltered.flatMap((id) => [
        id,
        generateColor(id),
      ]);

      map.setPaintProperty("balai-layer", "fill-color", [
        "match",
        ["get", "id_balai"],
        balaiId,
        "#77B254",
        ...colorMapping,
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
      map.getCanvas().style.cursor = "-";
    });
  };

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
        "line-width": 0.5,
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
