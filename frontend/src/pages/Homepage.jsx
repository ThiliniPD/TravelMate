import {useState} from "react";
import styled from "@emotion/styled";
import Carousel from 'react-bootstrap/Carousel';
import { Button } from '@mui/material';
import { Grid } from "@mui/material";

const data = [
    {
     image: "src/assets/sample1.png", 
     caption:"Caption",
     description:"Description Here"
    },
    {
      image: "src/assets/sample1.png", 
      caption:"Caption",
      description:"Description Here"
     },
     {
      image: "src/assets/sample1.png",  
      caption:"Caption",
      description:"Description Here"
     } 
  ]

const Styled = styled('div')(({ theme, breakPoint, maxWidth }) => {
    if (breakPoint == null) {
        breakPoint = 900;
    }
    if (maxWidth == null) {
        maxWidth = '320px'
    }
    
    return ({
        [theme.breakpoints.up(breakPoint)]: {
            maxWidth: 'unset'
        },
        [theme.breakpoints.down(breakPoint)]: {
            maxWidth: maxWidth
        }
    })
});

function HomeCarousel() {
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    return (
        <Carousel activeIndex={index} onSelect={handleSelect} interval={100000}>
            {data.map((slide, i) => {
                return (
                    <Carousel.Item key={i}>
                        <Grid container>
                            <Grid item xs={12} md={4}>
                                <Styled style={{margin: 'auto', marginRight: '0px'}}>
                                    <img
                                        className="d-block"
                                        src={slide.image}
                                        style={{width:"100%"}}
                                        alt="slider image"
                                    />
                                </Styled>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Styled style={{margin: 'auto'}}>
                                    <img
                                        className="d-block"
                                        src={slide.image}
                                        style={{width:"100%"}}
                                        alt="slider image"
                                    />
                                </Styled>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Styled style={{margin: 'auto', marginLeft:'0px'}}>
                                    <img
                                        className="d-block"
                                        src={slide.image}
                                        style={{width:"100%"}}
                                        alt="slider image"
                                    />
                                </Styled>
                            </Grid>
                        </Grid>
                        <Carousel.Caption>
                            <h3>{slide.caption}</h3>
                            <p>{slide.description}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                )
            })}
        </Carousel>
    );
}

export default function Homepage() {
    return (
        <>
            <div style={{height: '100%', backgroundColor:'#083D77'}}>
                <Grid container style={{maxWidth: '1200px', margin: 'auto'}}>
                    <Grid item  xs={12} sm={12} md={6} lg={6} xl={6}>
                        <div style={{marginTop: '16px'}}>
                            <h1 className="home-main-title">Travelling together ?</h1>
                            <p className="home-main-para">Planning a trip was never better...</p>
                        </div>
                    </Grid>
                    <Grid item  xs={12} sm={12} md={6} lg={6} xl={6}>
                        <img src="src/assets/location.png" style={{height: '50vw', maxHeight: '55vh'
                            , paddingTop: '16px', paddingBottom: '16px'}}></img>
                    </Grid>
                </Grid>
            </div>

            <Grid container  className='home-scroll'>  
                <Grid item  xs={12} sm={12} md={12} lg={12} xl={12}> 
                    <HomeCarousel />
                </Grid>
            </Grid>

            <div style={{background: 'linear-gradient(180deg, rgba(8,61,119,1) 0%, rgba(82,119,160,1) 100%)'}}>
                <Grid container className='home-tip-1'>
                    <Grid item className="home-tip-1-col-1" xs={12} sm={12} md={4} lg={4} xl={4}>
                            <img src="src/assets/tip1.png" style={{height: '30vw', maxHeight: '35vh'}}></img>
                    </Grid>
                    <Grid item className="home-tip-1-col-2" xs={12} sm={12} md={8} lg={8} xl={8}>
                            <p className="home-main-para">Did you get lost planning your itinerary.<br/>
                                Chill... We got you.
                            </p>
                    </Grid>
                </Grid>

                <Grid container className='home-tip-2'>
                    <Grid item className="home-tip-2-col-1" xs={12} sm={12} md={6} lg={6} xl={6}>
                            <p className="home-main-para">Everything is everywhere.<br/>
                                Yeah.. We know the feeling.
                            </p>  
                    </Grid>
                    <Grid item className="home-tip-2-col-2" xs={12} sm={12} md={6} lg={6} xl={6}>     
                        <img src="src/assets/tip2.png" style={{height: '30vw', maxHeight: '35vh'}}></img>
                    </Grid>
                </Grid>

                <Grid container className='home-tip-3'>
                    <Grid item className="home-tip-3-col-1" xs={12} sm={12} md={6} lg={6} xl={6}>
                            <img src="src/assets/tip1.png" style={{height: '30vw', maxHeight: '35vh'}}></img>
                    </Grid>
                    <Grid item className="home-tip-3-col-2" xs={12} sm={12} md={6} lg={6} xl={6}>
                            <p className="home-main-para">Looking for recommendations to tick off your bucket list...<br/>
                                Great! You are at the right place.
                            </p>
                    </Grid>
                </Grid>

                <Grid container className='home-tip-4'>
                    <Grid item className="home-tip-4-col-1" xs={12} sm={12} md={6} lg={6} xl={6}>
                            <p className="home-main-para">Share your adventures with your family and friends.</p>  
                    </Grid>
                    <Grid item className="home-tip-4-col-2" xs={12} sm={12} md={6} lg={6} xl={6}>     
                        <img src="src/assets/tip2.png" style={{height: '30vw', maxHeight: '35vh'}}></img>
                    </Grid>
                </Grid>

                <div style={{width: '100%', padding: '16px'}}>
                    <Styled style={{width: '100%', margin:'auto'}} maxWidth='200px'>
                        <Button>
                            <img style={{width: '100%'}} src="src/assets/start-button.png"></img>
                        </Button>
                    </Styled>
                </div>

            </div>
        </>
    )
}
