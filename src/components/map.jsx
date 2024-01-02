import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function BasicSelect() {

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl style={{ width: '20%', backgroundColor: 'white' }}>
        <InputLabel id="select-label">stops</InputLabel>
        <Select
          labelId="select-stop-label"
          id="select"
          label="stops"
        >
          <MenuItem>Start 🏃🏽‍♂️🎬</MenuItem>
          <MenuItem>Midway 🍔</MenuItem>
          <MenuItem>Finish 🏡</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}



const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};
const center = {
  lat: 7.2905715, // default latitude
  lng: 80.6337262, // default longitude
};


export default function Map (props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB4L45EgWGU3NK2KyYr7orRvxLrEFsoFRo',
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <>
      <div style={{ width:'100%', backgroundColor: 'green' }}>
        {/**/}
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={10}
          center={center}
          options={{streetViewControl: false, fullscreenControl: false, mapTypeControl: false}}
        >
          <div style= {{ paddingTop: '10px' }}></div> 
          <BasicSelect style={{ width: '20%', backgroundColor: 'blue' }}/>
          <Marker position={center} />
        </GoogleMap>
        {/**/}
      </div>
    </>
  );
};
