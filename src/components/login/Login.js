import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import logo from '../../assets/images/logo.svg';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import globalConsts from '../../globalConsts';

// Reactstrap components
import {
  Container,
  Input,
  Button,
  Form,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

// Compenent that renderes the login
const Login = () => {

  // States with React Hooks
  const [userLogin, setUserLogin] = useState('');
  const [password, setPassword] = useState('');
  const [modalError, setModalError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toggle modal
  const toggleModalError = () => setModalError(!modalError);

  // Handles the submit when loggin in
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    // Data for the POST request to get username
    const formData = new FormData();
    formData.append('phone', userLogin);
    formData.append('email', userLogin);

    // POST request to get the username
    axios({
      method: 'POST',
      url: `${globalConsts[0]}/users/getUsername.php`,
      data: formData,
    })
      .then((response) => {
        const username = response.data.username;
        if (
          response.data.status === 200 &&
          username !== '' &&
          password !== ''
        ) {

          // Data for the POST request that gets the user
          const formDataLogin = new FormData();
          formDataLogin.append('username', username);
          formDataLogin.append('password', password);

          // POST request to get user
          axios({
            method: 'POST',
            url: `${globalConsts[0]}/wordpress/wp-json/jwt-auth/v1/token`,
            data: formDataLogin,
          })
            .then((response) => {
              // Sets items for the local storage
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('ID', response.data.user_id);
              localStorage.setItem('username', response.data.user_nicename);
              localStorage.setItem('name', response.data.user_display_name);
              // Redirecting to the tasks component
              window.location = '/tasks';
            })
            .catch((error) => {
              console.log(error);
              setLoading(false);
              toggleModalError();
            });
        } else {
          setLoading(false);
          toggleModalError();
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toggleModalError();
      });
  };

  return (
    <div className="contentWrapper orangeBackgroundContent contentCenter">
      <Container>
        <img className="logoStyles" src={logo} alt="Holder 100 Logo" />
        <h2 className="headerStyles mb-4">Login på din konto</h2>
        <Form onSubmit={handleSubmit} method="POST">
          <FormGroup>
            <Input
              className="inputStyles"
              type="text"
              placeholder="Telefonnummer eller email"
              required
              value={userLogin}
              onChange={(event) => setUserLogin(event.target.value)}
            />
            <Input
              className="inputStyles"
              type="password"
              placeholder="Adgangskode"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button className="submitStyles">
              {/*Shows loading animation if loading is true */}
              {loading ? (
                <Loader
                  type="TailSpin"
                  color="#ff9414"
                  height={23}
                  width={23}
                />
              ) : (
                'Login'
              )}
            </Button>
          </FormGroup>
        </Form>
        <p className="mt-5">
          Har du ikke en konto?{' '}
          <Link className="linkStyles" to={'pincode'}>
            Få tilsendt kode
          </Link>
        </p>
      </Container>
      {/*Shows modal if the attempt to login failed */}
      <Modal isOpen={modalError} toggle={toggleModalError}>
        <ModalHeader toggle={toggleModalError}>Mislykket</ModalHeader>
        <ModalBody>
          Du kunne ikke logges ind.{<br />}Kontakt Holder 100 for hjælp.
        </ModalBody>
        <ModalFooter>
          <Button className="closeModal" onClick={toggleModalError}>
            Luk
          </Button>{' '}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Login;
