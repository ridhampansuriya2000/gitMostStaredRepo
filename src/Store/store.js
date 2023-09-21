import { configureStore } from '@reduxjs/toolkit';
import createReducer from "./slices";

export default configureStore({
    reducer: {
        root: createReducer(),
    },
});