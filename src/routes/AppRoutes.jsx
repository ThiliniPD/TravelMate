import {Routes, Route} from "react-router-dom";
import ItineraryPage from "../pages/itinerarypage";
import Homepage from "../pages/homepage";


function AppRoutes(props) {

    return (
        <Routes>
            <Route path='/itinerary' element={<ItineraryPage {...props}/>} />
            <Route path='/' element={<Homepage {...props}/>} />
        </Routes>
    )
}

export default AppRoutes;
