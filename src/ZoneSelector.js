import { useState } from "react";
import ZoneLeafletMap from "./ZoneLeafletMap";

const ZoneSelector = ({ zone, index, updateZone, removeZone }) => {
  const { lat, lng, radius } = zone;

  const [place, setPlace] = useState("");

  const handleSubmitLocation = async (event) => {
    event.preventDefault();
    const searchLocation = event.target.searchLocation.value;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search/${searchLocation}?format=json&addressdetails=1&limit=1&polygon_svg=1`
    );
    const data = await response.json();
    updateZone({
      lng: parseFloat(data[0].lon, 10),
      lat: parseFloat(data[0].lat, 10),
    });
    setPlace(searchLocation);
  };

  return (
    <div className="criteria-modal-zone">
      <div>
        <h2 className="text-center">Create a zone - zone {index}</h2>
        <p>Type here the latitude and longitude, or click on the map</p>
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

        {<button onClick={removeZone}>Remove zone</button>}
      </div>
      <ZoneLeafletMap zone={zone} place={place} updateZone={updateZone} />
    </div>
  );
};

export default ZoneSelector;
