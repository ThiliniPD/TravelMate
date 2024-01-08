import * as React from 'react';
import MapComponent from "../components/Map";
import Itinerary from "../components/itinerary";
import { SelectedLocationProvider } from "../context/SelectedLocationContext";
import { ItineraryProvider } from "../context/ItineraryContext";
import { Grid } from '@mui/material';
import { Box } from '@mui/material';

export default function Itinerarypage() {
  return (
    <div className="">
      <ItineraryProvider>
        <SelectedLocationProvider>
          <Box sx={{ height: 1, padding: 0, backgroundColor:"#78a383"}}>
              <Grid container spacing={0}>
                <Grid xs={12} sm={7} md={7} lg={8} xl={8}>
                  <MapComponent />
                </Grid>
                <Grid xs={12} sm={5} md={5} lg={4} xl={4}>
                  <Itinerary/>
                </Grid>
              </Grid>
          </Box>
        </SelectedLocationProvider>
      </ItineraryProvider>
    </div>
  ) 
}