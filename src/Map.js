import L from "leaflet";
import "leaflet/dist/leaflet.css";
import polyUtil from "polyline-encoded";
import { useEffect, useRef } from "react";

const Map = ({ activity }) => {
  const ref = useRef();
  useEffect(() => {
    if (
      ref.current.matches(".leaflet-container") ||
      !activity.map.summary_polyline
    )
      return;
    const map = L.map(ref.current);
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(map);
    const coordinates = polyUtil.decode(activity.map.summary_polyline);
    const polyLine = L.polyline(coordinates, {
      color: "#fc4c02",
      weight: 3,
      opacity: 1,
      lineJoin: "round",
    });
    const beginningIcon = L.divIcon({ className: "beginning-marker" });
    const endIcon = L.divIcon({ className: "end-marker" });
    const beginning = coordinates[0];
    const end = coordinates[coordinates.length - 1];
    polyLine.addTo(map);
    L.marker(beginning, { icon: beginningIcon }).addTo(map);
    L.marker(end, { icon: endIcon }).addTo(map);
    map.fitBounds(polyLine.getBounds());
  }, [activity.map.summary_polyline]);
  return (
    <div ref={ref} style={{ height: "200px" }}>
      {null}
    </div>
  );
};

export default Map;
