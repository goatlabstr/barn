import {
    CLAIM_REWARDS_VALIDATOR_SET,
    DELEGATED_VALIDATORS_FETCH_ERROR,
    DELEGATED_VALIDATORS_FETCH_IN_PROGRESS,
    DELEGATED_VALIDATORS_FETCH_SUCCESS,
    TOKENS_SET,
    VALIDATOR_FETCH_ERROR,
    VALIDATOR_FETCH_IN_PROGRESS,
    VALIDATOR_FETCH_SUCCESS,
    VALIDATOR_IMAGE_FETCH_ERROR,
    VALIDATOR_IMAGE_FETCH_IN_PROGRESS,
    VALIDATOR_IMAGE_FETCH_SUCCESS,
    VALIDATORS_FETCH_ERROR,
    VALIDATORS_FETCH_IN_PROGRESS,
    VALIDATORS_FETCH_SUCCESS,
} from './types/stake';
import Axios from 'axios';
import { getDelegatedValidatorsURL, getValidatorURL, validatorImageURL, VALIDATORS_LIST_URL } from '../constants/endpoints';
import {getConfig} from "../services/network-config";

const fetchValidatorsInProgress = () => {
    return {
        type: VALIDATORS_FETCH_IN_PROGRESS,
    };
};

const fetchValidatorsSuccess = (list) => {
    return {
        type: VALIDATORS_FETCH_SUCCESS,
        list,
    };
};

const fetchValidatorsError = (message) => {
    return {
        type: VALIDATORS_FETCH_ERROR,
        message,
    };
};

export const getValidators = (cb) => (dispatch) => {
    dispatch(fetchValidatorsInProgress());
    Axios.get(VALIDATORS_LIST_URL(), {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchValidatorsSuccess(res.data && res.data.result));
            cb(res.data && res.data.result);
        })
        .catch((error) => {
            dispatch(fetchValidatorsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

export const setTokens = (value) => {
    return {
        type: TOKENS_SET,
        value,
    };
};

const fetchValidatorInProgress = () => {
    return {
        type: VALIDATOR_FETCH_IN_PROGRESS,
    };
};

const fetchValidatorSuccess = (value) => {
    return {
        type: VALIDATOR_FETCH_SUCCESS,
        value,
    };
};

const fetchValidatorError = (message) => {
    return {
        type: VALIDATOR_FETCH_ERROR,
        message,
    };
};

export const getValidatorDetails = (address, cb) => (dispatch) => {
    dispatch(fetchValidatorInProgress());
    const URL = getValidatorURL(address);
    Axios.get(URL, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchValidatorSuccess(res.data && res.data.result));
            cb(res.data && res.data.result);
        })
        .catch((error) => {
            dispatch(fetchValidatorError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

const fetchDelegatedValidatorsInProgress = () => {
    return {
        type: DELEGATED_VALIDATORS_FETCH_IN_PROGRESS,
    };
};

const fetchDelegatedValidatorsSuccess = (list) => {
    return {
        type: DELEGATED_VALIDATORS_FETCH_SUCCESS,
        list,
    };
};

const fetchDelegatedValidatorsError = (message) => {
    return {
        type: DELEGATED_VALIDATORS_FETCH_ERROR,
        message,
    };
};

export const getDelegatedValidatorsDetails = (address) => (dispatch) => {
    dispatch(fetchDelegatedValidatorsInProgress());
    const URL = getDelegatedValidatorsURL(address);
    Axios.get(URL, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchDelegatedValidatorsSuccess(res.data && res.data.result));
        })
        .catch((error) => {
            dispatch(fetchDelegatedValidatorsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

export const setClaimRewardsValidator = (value) => {
    return {
        type: CLAIM_REWARDS_VALIDATOR_SET,
        value,
    };
};

const fetchValidatorImageInProgress = () => {
    return {
        type: VALIDATOR_IMAGE_FETCH_IN_PROGRESS,
    };
};

export const fetchValidatorImageSuccess = (value) => {
    return {
        type: VALIDATOR_IMAGE_FETCH_SUCCESS,
        value,
    };
};

const fetchValidatorImageError = (message) => {
    return {
        type: VALIDATOR_IMAGE_FETCH_ERROR,
        message,
    };
};

export const fetchValidatorImage = (id) => (dispatch) => {
    dispatch(fetchValidatorImageInProgress());
    const URL = validatorImageURL(id);
    return Axios.get(URL, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            let obj = sessionStorage.getItem(`${getConfig("PREFIX")}_images`) || '{}';
            obj = obj && JSON.parse(obj);
            //@ts-ignore
            obj[id] = res.data;
            obj = obj && JSON.stringify(obj);
            sessionStorage.setItem(`${getConfig("PREFIX")}_images`, obj);
            dispatch(fetchValidatorImageSuccess({
                ...res.data,
                _id: id,
            }));
        })
        .catch((error) => {
            dispatch(fetchValidatorImageError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};
