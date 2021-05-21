import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import globalConsts from './globalConsts';

// Routing components
import { Switch, Route, useLocation } from 'react-router-dom';

// Reactstrap components
import { Container, Col } from 'reactstrap';

// Local components
import Login from './components/login/Login';
import Pincode from './components/pincode/Pincode';
import Tasks from './components/tasks/Tasks';
import EmbeddedLinks from './components/embeddedLinks/EmbeddedLinks';
// import Header from './components/menu/Header';
// import Home from './components/home/Home';
import Menu from './components/menu/Menu';
import SpecificTask from './components/specificTask/SpecificTask';
import ChangePassword from './components/changePassword/ChangePassword';
import NotFound from './components/notFound/NotFound';

// App component that holds the entire app
function App() {

  // States with React Hooks
  const [validToken, setValidToken] = useState(false);
  const [doneFetching, setDoneFetching] = useState(false);
  const locationDom = useLocation();

  // useEffect with React Hooks. Runs when the component has mounted
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenHeader = 'Bearer ' + token
      // Headers for the POST request
      const headers = {
        'Content-Type': 'application/json',
        Authorization: tokenHeader,
      };
      // POST request that validates the token
      axios({
        method: 'post',
        url: `${globalConsts[0]}/wordpress/wp-json/jwt-auth/v1/token/validate`,
        headers: headers,
      })
        .then((result) => {
          if (result.data.data.status === 200) {
            setValidToken(true);
          }
          setDoneFetching(true);
        })
        .catch((error) => {
          setDoneFetching(true);
          localStorage.removeItem('token');
          console.log(error)
        });
    } else {
      setDoneFetching(true);
    }
    // Clean up. When left empty this useEffect will only be called once
  }, []);

  // Defining Auth route
  const Auth = ({ render: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        validToken ? (
          <Component {...props} />
        ) : (
          window.location.replace('/login')
        )
      }
    />
  );
  // Handles the menu component
  const handleMenu = () => {
    if (
      // New paths needs to be added here
      (locationDom.pathname.includes('/task/') ||
        locationDom.pathname === '/tasks' ||
        locationDom.pathname === '/change-password' ||
        locationDom.pathname.includes('/embeddedLink/')) &&
      validToken
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <React.Fragment>
      {/*Shows the menu if handleMenu returns true */}
      {handleMenu() && (
        <Col className="firstCol" lg="3">
          <Menu />
        </Col>
      )}
      <Switch>
        {/*Public routes */}
        <Route path="/login" exact component={Login} />
        <Route path="/pincode" exact component={Pincode} />
        <Route
          exact
          path="/"
          render={() => window.location.replace('/login')}
        />

        {/*Auth routes */}
        {doneFetching && (
          <Auth
            exact
            path="/tasks"
            render={() => (
              <Col className="secondCol">
                <Container className="homeContainer">
                  <Tasks />
                </Container>
              </Col>
            )}
          />
        )}

        {doneFetching && (
          <Auth
            exact
            path="/embeddedLink/:id"
            render={() => (
              <Col className="secondCol">
                <Container className="homeContainer">
                  <EmbeddedLinks />
                </Container>
              </Col>
            )}
          />
        )}
        {doneFetching && (
          <Auth
            exact
            path="/change-password"
            render={() => (
              <Col className="secondCol">
                <Container className="homeContainer">
                  <ChangePassword />
                </Container>
              </Col>
            )}
          />
        )}
        {doneFetching && (
          <Auth
            exact
            path="/task/:id"
            render={() => (
              <Col className="secondCol">
                <Container className="homeContainer">
                  <SpecificTask />
                </Container>
              </Col>
            )}
          />
        )}

        {/*Handles the routing if the route includes 'wordpress', so we can access the WordPress Backend */}
        {!window.location.href.includes(`${globalConsts[0]}/wordpress`)
          ? doneFetching && <Route exact component={NotFound} />
          : doneFetching &&
          window.location.replace(
            `${globalConsts[0]}/wordpress/wp-admin/index.php`
          )}
      </Switch>
    </React.Fragment>
  );
}

export default App;
