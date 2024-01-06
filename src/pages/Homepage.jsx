import * as React from 'react';
import Card from '@mui/material/Card';
//import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import { Container, Grid } from "@mui/material";


export default function Homepage() {
    return(
        <Container className='home-main'>
         <div className="home-main-header">
            <div className="background-image"></div>
            <div className="text-overlay">
                <h1 className='home-main-heading'>Travelling together</h1>
                <p className='home-main-para'>Planning a trip was never better ...</p>
            </div>
         </div>
       </Container>
    )

}