import Axios from 'axios';
import {config} from "../../constants/networkConfig";

const Common = {
    getChainsInfo: () => Axios.get(config.CHAINS_URL),
    getValidatorsInfo: () => Axios.get(config.VALIDATORS_URL),
    getAllChainsInfo: () => Axios.get("https://chains.cosmos.directory"),
    getSupportedNetworks: () => Axios.get("https://raw.githubusercontent.com/goatlabstr/barn-chain-config/main/networks.json")
};

export default Common;