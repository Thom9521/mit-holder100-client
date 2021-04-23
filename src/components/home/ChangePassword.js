import React, { useState } from 'react';
import axios from 'axios';
import globalConsts from '../../globalConsts';
import Loader from 'react-loader-spinner';

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

const ChangePassword = () => {

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [errorMessageOldPw, setErrorMessageOldPw] = useState(false);
    const [errorMessageNewPw, setErrorMessageNewPw] = useState(false);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const toggleModal = () => setModal(!modal);


    const handleOldPassword = (event) => {
        event.preventDefault();
        setOldPassword(event.target.value);
        setErrorMessageOldPw(false);
    }

    const handleNewPassword = (event) => {
        event.preventDefault();
        setNewPassword(event.target.value);
        setErrorMessageNewPw(false);
    }

    const handleRepeatedPassword = (event) => {
        event.preventDefault();
        setRepeatedPassword(event.target.value)
        setErrorMessageNewPw(false);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (newPassword !== repeatedPassword) {
            setErrorMessageNewPw(true);
        } else {
            setLoading(true);
            const formDataLogin = new FormData();
            formDataLogin.append('username', localStorage.getItem('username'));
            formDataLogin.append('password', oldPassword);

            axios({
                method: 'POST',
                url: `${globalConsts[0]}/wordpress/wp-json/jwt-auth/v1/token`,
                data: formDataLogin,
            }).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    const token = localStorage.getItem('token');
                    const tokenHeader = 'Bearer ' + token;
                    const headers = {
                        'Content-Type': 'application/json',
                        Authorization: tokenHeader,
                    };
                    const formDataPassword = new FormData();
                    formDataPassword.append('password', newPassword);
                    axios({
                        method: 'POST',
                        url: `${globalConsts[0]}/wordpress/wp-json/wp/v2/users/${localStorage.getItem('ID')}`,
                        data: formDataPassword,
                        headers: headers
                    }).then((response) => {
                        console.log(response)
                        toggleModal();
                        setLoading(false);
                        setOldPassword('');
                        setNewPassword('');
                        setRepeatedPassword('');

                    }).catch((error) => {
                        console.log(error)
                        setLoading(false);
                    })
                } else {
                    setLoading(false);
                }
            }).catch((error) => {
                console.log(error);
                setErrorMessageOldPw(true);
                setLoading(false);
            })
        }
    }

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
                    {errorMessageOldPw && <p className='errorMessage'>Forkert adgangskode</p>}

                    <Input
                        className="inputStyles"
                        placeholder="Ny adgangskode"
                        type="password"
                        required
                        minLength="8"
                        value={newPassword}
                        onChange={handleNewPassword}
                    />
                    <Input
                        className="inputStyles"
                        placeholder="Gentag ny adgangskode"
                        type="password"
                        required
                        minLength="8"
                        value={repeatedPassword}
                        onChange={handleRepeatedPassword}
                    />
                    {errorMessageNewPw && <p className='errorMessage'>Det nye password og det gentagende password er ikke ens</p>}
                    <Button className="submitBtn">{loading ? (
                        <Loader
                            type="TailSpin"
                            color="white"
                            height={23}
                            width={23}
                        />
                    ) : (
                        'Skift adgangskode'
                    )}</Button>
                </FormGroup>
            </Form>
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
    )
}
export default ChangePassword;