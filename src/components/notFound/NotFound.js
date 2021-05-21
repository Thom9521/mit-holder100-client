import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import { Container, Button } from 'reactstrap';

// Component that renderes the not found page
const NotFound = () => {

  // Handles the go back button
  const handleBackButton = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('ID');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
  };
  return (
    <div className="contentWrapper orangeBackgroundContent contentCenter">
      <Container>
        <img className="logoStyles" src={logo} alt="Holder 100 Logo" />
        <h1 className="mt-5">Siden findes desværre ikke</h1>
        <Link to="/login">
          <Button onClick={handleBackButton}>Find tilbage</Button>
        </Link>
      </Container>
    </div>
  );
};
export default NotFound;
