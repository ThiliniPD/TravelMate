import * as React from 'react';
import { Autocomplete, Button, CircularProgress, Grid } from '@mui/material';
import { Card, CardActions, CardContent, CardMedia } from '@mui/material';
import { TextField, Typography, debounce } from '@mui/material';
import { GoogleMap, useLoadScript, Marker, MarkerF, InfoBox, InfoBoxF } from '@react-google-maps/api';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Box from '@mui/material/Box'; // keep this import at last as a workaround for MUI issue

const LIBRARIES = ['places', 'marker', 'routes'];
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
        console.log("request: ", request);
        autocomplete.current.getPlacePredictions(request, callback);
      }, 600),
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
    debouncedFetch({ input: inputValue, location: center, radius: 10000,
        xsessionToken: sessionToken }, (results, status) => {
      if (active) {
        setOptions(results);
        console.log("status: ", status);
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
        filterOptions={ (x) => x }
        isOptionEqualToValue={ (option, value) => option.place_id === value.place_id }
        getOptionLabel={ (option) => option.description }
        options={ options }
        loading={ loading }
        autoComplete
        noOptionsText= { inputValue == '' ? "Start Typing..." : "Unable to find the place..." }
        onChange={ (event, newValue) => {
          setValue(newValue);
          if (onPlaceChanged) {
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
            style={ {backgroundColor: 'white',borderRadius: '5px'} }
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
    </Box>
  );
}

function MapInfoBox({ visibility, elementRef }) {
  return (
    <div ref={ elementRef } style={ {display: (visibility? 'block' : 'none')} }>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image="/static/images/cards/contemplative-reptile.jpg"
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Lizard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </div>
  )
}

export default function Map (props) {
  const [map, setMap] = React.useState(null);
  const [center, setCenter] = React.useState(null);
  const placesService = React.useRef(null);
  const sessionToken = React.useRef(null);
  const markers = React.useRef();
  const infoWindowRef = React.useRef();

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

  if (!center) {
    setCenter(new window.google.maps.LatLng({
      lat: 7.2905715, // default latitude
      lng: 80.6337262, // default longitude
    }));
  }

  if (!markers.current) {
    markers.current = {
      center: null, // keep the center point marker
      selection: null, // keep the clicked position marker
      route: [], // keep the route point markers
    }
  }

  const onPlaceChanged = function(newAutocompletePrediction) {
    // update center when a location is selected in search
    if (!map) {
      return;
    }

    if (newAutocompletePrediction) {
      if (!placesService.current) {
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
            map.setCenter(result.geometry.location);
            setCenter(map.getCenter());

            let marker = new window.google.maps.Marker({
              map: map,
              position: result.geometry.location
            });

            if (markers.current.center) {
              markers.current.center.setMap(null);
            }

            markers.current.center = marker;
          }
        }
        console.log("Place Info:", result);
      });
    }
    else {
      if (markers.current.center) {
        markers.current.center.setMap(null);
      }

      markers.current.center = null;
    }
  }

  const onClick = function(e) {
    if (e.latLng) {
      let marker = new window.google.maps.Marker({
        map: map,
        position: e.latLng,
        clickable: true,
        draggable: true,
        opacity: 1.0,
        label: {
          text: "1",
          fontSize: "14px",
          color: "black",
          className: "marker-label"
        },
      });

      if (markers.current.selection) {
        markers.current.selection.setMap(null);
      }

      markers.current.selection = marker;
      markers.current.info.open(map, marker);
    }
    e.stop();
  }

  const options = {
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
    draggable: true,
    clickableIcons: true,
  }

  return (
    <>
      <div style={ {width:'calc(100% -16px)', padding:'8px', paddingRight : '0px'} }>
        <GoogleMap
          mapContainerStyle={ {width: '100%', height: 'calc(100vh - 16px)', borderRadius: '5px'} }
          zoom={ 10 }
          center={ center }
          options={ options }
          onLoad={ map => { setMap(map); setCenter(map.getCenter()) } }
          onUnmount={ () => { setMap(null) } }
          onClick={ onClick }
        >
          <MainControlBox center={ center } 
            sessionToken={ sessionToken.current } 
            onPlaceChanged={ onPlaceChanged }/>
        </GoogleMap>
      </div>
    </>
  );
};
