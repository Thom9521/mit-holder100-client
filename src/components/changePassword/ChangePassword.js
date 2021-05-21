import React, { useState } from 'react';
import axios from 'axios';
import globalConsts from '../../globalConsts';
import Loader from 'react-loader-spinner';

// Reactstrap components
import {
  Form,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

// Component that renderes the form to change the password
const ChangePassword = () => {

  // States with React Hooks
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [errorMessageOldPw, setErrorMessageOldPw] = useState(false);
  const [errorMessageNewPw, setErrorMessageNewPw] = useState(false);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toggle modal
  const toggleModal = () => setModal(!modal);

  // Handles the old password input
  const handleOldPassword = (event) => {
    event.preventDefault();
    setOldPassword(event.target.value);
    setErrorMessageOldPw(false);
  };

  // Handles the new password input
  const handleNewPassword = (event) => {
    event.preventDefault();
    setNewPassword(event.target.value);
    setErrorMessageNewPw(false);
  };

  // Handles the repeat of the new password input
  const handleRepeatedPassword = (event) => {
    event.preventDefault();
    setRepeatedPassword(event.target.value);
    setErrorMessageNewPw(false);
  };

  // Handles the submit
  const handleSubmit = (event) => {
    event.preventDefault();
    if (newPassword !== repeatedPassword) {
      setErrorMessageNewPw(true);
    } else {
      setLoading(true);

      // FormData send as data for the POST Request
      const formDataLogin = new FormData();
      formDataLogin.append('username', localStorage.getItem('username'));
      formDataLogin.append('password', oldPassword);

      // HTTP POST request that makes sure the old password is correct
      axios({
        method: 'POST',
        url: `${globalConsts[0]}/wordpress/wp-json/jwt-auth/v1/token`,
        data: formDataLogin,
      })
        .then((response) => {
          if (response.status === 200) {
            const token = localStorage.getItem('token');
            const tokenHeader = 'Bearer ' + token;
            const headers = {
              'Content-Type': 'application/json',
              Authorization: tokenHeader,
            };
            const formDataPassword = new FormData();
            formDataPassword.append('password', newPassword);

            // HTTP POST request
            axios({
              method: 'POST',
              url: `${globalConsts[0]
                }/wordpress/wp-json/wp/v2/users/${localStorage.getItem('ID')}`,
              data: formDataPassword,
              headers: headers,
            })
              .then((response) => {
                toggleModal();
                setLoading(false);

                // Resets the input fields
                setOldPassword('');
                setNewPassword('');
                setRepeatedPassword('');
              })
              .catch((error) => {
                console.log(error);
                setLoading(false);
              });
          } else {
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          setErrorMessageOldPw(true);
          setLoading(false);
        });
    }
  };

  return (
    <div className="contentWrapper contentCenter homeContainerContainer">
      <h4>Skift adgangskode</h4>
      <Form onSubmit={handleSubmit} method="POST">
        <FormGroup>
          <Input
            className="inputStyles"
            placeholder="Nuværende adgangskode"
            type="password"
            required
            value={oldPassword}
            onChange={handleOldPassword}
          />
          {/*Shows error message if this error is true*/}
          {errorMessageOldPw && (
            <p className="errorMessage">Forkert adgangskode</p>
          )}
          <Input
            className="inputStyles"
            placeholder="Ny adgangskode"
            type="password"
            required
            value={newPassword}
            onChange={handleNewPassword}
          />
          <Input
            className="inputStyles"
            placeholder="Gentag ny adgangskode"
            type="password"
            required
            value={repeatedPassword}
            onChange={handleRepeatedPassword}
          />
          {/*Shows error message if this error is true*/}
          {errorMessageNewPw && (
            <p className="errorMessage">
              Det nye password og det gentagende password er ikke ens
            </p>
          )}
          <Button className="submitBtn">
            {/*Shows loading animation if loading is true*/}
            {loading ? (
              <Loader type="TailSpin" color="white" height={23} width={23} />
            ) : (
              'Skift adgangskode'
            )}
          </Button>
        </FormGroup>
      </Form>
      {/*Modal that shows on submit success */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Succes!</ModalHeader>
        <ModalBody>Din adgangskode blev skiftet</ModalBody>
        <ModalFooter>
          <Button className="closeModal" onClick={toggleModal}>
            Luk
          </Button>{' '}
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default ChangePassword;
