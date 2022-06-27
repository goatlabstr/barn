type DefaultJunoConfig = {
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

export const config: DefaultJunoConfig = {
    "RPC_URL": "https://rpc-juno-ia.notional.ventures",
    "REST_URL": "https://api-juno-ia.notional.ventures",
    "EXPLORER_URL": "https://www.mintscan.io/juno",
    "STAKING_URL": "https://juno.goatlabs.zone/stake",
    "NETWORK_NAME": "Juno",
    "NETWORK_TYPE": "mainnet",
    "CHAIN_ID": "juno-1",
    "CHAIN_NAME": "Juno",
    "COIN_DENOM": "JUNO",
    "COIN_MINIMAL_DENOM": "ujuno",
    "COIN_DECIMALS": 6,
    "PREFIX": "juno",
    "COIN_TYPE": 118,
    "COINGECKO_ID": "juno-network",
    "DEFAULT_GAS": 200000,
    "GAS_PRICE_STEP_LOW": 0.001,
    "GAS_PRICE_STEP_AVERAGE": 0.0025,
    "GAS_PRICE_STEP_HIGH": 0.004,
    "FEATURES": [
        "ibc-transfer",
        "cosmwasm",
        "ibc-go"
    ]
}