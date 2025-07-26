const getAddressFromCoordinates = async (lng: any, lat: any) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error fetching address');
  }
  
  const data = await response.json();
  return data.features.length > 0 ? data.features[0].place_name : 'No address found';
};

export {
  getAddressFromCoordinates,
}