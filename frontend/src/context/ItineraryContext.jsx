import axios from "axios";
import { useState, useContext, createContext, useRef, useEffect } from "react";
import { useUserContext } from "./UserContext";

const ItineraryContext = createContext();

export const ItineraryProvider = ({children}) => {
    const [itinerary, setItinerary] = useState([]);
    const [routeData, setRouteData] = useState(new Map());
    const privateState = useRef({});
    const [properties, setProperties] = useState({});
    const currentUser = useUserContext();

    function addPlace(place, index = -1) {
        // verify the place details are available
        if (place && place.placeId) {
            if (place.geometry && place.geometry.location) {
                if (place.type == 'start' && !privateState.current.startAdded) {
                    privateState.current.startAdded = true;
                    setItinerary([place, ...itinerary]);
                }
                else if (place.type == 'end' && !privateState.current.endAdded) {
                    privateState.current.endAdded = true;
                    setItinerary([...itinerary, place]);
                }
                else if (place.type != 'start' && place.type != 'end') {
                    if (index <= 0 ) {
                        // add to the last if there is no last. otherwise add to one before last
                        index = privateState.current.endAdded ? itinerary.length - 1 : itinerary.length;
                    }
                    setItinerary([...itinerary.slice(0, index), place, ...itinerary.slice(index)]);
                }
                else {
                    return false;
                }

                return true;
            }
        }

        return false;
    }

    function updatePlace(place, index) {
        if (index >= 0 && index < itinerary.length) {
            setItinerary([...itinerary.slice(0, index), place, ...itinerary.slice(index + 1)]);

            if (itinerary.length == 0) {
                privateState.current.startAdded = false;
                privateState.current.endAdded = false;
            }
            else if (itinerary[itinerary.length - 1].type != 'end') {
                privateState.current.endAdded = false;
            }
            else if (itinerary[0].type != 'start') {
                privateState.current.startAdded = false;
            }

            return true;
        }

        return false;
    }

    function removePlace(index) {
        if (index >= 0 && index < itinerary.length) {
            setItinerary([...itinerary.slice(0, index), ...itinerary.slice(index + 1)]);
            
            if (itinerary.length == 0) {
                privateState.current.startAdded = false;
                privateState.current.endAdded = false;
            }
            else if (itinerary[itinerary.length - 1].type != 'end') {
                privateState.current.endAdded = false;
            }
            else if (itinerary[0].type != 'start') {
                privateState.current.startAdded = false;
            }

            return true;
        }

        return false;
    }

    function hasStart() {
        return privateState.current.startAdded == true;
    }

    function hasEnd() {
        return privateState.current.endAdded == true;
    }

    function updateRoutes(routes) {
        routes = new Map(routes); // take a copy of the map

        // remove unecessary routes and merge route data
        routeData.forEach((value, key) => {
            if (!routes.has(key)) {
                if (itinerary.find((place) => (place.placeId == key))) {
                    routes.set(key, value);
                }
            }
        })

        setRouteData(routes);
    }

    // Save the itinary to backend
    async function saveItinery() {
        let mapData = [...itinerary]
        mapData.forEach((place, index) => {
            if (place.geometry) {
                let geoJson = {}
                if (place.geometry.location && place.geometry.location.toJSON) {
                    geoJson.location = place.geometry.location.toJSON();
                }
                if (place.geometry.viewport && place.geometry.viewport.toJSON) {
                    geoJson.viewport = place.geometry.viewport.toJSON();
                }

                if (geoJson.location) {
                    place.geometry = geoJson;
                }
                else {
                    // A json already
                }
            }

            if (index < mapData.length - 1) {
                // merge the route data
                let startPlaceId = place.placeId;
                let endPlaceId = mapData[index + 1].placeId;
                let route = routeData.get(startPlaceId);
                if (route && route.endId && route.endId == endPlaceId) {
                    place.routeData = route.data;
                }
            }

            if (!place.photos) {
                place.photos = []
            }

            place.photos = place.photos.map((photo, i) => {
                if (photo.getUrl) {
                    return {
                        width: photo.width,
                        heright: photo.heright,
                        url : photo.getUrl({maxHeight: 480})
                    }
                }
                else {
                    return photo;
                }
            })
        })

        let mapObject = {
            name: properties.name || "test",
            description : properties.description || "test",
            startDate : properties.startDate || Date.now(),
            photo: properties.photo,
            itinerary: mapData,
        }

        // find a photo possibly of the destination
        if (!mapObject.photo) {
            mapData.reverse().find((place) => {
                if (place.photos.length) {
                    mapObject.photo = place.photos[0].url;
                    return true;
                }
                return false;
            })
        }

        console.log("map object: ", mapObject);

        const headers = { "x-access-token": currentUser.token }

        if (!properties.id) {
            // this is a new map. request to create it
            try {
                let response = await axios.post('/api/trips', mapObject, {headers: headers});
                const data = response.data;
                setProperties({...properties, id:data.id})
                console.log(`Map ${data.id} created`, data);
            } catch (err) {
                console.log(err.message)
            }
        }
        else {
            // update a already existing map
            let mapId = properties.id;
            try {
                let response = await axios.put(`/api/trips/${mapId}`, mapObject, {headers: headers});
                console.log(`Map ${mapId} updated`);
            } catch (err) {
                console.log(err.message)
            }
        }
    }

    async function loadItinery(mapId) {
        const headers = { "x-access-token": currentUser.token }
        let mapObject = null;

        // load a map from the backend to the itinery
        try {
            let response = await axios.get(`/api/trips/${mapId}`, {headers: headers});
            mapObject = response.data;
            console.log(`Map ${mapObject.id} dwnloaded`);
        } catch (err) {
            console.log(err.message)
        }

        // update itinery/routes and settings
        if (mapObject && mapObject.itinerary && typeof(mapObject.itinerary) == typeof(itinerary)) {
            let itineraryObj = [];
            let routeDataObj = new Map();
            let privateStetObj = {
                startAdded: false,
                endAdded: false,
                mapId: mapId,
            };
            let propDataObj = {
                name: mapObject.name,
                description : mapObject.description,
                startDate : mapObject.startDate,
                photo: mapObject.photo,
            };
            
            mapObject.itinerary.forEach((place, i) => {
                let route = place.routeData;
                place.routeData = undefined;
                itineraryObj.push(place);

                if (place.type == 'start') {
                    privateStetObj.startAdded = true;
                }

                if (place.type == 'end') {
                    privateStetObj.endAdded = true;
                }

                if (i < mapObject.itinerary.length - 1 && route != null) {
                    route.endId = mapObject.itinerary[i + 1].placeId;
                    routeDataObj.set(place.placeId, route);
                }
            });

            // update state for the new map
            privateState.current = privateStetObj;
            setProperties(propDataObj);
            setRouteData(routeDataObj);
            setItinerary(itineraryObj);

            return true;
        }

        return false;
    }

    async function deleteItinery(mapId) {
        const headers = { "x-access-token": currentUser.token }

        // delete the specified map
        try {
            let response = await axios.delete(`/api/trips/${mapId}`, {headers: headers});
            console.log(`Map ${mapObject.id} deleted`);
        } catch (err) {
            console.log(err.message)
        }
    }

    function resetItinery() {
        setItinerary([]);
        setRouteData(new Map());
        privateState.current = {};
        setProperties({});
    }

    return (
        <ItineraryContext.Provider value={{ value:itinerary, addPlace, removePlace, 
            hasStart, hasEnd, routes:routeData, updateRoutes, properties, setProperties,
            saveItinery, loadItinery, deleteItinery, resetItinery, updatePlace }}>
            {children}
        </ItineraryContext.Provider>
    );
}

export const useItineraryContext = () => {
    return useContext(ItineraryContext);
};
