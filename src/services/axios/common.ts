import Axios from 'axios';

const getBarnConfigEndpoint = () => {
    const hostname = window.location.hostname;
    if (hostname.includes(".goatlabs.zone")) {
        const chainName = hostname.split(".goatlabs.zone")[0];
        return "https://raw.githubusercontent.com/goatlabstr/barn-chain-config/main/" + chainName + "/config.json"
    } else
        return "https://raw.githubusercontent.com/goatlabstr/barn-chain-config/main/juno/config.json"
}

const Common = {
    getConfig: () => Axios.get(getBarnConfigEndpoint()),
};

export default Common;