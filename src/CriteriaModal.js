import ReactDom from "react-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import "./CriteriaModal.css";
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

const Zone = ({ zone, index, updateZone }) => {
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

const CriteriaModal = ({ onClose, zones, setZones }) => {
  const backdrop = useRef();
  const addAZone = () => {
    setZones((oldZones) => [...oldZones, oldZones[0]]);
  };
  const removeAZone = (index) => {
    setZones((zones) => zones.filter((_zone, i) => i !== index));
  };

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

  useEffect(() => {
    window.localStorage.setItem("zones", JSON.stringify(zones));
  }, [zones]);

  const [checkedDays, setCheckedDays] = useState([1, 2, 3, 4, 5]);

  const children = (
    <div id="modal-backdrop" ref={backdrop}>
      <div id="map-modal-top">
        <button id="modal-close-button" onClick={onClose}>
          x
        </button>
      </div>
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
          {zones.map((zone, index) => {
            const { lat, lng, radius } = zone;
            const updateZone = (zone) =>
              setZones((zones) =>
                zones.map((oldZone, i) =>
                  i === index ? { ...oldZone, ...zone } : oldZone
                )
              );

            return (
              <div className="criteria-modal-zone">
                <div>
                  <h2 className="text-center">Create a zone - zone {index}</h2>
                  <p>
                    Type here the latitude and longitude, or click on the map
                  </p>
                  <label className="display-block">
                    Latitude{" "}
                    <input
                      step="0.1"
                      min={0}
                      type="number"
                      value={lat}
                      onChange={(e) =>
                        updateZone({ lat: parseFloat(e.target.value, 10) })
                      }
                    />
                  </label>
                  <label className="display-block">
                    Longitude{" "}
                    <input
                      step="0.1"
                      min={0}
                      type="number"
                      value={lng}
                      onChange={(e) =>
                        updateZone({ lng: parseFloat(e.target.value, 10) })
                      }
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
                      onChange={(e) =>
                        updateZone({ radius: parseFloat(e.target.value, 10) })
                      }
                    />
                  </label>
                  {index > 0 && (
                    <button onClick={() => removeAZone(index)}>
                      Remove zone
                    </button>
                  )}
                </div>
                <Zone zone={zone} index={index} updateZone={updateZone} />
              </div>
            );
          })}
          <button onClick={() => addAZone()}>Add a zone</button>
          {/* <button onSave={() => setZones([])}>Save</button> */}
        </div>
      </div>
    </div>
  );

  return ReactDom.createPortal(children, modalWrapper);
};

export default CriteriaModal;
