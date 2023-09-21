import React from "react";
import {Container} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import Header from "./Component/Header/Header";
import RepoList from "./Component/RepoList/RepoList";
import Loader from "./Component/Loader/Loader";
import {getRepoListAPI} from "../../Store/slices/repoListSlice";

function Dashboard(){

    const dispatch = useDispatch();
    const {repoList, loader, duration} = useSelector((state)=>({
        repoList : state.root.repoList.list,
        loader: state.root.repoList.loader,
        duration : state.root.repoList.duration,
    }));

    const [hasMore, setHasMore] = React.useState(true);
    const [pageNum, setPageNum] = React.useState(1);
    const [gitRepoList, setGitRepoList] = React.useState([]);

    const fetchData = () => {
        setPageNum((preState)=> preState + 1);
        dispatch(getRepoListAPI({params: {page: pageNum, duration: duration, changeDuration : false}}));
    };

    React.useEffect(()=>{
        setGitRepoList([]);
        duration && dispatch(getRepoListAPI({params: {page: pageNum, duration: duration, changeDuration : true}}));
    },[duration]);

    React.useEffect(()=>{
        setGitRepoList(()=>[...repoList]);
    },[repoList.length,JSON.stringify(repoList)]);


    return(
        <>
            <section>
                <Container>
                    <Header/>
                    {
                        !(loader && !gitRepoList.length) ?
                            <RepoList
                                repoList={gitRepoList}
                                fetchData={fetchData}
                                hasMore={hasMore}
                            />
                            :
                            <Loader/>
                    }
                </Container>
            </section>
        </>
    );
}

export default Dashboard;