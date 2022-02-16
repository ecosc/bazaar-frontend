import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple'
import ProfileReducer, { initialState as profileInitialState } from './profile';
import OrderReducer from './order';
import cloneDeep from 'lodash/cloneDeep'

const PERSISTED_KEYS = [];

export default configureStore({
    devTools: process.env.NODE_ENV !== 'production',
    reducer: {
        profile: ProfileReducer,
        order: OrderReducer,
    },
    // middleware: [...getDefaultMiddleware({ thunk: true }), save({ states: PERSISTED_KEYS })],
    middleware: [...getDefaultMiddleware({ thunk: true, serializableCheck: false })],
    // preloadedState: load({
    //     states: PERSISTED_KEYS,
    //     disableWarnings: true,
    //     preloadedState: {
    //         profile: cloneDeep(profileInitialState),
    //     },
    // }),
});
