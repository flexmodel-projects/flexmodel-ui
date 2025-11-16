import React, {useMemo} from 'react';
import {Provider} from 'react-redux';
import PropTypes from 'prop-types';
import moox from './mooxCompat';

import App from './App.jsx';
import utils from './utils';
import schema from './models/schema';

const createModelBundle = ({lang, format, mock}) => {
  if (lang) {
    utils.lang = lang;
  }

  const Model = moox({
    schema,
  });

  if (format) {
    Model.__jsonSchemaFormat = format;
  } else {
    Model.__jsonSchemaFormat = utils.format;
  }

  if (mock) {
    Model.__jsonSchemaMock = mock;
  }

  const store = Model.getStore();

  return {Model, store};
};

const JsonSchemaEditor = ({lang, format, mock, ...props}) => {
  const {Model, store} = useMemo(
    () => createModelBundle({lang, format, mock}),
    [lang, format, mock],
  );

  return (
    <Provider store={store} className="wrapper">
      <App Model={Model} {...props} />
    </Provider>
  );
};

JsonSchemaEditor.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
  showEditor: PropTypes.bool,
  isMock: PropTypes.bool,
  lang: PropTypes.oneOf(['zh_CN', 'en_US']),
  format: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
  mock: PropTypes.any,
};

export default JsonSchemaEditor;


