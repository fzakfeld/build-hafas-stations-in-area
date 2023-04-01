import createWalk from "hafas-discover-stations";
import createClient from "hafas-client";
import * as turf from "@turf/turf";
import geoCountriesCoastline from "@geo-maps/countries-coastline-500m/map.geo.json" assert { type: "json" };
import fs from "fs";

const clientName = "testing";

export function buildStationsFile(profile, name, countrycode, entrypoint) {
  console.log("Building Stations...");

  fs.writeFileSync(`stations/${name}.ndjson`, "");

  const client = createClient(profile, clientName);
  const walk = createWalk(client);

  const collection = turf.featureCollection(geoCountriesCoastline).features;
  const feature = collection.features.find(
    (f) => f.properties["A3"] === countrycode
  );
  const multiPolygon = turf.multiPolygon(feature.geometry.coordinates);

  walk(entrypoint)
    .on("data", (data) => {
      if (
        inInsideCountry(
          multiPolygon,
          data.location.latitude,
          data.location.longitude
        )
      ) {
        fs.appendFileSync(
          `stations/${name}.ndjson`,
          JSON.stringify({
            id: data.id,
            name: data.name,
            location: data.location,
            weight: getWeight(data.products),
          }) + "\n"
        );
      }
    })
    .on("error", console.error);
}

function inInsideCountry(multiPolygon, latitude, longitude) {
  const point = turf.point([longitude, latitude]);

  let inside = false;

  multiPolygon.geometry.coordinates.forEach((coordinates) => {
    const polygon = turf.polygon(coordinates);
    if (turf.booleanPointInPolygon(point, polygon)) {
      inside = true;
      return;
    }
  });

  return inside;
}

function getWeight(products) {
  let total = 0;
  let available = 0;

  for (const [_, isAvailable] of Object.entries(products)) {
    total++;
    if (isAvailable) available++;
  }

  return (available / total) * 100;
}
