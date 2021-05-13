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

const Login = () => {
  const [userLogin, setUserLogin] = useState('');
  const [password, setPassword] = useState('');
  const [modalError, setModalError] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleModalError = () => setModalError(!modalError);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('phone', userLogin);
    formData.append('email', userLogin);
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
          const formDataLogin = new FormData();
          formDataLogin.append('username', username);
          formDataLogin.append('password', password);

          axios({
            method: 'POST',
            url: `${globalConsts[0]}/wordpress/wp-json/jwt-auth/v1/token`,
            data: formDataLogin,
          })
            .then((response) => {
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('ID', response.data.user_id);
              localStorage.setItem('username', response.data.user_nicename);
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
