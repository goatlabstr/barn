import { combineReducers } from 'redux';
import {
    CLAIM_REWARDS_VALIDATOR_SET,
    DELEGATED_VALIDATORS_FETCH_ERROR,
    DELEGATED_VALIDATORS_FETCH_IN_PROGRESS,
    DELEGATED_VALIDATORS_FETCH_SUCCESS,
    TOKENS_SET,
    VALIDATOR_FETCH_ERROR,
    VALIDATOR_FETCH_IN_PROGRESS,
    VALIDATOR_FETCH_SUCCESS,
    VALIDATOR_IMAGE_FETCH_SUCCESS,
} from '../action/types/stake';
import { DISCONNECT_SET } from '../action/types/account';

const validators = (state = {
    inProgress: false,
    list: [],
    images: [],
}, action) => {
    switch (action.type) {
        case VALIDATOR_IMAGE_FETCH_SUCCESS: {
            const array = [...state.images];
            //@ts-ignore
            if (action.value && array.indexOf(action.value) === -1) {
                //@ts-ignore
                array.push(action.value);
            }

            return {
                ...state,
                images: [...array],
            };
        }
        default:
            return state;
    }
};

const tokens = (state = null, action) => {
    switch (action.type) {
        case TOKENS_SET:
            return action.value;
        default:
            return state;
    }
};

const validatorDetails = (state = {
    inProgress: false,
    value: '',
}, action) => {
    switch (action.type) {
        case VALIDATOR_FETCH_IN_PROGRESS:
            return {
                ...state,
                inProgress: true,
            };
        case VALIDATOR_FETCH_SUCCESS:
            return {
                inProgress: false,
                value: action.value,
            };
        case VALIDATOR_FETCH_ERROR:
            return {
                ...state,
                inProgress: false,
            };
        default:
            return state;
    }
};

const delegatedValidators = (state = {
    inProgress: false,
    list: [],
}, action) => {
    switch (action.type) {
        case DELEGATED_VALIDATORS_FETCH_IN_PROGRESS:
            return {
                ...state,
                inProgress: true,
            };
        case DELEGATED_VALIDATORS_FETCH_SUCCESS:
            return {
                ...state,
                list: action.list,
            };
        case DELEGATED_VALIDATORS_FETCH_ERROR:
            return {
                ...state,
                inProgress: false,
            };
        case DISCONNECT_SET:
            return {
                ...state,
                list: [],
            };
        default:
            return state;
    }
};

const claimDialog = (state = {
    open: false,
    validator: 'none',
}, action) => {
    switch (action.type) {
        case CLAIM_REWARDS_VALIDATOR_SET:
            return {
                ...state,
                validator: action.value,
            };
        default:
            return state;
    }
};

export default combineReducers({
    tokens,
    validators,
    validatorDetails,
    delegatedValidators,
    claimDialog,
});
