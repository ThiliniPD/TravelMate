
import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};
const center = {
  lat: 7.2905715, // default latitude
  lng: 80.6337262, // default longitude
};

export default function Map (props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB4L45EgWGU3NK2KyYr7orRvxLrEFsoFRo',
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div style={{ width:'100%', backgroundColor: 'green' }}>
      {/**/}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
      >
        <Marker position={center} />
      </GoogleMap>
      {/**/}
    </div>
  );
};
