import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import "./CriteriaModal.css";

const blueIcon = L.icon({
  iconUrl: MarkerIcon,
  iconSize: [25, 41],
  iconAnchor: [13, 50],
});

const ZoneLeafletMap = ({ zone, updateZone, place }) => {
  const { lat, lng, radius } = zone;
  const mapDivRef = useRef();
  const mapInstanceRef = useRef();
  const marker = useRef();
  const circle = useRef();

  useEffect(() => {
    if (mapDivRef.current.matches(".leaflet-container")) return;
    const map = L.map(mapDivRef.current);
    mapInstanceRef.current = map;
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(map);
    map.setView([lat, lng], 13);
    map.on("click", (e) => {
      updateZone({ lat: e.latlng.lat, lng: e.latlng.lng, radius });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 13);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place]);

  useEffect(() => {
    const latLng = [lat, lng];
    if (!marker.current) {
      marker.current = L.marker(latLng, { icon: blueIcon });
      marker.current.addTo(mapInstanceRef.current);

      circle.current = L.circle(latLng, radius);
      circle.current.addTo(mapInstanceRef.current);
    } else {
      marker.current.setLatLng(latLng);
      circle.current.setLatLng(latLng);
      circle.current.setRadius(radius);
    }
  }, [lat, lng, radius]);

  return <div ref={mapDivRef}>{null}</div>;
};

export default ZoneLeafletMap;
