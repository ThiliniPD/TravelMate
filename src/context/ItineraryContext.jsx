import { useState, useContext, createContext } from "react";

const ItineraryContext = createContext();

export const ItineraryProvider = ({children}) => {
    const [itinerary, setItinerary] = useState([]);
    const [privateState, setPrivateState] = useState({});

    function addPlace(place, index = -1) {
        // verify the place details are available
        if (place && place.placeId) {
            if (place.geometry && place.geometry.location) {
                if (place.type == 'start' && !privateState.startAdded) {
                    setPrivateState({...privateState, startAdded:true});
                    setItinerary([place, ...itinerary]);
                }
                else if (place.type == 'end' && !privateState.endAdded) {
                    setPrivateState({...privateState, endAdded:true});
                    setItinerary([...itinerary, place]);
                }
                else {
                    setItinerary([...itinerary.slice(0, index), place, ...itinerary.slice(index)])
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
                setPrivateState({...privateState, startAdded:false, endAdded:false});
            }
            else if (itinerary[-1].type != 'end') {
                setPrivateState({...privateState, endAdded:false});
            }
            else if (itinerary[0].type != 'start') {
                setPrivateState({...privateState, startAdded:false});
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

    return (
        <ItineraryContext.Provider value={{ value:itinerary, addPlace, removePlace, 
            hasStart, hasEnd }}>
            {children}
        </ItineraryContext.Provider>
    );
}

export const useItineraryContext = () => {
    return useContext(ItineraryContext);
};
