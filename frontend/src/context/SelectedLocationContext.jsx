import { useState, useContext, createContext } from "react";

const SelectedLocationContext = createContext();

export const SelectedLocationProvider = ({children}) => {
    const [selectedLocation, setSelectedLocation] = useState(null);

    return (
        <SelectedLocationContext.Provider value={{ selectedLocation, setSelectedLocation }}>
            {children}
        </SelectedLocationContext.Provider>
    );
}

export const useSelectedLocationContext = () => {
    return useContext(SelectedLocationContext);
};

export const SELECTED_LOCATION_LOADING = "loading";