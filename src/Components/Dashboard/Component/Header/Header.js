import {FormControl, Grid, InputLabel, MenuItem, Select} from "@mui/material";
import React, {useEffect} from "react";
import moment from "moment";
import {useDispatch} from "react-redux";
import {setDuration} from '../../../../Store/slices/repoListSlice'
import style from "./Header.module.css";


const getPastDateValue = (count, unit) => {
    return moment().subtract(count, unit).format('YYYY-MM-DD');
};


function Header() {

    const [date,setDate] = React.useState(getPastDateValue(1,'weeks'));

    const dispatch = useDispatch();

    const handleSelectedDuration = (e) => {
        setDate(e.target.value);
        dispatch(setDuration(e.target.value))
    };

    useEffect(() => {
        dispatch(setDuration(getPastDateValue(1,'weeks')))
    },[]);

    return(
        <>
            <Grid container sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '20px 0 40px 0'
            }}>
                <Grid item className={`${style.headingBar}`}>
                    <h1>Most Starred Repos</h1>
                </Grid>
                <Grid item>
                    <div style={{display: "flex", justifyContent: "end"}}>
                        <FormControl sx={{width: '150px'}}>
                            <InputLabel id="demo-simple-select-label">Select</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={date}
                                label="Select"
                                onChange={handleSelectedDuration}
                                sx={{
                                    height: '45px'
                                }}
                            >
                                <MenuItem value={getPastDateValue(1,'weeks')}>Last Week</MenuItem>
                                <MenuItem value={getPastDateValue(3,'weeks')}>Last 3 Weeks</MenuItem>
                                <MenuItem value={getPastDateValue(1,'months')}>Last Month</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </Grid>
            </Grid>
        </>
    );
}

export default Header;