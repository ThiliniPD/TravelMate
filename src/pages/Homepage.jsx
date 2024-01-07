import * as React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Container, Grid } from "@mui/material";
import Carousel from 'react-bootstrap/Carousel';
import {useState} from "react"; 

const data = [
  {
   image: "/images/sample1.png", 
   caption:"Caption",
   description:"Description Here"
  },
  {
    image: "/images/sample2.jpg", 
    caption:"Caption",
    description:"Description Here"
   },
   {
    image: "/images/sample3.jpg",  
    caption:"Caption",
    description:"Description Here"
   } 
]

function HomeCarousel() {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
       {data.map((slide, i) => {
        return (
          <Carousel.Item>        
        <img
          className="d-block w-100"
          src={slide.image}
          style={{height:"400px", width:"100"}}
          alt="slider image"
        />
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
    return(
     <>
        <Container className='home-main'>

            <Grid container className="home-main-header">
                <Grid item  xs={12} sm={12} md={6} lg={6} xl={6}>
                    <div className="text-overlay">
                        <h1 className='home-main-heading'>Travelling together</h1>
                        <p className='home-main-para'>Planning a trip was never better...</p>
                    </div>
                </Grid>
                <Grid item  xs={12} sm={12} md={6} lg={6} xl={6}>
                        <img className= "home-main-locationImg" src="/images/location.png"></img>
                </Grid>                
            </Grid>

            <Grid container  className='home-scroll'>  
                <Grid item  xs={12} sm={12} md={12} lg={12} xl={12}> 
                    <HomeCarousel />
                </Grid>      
            </Grid>

            <Grid container className='home-tip-1'>
                <Grid item className="home-tip-1-col-1" xs={12} sm={12} md={4} lg={4} xl={4}>
                        <img src="/images/tip1.png" style={{height:"200px"}}></img>
                </Grid>
                <Grid item className="home-tip-1-col-2" xs={12} sm={12} md={8} lg={8} xl={8}>
                        <p>Did you get lost planning your itinerary.<br/>
                           Chill... We got you.
                        </p>
                </Grid>
            </Grid>

            <Grid container className='home-tip-2'>
                <Grid item className="home-tip-2-col-1" xs={12} sm={12} md={6} lg={6} xl={6}>
                        <p>Everything is everywhere.<br/>
                           Yeah.. We know the feeling.
                        </p>  
                </Grid>
                <Grid item className="home-tip-2-col-2" xs={12} sm={12} md={6} lg={6} xl={6}>     
                    <img src="/images/tip2.png" style={{height:"200px"}}></img>
                </Grid>
            </Grid>

            <Grid container className='home-tip-3'>
                <Grid item className="home-tip-3-col-1" xs={12} sm={12} md={6} lg={6} xl={6}>
                        <img src="/images/tip1.png" style={{height:"200px"}}></img>
                </Grid>
                <Grid item className="home-tip-3-col-2" xs={12} sm={12} md={6} lg={6} xl={6}>
                        <p>Looking for recommendations to tick off your bucket list...<br/>
                           Great! You are at the right place.
                        </p>
                </Grid>
            </Grid>

            <Grid container className='home-tip-4'>
                <Grid item className="home-tip-4-col-1" xs={12} sm={12} md={6} lg={6} xl={6}>
                        <p>Share your adventures with your family and friends.</p>  
                </Grid>
                <Grid item className="home-tip-4-col-2" xs={12} sm={12} md={6} lg={6} xl={6}>     
                    <img src="/images/tip2.png" style={{height:"200px"}}></img>
                </Grid>
            </Grid>
        </Container>
        <footer></footer>
     </>
    )

}
