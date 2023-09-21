import { combineReducers } from '@reduxjs/toolkit';
import repoListSlice from './repoListSlice'
import repoChartSlice from "./repoChartSlice";

const createReducer = (asyncReducers) => (state, action) => {
    const combinedReducer = combineReducers({
        repoList : repoListSlice,
        repoChart: repoChartSlice,
        ...asyncReducers,
    });
    return combinedReducer(state, action);
};

export default createReducer;