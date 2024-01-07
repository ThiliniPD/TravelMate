import Map from "../components/Map"; 
import Itinerary from "../components/itinerary";
import * as React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';

export default function Itinerarypage() {

  return (
    <div className="">
      <Box sx={{ height: 1, padding: 0, backgroundColor:"#78a383"}}>
          <Grid container spacing={0}>
            <Grid xs={12} sm={7} md={7} lg={8} xl={8}>
              <Map />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={4} xl={4}>
              <Itinerary/>
            </Grid>
          </Grid>
      </Box>
    </div>
  ) 
}