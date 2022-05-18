import { get, post, put, destroy } from "./axiosClient";

const URL_PREFIX = process.env.REACT_APP_REST_PREFIX;

const General = {
    getLang: () => get("/lang"),
    // remove: (id: number) => destroy(`https://localhost:8443/asset/rest/asset?id=${id}`),
};

export default General;
