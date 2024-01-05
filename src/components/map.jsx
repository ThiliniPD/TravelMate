import * as React from 'react';
import { Autocomplete, CircularProgress, Grid, Stack } from '@mui/material';
import { TextField, Typography, debounce } from '@mui/material';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Box from '@mui/material/Box'; // keep this import at last as a workaround for MUI issue

const LIBRARIES = ['places'];
const PLACE_DETAILS = ["icon", "icon_background_color", "geometry.location", "geometry.viewport"];

function MainControlBox({ center, sessionToken, onPlaceChanged }) {
  const [options, setOptionsInternal] = React.useState([]);
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const autocomplete = React.useRef(null);

  // Debouncer method to throtel the request rate
  const debouncedFetch = React.useMemo(
    () =>
      debounce((request, callback) => {
        autocomplete.current.getPlacePredictions(request, callback);
      }, 400),
    [],
  );

  const setOptions = function(newOptions) {
    // add value to options if it does not exists
    if (newOptions == null) {
      newOptions = [];
    }
    const contains = (value == null || newOptions.some((option) => option.place_id == value.place_id));
    setOptionsInternal(contains ? newOptions : [value, ...newOptions]);
    console.log("options: ", newOptions);
  }

  // Options loader function
  React.useEffect(() => {
    let active = true;

    if (!autocomplete.current && window.google) {
      autocomplete.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocomplete.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions([]);
      return undefined;
    }

    setLoading(true);
    debouncedFetch({ input: inputValue, locationBias: (center ? center : "IP_BIAS"), 
        sessionToken: sessionToken }, (results) => {
      if (active) {
        setOptions(results);
      }
      setLoading(false);
    });

    // cleanup call
    return () => {
      // set activate to false to prevent debouncing for previous inputs
      active = false;
    };
  }, [value, inputValue, debouncedFetch]);

  return (
    <Box sx={ {minWidth: 120, paddingTop: '10px', paddingLeft: '10px', display: 'flex'} }>
      <Autocomplete
        id="asynchronous-demo"
        sx={ { width: 300 } }
        style={ { paddingRight: '5px' } }
        filterOptions={ (x) => x }
        isOptionEqualToValue={ (option, value) => option.place_id === value.place_id }
        getOptionLabel={ (option) => option.description }
        options={ options }
        loading={ loading }
        autoComplete
        noOptionsText= { inputValue == '' ? "Start Typing..." : "Unable to find the place..." }
        onChange={ (event, newValue) => {
          setValue(newValue);
          if (newValue && onPlaceChanged) {
            onPlaceChanged(newValue);
          }
        } }
        onInputChange={ (event, newInputValue) => {
          setInputValue(newInputValue);
        } }
        renderInput={ (params) => (
          <TextField
            { ...params }
            label="Find a place"
            size="small"
            style={ {backgroundColor: 'white'} }
            InputProps={ {
              ...params.InputProps,
              endAdornment: (
                <>
                  { loading ? <CircularProgress color="inherit" size={20} /> : null }
                  { params.InputProps.endAdornment }
                </>
              ),
            } }
          />
        ) }
        renderOption={ (props, option) => {
          return (
            <li {...props}>
              <Grid container alignItems="center">
                <Grid item sx={ {display: 'flex', width: 44} }>
                  <LocationOnIcon sx={ {color: 'text.secondary'} } />
                </Grid>
                <Grid item sx={ {width: 'calc(100% - 44px)', wordWrap: 'break-word'} }>
                  {option.structured_formatting.main_text}
                  <Typography variant="body2" color="text.secondary">
                    {option.structured_formatting.secondary_text}
                  </Typography>
                </Grid>
              </Grid>
            </li>
          );
        } }
        renderTags={ (value, getTagProps) => {
          return (
            <span>aaaaa</span>
          )
        } }
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

const center = {
  lat: 7.2905715, // default latitude
  lng: 80.6337262, // default longitude
};

export default function Map (props) {
  const [map, setMap] = React.useState(null);
  const placesService = React.useRef(null);
  const sessionToken = React.useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB4L45EgWGU3NK2KyYr7orRvxLrEFsoFRo',
    libraries: LIBRARIES,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  if (!sessionToken.current) {
    sessionToken.current = new google.maps.places.AutocompleteSessionToken();
  }

  const onPlaceChanged = function(newAutocompletePrediction) {
    // update center when a location is selected in search
    if (newAutocompletePrediction && map) {
      if (!placesService.current && window.google) {
        placesService.current = new window.google.maps.places.PlacesService(map);
      }
      if (!placesService.current) {
        return;
      }

      placesService.current.getDetails({ placeId: newAutocompletePrediction.place_id, 
          sessionToken: sessionToken.current,
          fields: PLACE_DETAILS }, (result) => {
        if (result && result.geometry && map) {
          if (result.geometry.viewport) {
            map.fitBounds(result.geometry.viewport);
          }
          if (result.geometry.location) {
            map.setCenter(result.location);
          }
        }
        console.log("Place Info:", result);
      });
    }
  }

  const center = map ? map.getCenter() : null;

  return (
    <>
      <div style={ {width:'100%', backgroundColor: 'green'} }>
        <GoogleMap
          mapContainerStyle={ { width: '100%', height: '100vh' } }
          zoom={ 10 }
          center={ center }
          options={ {streetViewControl: false, fullscreenControl: false, mapTypeControl: false} }
          onLoad={ map => { setMap(map) } }
          onUnmount={ () => { setMap(null) } }
        >
          {/*
          <MainControlBox center={ map ? map.getCenter() : null } 
            sessionToken={ sessionToken.current } 
            onPlaceChanged={ onPlaceChanged }/>
          <Marker position={ center }/>
          */}
        </GoogleMap>
      </div>
    </>
  );
};
