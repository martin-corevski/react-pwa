import React, { Component } from 'react'
import { connect } from 'react-redux'
import { enableNotifications } from '../../services/notificationsMgmt'

import * as actionCreators from '../../store/actions/index'

class ReduxReady extends Component {
  componentDidMount = () => {
    this.props.onInitializeState()
  }

  render () {
    return (
      <div>
        <h1>Test redux saga by pressing the buttons</h1>
        <h3>{this.props.str}</h3>
        <button onClick={this.props.onAction1} style={{ cursor: 'pointer' }}>
          Test action
        </button>
        <button onClick={this.props.onStoreData} style={{ cursor: 'pointer' }}>
          Add number
        </button>
        <hr />
        {this.props.nums ? this.props.nums.join(' ') : ''}
        <h4>Errors: </h4>
        {this.props.error}
        <hr />
        <h1>Notify me when a number is added</h1>
        {/* We can hide the button as soon as we have an active subscription */}
        <button onClick={enableNotifications} style={{ cursor: 'pointer' }}>
          Enable notifications
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    str: state.r1.string,
    nums: state.r2d2.numbers,
    error: state.r2d2.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onInitializeState: () => dispatch(actionCreators.initializeState()),
    onAction1: () => dispatch(actionCreators.action1()),
    onStoreData: () => dispatch(actionCreators.storeData(1))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxReady)
