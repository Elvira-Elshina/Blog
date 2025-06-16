import { configureStore } from "@reduxjs/toolkit";
import articleSliceReducer from './blogAppSlice';

export const store = configureStore({
    reducer: {
        articleSliceReducer: articleSliceReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
