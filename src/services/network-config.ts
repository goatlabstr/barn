export const getAllConfiguration = () => {
    const configs = sessionStorage.getItem(
        window.location.hostname.split(".goatlabs.zone")[0] + "-barn-configuration"
    );
    if (configs != null)
        return JSON.parse(configs);
    else
        return {};
}

export const getConfig = (key) => {
    return getAllConfiguration()[key];
}