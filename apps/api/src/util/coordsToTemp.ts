import axios from 'axios';

/**
 * Fetches current temp based upon a given longitude and latitude.
 *
 * Please see the docs for the API used
 * https://open-meteo.com/en/docs
 *
 * @param lat latitude
 * @param long longitude
 * @returns current temperature at location in Celsius
 */
export const coordsToTemp = async (
  lat: number,
  long: number
): Promise<number> => {
  const locationResult = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m&timezone=auto&forecast_days=1`
  );
  return locationResult.data.current.temperature_2m as number;
};
