import React, { Component } from 'react'
import L from 'leaflet'
import HereTileLayers from './hereTileLayers'


// Define the container styles the map sits in:
const style = {
    width: '100%',
    height: '100vh',
}

// Use the reduced.day map style:
const hereReducedDay = HereTileLayers.here({
    appId: 'jKco7gLGf0WWlvS5n2fl',
    appCode: 'HQnCztY23zh2xiTPCFiTMA',
    scheme: 'reduced.day'
})

// Create two leaflet layer groups to control.
// One for the isochrone centers and one for 
// the isochrone contours
const placesLayer = L.featureGroup()
const clusterLayer = L.featureGroup()

// Params for map:
const mapParams = {
    center: [40.7569, -73.9837],
    zoomControl: false,
    maxBounds: L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180)),
    zoom: 13,
    layers: [placesLayer, clusterLayer, hereReducedDay], 
}

class Map extends Component {

    // Add everything once component has mounted:
    componentDidMount() {
        // The map:
        this.map = L.map('map', mapParams)

        // Create leaflet pane that holds all cluster polygons
        // with a given opacity
        const clusterPane = this.map.createPane('clusterPane')
        clusterPane.style.opacity = 0.9

        // Basemap tile layer:
        const baseMaps = {
            'HERE Maps Tiles: reduced day': hereReducedDay,
        }

        // Add the overlay maps:
        const overlayMaps = {
            'Points of interest': placesLayer,
            Clusters: clusterLayer
        }

        // Add the layers to the layer control and add to map:
        L.control
            .layers(baseMaps, overlayMaps)
            .addTo(this.map)
        //

        // Create the zoom control:
        L.control
            .zoom({position: 'topright'})
            .addTo(this.map)
        //
    }

    render() {
        return (
            <div id="map" style={style} />
        )
    }
}


export default Map