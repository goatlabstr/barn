import {config} from "../constants/defaultJunoConfig";

export const getAllConfiguration = () => {
    const configs = sessionStorage.getItem("barn-configuration");
    if (configs != null)
        return JSON.parse(configs);
    else
        return config;
}

export const getConfig = (key) => {
    return getAllConfiguration()[key];
}