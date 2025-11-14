import React from 'react';
import {Provider} from 'react-redux';
import PropTypes from 'prop-types';
import moox from 'moox';

import App from './App.jsx';
import utils from './utils';
import schema from './models/schema';

const jeditor = (config = {}) => {
  if (config.lang) {
    utils.lang = config.lang;
  }

  const Model = moox({
    schema,
  });

  if (config.format) {
    Model.__jsonSchemaFormat = config.format;
  } else {
    Model.__jsonSchemaFormat = utils.format;
  }

  if (config.mock) {
    Model.__jsonSchemaMock = config.mock;
  }

  const store = Model.getStore();

  const Component = (props) => (
    <Provider store={store} className="wrapper">
      <App Model={Model} {...props} />
    </Provider>
  );

  Component.propTypes = {
    data: PropTypes.string,
    onChange: PropTypes.func,
    showEditor: PropTypes.bool,
    isMock: PropTypes.bool,
  };

  return Component;
};

export default jeditor;


