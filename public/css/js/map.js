 // TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style:"mapbox://styles/mapbox/streets-v12",
center:Listing.geometry.coordinates, // starting position [lng, lat]
zoom: 7 // starting zoom
});


const marker=new mapboxgl.Marker({color:"red"})
.setLngLat(Listing.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ offset:25 })
.setHTML(`<h4>${Listing.title}</h4><p>Exact location will be provided after booking.</p>`)
)
.addTo(map);
// Create a new marker.
// const marker = new mapboxgl.Marker({color:"red"})
// .setlnglat(coordinate)
// .addTo(map);
