import { combineReducers } from 'redux'


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
        default:
            return state
    }
}

// Create a root reducer:
const rootReducer = combineReducers({
    placesControls
})

export default rootReducer