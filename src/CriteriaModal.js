import ReactDom from "react-dom";
import { useEffect, useRef, useState } from "react";
import "./CriteriaModal.css";
import { Fragment } from "react";
import Zone from "./Zone";

let modalWrapper = document.querySelector(".modal-wrapper");
if (!modalWrapper) {
  modalWrapper = document.createElement("div");
  modalWrapper.classList.add("modal-wrapper");
  document.body.appendChild(modalWrapper);
}

const daysOfWeeks = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
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
      <div id="criteria-modal-top-noscroll">
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
            const updateZone = (zone) => {
              setZones((zones) =>
                zones.map((oldZone, i) =>
                  i === index ? { ...oldZone, ...zone } : oldZone
                )
              );
            };
            const handleSubmitLocation = async (event) => {
              event.preventDefault();
              const searchLocation = event.target.searchLocation.value;
              const response = await fetch(
                `https://nominatim.openstreetmap.org/search/${searchLocation}?format=json&addressdetails=1&limit=1&polygon_svg=1`
              );
              const data = await response.json();
              debugger;
              updateZone({
                lng: parseFloat(data[0].lon, 10),
                lat: parseFloat(data[0].lat, 10),
              });
            };

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
                    Location{" "}
                    <form onSubmit={(e) => handleSubmitLocation(e)}>
                      <input
                        type="text"
                        placeholder="Search..."
                        name="searchLocation"
                      ></input>
                      <button type="submit">&#x1F50D;</button>
                    </form>
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
        </div>
      </div>
    </div>
  );

  return ReactDom.createPortal(children, modalWrapper);
};

export default CriteriaModal;
