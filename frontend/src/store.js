import { createStore, combineReducers, applyMiddleware  } from 'redux';
import thunk from 'redux-thunk';

import {reducer, authReducer, managerReducer} from './reducers';

const rootReducer = combineReducers({
    auth: authReducer,
    signUp: reducer,
    managerReducer: managerReducer
    // add other reducers here
});
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
