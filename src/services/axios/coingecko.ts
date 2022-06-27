import Axios from 'axios';

const SIMPLE_PRICE_ENDPOINT = "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids="

const CoinGecko = {
    getPrice: (name) => Axios.get(SIMPLE_PRICE_ENDPOINT + name),
};

export default CoinGecko;