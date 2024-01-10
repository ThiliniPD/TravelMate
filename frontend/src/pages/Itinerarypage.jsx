import * as React from 'react';
import MapComponent from "../components/MapComponent";
import Itinerary from "../components/Itinerary";
import { SelectedLocationProvider } from "../context/SelectedLocationContext";
import { ItineraryProvider } from "../context/ItineraryContext";
import { Grid } from '@mui/material';
import { Box } from '@mui/material';

export default function Itinerarypage() {
  return (
    <div className="">      
      <SelectedLocationProvider>
        <Box sx={{ height: 1, padding: 0, backgroundColor:"#78a383"}}>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={7} md={7} lg={8} xl={8}>
                <MapComponent />
              </Grid>
              <Grid item xs={12} sm={5} md={5} lg={4} xl={4}>
                <Itinerary/>
              </Grid>
            </Grid>
        </Box>
      </SelectedLocationProvider>
    </div>
  ) 
}