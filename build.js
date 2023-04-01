import { buildStationsFile } from "./index.js";
import yargs from "yargs/yargs";
import dbProfile from "hafas-client/p/db/index.js";
import oebbProfile from "hafas-client/p/oebb/index.js";

buildStationsFile(dbProfile, "db", "DEU", "8011306");
