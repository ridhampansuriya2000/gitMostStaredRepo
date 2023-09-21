import React from "react";
import {
    Grid,
} from "@mui/material";
import InfiniteScroll from 'react-infinite-scroll-component';
import RepoCard from "../RepoCard/RepoCard";
import Loader from "../Loader/Loader";

function RepoList({repoList,fetchData,hasMore}){

    const [expanded, setExpanded] = React.useState(-1);

    const handleExpandClick = (index) => {
        if (index === expanded) {
            setExpanded(-1);
        } else {
            setExpanded(index);
        }
    };

    return(
        <>
            <InfiniteScroll
                dataLength={repoList?.length ?? 0}
                next={() => fetchData()}
                hasMore={hasMore}
                hasChildren
                style={{
                    overflow: 'hide',
                }}
                scrollableTarget="scrollableDiv"
                loader={<Loader/>}
            >
                {
                    repoList.map((item,index) => {
                        return(
                            <Grid container sx={{marginBottom: '30px'}}>
                                <Grid item xs={12}>
                                    <RepoCard
                                        cardData={item}
                                        index={index}
                                        expanded={expanded}
                                        handleExpandClick={handleExpandClick}/>
                                </Grid>
                            </Grid>
                        );
                    })
                }
            </InfiniteScroll>
        </>
    )
}

export default RepoList;