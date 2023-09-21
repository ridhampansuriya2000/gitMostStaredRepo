import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";

export const getCommitActivityChartAPI = createAsyncThunk(
    'getCommitActivityChartAPI',
    ({url = null, params}, thunkAPI) => {
        return axios.get(`https://api.github.com/repos/${params.owner}/${params.repo}/stats/commit_activity`)
        .then(async (res)=>{
            let commitActivityChartData = await axios.get(`https://api.github.com/repos/${params.owner}/${params.repo}/stats/code_frequency`)
                .then(({data})=>{
                    let commitActivity = res.data;
                    let codeFrequency = data;
                    if (
                        Object.keys(commitActivity).length > 0 &&
                        Object.keys(codeFrequency).length > 0
                    ) {
                        return  commitActivity.map((item) => {
                            const match_code_freq = codeFrequency.find(
                                (arr) => arr[0] === item.week
                            );
                            let additions = match_code_freq ? match_code_freq[1] : 0;
                            let deletations = match_code_freq ? match_code_freq[2] : 0;

                            return {
                                week: item.week,
                                c: item.total,
                                a: additions,
                                d: deletations < 0 ? -1*deletations : deletations,
                            };
                        });
                    } else if (Object.keys(commitActivity).length > 0) {
                        return  commitActivity.map((item) => {
                            return {
                                week: item.week,
                                c: item.total,
                                a: 0,
                                d: 0,
                            };
                        });
                    } else {
                       return [];
                    };
                })
            return thunkAPI.fulfillWithValue({data : commitActivityChartData});
        })}
);

export const getContributorChartAPI = createAsyncThunk(
    'getContributorChartAPI',
    ({url = null, params}, thunkAPI) => {
        return axios.get(`https://api.github.com/repos/${params.owner}/${params.repo}/stats/contributors`)
            .then(({data})=>{
                return thunkAPI.fulfillWithValue({data});
            })}
);

export const repoListSlice = createSlice({
    name: 'counter',
    initialState: {
        totalChanges: [],
        contributorList: [],
        loader : false
    },
    reducers: {

    },
    extraReducers:{
        [getCommitActivityChartAPI.fulfilled] : (state,action) => {
            const data = action.payload;
            state.totalChanges = data?.data?.length ? data?.data : [];
            state.loader = false;
            return state
        },
        [getContributorChartAPI.fulfilled] : (state,action) => {
            const data = action.payload;
            state.contributorList = data?.data?.length ? data?.data : [];
            state.loader = false;
            return state
        }
    }
});


export default repoListSlice.reducer;