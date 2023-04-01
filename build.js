import { buildStationsFile } from "./index.js";
import yargs from "yargs/yargs";
import dbProfile from "hafas-client/p/db/index.js";
import oebbProfile from "hafas-client/p/oebb/index.js";

const argv = yargs(process.argv).argv;

switch (argv.profile) {
  case "db":
    buildStationsFile(dbProfile, "db", "DEU", "8011306");
  case "oebb":
    buildStationsFile(oebbProfile, "oebb", "AUS", "1291501");
  default:
    console.error(
      "Invalid profile, specify with --profile (e.g. --profile=db)"
    );
    process.exit(1);
}
