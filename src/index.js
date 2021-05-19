import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { BrowserRouter as Router } from 'react-router-dom';

import { Container, Row } from 'reactstrap';

var stylingClassesContainer = 'contentWrapper';
var stylingClassesContainerRow = 'contentWrapper';
var useRow = true;
// New paths needs to be added here
if (
  window.location.pathname !== '/tasks' &&
  !window.location.pathname.includes('/information/') &&
  window.location.pathname !== '/change-password' &&
  !window.location.pathname.includes('/task/')
) {
  stylingClassesContainer = 'contentWrapper orangeBackground';
  stylingClassesContainerRow = 'orangeBackgroundContent';
  useRow = false;
}

ReactDOM.render(
  <div className={stylingClassesContainer}>
    <Container className={stylingClassesContainerRow}>
      {useRow ? (
        <Row className={stylingClassesContainerRow}>
          <Router>
            <App />
          </Router>
        </Row>
      ) : (
        <Router>
          <App />
        </Router>
      )}
    </Container>
  </div>,
  document.getElementById('root')
);
serviceWorkerRegistration.register();
