import ReactDom from "react-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import "./MapModal.css";

let modalWrapper = document.querySelector(".modal-wrapper");
if (!modalWrapper) {
  modalWrapper = document.createElement("div");
  modalWrapper.classList.add("modal-wrapper");
  document.body.appendChild(modalWrapper);
}

const blueIcon = L.icon({
  iconUrl: MarkerIcon,
  iconSize: [25, 41],
  iconAnchor: [13, 50],
});

const MapModal = () => {
  const mapDivRef = useRef();
  const mapInstanceRef = useRef();
  const marker = useRef();
  const [lat, setLat] = useState(52.521465);
  const [lng, setLng] = useState(13.413099);

  useEffect(() => {
    if (mapDivRef.current.matches(".leaflet-container")) return;
    const map = L.map(mapDivRef.current);
    mapInstanceRef.current = map;
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(map);
    map.setView([lat, lng], 13);
    map.on("click", (e) => {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    });
  }, []);

  useEffect(() => {
    const latLng = [lat, lng];
    if (!marker.current) {
      marker.current = L.marker(latLng, { icon: blueIcon });
      marker.current.addTo(mapInstanceRef.current);
    } else {
      marker.current.setLatLng(latLng);
    }
  }, [lat, lng]);
  const children = (
    <div>
      <div id="map-modal-content">
        <div>
          <h2 className="text-center">Create a zone</h2>
          <h3>Type here the latitude and longitude, or click on the map</h3>
          <label>
            Latitude{" "}
            <input
              step="1"
              min={0}
              type="number"
              value={lat}
              onChange={(e) => setLat(parseInt(e.target.value, 10))}
            />
          </label>
          <label>
            Longitude{" "}
            <input
              step="1"
              min={0}
              type="number"
              value={lng}
              onChange={(e) => setLng(parseInt(e.target.value, 10))}
            />
          </label>
        </div>
        <div ref={mapDivRef} style={{ height: "100%" }}>
          {null}
        </div>
      </div>
    </div>
  );

  return ReactDom.createPortal(children, modalWrapper);
};

export default MapModal;
