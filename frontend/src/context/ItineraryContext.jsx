import axios from "axios";
import { useState, useContext, createContext, useRef } from "react";
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

    function removePlace(index) {
        if (index >= 0 && index < itinerary.length) {
            setItinerary([...itinerary.slice(0, index), ...itinerary.slice(index + 1)]);
            
            if (itinerary.length == 0) {
                privateState.current.startAdded = false;
                privateState.current.endAdded = false;
            }
            else if (itinerary[-1].type != 'end') {
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
        return privateState.startAdded == true;
    }

    function hasEnd() {
        return privateState.endAdded == true;
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
            if (index < mapData.length - 1) {
                // merge the route data
                let startPlaceId = place.placeId;
                let endPlaceId = mapData[index].placeId;
                let route = routeData.get(startPlaceId);
                if (route && route.endId && route.endId == endPlaceId) {
                    place.routeData = route.data;
                }
            }
        })

        let mapObject = {
            name: properties.name,
            description : properties.description,
            startDate : properties.startDate,
            photo: properties.photo,
            owner: currentUser.id,
            itinerary: mapData,
        }

        const headers = { "x-access-token": currentUser.token }

        if (!privateState.current.mapId) {
            // this is a new map. request to create it
            try {
                let response = await axios.post('/api/trips/', mapObject, {headers: headers});
                const {mapId} = response.data;
                privateState.current.mapId = mapId;
                console.log(`Map ${mapId} created`);
            } catch (err) {
                console.log(err.message)
            }
        }
        else {
            // update a already existing map
            let mapId = privateState.current.mapId;
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
                    privateState.endAdded = true;
                }

                if (i < mapObject.itinerary.length - 1) {
                    route.endId = mapObject.itinerary[i + 1].placeId;
                    routeDataObj.set(place.placeId, route);
                }
            });

            // update state for the new map
            privateState.current = privateStetObj;
            setProperties(propDataObj);
            setRouteData(routeDataObj);
            setItinerary(itineraryObj);
        }
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

    return (
        <ItineraryContext.Provider value={{ value:itinerary, addPlace, removePlace, 
            hasStart, hasEnd, routes:routeData, updateRoutes, properties, setProperties,
            saveItinery, loadItinery, deleteItinery }}>
            {children}
        </ItineraryContext.Provider>
    );
}

export const useItineraryContext = () => {
    return useContext(ItineraryContext);
};
