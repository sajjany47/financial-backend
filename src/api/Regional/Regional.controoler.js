import { StatusCodes } from "http-status-codes";
import { City, Country, State } from "./Regional.model.js";

export const country = async (req, res) => {
  try {
    const countryData = await Country.find({});
    console.log(countryData);
    return res.status(StatusCodes.OK).json({ data: countryData });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

export const state = async (req, res) => {
  try {
    const country = req.params.country;

    const stateData = await State.find({ country_id: country });

    return res.status(StatusCodes.OK).json({ data: stateData });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

export const city = async (req, res) => {
  try {
    const { country, state } = req.query;

    const cityData = await City.find({ country_id: country, state_id: state });

    return res.status(StatusCodes.OK).json({ data: cityData });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};
