import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import { Container, Row } from 'reactstrap';

ReactDOM.render(
  <Container className="contentWrapper">
    <Row>
      <App />
    </Row>
  </Container>,
  document.getElementById('root')
);
serviceWorkerRegistration.register();
