import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import registerServiceWorker from './registerServiceWorker'
// Isomorphic style loader context provider
import ContextProvider from './hoc/ContextProvider'

import './index.scss'
import App from './containers/App'
import reducer1 from './store/reducers/reducer1'
import reducer2 from './store/reducers/reducer2'
import { watchActionCreator2 } from './store/sagas/index'

// Combining multiple reducers
const rootReducer = combineReducers({
  r1: reducer1,
  r2d2: reducer2
})

// Custom middleware for logging the dispatched actions and current state
const logger = store => {
  return next => {
    return action => {
      console.log('[Middleware] Dispatching ', action)
      const result = next(action)
      console.log('[Middleware] Next state ', store.getState())
      return result
    }
  }
}

const sagaMiddleware = createSagaMiddleware()

// For Chrome Dev tools, https://github.com/zalmoxisus/redux-devtools-extension
const composeEnhancers =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : null || compose

// For single reducer store
// const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
// Multiple reducers store and as a second argument we can pass the so called
// enhancer (the middleware or multiple middlewares)
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(logger, sagaMiddleware))
)

sagaMiddleware.run(watchActionCreator2)

// ContextProvider is used in order for isomorphic-style-loader to function properly
const context = {
  insertCss: (...styles) => {
    const removeCss = styles.map(style => style._insertCss())
    return () => {
      removeCss.forEach(f => f())
    }
  }
}

ReactDOM.render(
  <ContextProvider context={context}>
    <Provider store={store}>
      <App />
    </Provider>
  </ContextProvider>,
  document.getElementById('root')
)

registerServiceWorker() // Runs register() as default function
