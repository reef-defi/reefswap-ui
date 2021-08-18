import axios, { AxiosResponse } from 'axios';

interface PriceRes {
  [currenty: string]: {
    usd: number;
  }
}

const coingeckoApi = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3/',
});

export const getTokenPrice = async (tokenId: string): Promise<number> => coingeckoApi
  .get<void, AxiosResponse<PriceRes>>(`/simple/price?ids=${tokenId}&vs_currencies=usd`)
  .then((res) => res.data[tokenId].usd);
