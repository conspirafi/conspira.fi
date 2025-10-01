import axios, { type AxiosResponse } from "axios";

export const pmxApiClient = axios.create({
  baseURL: process.env.PMX_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.PMX_API_AUTHORIZATION}`,
    apiKey: process.env.PMX_API_KEY,
  },
});
export const pmxFeesApiClient = axios.create({
  baseURL: process.env.PMX_FEES_BASE_URL,
});
export const historicPricesApiClient = axios.create({
  baseURL: process.env.HISTORIC_PRICES_API_URL,
});
