type NetworkConfig = {
    RPC_URL: string;
    REST_URL: string;
    EXPLORER_URL: string;
    STAKING_URL: string;
    NETWORK_NAME: string;
    NETWORK_TYPE: string;
    CHAIN_ID: string;
    CHAIN_NAME: string;
    COIN_DENOM: string;
    COIN_MINIMAL_DENOM: string;
    COIN_DECIMALS: number;
    PREFIX: string;
    COIN_TYPE: number;
    COINGECKO_ID: string;
    DEFAULT_GAS: number;
    GAS_PRICE_STEP_LOW: number;
    GAS_PRICE_STEP_AVERAGE: number;
    GAS_PRICE_STEP_HIGH: number;
    FEATURES: any;

}
const coinDecimal = process.env.REACT_APP_COIN_DECIMALS ? process.env.REACT_APP_COIN_DECIMALS : "6";
const coinType = process.env.REACT_APP_COIN_TYPE ? process.env.REACT_APP_COIN_TYPE : "118";
const defaultGas = process.env.REACT_APP_DEFAULT_GAS ? process.env.REACT_APP_DEFAULT_GAS : "300000";
const gasPriceStepLow = process.env.REACT_APP_GAS_PRICE_STEP_LOW ? process.env.REACT_APP_GAS_PRICE_STEP_LOW : "0.001";
const gasPriceStepAvg = process.env.REACT_APP_GAS_PRICE_STEP_AVERAGE ? process.env.REACT_APP_GAS_PRICE_STEP_AVERAGE : "0.0025";
const gasPriceStepHigh = process.env.REACT_APP_GAS_PRICE_STEP_HIGH ? process.env.REACT_APP_GAS_PRICE_STEP_HIGH : "0.004";

export const config : NetworkConfig = {
    RPC_URL: process.env.REACT_APP_RPC_URL ? process.env.REACT_APP_RPC_URL : "",
    REST_URL: process.env.REACT_APP_REST_URL ? process.env.REACT_APP_REST_URL: "",
    EXPLORER_URL: process.env.REACT_APP_EXPLORER_URL ? process.env.REACT_APP_EXPLORER_URL : "",
    STAKING_URL:  process.env.REACT_APP_STAKING_URL ? process.env.REACT_APP_STAKING_URL : "",
    NETWORK_NAME: process.env.REACT_APP_NETWORK_NAME ? process.env.REACT_APP_NETWORK_NAME : "",
    NETWORK_TYPE: process.env.REACT_APP_NETWORK_TYPE ? process.env.REACT_APP_NETWORK_TYPE : "",
    CHAIN_ID: process.env.REACT_APP_CHAIN_ID ? process.env.REACT_APP_CHAIN_ID : "",
    CHAIN_NAME: process.env.REACT_APP_CHAIN_NAME ? process.env.REACT_APP_CHAIN_NAME : "",
    COIN_DENOM: process.env.REACT_APP_COIN_DENOM ? process.env.REACT_APP_COIN_DENOM : "",
    COIN_MINIMAL_DENOM: process.env.REACT_APP_COIN_MINIMAL_DENOM ? process.env.REACT_APP_COIN_MINIMAL_DENOM : "",
    COIN_DECIMALS: parseInt(coinDecimal),
    PREFIX: process.env.REACT_APP_PREFIX ? process.env.REACT_APP_PREFIX : "",
    COIN_TYPE: parseInt(coinType),
    COINGECKO_ID: process.env.REACT_APP_COINGECKO_ID ? process.env.REACT_APP_COINGECKO_ID : "",
    DEFAULT_GAS: parseInt(defaultGas),
    GAS_PRICE_STEP_LOW: parseFloat(gasPriceStepLow),
    GAS_PRICE_STEP_AVERAGE: parseFloat(gasPriceStepAvg),
    GAS_PRICE_STEP_HIGH: parseFloat(gasPriceStepHigh),
    FEATURES: ['ibc-transfer', 'cosmwasm', 'ibc-go'],
};