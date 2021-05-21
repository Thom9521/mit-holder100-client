import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Pincode.css';
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

// Component that renderes the possiblity to get a new pincode as a password
const Pincode = () => {

  // States with React Hooks
  const [phone, setPhone] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handles the succes modal
  const toggleModalSuccess = () => {
    setModalSuccess(!modalSuccess);
    if (modalSuccess) {
      window.location = '/login';
    }
  };

  // Handles the error modal
  const toggleModalError = () => setModalError(!modalError);

  // Handles the submit
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    // Data for the POST request
    const formData = new FormData();
    formData.append('phone', phone);

    // POST request to send the mail
    axios({
      method: 'POST',
      url: `${globalConsts[0]}/users/sendMailByPhone.php`,
      data: formData,
    })
      .then((response) => {
        if (response.data.status === 200) {
          // Resets the state
          setPhone('');
          toggleModalSuccess();
        } else if (response.data.status === 400) {
          toggleModalError();
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <div className="contentWrapper orangeBackgroundContent contentCenter">
      <Container>
        <img className="logoStyles" src={logo} alt="Holder 100 Logo" />
        <h2 className="headerStyles mb-4">Få tilsendt pinkode</h2>
        <Form onSubmit={handleSubmit} method="POST">
          <FormGroup>
            <Input
              className="inputStyles"
              type="text"
              placeholder="Telefonnummer"
              required
              minLength="8"
              maxLength="8"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <Button className="submitStyles">
              {/*Shows a loading animation if loading is true */}
              {loading ? (
                <Loader
                  type="TailSpin"
                  color="#ff9414"
                  height={23}
                  width={23}
                />
              ) : (
                'Få kode'
              )}
            </Button>
          </FormGroup>
        </Form>
        <p className="mt-5">
          <Link className="linkStyles" to={'/login'}>
            Tilbage
          </Link>
        </p>
      </Container>
      {/*Shows is the request was a success */}
      <Modal isOpen={modalSuccess} toggle={toggleModalSuccess}>
        <ModalHeader toggle={toggleModalSuccess}>Succes!</ModalHeader>
        <ModalBody>Din nye pinkode er blevet sendt til din email.</ModalBody>
        <ModalFooter>
          <Button className="closeModal" onClick={toggleModalSuccess}>
            Luk
          </Button>{' '}
        </ModalFooter>
      </Modal>
      {/*Shows is the request failed */}
      <Modal isOpen={modalError} toggle={toggleModalError}>
        <ModalHeader toggle={toggleModalError}>Fejl</ModalHeader>
        <ModalBody>
          Der skete desværre en fejl i systemet.{<br />}Kontakt Holder 100 for
          hjælp.
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

export default Pincode;
