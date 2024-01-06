import React from 'react';
import { Box } from '@mui/material';
import { Button, Card, Chip, Divider, } from '@mui/material';
import { Step, StepButton, StepContent, StepLabel, Stepper, Typography } from '@mui/material';

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

export default function Itinerary() {
    const [activeStep, setActiveStep] = React.useState(0);
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
                <Card sx={{ display: 'flex', backgroundColor: '#f1ffe4', margin:'8px', marginRight: '16px' , borderRadius: '5px' }}>
                    <div style={ {height: '100%', verticalAlign: 'middle'} }>
                        <div style={ {height: '10px'} }></div>
                        <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" height="24px" width="24px" viewBox="0 0 24 24" data-testid="DragIcon">
                            <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                        </svg>
                        <div style={ {height: '10px'} }></div>
                    </div>
                    <Divider orientation='vertical' variant='middle' flexItem/>
                    <Box height={200}>
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
                            <div>

                            </div>
                        </div>
                    </Box>
                </Card>
            </div>
            <div className='thin-h-scroll' style={ {flexGrow: 2} } >
                <Card sx={ {backgroundColor: '#f1ffe4', margin:'8px', borderRadius: '5px'} }>
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