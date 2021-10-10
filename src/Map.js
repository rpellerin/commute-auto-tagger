import L, { polyline } from "leaflet";
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
    console.log({ coordinates });
    const polyLine = L.polyline(coordinates, {
      color: "blue",
      weight: 2,
      opacity: 0.7,
      lineJoin: "round",
    });
    polyLine.addTo(map);
    map.fitBounds(polyLine.getBounds());
  }, []);
  return (
    <div ref={ref} style={{ height: "200px" }}>
      {null}
    </div>
  );
};

export default Map;
