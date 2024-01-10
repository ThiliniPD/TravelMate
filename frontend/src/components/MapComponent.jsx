import * as React from 'react';
import { Autocomplete, CircularProgress, Grid } from '@mui/material';
import { TextField, Typography, debounce } from '@mui/material';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box } from '@mui/material'; // keep this import at last as a workaround for MUI issue
import { useSelectedLocationContext } from '../context/SelectedLocationContext';
import { SELECTED_LOCATION_LOADING } from '../context/SelectedLocationContext';
import { useItineraryContext } from '../context/ItineraryContext';

const LIBRARIES = ['places', 'marker', 'routes', 'geocoding'];
const PLACE_DETAILS = ["formatted_address", "international_phone_number", "rating", "website", "photos", "name", "geometry.location", "geometry.viewport"];

function trimAddress(str) {
  return str.trim().replace(/^[,]+/, '').replace(/[,]+$/, '').trim()
}

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
            onPlaceChanged(newValue ? newValue.place_id : null);
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
      />
    </Box>
  );
}

export default function MapComponent (props) {
  const [map, setMap] = React.useState(null);
  const [center, setCenter] = React.useState(null);
  const [refreshTrigger, setRrefreshTrigger] = React.useState(false);
  const { setSelectedLocation } = useSelectedLocationContext();
  const placesService = React.useRef(null);
  const geoCoderService = React.useRef(null);
  const directionService = React.useRef(null);
  const sessionToken = React.useRef(null);
  const markers = React.useRef();
  const itinerary = useItineraryContext();
  
  // load google services scripts
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB4L45EgWGU3NK2KyYr7orRvxLrEFsoFRo',
    libraries: LIBRARIES,
  });

  React.useEffect(() => {
    console.log("Itinerary changed: ", itinerary.value);

    if (!map) {
      return;
    }

    if (!directionService.current) {
      directionService.current = new google.maps.DirectionsService();
    }

    async function recalcutareRoutes(itineraryArray, routesArray, directionService) {
      let updatedRoutes = new Map();
      let promices = [];
  
      for (let i = 0; i < itineraryArray.length - 1; i++) {
        const startPlaceId = itineraryArray[i].placeId;
        const endPlaceId = itineraryArray[i + 1].placeId;
        const route = routesArray.get(startPlaceId);
        if (!route || !route.data || route.endId != endPlaceId) {
          // this route is outdated. Need to recalculate it
          promices.push(directionService.route({
            origin: {
              placeId: startPlaceId
            },
            destination: {
              placeId: endPlaceId
            },
            travelMode: google.maps.TravelMode.DRIVING,
          }).then((responce) => {
            return {startPlaceId, endPlaceId, data:responce}
          }));
        }
      }
  
      // wait for api requests to complete
      try{
        let responces = await Promise.all(promices);
        responces.forEach((responce) => {
          updatedRoutes.set(responce.startPlaceId, { data: responce.data, endId: responce.endPlaceId });
        });
      }
      catch(e) {
        console.log("Route api call failed: ", e);
      }

      itinerary.updateRoutes(updatedRoutes);
    }

    // recalculate the missing routes routes
    recalcutareRoutes(itinerary.value, itinerary.routes, directionService.current);
  }, [itinerary.value, refreshTrigger]);

  React.useEffect(() => {
    if (!map) {
      // still not initialized
      return;
    }

    // remove unused route data we hold temporaarily
    markers.current.routes.forEach((value, key) => {
      if(!itinerary.routes.has(key)) {
        // this is not in routes anymore. so we remove it from the map
        if (value.marker) {
          value.marker.setMap(null);
        }

        if (value.route) {
          value.route.setmap(null);
        }

        markers.current.routes.set(key, null);
      }
    })

    // redraw updated routes
    itinerary.routes.forEach((routeData, key) => {
      let newMarker = null;
      let newRoute = null;

      const startPlaceId = key;
      const endPlaceId = routeData.endId;
      const startPlace = itinerary.value.find((place) => (place.placeId == startPlaceId));

      if (!startPlace || !startPlace.geometry || !startPlace.geometry.location) {
        return;
      }
      else if (!routeData || !routeData.data) {
        return;
      }

      if (markers.current.routes.has(key)) {
        let value = markers.current.routes.get(key);
        newMarker = value.marker;
        newRoute = value.route;
      }

      if (!newMarker) {
        newMarker = new window.google.maps.Marker({
          map: map,
          label: {
            text: " ",
            fontSize: "14px",
            color: "black",
            className: "marker-label mk-route" + (startPlace.type != "") ? `mk-${startPlace.type}` : ""
          }
        });
      }

      if (!newRoute) {
        newRoute = new google.maps.DirectionsRenderer({
          map: map,
          draggable: true,
          markerOptions: { visible: false }
        });
      }

      newMarker.setPosition(startPlace.geometry.location);
      newRoute.setDirections(routeData.data);
      markers.current.routes.set(key, {marker: newMarker, route: newRoute});
    })

    // draw the last marker
    if (itinerary.value && itinerary.value.length > 0) {
      let lastPlace = itinerary.value[itinerary.value.length - 1];
      if (!(!lastPlace || !lastPlace.geometry || !lastPlace.geometry.location)) {
        let newMarker = markers.current.lastMarker;

        if (!newMarker) {
          newMarker = new window.google.maps.Marker({
            map: map,
            label: {
              text: " ",
              fontSize: "14px",
              color: "black",
              className: "marker-label mk-route" + (lastPlace.type != "") ? `mk-${lastPlace.type}` : ""
            }
          });
        }

        newMarker.setPosition(lastPlace.geometry.location);
        markers.current.lastMarker = newMarker;
      }
    }

  }, [itinerary.routes])

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  if (!sessionToken.current) {
    sessionToken.current = new google.maps.places.AutocompleteSessionToken();
  }

  if (!geoCoderService.current) {
    geoCoderService.current = new google.maps.Geocoder();
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
      routes: new Map(), // keep the route data and the markers by place ID
    }
  }

  const onPlaceChanged = function(newPlaceId, maintainBounds) {
    // update center when a location is selected in search
    if (!map) {
      return;
    }

    if (newPlaceId) {
      if (!placesService.current) {
        placesService.current = new window.google.maps.places.PlacesService(map);
      }
      if (!placesService.current) {
        return;
      }

      setSelectedLocation(SELECTED_LOCATION_LOADING);
      placesService.current.getDetails({ placeId: newPlaceId, 
          sessionToken: sessionToken.current,
          fields: PLACE_DETAILS }, (result) => {
        if (result && result.geometry && map) {
          if (!maintainBounds && result.geometry.viewport) {
            map.fitBounds(result.geometry.viewport);
          }
          if (result.geometry.location) {
            if (!maintainBounds) {
              map.setCenter(result.geometry.location);
              setCenter(map.getCenter());
            }

            let marker = new window.google.maps.Marker({
              map: map,
              position: result.geometry.location,
              label: {
                text: " ",
                fontSize: "14px",
                color: "black",
                className: "marker-label mk-select"
              }
            });

            if (markers.current.center) {
              markers.current.center.setMap(null);
            }

            markers.current.center = marker;

            if (result) {
              // some addresses contain location code at front. remove them
              let parts = "";

              parts=result.name.split(' ', 1)
              if (parts.length > 0 && parts[0].length > 0) {
                if(parts[0].includes('+') && parts[0] == parts[0].toUpperCase()) {
                  result.name = trimAddress(result.name.substring(parts[0].length));
                }
              }

              parts=result.formatted_address.split(' ', 1)
              if (parts.length > 0 && parts[0].length > 0) {
                if(parts[0].includes('+') && parts[0] == parts[0].toUpperCase()) {
                  result.formatted_address = trimAddress(result.formatted_address.substring(parts[0].length)).trim();
                }
              }

              // sometimes the address contains name. remove it before setting
              if (result.formatted_address.startsWith(result.name)) {
                result.formatted_address = trimAddress(result.formatted_address.substring(result.name.length));
              }
            }

            result.placeId = newPlaceId;
            setSelectedLocation(result);
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
    console.log("click event: ", e)
    if (e.placeId) {
      onPlaceChanged(e.placeId, true);
    }
    else if (e.latLng) {
      setSelectedLocation(SELECTED_LOCATION_LOADING);
      geoCoderService.current.geocode({location: e.latLng}, (results) => {
        if (results && results.length > 0 && results[0] && results[0].place_id) {
          onPlaceChanged(results[0].place_id, true);
        }
      });
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
          mapContainerStyle={ {width: '100%', height: 'calc(100vh - 16px - 70px)', borderRadius: '5px'} }
          zoom={ 10 }
          center={ center }
          options={ options }
          onLoad={ map => { 
            setMap(map);
            setCenter(map.getCenter());
            setRrefreshTrigger(!refreshTrigger); // trigger a redraw of routes after map is loaded
          } }
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
