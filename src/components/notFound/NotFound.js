import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import { Container, Button } from 'reactstrap';

const NotFound = () => {
    return (
        <div className="contentWrapper orangeBackground contentCenter">
            <Container>
                <img className="logoStyles" src={logo} alt="Holder 100 Logo" />
                <h1 className="mt-5">Siden findes desværre ikke</h1>
                <Link to="/">
                    <Button>
                        Find tilbage
                    </Button>
                </Link>
            </Container>
        </div>
    )
}
export default NotFound;