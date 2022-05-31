import { combineReducers } from 'redux';
import accounts from './account';
import stake from './stake';
import governance from './governance';

const reduxObjects = combineReducers({
    accounts,
    stake,
    governance
});

const rootReducer = (state, action) => {
    return reduxObjects(state, action);
};

export default rootReducer;
