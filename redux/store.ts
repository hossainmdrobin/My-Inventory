import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, PersistConfig, persistStore } from "redux-persist";
import apiSlice from "./api/apiSlice";

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer
})
const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ["accounts"]
}

const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(apiSlice.middleware),
        devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store)