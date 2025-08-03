
import { LngLatLike } from "mapbox-gl";


const MAPBOX_STYLE = "mapbox://styles/mapbox/satellite-streets-v12";
// const MAPBOX_STYLE = "mapbox://styles/geoscape-psma/clpt55jcl00f201px05cd3bf1";

const API_BASE_URL = "https://api.psma.com.au/v1/maps/geoscape_v1/";

const INITIAL_CENTER: LngLatLike = [133.7751, -25.2744];

const INITIAL_ZOOM = 4;


export {
  API_BASE_URL,
  INITIAL_CENTER,
  INITIAL_ZOOM,
  MAPBOX_STYLE
};
