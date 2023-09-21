import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";

export const getRepoListAPI = createAsyncThunk(
    'getRepoListAPI',
    ({url = null, params}, thunkAPI) => {
        return axios.get(`https://api.github.com/search/repositories?q=created:>${params.duration}&sort=stars&order=desc&page=${params.page}`)
        .then(({data})=>{
            return thunkAPI.fulfillWithValue({...data, changeDuration : params?.changeDuration});
        })}
);

export const repoListSlice = createSlice({
    name: 'counter',
    initialState: {
        list : [],
        loader : false,
        duration: null,
    },
    reducers: {
        // submits all data(combined) into an array
        setDuration: (state, action) => {
            console.log("action",action);
            state.duration =  action.payload;
            return state;
        }
    },
    extraReducers:{
        [getRepoListAPI.pending] : (state,action) => {
            console.log("pending",action);
            state.loader = true;
            return state
        },
        [getRepoListAPI.fulfilled] : (state,action) => {
            const data = action.payload;
            state.list = data?.changeDuration ?  [...data.items] : [...state.list,...data.items];
            state.loader = false;
            return state
        }
    }
});

export const { setDuration } = repoListSlice.actions;

export default repoListSlice.reducer;