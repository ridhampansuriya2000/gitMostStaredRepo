import React from "react";
import style from "../RepoList/RepoList.module.css";
import moment from "moment";
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Collapse,
    IconButton,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box
} from "@mui/material";
import {styled} from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BugReportIcon from '@mui/icons-material/BugReport';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {useDispatch, useSelector} from "react-redux";
import {getContributorChartAPI, getCommitActivityChartAPI} from "../../../../Store/slices/repoChartSlice";


const ExpandMore = styled((props) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function RepoCard({cardData, index, expanded, handleExpandClick}) {

    const [gitAction, setGitAction] = React.useState("c");
    const dispatch = useDispatch();
    const {totalChangesChart, contributorChart} = useSelector((state) => ({
        totalChangesChart: state?.root?.repoChart?.totalChanges,
        contributorChart: state?.root?.repoChart?.contributorList
    }));

    const handleGitAction = (event) => {
        setGitAction(event.target.value);
    };

    const fetchChartData = async (owner, repo) => {
        await dispatch(getCommitActivityChartAPI({params: {owner: owner, repo: repo}}));
        await dispatch(getContributorChartAPI({params: {owner: owner, repo: repo}}));
    };

    const commitsDatesArray = totalChangesChart?.map(item => {
        const timestamp = item.week;
        const date = new Date(timestamp * 1000);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}-${month}-${year}`;
    });


    const [totalChanges, setTotalChanges] = React.useState({
        title: {
            text: 'Total Changes'
        },
        yAxis: {
            title: {
                text: 'Total Changes'
            }
        },
        xAxis: {
            categories: commitsDatesArray
        },
        series: [],
    });

    const [contributorsChanges, setContributorsChanges] = React.useState({
        title: {
            text: 'Contributors Changes'
        },
        yAxis: {
            title: {
                text: 'Total Changes'
            }
        },
        xAxis: {
            categories: commitsDatesArray
        },
        series: [],
    });

    React.useEffect(() => {
        let arr = contributorChart.length && contributorChart.map((item) => {
            return {
                name: item.author.login,
                data: item.weeks.map((elm) => elm[gitAction]),
            }
        });
        setContributorsChanges((preState) => ({
            ...preState,
            series: arr
        }))
    }, [contributorChart.length, gitAction, expanded]);

    React.useEffect(() => {
        let series = totalChangesChart.length && [{
            name: "Changes",
            data: totalChangesChart.map((item) => item[gitAction])
        }];
        setTotalChanges((preState) => ({
            ...preState,
            series: series || []
        }))
    }, [totalChangesChart.length, gitAction, expanded]);

    return (
        <div>
            <Card sx={{
                padding: '20px',
                boxShadow: 'none',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '10px'
            }}
            >
                <div style={{display: 'flex'}} className={`${style.cardMain}`}>
                    <CardMedia
                        component="img"
                        image={cardData?.owner?.avatar_url}
                        alt="Paella dish"
                        sx={{
                            width: '200px',
                            height: '200px',
                            borderRadius: '10px'
                        }}
                    />
                    <div className={`${style.cardContent}`}>
                        <CardContent>
                            <h2>{cardData?.name}</h2>
                            <Typography variant="body1">
                                {cardData?.description}
                            </Typography>
                            <div className={`${style.dummyBtns}`}>
                                                            <span>
                                                                <StarIcon sx={{
                                                                    fontSize: '18px',
                                                                    marginRight: '5px',
                                                                    marginBottom: '-2.5px'
                                                                }}
                                                                />
                                                                {cardData?.stargazers_count}
                                                            </span>
                                <span>
                                                                <BugReportIcon sx={{
                                                                    fontSize: '18px',
                                                                    marginRight: '5px',
                                                                    marginBottom: '-2.5px'
                                                                }}
                                                                />
                                    {cardData?.open_issues_count}
                                                            </span>
                            </div>
                        </CardContent>
                        <div>
                            <CardContent sx={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0 0 0 16px!important',
                                marginTop: '5px'
                            }}
                            >
                                <Typography variant="body2" sx={{color: 'rgba(0, 0, 0, 0.6)'}}>
                                    Last pushed
                                    at {moment(cardData.pushed_at).format("MMMM Do, YYYY")} by {cardData.name}
                                </Typography>

                                <CardActions disableSpacing>
                                    <ExpandMore
                                        expand={index === expanded}
                                        onClick={() => {
                                            (index !== expanded)  && fetchChartData(cardData?.owner?.login, cardData?.name);
                                            handleExpandClick(index);
                                        }}
                                        aria-expanded={index === expanded}
                                        aria-label="show more"
                                    >
                                        <ExpandMoreIcon/>
                                    </ExpandMore>
                                </CardActions>
                            </CardContent>
                        </div>
                    </div>
                </div>
                <Collapse in={index === expanded} timeout="auto" unmountOnExit>
                    <CardContent sx={{
                        marginTop: '20px',
                        padding: '16px 0 16px 0!important'
                    }}>
                        <div style={{display: "flex", justifyContent: "end"}}>
                            <FormControl sx={{width: '150px'}}>
                                <InputLabel id="demo-simple-select-label">Select</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={gitAction}
                                    label="Select"
                                    onChange={handleGitAction}
                                    sx={{
                                        height: '45px',
                                        marginBottom: '20px'
                                    }}
                                >
                                    <MenuItem value={'c'}>Commits</MenuItem>
                                    <MenuItem value={'a'}>Additions</MenuItem>
                                    <MenuItem value={'d'}>Deletations</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <Box sx={{
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            marginBottom: '30px'
                        }}>
                            {
                                totalChanges.series.length ?
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={totalChanges}
                                    /> :
                                    <h2> No Data Available</h2>
                            }
                        </Box>
                        <Box sx={{
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: '10px',
                            overflow: 'hidden',
                        }}>
                            {
                            contributorsChanges.series.length ?
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={contributorsChanges}
                                /> :
                                <h2> No Data Available</h2>
                        }
                        </Box>
                    </CardContent>
                </Collapse>
            </Card>
        </div>
    )
};

export default RepoCard;