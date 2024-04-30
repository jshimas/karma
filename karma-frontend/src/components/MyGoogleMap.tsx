import React from "react";
import mapStyles from "../assets/googleMapStyle.json";
import { Map } from "@vis.gl/react-google-maps";

interface MapProps {
  onLoad?: (map: google.maps.Map) => void | Promise<void>;
  center: google.maps.LatLngLiteral;
  zoom: number;
  children?: React.ReactNode;
}

const MyGoogleMap: React.FC<MapProps> = ({ center, zoom, children }) => {
  return (
    <Map
      mapId={"f6a6a7b729f6110d"}
      style={{ zIndex: 1 }}
      styles={mapStyles as google.maps.MapTypeStyle[]} // Apply custom map styles
      defaultCenter={center}
      defaultZoom={zoom}
      disableDefaultUI
    >
      {children}
    </Map>
  );
};

export default MyGoogleMap;
