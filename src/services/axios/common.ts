import Axios from 'axios';
import {config} from "../../constants/networkConfig";

const getConfigEnvMode = () => {
    const host = window.location.host;
    if (host.startsWith("localhost") ||
        host.startsWith("192.168") ||
        host.startsWith("127.0.0.1") ||
        host.startsWith("development"))
        return "development";
    else
        return "main";
}

const Common = {
    getChainsInfo: () => Axios.get(config.CHAINS_URL),
    getValidatorsInfo: () => Axios.get(config.VALIDATORS_URL),
    getAllChainsInfo: () => Axios.get("https://chains.cosmos.directory"),
    getSupportedNetworks: () => Axios.get("https://raw.githubusercontent.com/goatlabstr/barn-chain-config/" + getConfigEnvMode() + "/networks.json")
};

export default Common;