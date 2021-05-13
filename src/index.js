import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import { Container, Row } from 'reactstrap';
var stylingClassesContainer = 'contentWrapper';
var stylingClassesContainerRow = 'contentWrapper';
if (
  window.location.href.includes('/login') ||
  window.location.href.includes('/pincode')
) {
  stylingClassesContainer = 'contentWrapper orangeBackground';
  stylingClassesContainerRow = 'orangeBackgroundContent';
}

ReactDOM.render(
  <div className={stylingClassesContainer}>
    <Container className={stylingClassesContainerRow}>
      <Row className={stylingClassesContainerRow}>
        <App />
      </Row>
    </Container>
  </div>,
  document.getElementById('root')
);
serviceWorkerRegistration.register();
