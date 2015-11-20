import React, { Component } from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, bindActionCreators, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import createLogger from 'redux-logger'

const logger = createLogger();

// Actions
const inc = () => ({ type: 'INC' });
const dec = () => ({ type: 'DEC' });
const incIfOdd = () => (dispatch, getState) => {
  const { counter } = getState();
  if (counter % 2 === 0) {
    return;
  }
  dispatch(inc());
}
const incAsync = (delay = 1000) => dispatch => setTimeout(() => dispatch(inc()), delay);

// Reducer
const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INC':
      return state + 1;
    case 'DEC':
      return state - 1;
    default:
      return state;
  }
}

const reducer = combineReducers({
  counter
});

const store = applyMiddleware(thunk,logger)(createStore)(reducer);




// Component
// New syntax in 0.14 for pure render component
// parameter `props` could be deconstructured as following:
// Awesome!
const mapState = state => ({ counter: state.counter });
const mapDispatch = dispatch => bindActionCreators({ inc, dec, incIfOdd, incAsync }, dispatch);

//const App = connect(stateToProps, dispatcherToProps)(Counter);
@connect(mapState, mapDispatch)
class App extends Component {
  render = () => {
    const { counter, inc, dec, incIfOdd, incAsync } = this.props
    return (
      <div>
        Clicked: { counter } times
        {' '}
        <button onClick={ inc }>+</button>
        {' '}
        <button onClick={ dec }>-</button>
        {' '}
        <button onClick={ incIfOdd }>IncIfOdd</button>
        {' '}
        <button onClick={ () => incAsync() }>Async</button>
        <Text content={ counter } other="2222" inc={ inc }/>
      </div>
    )
  }
}

class Text extends Component {
  render = () => <div>
    <h1>
      { this.props.content }
    </h1>
    <h2>
      { this.props.other }
    </h2>
    <button onClick={ this.props.inc }>INC</button>
  </div>
}

// render
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
