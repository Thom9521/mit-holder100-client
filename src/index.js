import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

// Routing components
import { BrowserRouter as Router } from 'react-router-dom';

// Reactstrap components
import { Container, Row } from 'reactstrap';

var stylingClassesContainer = 'contentWrapper';
var stylingClassesContainerRow = 'contentWrapper';
var specificRoute = true;

// Handles the orange background style for some chosen routes
if (
  // New paths needs to be added here
  window.location.pathname !== '/tasks' &&
  !window.location.pathname.includes('/embeddedLink/') &&
  window.location.pathname !== '/change-password' &&
  !window.location.pathname.includes('/task/') &&
  !window.location.pathname.includes('/historical-task/')
) {
  stylingClassesContainer = 'contentWrapper orangeBackground';
  stylingClassesContainerRow = 'orangeBackgroundContent containerOrange';
  specificRoute = false;
}

ReactDOM.render(
  <div className={stylingClassesContainer}>
    <Container className={stylingClassesContainerRow}>
      {specificRoute ? (
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
