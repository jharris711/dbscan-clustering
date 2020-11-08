const hereAppCode = 'HQnCztY23zh2xiTPCFiTMA'
const hereAppId = 'jKco7gLGf0WWlvS5n2fl'

// Create the action types:
export const RECEIVE_PLACES_RESULTS = 'RECEIVE_PLACES_RESULTS'
export const REQUEST_PLACES_RESULTS = 'REQUEST_PLACES_RESULTS'
export const CLEAR = 'CLEAR'

// This function makes the call to the HERE Maps API:
export const fetchHerePlaces = payload => (dispatch, getState) => {
    // This dispatcher makes sure the loading icons spin:
    dispatch(requestPlacesResults({ category: payload.category }))

    // Access the state in the action to retrieve the boundingbox
    // of the map, which will be reduced in the subsequent step:
    const { boundingbox } = getState().placesControls

    // For more info on these params, visit:
    // https://developer.here.com/documentation/places/topics/search-results-ranking.html
    const url = new URL(
        'https://places.demo.api.here.com/places/v1/discover/explore'
    )
    const params = {
        app_id: hereAppId,
        app_code: hereAppCode,
        // This will come from the Map component:
        in: boundingbox,
        // The amount of places:
        size: 100,
        // Category clicked/selected by user:
        cat: payload.category
    }

    url.search = new URLSearchParams(params)

    return fetch(url)
        // Return data as JSON:
        .then(response => response.json())
        .then(data => 
            // Once the JSON data is returned, dispatch the parsing
            // of the data which will include the category and the color:
            dispatch(
                processPlacesResponse(
                    data,
                    payload.category,
                    boundingbox,
                    payload.color
                )
            )
        )
        .catch(error => console.error(error))
}

// Action to clear places:
export const clear = () => ({
    type: CLEAR
})

const parsePlacesResponse = json => {
    if (json.results && json.results.items.length > 0) {
        return json.results.items
    }
    return []
}

const processPlacesResponse = (json, category, bbox, color) => dispatch => {
    const results = parsePlacesResponse(json)

    // The response should be parsed at this point and ready to be 
    // dispatched to our reducer:
    dispatch(
        receivePlacesResults({
            data: results,
            category: category,
            boundingbox: bbox,
            color: color,
        })
    )
}

export const receivePlacesResults = places => ({
    type: RECEIVE_PLACES_RESULTS,
    payload: places,
})

export const requestPlacesResults = category => ({
    type: REQUEST_PLACES_RESULTS,
    payload: category,
})