import Axios from 'axios';
import {config} from "../../constants/networkConfig";

const Common = {
    getChainsInfo: () => Axios.get(config.CHAINS_URL),
    getValidatorsInfo: () => Axios.get(config.VALIDATORS_URL)
};

export default Common;