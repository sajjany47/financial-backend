import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  iso3: { type: String, required: true },
  iso2: { type: String, required: true },
  numeric_code: { type: Number, required: true },
  phone_code: { type: Number, required: true },
  capital: { type: String, required: true },
  currency: { type: String, required: true },
  currency_name: { type: String, required: true },
  currency_symbol: { type: String, required: true },
  tld: { type: String, required: true },
  native: { type: String, required: true },
  region: { type: String, required: true },
  region_id: { type: Number, required: true },
  subregion: { type: String, required: true },
  subregion_id: { type: Number, required: true },
  nationality: { type: String, required: true },
  timezones: { type: String, required: true }, // Stored as a JSON string in this case
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  emoji: { type: String, required: true },
  emojiU: { type: String, required: true },
});

// Create the Country model
const Country = mongoose.model("country", countrySchema);

// Define the State schema
const stateSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  country_id: { type: Number, required: true },
  country_code: { type: String, required: true },
  country_name: { type: String, required: true },
  state_code: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

// Create the State model
const State = mongoose.model("state", stateSchema);

// Define the City schema
const citySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  state_id: { type: Number, required: true },
  state_code: { type: String, required: true },
  state_name: { type: String, required: true },
  country_id: { type: Number, required: true },
  country_code: { type: String, required: true },
  country_name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  wikiDataId: { type: String, required: true }, // Wikidata ID for additional reference
});

// Create the City model
const City = mongoose.model("city", citySchema);

export { Country, State, City };
