import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import { useItineraryContext } from '../context/ItineraryContext';
import { useNavigate } from 'react-router-dom';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function TripDetailsCard({trip}) {
    const itinerary = useItineraryContext();
    const navigate = useNavigate();

    const handleLoadTrip = async function() {
        await itinerary.loadItinery(trip.id);
        navigate("/itinerary");
    }

    return (
        <Card sx={{ maxWidth: 345, borderRadius:'5px' }}>
            <CardHeader
            avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    <RoomOutlinedIcon/>
                </Avatar>
            }
            action={
                <IconButton aria-label="settings" onClick={handleLoadTrip}>
                    <LaunchRoundedIcon />
                </IconButton>
            }
            title={trip.name}
            subheader={`${trip.owner.firstName} ${trip.owner.lastName}`}
            />
            <CardMedia
            component="img"
            height="194"
            image={trip.photo}
            alt=""
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {trip.description}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
                <IconButton aria-label="url" disabled={!trip.url}>
                    <LanguageOutlinedIcon />
                </IconButton>
                <IconButton aria-label="edit" onClick={handleLoadTrip}>
                    <EditLocationOutlinedIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}
