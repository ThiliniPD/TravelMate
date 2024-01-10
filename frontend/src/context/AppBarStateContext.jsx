import React, { useState, useContext } from "react";
import { useLocation } from 'react-router-dom'

// 1. Create the context
const AppBarStateContext = React.createContext();

// Custom provider component for this context.
// Use it in App.jsx like <UserProvider>...</UserProvider>
export const AppBarStateProvider = (props) => {
    const [appButtonsState, setAppButtonsState] = React.useState({});
    const location = useLocation();

    function showSaveMap() {
        return (location.pathname == "/itinerary");
    }

    function showCreateMap() {
        return (location.pathname != "/itinerary");;
    }

    // 2. Provide the context.
    // The Provider component of any context (UserContext.Provider)
    // sends data via its value prop to all children at every level.
    // We are sending both the current user and an update function
    return (
        <AppBarStateContext.Provider value={{ showSaveMap, showCreateMap }}>
            {props.children}
        </AppBarStateContext.Provider>
    );
}

// 3. Use the context. This custom hook allows easy access
// of this particular context from any child component
export const useAppBarStateContext = () => {
    return useContext(AppBarStateContext);
};