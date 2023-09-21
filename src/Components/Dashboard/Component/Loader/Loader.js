import React from "react";
import { Hourglass } from 'react-loader-spinner'

function Loader() {
    return(
        <>
            <div style={{textAlign: 'center', marginBottom: '20px'}}>
                <Hourglass
                    visible={true}
                    height="60"
                    width="60"
                    ariaLabel="hourglass-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    colors={['#000000', '#363636']}
                />
            </div>
        </>
    )
}

export default Loader;