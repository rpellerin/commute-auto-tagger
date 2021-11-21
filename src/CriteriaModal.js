import ReactDom from "react-dom";
import { useEffect, useRef } from "react";
import "./CriteriaModal.css";
import { Fragment } from "react";
import ZoneSelector from "./ZoneSelector";
import { v4 as uuidv4 } from "uuid";

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

export const defaultZone = {
  lat: 52.5175672,
  lng: 13.3981842,
  radius: 250,
};

const CriteriaModal = ({
  onClose,
  zones,
  setZones,
  checkedDays,
  setCheckedDays,
}) => {
  const backdrop = useRef();
  const addZone = () => {
    setZones((oldZones) => [
      ...oldZones,
      { ...(oldZones[0] || defaultZone), uuid: uuidv4() },
    ]);
  };
  const removeZone = (index) => {
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
  }, [onClose]);

  useEffect(() => {
    window.localStorage.setItem(
      "zones",
      JSON.stringify(zones.map(({ uuid, ...zone }) => zone))
    );
  }, [zones]);

  useEffect(() => {
    window.localStorage.setItem("checkedDays", JSON.stringify(checkedDays));
  }, [checkedDays]);

  const children = (
    <div id="modal-backdrop" ref={backdrop}>
      <div className="modal-wrapper-height">
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
            {zones.map((zone, index) => (
              <ZoneSelector
                key={zone.uuid}
                zone={zone}
                index={index}
                removeZone={() => removeZone(index)}
                updateZone={(zone) => {
                  setZones((zones) =>
                    zones.map((oldZone, i) =>
                      i === index ? { ...oldZone, ...zone } : oldZone
                    )
                  );
                }}
              />
            ))}
            <button onClick={addZone}>Add a zone</button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDom.createPortal(children, modalWrapper);
};

export default CriteriaModal;
