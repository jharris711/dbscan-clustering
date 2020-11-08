import React, { Component } from 'react'
import PropTypes from 'prop-types'
import L from 'leaflet'
import HereTileLayers from './hereTileLayers'
import { doUpdateBoundingBox } from '../actions/actions'
import { connect } from 'react-redux'


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
    static propTypes = {
        lastCall: PropTypes.number,
        lastCompute: PropTypes.number,
        dbscanSettings: PropTypes.object,
        dispatch: PropTypes.func.isRequired,
        places: PropTypes.object
    }

    // Add everything once component has mounted:
    componentDidMount() {
        const { dispatch } = this.props
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

        // When the map is paned, update the boundingbox
        // in the redux store:
        this.map.on('moveend', () => {
            dispatch(doUpdateBoundingBox(this.map.getBounds()))
        })

        // And also on load:
        dispatch(doUpdateBoundingBox(this.map.getBounds()))
    }

    componentDidUpdate(prevProps) {
        const { lastCall } = this.props
        // Is the epoche timestamp later?
        if (lastCall > prevProps.lastCall) {
            // If so, then start adding places to the map:
            this.addPlaces()
        }
    }

    addPlaces() {
        // Clear layers with Leaflet API:
        placesLayer.clearLayers()
      
        // Places will become part of props, but we need to
        // connect this component to our state in the next step:
        const { places } = this.props
        let cnt = 0
        // Loop through our places:
        for (const place in places) {
          // Check for data:
          if (
            places[place].hasOwnProperty('data') &&
            places[place].data.length > 0
          ) {
            // Add a Leaflet circle-marker and tooltip for every place:
            for (const placeObj of places[place].data) {
              L.circleMarker([placeObj.position[0], placeObj.position[1]], {
                color: places[place].color,
                orig_color: places[place].color,
                radius: 5,
                id: cnt,
                weight: 1,
                opacity: 0.5
              })
                .addTo(placesLayer)
                .bindTooltip(placeObj.title)
              cnt += 1
            }
          }
        }
    }

    render() {
        return (
            <div id="map" style={style} />
        )
    }
}


const mapStateToProps = state => {
    const { places, lastCall } = state.placesControls
    return {
        places,
        lastCall
    }
}


export default connect(mapStateToProps)(Map)