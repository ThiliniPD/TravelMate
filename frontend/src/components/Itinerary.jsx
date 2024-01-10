import React from 'react';
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded';
import { Alert, Avatar, Button, Card, Chip, Divider, Grid, IconButton, TextField, } from '@mui/material';
import { Step, StepButton, StepContent, StepLabel, Stepper, Typography } from '@mui/material';
import { Box } from '@mui/material'; // keep this import at last as a workaround for MUI issue
import { useSelectedLocationContext } from '../context/SelectedLocationContext';
import { SELECTED_LOCATION_LOADING } from '../context/SelectedLocationContext';
import { useItineraryContext } from '../context/ItineraryContext';

const actionInfo = [
    { action: 'Starting Point', image: 'src/assets/location-type-start.png', code: 'start' },
    { action: 'Visit Location', image: 'src/assets/location-type-visit.png', code: 'visit' },
    { action: 'Food Stop', image: 'src/assets/location-type-food-stop.png', code: 'food' },
    { action: 'Rest Stop', image: 'src/assets/location-type-rest-stop.png', code: 'rest' },
    { action: 'Ending Point', image: 'src/assets/location-type-end.png', code: 'end' },
]

const START_ACTION_INDEX = 0;
const END_ACTION_INDEX = actionInfo.length - 1;

function getPhoto(place) {
    try{
        return place.photos[0].url || place.photos[0].getUrl({maxWidth:300})
    }
    catch (e) {
        return 'https://mui.com/static/images/cards/live-from-space.jpg';
    }
}

function LocationDetails({selectedLocation, onAddClicked}) {
    const [selectedAction, setSelectedAction] = React.useState(0);
    const itinerary = useItineraryContext();

    const image = getPhoto(selectedLocation);

    const onAddClickedInternal = function() {
        selectedLocation.type = actionInfo[selectedAction].code
        itinerary.addPlace(selectedLocation);
        onAddClicked();
    }

    if (selectedAction == 0 && itinerary.hasStart()) {
        setSelectedAction(1);
    }

    return(
        <div className='MuiCardHeader-root' style={ {padding: '8px', display:'flex', flexDirection: 'column'} }>
            <div style={ {display: 'flex', flexDirection: 'row'} }>
                <img className='MuiCardMedia-root' 
                    src={ image }
                    style={ {width: '75px', height: '75px', border:'5px solid #78a383', borderRadius: '5px'} }>
                </img>
                <div style={ {padding: '8px', paddingTop: '0px', textAlign: 'left'} }>
                    <Typography variant="h6" style={ {} }>
                        {selectedLocation.name}
                    </Typography>
                    <Typography variant="subtitle1" style={ {color: "lightgrey"} }>
                        {selectedLocation.formatted_address}
                    </Typography>
                </div>
            </div>
            <div style={ {display:'flex', flexDirection: 'row',flexWrap: 'wrap', alignItems: 'stretch'} }>
                <div style={ {padding: '8px', display:'flex', flexDirection: 'row',flexWrap: 'wrap', justifyContent: 'center'} }>
                    {
                        actionInfo.map((info, index) => {
                            return (
                                <Button key={ index } aria-label={ info.action } color='success' 
                                    variant={ selectedAction == index ? 'outlined':'' } 
                                    onClick={ ()=>{ setSelectedAction(index) } }
                                    disabled={ index == START_ACTION_INDEX ? itinerary.hasStart() 
                                        : index == END_ACTION_INDEX ? itinerary.hasEnd() : false }>
                                    <Avatar sx={ {width: 32, height: 32} } variant="rounded" src={info.image}/>
                                </Button>
                            );
                        })
                    }
                </div>
                <div style={ {margin: 'auto', height:'50%', marginRight: '8px'} }>
                    <Button onClick={ onAddClickedInternal } variant='outlined' color='success' startIcon={<AddLocationAltRoundedIcon/>}>Add</Button>
                </div>
            </div>
        </div>
    )
}

function LoadingIcon() {
    return (
        <div style={{width: '22px', height: '22px'}}>
            <div className="loading">
                <div></div><div></div><div></div><div></div>
            </div>
        </div>
    )
}

function LocationEmpty({loading}) {
    return(
        <div style={ { margin:'16px'} }>
            <img src="./src/assets/map-location.png" style={{height:'80px'}}></img>
            <div style={ {width: '100%', display:(loading? 'none' : 'block')} }>
                <Alert severity="info" style={{width: 'calc(100% - 32px)'}}>Please select a location on the map to see the details</Alert>
            </div>
            <div style={ {width: '100%', display:(loading? 'block' : 'none')} }>
                <Alert severity="info" icon={ <LoadingIcon/> }>Loading...</Alert>
            </div>
        </div>
    )
}

function SelectedLocationPane() {
    const { selectedLocation, setSelectedLocation } = useSelectedLocationContext();

    const onAddClicked = function() {
        setSelectedLocation(null);
    }

    let draggable = false;
    let content = null;
    if (selectedLocation == SELECTED_LOCATION_LOADING) {
        content = (<LocationEmpty loading={ true }/>)
    }
    else if (selectedLocation != null) {
        draggable = true;
        content = (<LocationDetails selectedLocation={ selectedLocation } onAddClicked={ onAddClicked }/>)
    }
    else {
        content = (<LocationEmpty loading={ false }/>)
    }

    return (
        <Card sx={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#f1ffe4', borderRadius: '5px', height :'100%' }}>
            <div style={ {width: '32px', minHeight: '40px'} }>
                <div style={ {height: 'calc(50% - 12px)'} }></div>
                <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" height="24px" width="24px" viewBox="0 0 24 24" data-testid="DragIcon">
                    <path fill={draggable ?  "black" : "lightgrey"} d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                </svg>
                <div style={ {height: 'calc(50% - 12px)'} }></div>
            </div>
            <Divider orientation='vertical' variant='middle' flexItem/>
            <Box style={ {flex:'2'} }>
                {content}
            </Box>
        </Card>
    )
}

function PlaceIcon({ place }) {
    const image = getPhoto(place);

    return(
        <Avatar src={ image } sx={ {width: 50, height: 50} } variant="circular"></Avatar>
    )
}

function StepperLocationDetails({place, index, onClick, onEndit, onRemove}) {
    return(
        <>
        <StepButton style={ {width:'100%'} }
            optional={(<Typography variant="caption">{place.formatted_address}</Typography>)}
            color="inherit" onClick={ ()=>onClick(index) }>
            <StepLabel style={ {width:'100%'} } StepIconComponent={PlaceIcon} StepIconProps={ {place:place} }>
                <Box sx={ {width: '100%'} }>
                    {place.name}
                    <Divider/>
                </Box>
            </StepLabel>
        </StepButton>
        <StepContent>
            <Typography>The quick brown fox jumped over the lazy dog{/*place.description*/}</Typography>
        </StepContent>
        </>
    )
}

function RouteDetailsPane() {
    const [activeStep, setActiveStep] = React.useState(0);
    const itinerary = useItineraryContext();

    const handleStep = (index) => {
        setActiveStep(index);
    }

    return(
        <Card sx={ {backgroundColor: '#f1ffe4', borderRadius: '5px'} }>
            <Stepper activeStep={activeStep} orientation="vertical" nonLinear sx={ {margin: '16px'} }>
                {
                    itinerary.value.map((place, index) => (
                        <Step key={index}>
                            <StepperLocationDetails key={index} place={place} index={index} onClick={handleStep}/>
                        </Step>
                    ))
                }
            </Stepper>
        </Card>
    )
}

export default function Itinerary() {
    return(
        <div style={ {height: 'calc(100vh - 10px - 70px)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'stretch'} }>
            <div style={ { flex: '0 0 200px',  margin: '8px', marginRight: '16px', marginBottom: '0px'} }>
                <SelectedLocationPane/>
            </div>
            <div style={ {margin: '8px', marginBottom: '0px'} } className='thin-h-scroll'>
                <RouteDetailsPane/>
            </div>
        </div>
    )
}
