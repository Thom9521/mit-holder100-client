import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import globalConsts from './globalConsts';

// Routing components
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Reactstrap components
import { Container, Col } from 'reactstrap';

// Local components
import Login from './components/login/Login';
import Pincode from './components/pincode/Pincode';
import Tasks from './components/tasks/Tasks';
import Information from './components/information/Information';
// import Header from './components/menu/Header';
// import Home from './components/home/Home';
import Menu from './components/menu/Menu';
import SpecificTask from './components/specificTask/SpecificTask';
import ChangePassword from './components/changePassword/ChangePassword';
import NotFound from './components/notFound/NotFound';

function App() {
  const [validToken, setValidToken] = useState(false);
  const [doneFetching, setDoneFetching] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenHeader = 'Bearer ' + token;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: tokenHeader,
      };
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
        });
    } else {
      setDoneFetching(true);
    }
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

  return (
    <Router>
      {!window.location.href.includes('/pincode') &&
        !window.location.href.includes('/login') &&
        window.location.href !== 'http://localhost:3000/' &&
        window.location.href !== 'https://mit.holder100.dk/' &&
        localStorage.getItem('token') && (
          <Col className="firstCol" lg="3">
            <Menu />
          </Col>
        )}

      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/pincode" exact component={Pincode} />
        <Route
          exact
          path="/"
          render={() => window.location.replace('/login')}
        />
        {/* {doneFetching ? (
          <Auth path="/home" render={() => <Home />} />
        ) : (
          <Route>
            <Container>Loading...</Container>
          </Route>
        )} */}

        {doneFetching ? (
          <Auth
            path="/tasks"
            render={() => (
              <Col className="secondCol">
                {/* <div className="headerDiv">
                      <Header />
                    </div> */}
                <Container className="homeContainer">
                  <Tasks />
                </Container>
              </Col>
            )}
          />
        ) : (
          <Route>
            <Container>Loading...</Container>
          </Route>
        )}
        {doneFetching ? (
          <Auth
            path="/information"
            render={() => (
              <Col className="secondCol">
                {/* <div className="headerDiv">
                      <Header />
                    </div> */}
                <Container className="homeContainer">
                  <Information />
                </Container>
              </Col>
            )}
          />
        ) : (
          <Route>
            <Container>Loading...</Container>
          </Route>
        )}
        {doneFetching ? (
          <Auth
            path="/change-password"
            render={() => (
              <Col className="secondCol">
                {/* <div className="headerDiv">
                      <Header />
                    </div> */}
                <Container className="homeContainer">
                  <ChangePassword />
                </Container>
              </Col>
            )}
          />
        ) : (
          <Route>
            <Container>Loading...</Container>
          </Route>
        )}
        {doneFetching ? (
          <Auth
            path="/task/:id"
            render={() => (
              <Col className="secondCol">
                {/* <div className="headerDiv">
                      <Header />
                    </div> */}
                <Container className="homeContainer">
                  <SpecificTask />
                </Container>
              </Col>
            )}
          />
        ) : (
          <Route>
            <Container>Loading...</Container>
          </Route>
        )}
        {!window.location.href.includes(`${globalConsts[0]}/wordpress`) ? (
          // window.location.href !== `${globalConsts[0]}/wordpress/wp-admin` || window.location.href !== `${globalConsts[0]}/wordpress/wp-login.php?loggedout=true&wp_lang=da_DK` ? (
          // window.location.href !== `${globalConsts[0]}/wordpress/wp-admin` ? (
          <Route exact component={NotFound} />
        ) : (
          window.location.replace(
            `${globalConsts[0]}/wordpress/wp-admin/index.php`
          )
        )}
      </Switch>
    </Router>
  );
}

export default App;
