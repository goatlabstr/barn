import { get } from "./axiosClient";

const General = {
    getLang: () => get("/lang")
};

export default General;
