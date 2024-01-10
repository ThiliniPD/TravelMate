import { Routes, Route } from "react-router-dom";
import SignUp from "../components/SignupMUI";
import Homepage from "../pages/Homepage";
import LoginMUI from "../components/LoginMUI"
import ItineraryPage from "../pages/Itinerarypage";
import ForgotPassword from "../components/ForgotPassword";
import { useUserContext } from "../context/UserContext";
import Logoutpage from "../pages/Logoutpage";
import Profilepage from "../pages/Profilepage";

function AppRoutes(props) {
    const user = useUserContext();

    return (
        <Routes>
            <Route index element={<Homepage {...props} />} />
            { !user.isLoggedIn() ? 
                // Only allow these routes when not logged in
                <>
                    <Route path="signup" element={<SignUp {...props} />} />
                    <Route path="forgotpw" element={<ForgotPassword {...props} />} />
                    <Route path="signin" element={<LoginMUI {...props} />} />
                </>
            :
                // Only allow these routes when logged in
                <>
                    <Route path='itinerary' element={<ItineraryPage {...props}/>} />
                    <Route path='profile' element={<Profilepage {...props}/>} />
                    <Route path="signout" element={<Logoutpage {...props} />} />
                </>
            }
        </Routes>
    );
}

export default AppRoutes