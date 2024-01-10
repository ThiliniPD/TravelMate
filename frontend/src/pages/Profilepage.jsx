import * as React from 'react';
import axios from "axios";
import TripDetailsCard from "../components/TripDetailsCard";
import { useUserContext } from "../context/UserContext";
import { Grid } from "@mui/material";


export default function Profilepage() {
    const [trips, setTrips] = React.useState([]);
    const currentUser = useUserContext();

    const headers = { "x-access-token": currentUser.token }
    React.useEffect(() => {
        axios.get('api/trips', {headers: headers})
            .then(response => { setTrips(response.data); console.log(response.data) })
            .catch(err => console.log(err.message))
    }, []);

    return(
        <Grid container spacing={3} sx={{ margin:'16px' }}>
            { 
                trips.map((trip, i) => {
                    return (
                        <Grid item key={i} xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TripDetailsCard trip={trip}/>
                        </Grid>
                    )
                })
            }
        </Grid>
    )
}
