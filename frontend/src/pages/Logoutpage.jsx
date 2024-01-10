import {useState} from "react";
import Login from "../components/LoginMUI";
import { useItineraryContext } from "../context/ItineraryContext";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

export default function Logoutpage() {
    const currentUser = useUserContext();
    const itinery = useItineraryContext();
    const navigate = useNavigate();

    // cleanup things and go to home page
    itinery.resetItinery();
    currentUser.handleUpdateUser({});
    navigate("/", {replace: true});

    return(
        <></>
    )
}