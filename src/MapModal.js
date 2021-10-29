import ReactDom from "react-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import "./MapModal.css";
import { Fragment } from "react";

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

const daysOfWeeks = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};

const MapModal = ({ onClose, lat, lng, radius, setLat, setLng, setRadius }) => {
  const mapDivRef = useRef();
  const mapInstanceRef = useRef();
  const marker = useRef();
  const circle = useRef();
  // const [lat, setLat] = useState(52.521465);
  // const [lng, setLng] = useState(13.413099);
  // const [radius, setRadius] = useState(250);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const backdrop = useRef();

  useEffect(() => {
    const onKeyup = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keyup", onKeyup);
    const onWindowClick = (event) => {
      if (event.target === backdrop.current) onClose();
    };
    window.addEventListener("click", onWindowClick);
    return () => {
      window.removeEventListener("keyup", onKeyup);
      window.removeEventListener("click", onWindowClick);
    };
  }, []);

  const [checkedDays, setCheckedDays] = useState([1, 2, 3, 4, 5]);

  const children = (
    <div id="modal-backdrop" ref={backdrop}>
      <div id="map-modal-content">
        <div>
          <h2 className="text-center">Days</h2>
          <p>On which days do you commute?</p>
          {Object.entries(daysOfWeeks).map(([number, string]) => {
            const value = parseInt(number, 10) % 7;
            const checked = checkedDays.includes(value);
            return (
              <Fragment key={number}>
                <input
                  type="checkbox"
                  value={value}
                  checked={checked}
                  onChange={() =>
                    setCheckedDays((days) =>
                      checked
                        ? days.filter((d) => d !== value)
                        : [...days, value]
                    )
                  }
                  id={`day-${number}`}
                />
                <label htmlFor={`day-${number}`}>{`${string} `}</label>
              </Fragment>
            );
          })}
          <h2 className="text-center">Create a zone</h2>
          <p>Type here the latitude and longitude, or click on the map</p>
          <label className="display-block">
            Latitude{" "}
            <input
              step="1"
              min={0}
              type="number"
              value={lat}
              onChange={(e) => setLat(parseInt(e.target.value, 10))}
            />
          </label>
          <label className="display-block">
            Longitude{" "}
            <input
              step="1"
              min={0}
              type="number"
              value={lng}
              onChange={(e) => setLng(parseInt(e.target.value, 10))}
            />
          </label>
          <label className="display-block">
            Radius {radius} meters{" "}
            <input
              step="1"
              min={0}
              max={1000}
              type="range"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value, 10))}
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
