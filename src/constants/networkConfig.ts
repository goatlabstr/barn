type NetworkConfig = {
    RPC_URL: string;
    REST_URL: string;
    CHAINS_URL: string;
    VALIDATORS_URL: string;
    EXPLORER_URL: string;
    STAKING_URL: string;
    DEFAULT_GAS: number;
    GAS_PRICE_STEP_LOW: number;
    GAS_PRICE_STEP_AVERAGE: number;
    GAS_PRICE_STEP_HIGH: number;
    FEATURES: any;
}

const getSubdomain = () => {
    let subdomain = window.location.hostname.split(".goatlabs.zone")[0];
    if (!window.location.hostname.includes(".goatlabs.zone"))
        subdomain = "evmos";
    return subdomain;
}

export const subdomain = getSubdomain();

export const config: NetworkConfig = {
    "RPC_URL": "https://rpc.cosmos.directory/" + subdomain,
    "REST_URL": "https://rest.cosmos.directory/" + subdomain,
    "CHAINS_URL": "https://chains.cosmos.directory/" + subdomain,
    "VALIDATORS_URL": "https://validators.cosmos.directory/chains/" + subdomain,
    "EXPLORER_URL": "https://www.mintscan.io/" + subdomain,
    "STAKING_URL": "https://" + subdomain + ".goatlabs.zone/stake",
    "DEFAULT_GAS": 200000,
    "GAS_PRICE_STEP_LOW": 0.02,
    "GAS_PRICE_STEP_AVERAGE": 0.03,
    "GAS_PRICE_STEP_HIGH": 0.04,
    "FEATURES": [
        "ibc-transfer",
        "cosmwasm",
        "ibc-go"
    ],
}