import React, { Component } from 'react'

import Map from './Map/Map'
import Controls from './Controls/Control'


class App extends Component {
    render() {
        return (
            <div>
                <Controls />
                <Map />
            </div>
        )
    }
}


export default App
