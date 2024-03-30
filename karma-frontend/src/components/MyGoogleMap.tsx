import React from "react";
import mapStyles from "../assets/googleMapStyle.json";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

interface MapProps {
  onLoad?: (map: google.maps.Map) => void | Promise<void>;
  center: google.maps.LatLngLiteral;
  zoom: number;
  children?: React.ReactNode;
}

const MyGoogleMap: React.FC<MapProps> = ({ center, zoom, children }) => {
  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}
      libraries={["marker", "places"]}
    >
      <Map
        mapId={"f6a6a7b729f6110d"}
        style={{ zIndex: 1 }}
        styles={mapStyles as google.maps.MapTypeStyle[]} // Apply custom map styles
        defaultZoom={zoom}
        defaultCenter={center}
        disableDefaultUI
      >
        {children}
      </Map>
    </APIProvider>
  );
};

export default MyGoogleMap;
