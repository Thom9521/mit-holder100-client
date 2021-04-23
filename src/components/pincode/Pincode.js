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

const Pincode = () => {
  const [phone, setPhone] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleModalSuccess = () => setModalSuccess(!modalSuccess);
  const toggleModalError = () => setModalError(!modalError);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('phone', phone);
    axios({
      method: 'POST',
      url: `${globalConsts[0]}/users/sendMailByPhone.php`,
      data: formData,
    })
      .then((response) => {
        if (response.data.status === 200) {
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
    <div className="contentWrapper orangeBackground contentCenter">
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
          <Link className="linkStyles" to={'/'}>
            Tilbage
          </Link>
        </p>
      </Container>
      <Modal isOpen={modalSuccess} toggle={toggleModalSuccess}>
        <ModalHeader toggle={toggleModalSuccess}>Succes!</ModalHeader>
        <ModalBody>Din nye pinkode er blevet sendt til din email.</ModalBody>
        <ModalFooter>
          <Button className="closeModal" onClick={toggleModalSuccess}>
            Luk
          </Button>{' '}
        </ModalFooter>
      </Modal>
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
