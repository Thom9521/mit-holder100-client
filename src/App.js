import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import globalConsts from './globalConsts';

// Routing components
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Reactstrap components
import { Container } from 'reactstrap';

// Local components
import Login from './components/login/Login';
import Pincode from './components/pincode/Pincode';
import Home from './components/home/Home';
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
        validToken ? <Component {...props} /> : window.location.replace('/')
      }
    />
  );

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/pincode" exact component={Pincode} />
        {doneFetching ? (
          <Auth path="/home" render={() => <Home />} />
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
