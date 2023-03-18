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

const getNetworkName = () => {
    let name = window.location.hostname.split(".goats.place")[0];
    if (name !== "wallet" && name !== "localhost") {
        window.location.href = "https://wallet.goats.place/" + name;
    } else {
        name = window.location.pathname.split("\/").filter(Boolean)[0];
        if (name === undefined)
            window.location.href = window.location.origin + "/chihuahua";
    }
    return name;
}

export const networkName = getNetworkName();

export const config: NetworkConfig = {
    "RPC_URL": "https://rpc.cosmos.directory/" + networkName,
    "REST_URL": "https://rest.cosmos.directory/" + networkName,
    "CHAINS_URL": "https://chains.cosmos.directory/" + networkName,
    "VALIDATORS_URL": "https://validators.cosmos.directory/chains/" + networkName,
    "EXPLORER_URL": "https://www.mintscan.io/" + networkName,
    "STAKING_URL": "https://wallet.goats.place/" + networkName + "/stake",
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