import _ from 'lodash';

let defaultState = {
  db: null,
  ui: {
    controller: null
  }
};

function createStore(reducer) {
  let state = undefined;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  };

  dispatch({}); /** Initialize store */

  return { getState, dispatch, subscribe };
}

function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'pokemon.load': {
      const data = action.payload.data;
      if (data) {
        return _.merge({ ...state }, { db: { pokemon: data } });
      }
      return { ...state };
    }
    case 'colors.load': {
      const data = action.payload.data;
      if (data) {
        return _.merge({ ...state }, { db: { colors: data } });
      }
      return { ...state };
    }
    default: {
      return { ...state };
    }
  }
}

const { dispatch, getState, subscribe } = createStore(reducer);

export { dispatch, getState, subscribe };
