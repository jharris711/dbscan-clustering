import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Button, Label, Popup } from 'semantic-ui-react'

import { fetchHerePlaces, clear } from '../actions/actions'

// Some styling:
const segmentStyle = {
    zIndex: 999,
    position: 'absolute',
    width: '400px',
    top: '10px',
    left: '10px',
    maxHeight: 'calc(100vh-3vw)',
    overflow: 'auto',
    padding: '20px',
}

// Fetch HERE Maps places categories and add colors:
const herePlaces = {
    0: { name: 'shopping', color: 'red' },
    1: { name: 'accommodation', color: 'orange' },
    2: { name: 'administrative-areas-buildings', color: 'yellow' },
    3: { name: 'airport', color: 'olive' },
    4: { name: 'atm-bank-exchange', color: 'green' },
    5: { name: 'coffee-tea', color: 'teal' },
    6: { name: 'eat-drink', color: 'blue' },
    7: { name: 'going-out', color: 'violet' },
    8: { name: 'hospital-health-care-facility', color: 'purple' },
    9: { name: 'leisure-outdoor', color: 'pink' },
    10: { name: 'natural-geographical', color: 'brown' },
    11: { name: 'petrol-station', color: 'green' },
    12: { name: 'restaurant', color: 'grey' },
    13: { name: 'snacks-fast-food', color: 'black' },
    14: { name: 'sights-museums', color: 'red' },
    16: { name: 'toilet-rest-area', color: 'yellow' },
    17: { name: 'transport', color: 'olive' }
}

// Label component:
const CustomLabel = ({ content, value }) => (
    <Popup content={content} trigger={<Label size="tiny">{value}</Label>} />
)

class Control extends Component {
    static propTypes = {
        places: PropTypes.object,
        dispatch: PropTypes.func.isRequired,
    }

    // Places button logic:
    handleClick = (event, data) => {
        const { dispatch } = this.props
        dispatch(fetchHerePlaces({ category: data.content, color: data.color }))
    }

    // When remove icon is clicked:
    handleClickClear = () => {
        const { dispatch } = this.props
        dispatch(clear())
    }

    // Buttons will be disabled if no places exist:
    areButtonsDisabled = places => {
        let buttonsDisabled = true
        for (const key in places) {
            if (places.hasOwnProperty(key)) {
                if (places[key].hasOwnProperty('data') && places[key].data.length > 0) {
                    buttonsDisabled = false
                }
            }
        }
        return buttonsDisabled
    }

    render() {
        // Places coming from the redux state:
        const { places } = this.props

        // Custom button component with a bunch of props/options:
        const CustomButton =({
            content,
            circular,
            popupContent,
            handler,
            icon,
            value,
            disabled,
            basic,
            size,
            loading,
            color
        }) => (
            <Popup
                content={popupContent}
                size={size}
                trigger={
                    <Button
                        color={color}
                        circular={circular}
                        content={content}
                        loading={loading}
                        size={size}
                        onClick={handler}
                        basic={basic}
                        disabled={disabled}
                        icon={icon}
                    />
                }
            />
        )

        // Loop through the herePlaces object defined above and add
        // semantic-UI buttons this way:
        return (
            <div>
                <Segment style={segmentStyle}>
                    <div>
                        {Object.keys(herePlaces).map((key, index) => {
                            return (
                                <div key={index} className="mt1 dib">
                                    <CustomButton
                                        icon={false}
                                        popupContent={'Fetch places of this category'}
                                        content={herePlaces[key].name}
                                        disabled={false}
                                        handler={this.handleClick}
                                        color={herePlaces[key].color}
                                        loading={
                                            places[herePlaces[key].name]
                                                ? places[herePlaces[key].name].isFetching
                                                : false
                                        }
                                        size="tiny"
                                    />
                                </div>
                            )
                        })}
                        <div className="mt2">
                            <CustomButton
                                icon={'remove'}
                                size={'tiny'}
                                popupContent={'Reset places and map'}
                                handler={this.handleClickClear}
                                disabled={this.areButtonsDisabled(places)}
                            />
                        </div>
                    </div>
                </Segment>
            </div>
        )
    }
}

// Connect the component to the redux store:
const mapStateToProps = state => {
    const { places } = state.placesControls
    return {
        places
    }
}

// Export with react-redux connect function:
export default connect(mapStateToProps)(Control)