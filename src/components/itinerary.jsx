import React from 'react';
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded';
import { Avatar, Button, Card, Chip, Divider, Grid, IconButton, TextField, } from '@mui/material';
import { Step, StepButton, StepContent, StepLabel, Stepper, Typography } from '@mui/material';
import Box from '@mui/material/Box'; // keep this import at last as a workaround for MUI issue

const steps = [
    {
      label: 'Select campaign settings',
      description: `For each ad campaign that you create, you can control how much
                you're willing to spend on clicks and conversions, which networks
                and geographical locations you want your ads to show on, and more.`,
    },
    {
      label: 'Create an ad group',
      description:
        'An ad group contains one or more ads which target a shared set of keywords.',
    },
    {
      label: 'Create an ad',
      description: `Try out different ad text to see what brings in the most customers,
                and learn how to enhance your ads using features like ad extensions.
                If you run into any problems with your ads, find out how to tell if
                they're running and how to resolve approval issues.`,
    },
  ];

const actionInfo = [
    { action: 'Starting Point', image: 'src/assets/location-type-start.png' },
    { action: 'Visit Location', image: 'src/assets/location-type-visit.png' },
    { action: 'Food Stop', image: 'src/assets/location-type-food-stop.png' },
    { action: 'Rest Stop', image: 'src/assets/location-type-rest-stop.png' },
    { action: 'Ending Point', image: 'src/assets/location-type-end.png' },
]

export default function Itinerary() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [selectedAction, setSelectedAction] = React.useState(0);
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleStep = (index) => {
        setActiveStep(index);
    }

    return(
        <div style={ {height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'} }>
            <div>
                <Card sx={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#f1ffe4', margin:'8px', 
                    marginRight: '16px', marginBottom: '0px' , borderRadius: '5px' }}>
                    <div>
                        <div style={ {height: 'calc(50% - 6px)'} }></div>
                        <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" height="24px" width="24px" viewBox="0 0 24 24" data-testid="DragIcon">
                            <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                        </svg>
                    </div>
                    <Divider orientation='vertical' variant='middle' flexItem/>
                    <Box style={ {flex:'2'} }>
                        <div className='MuiCardHeader-root' style={ {padding: '8px', display:'flex', flexDirection: 'column'} }>
                            <div style={ {display: 'flex', flexDirection: 'row'} }>
                                <img className='MuiCardMedia-root' 
                                    src='https://mui.com/static/images/cards/live-from-space.jpg'
                                    style={ {width: '75px', height: '75px', border:'5px solid #78a383', borderRadius: '5px'} }>
                                </img>
                                <div style={ {padding: '8px', paddingTop: '0px', textAlign: 'left'} }>
                                    <Typography variant="h6" style={ {} }>1/11 Carillon Avenue</Typography>
                                    <Typography variant="subtitle1" style={ {color: "lightgrey"} }>Camperdown NSW, Australia</Typography>
                                </div>
                            </div>
                            <div style={ {display:'flex', flexDirection: 'row',flexWrap: 'wrap', alignItems: 'stretch'} }>
                                <div style={ {padding: '8px', display:'flex', flexDirection: 'row',flexWrap: 'wrap'} }>
                                    {
                                        actionInfo.map((info, index) => {
                                            return (
                                                <Button key={ index } aria-label={ info.action } color='success' 
                                                    variant={ selectedAction == index ? 'outlined':'' } 
                                                    onClick={ ()=>{ setSelectedAction(index) } }
                                                    disabled={ false /*TODO: set based on added items*/ }>
                                                    <Avatar sx={ {width: 32, height: 32} } variant="rounded" src={info.image}/>
                                                </Button>
                                            );
                                        })
                                    }
                                </div>
                                <div style={ {margin: 'auto', height:'50%', marginRight: '8px'} }>
                                    <Button variant='outlined' color='success' startIcon={<AddLocationAltRoundedIcon/>}>Add</Button>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Card>
            </div>
            <div className='thin-h-scroll' style={ {flexGrow: 2} } >
                <Card sx={ {backgroundColor: '#f1ffe4', margin:'8px', borderRadius: '5px', height: 'calc(100% - 16px)'} }>
                    <Stepper activeStep={activeStep} orientation="vertical" nonLinear sx={ {margin: '16px'} }>
                        {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepButton style={ {width:'100%'} }
                                optional={
                                    index === 2 ? (
                                    <Typography variant="caption">Last step</Typography>
                                    ) : null
                                }
                                color="inherit" onClick={ ()=>handleStep(index) }>
                                <StepLabel style={ {width:'100%'} }>
                                    <Box sx={ {width: '100%'} }>
                                        {step.label}
                                        <Divider/>
                                    </Box>
                                </StepLabel>
                            </StepButton>
                            <StepContent>
                                <Typography>{step.description}</Typography>
                                <Box sx={{ mb: 2 }}>
                                    <div>
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            sx={{ mt: 1, mr: 1 }}
                                        >
                                            {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                        </Button>
                                        <Button
                                            disabled={index === 0}
                                            onClick={handleBack}
                                            sx={{ mt: 1, mr: 1 }}
                                        >
                                            Back
                                        </Button>
                                    </div>
                                </Box>
                            </StepContent>
                        </Step>
                        ))}
                    </Stepper>
                </Card>
            </div>
        </div>
    )
}