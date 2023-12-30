import {Routes, Route} from "react-router-dom";
import ItineraryPage from "../pages/itinerarypage";


function AppRoutes(props) {

    return (
        <Routes>
            <Route path='/itinerary' element={<ItineraryPage {...props}/>} />
        </Routes>
    )
}

export default AppRoutes;
