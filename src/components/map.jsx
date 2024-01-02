import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';

function MainControlBox() {
  let options = []
  let open = false;
  let loading = true;

  return (
    <Box sx={{ minWidth: 120, paddingTop: '10px', paddingLeft: '10px', display: 'flex' }}>
      <Autocomplete
        id="asynchronous-demo"
        sx={{ width: 300 }}
        open={open}
        style={{ paddingRight: '5px' }}
        onOpen={() => {
          //setOpen(true);
        }}
        onClose={() => {
          //setOpen(false);
        }}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        getOptionLabel={(option) => option.title}
        options={options}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Asynchronous"
            size="small"
            style={{ backgroundColor: 'white' }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
      <FormControl style={{ width: '40%', paddingRight: '5px' }} size="small">
        <InputLabel id="select-label">stops</InputLabel>
        <Select
          labelId="select-stop-label"
          id="select"
          label="stops"
          style={{ backgroundColor: 'white' }}
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
          <MainControlBox/>
          <Marker position={center} />
        </GoogleMap>
        {/**/}
      </div>
    </>
  );
};
