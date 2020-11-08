import { combineReducers } from 'redux'

import {
    REQUEST_PLACES_RESULTS,
    RECEIVE_PLACES_RESULTS,
    CLEAR,
} from '../actions/actions'

// The initial state object with an empty boundingbox
// string, a lastCall date field, and an empty places
// object
const initialPlacesState = {
    boundingbox: '',
    lastCall: Date.now(),
    places: {},
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
        default:
            return state
    }
}

// Create a root reducer:
const rootReducer = combineReducers({
    placesControls
})

export default rootReducer