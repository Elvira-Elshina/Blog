import { configureStore } from "@reduxjs/toolkit";
import articleSliceReducer from './blogAppSlice';
import authSliceReducer, { loginSliceReducer } from './authSlice';

export const store = configureStore({
    reducer: {
        articleSliceReducer: articleSliceReducer,
        authSliceReducer: authSliceReducer,
        loginSliceReducer: loginSliceReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
