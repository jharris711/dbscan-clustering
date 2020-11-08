import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Button, Label, Popup, Divider, Header } from 'semantic-ui-react'
import { Slider } from 'react-semantic-ui-range'
import { fetchHerePlaces, clear , updateDbScanSettings, computeDbScan} from '../actions/actions'

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

// Custom slider component to be used for both dbscan settings:
const CustomSlider = ({
    name,
    min,
    max,
    step,
    start,
    value,
    dispatch 
}) => (
    <Slider 
        discrete
        color="grey"
        settings={{
            start: start,
            value: value,
            min: min,
            max: max,
            step: step,
            onChange: val => {
                // if the slider is changed dispatch an action!
                dispatch(
                    updateDbScanSettings({
                        setting: name,
                        value: val
                    })
                )
            }
        }}
    />
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

    handleClickDbScan = () => {
        const { dispatch } = this.props
        dispatch(computeDbScan())
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
        const { places, dbscanSettings, dispatch } = this.props

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
                
                <Header as="h5">DBScan settings</Header>
                    <div className="flex flex-row">
                    <div className="w-80">
                        <CustomSlider
                        name={'maxDistance'}
                        min={100}
                        max={5000}
                        step={50}
                        start={dbscanSettings.maxDistance}
                        value={dbscanSettings.maxDistance}
                        dispatch={dispatch}
                        />
                        <div className="mt2">
                        <CustomLabel
                            value={'Max. distance: ' + dbscanSettings.maxDistance}
                            content={
                            'Maximum Distance ε between any point of the cluster to generate the clusters'
                            }
                        />
                        </div>
                    </div>
                    <div className="w-80">
                        <CustomSlider
                        name={'minPoints'}
                        min={3}
                        max={20}
                        step={1}
                        start={dbscanSettings.minPoints}
                        value={dbscanSettings.minPoints}
                        dispatch={dispatch}
                        />

                        <div className="mt2">
                        <CustomLabel
                            value={'Min. points: ' + dbscanSettings.minPoints}
                            content={
                            "Minimum number of points to generate a single cluster, points which do not meet this requirement will be classified as an 'edge' or 'noise'."
                            }
                        />
                        </div>
                    </div>
                    <div className="w-20">
                        <CustomButton
                        basic={true}
                        size={'tiny'}
                        icon={'whmcs'}
                        circular={true}
                        popupContent={'Compute DBScan'}
                        disabled={this.areButtonsDisabled(places)}
                        handler={this.handleClickDbscan}
                        />
                    </div>
                    </div>
                    <Divider />
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
    const { places, dbscanSettings } = state.placesControls
    return {
        places,
        dbscanSettings,
    }
}

// Export with react-redux connect function:
export default connect(mapStateToProps)(Control)