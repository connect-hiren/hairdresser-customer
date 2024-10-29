import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import createSensitiveStorage from "redux-persist-sensitive-storage";
import { persistReducer } from 'redux-persist';
import { createLogger } from 'redux-logger';

import RootReducer from './reducers';

const storage = createSensitiveStorage({
    keychainService: "myKeychain",
    sharedPreferencesName: "mySharedPrefs"
  });

const persistConfig = {
    key: 'root',
    storage: storage
};

const logger = createLogger({
    predicate: (getState, action) => false,
    collapsed: true,
    duration: true
});

const persistedReducer = persistReducer(persistConfig, RootReducer);

const middlewares = [ReduxThunk, logger];

const store = createStore(
    persistedReducer,
    {}, // default state of the application
    compose(applyMiddleware(...middlewares))
);

export default store;