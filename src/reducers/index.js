import { combineReducers } from 'redux'

import {
    REQUEST_PLACES_RESULTS,
    RECEIVE_PLACES_RESULTS,
    CLEAR,
    UPDATE_BBOX,
    UPDATE_DBSCAN_SETTINGS,
    COMPUTE_DBSCAN,
} from '../actions/actions'

// The initial state object with an empty boundingbox
// string, a lastCall date field, and an empty places
// object
const initialPlacesState = {
    boundingbox: '',
    lastCall: Date.now(),
    places: {},
    dbscanSettings: {
        minPoints: 10,
        maxDistance: 500,
    },
    // This lastCompute will help us determine if a new 
    // computation should be made:
    lastCompute: 0,
}

// Switch statement that will reduce the actions depending
// on what is being called:
const placesControls = (state = initialPlacesState, action) => {
    switch(action.type) {
        // Send request, let button know it is doing something:
        case REQUEST_PLACES_RESULTS:
            return {
                ...state,
                places: {
                    ...state.places,
                    [action.payload.category]: {
                        ...state.places[action.payload.category],
                        isFetching: true,
                    }
                }
            }
        // If results are received, start reducing the state:
        case RECEIVE_PLACES_RESULTS:
            return {
                ...state,
                // When the data was received:
                lastCall: Date.now(),
                // Update the places object:
                places: {
                    ...state.places,
                    // for the requested category:
                    [action.payload.category]: {
                        ...state.places[action.payload.category],
                        // This ternary operator decides if we will 
                        // merge previous calls or not:
                        data: state.places[action.payload.category].hasOwnProperty('data')
                            ? [
                                ...state.places[action.payload.category].data,
                                ...action.payload.data,
                            ]
                            : action.payload.data,
                        // Save the bounding box of the API request:
                        boundingbox: action.payload.boundingbox,
                        // Save the color:
                        color: action.payload.color,
                        // Disable spinner:
                        isFetching: false,
                    }
                }
            }
        case CLEAR:
            return {
                ...state,
                places: {},
                lastCall: Date.now(),
                lastCompute: Date.now(),
            }
        case UPDATE_BBOX:
            return {
                ...state,
                boundingbox: action.payload,
            }
        // Update the lastCompute key when this action is called:
        case COMPUTE_DBSCAN:
            return {
                ...state,
                lastCompute: Date.now()
            }
        // Update dbscan settings when theses are changed in 
        // the controller by the user:
        case UPDATE_DBSCAN_SETTINGS:
            return {
                ...state,
                dbscanSettings: {
                    ...state.dbscanSettings,
                    [action.payload.setting]: action.payload.value,
                }
            }
        default:
            return state
    }
}

// Create a root reducer:
const rootReducer = combineReducers({
    placesControls
})

export default rootReducer