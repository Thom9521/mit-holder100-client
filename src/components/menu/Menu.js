import React, { useState } from 'react';
import logoBlack from '../../assets/images/logoBlack.svg';
import { Link } from 'react-router-dom';
import './Menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
// import { faCalenderCheck } from '@fortawesome/free-solid-svg-icons'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons';

// Reactstrap components
import {
  Container,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  List,
  Row,
  Col,
} from 'reactstrap';

const Menu = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);

  // const handleTasksMenu = () => {
  //   props.selectedMenuPage('Tasks');
  // };

  // const handleChangePasswordMenu = () => {
  //   props.selectedMenuPage('ChangePassword');
  // };
  // const handleChangeInformationMenu = () => {
  //   props.selectedMenuPage('Information');
  // };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location = '/';
  };

  return (
    <Container>
      <img className="mb-5" src={logoBlack} alt="Holder100 logo" />
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret>Firma 1</DropdownToggle>
        <DropdownMenu>
          <DropdownItem className="mb-3">Firma 1</DropdownItem>
          <DropdownItem className="mb-3">Firma 2</DropdownItem>
          <DropdownItem className="mb-3">Firma 3</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <List className="listMenu" type="unstyled">
        <li className="listItem" >
          <Link to={'/home'}>
            <Row>
              <Col className="listCol">
                <FontAwesomeIcon
                  className="fontAwesomeIconMenu"
                  icon={faClipboardList}
                ></FontAwesomeIcon>
              </Col>
              <Col>Opgaver</Col>
            </Row>
          </Link>
        </li>
        <li className="listItem">
          <Link to={'/information'}>
            <Row>
              <Col className="listCol">
                <FontAwesomeIcon
                  className="fontAwesomeIconMenu"
                  icon={faInfoCircle}
                ></FontAwesomeIcon>
              </Col>
              <Col>Information</Col>
            </Row>
          </Link>
        </li>

        <li className="listItem">
          <Link to={'/change-password'}>
            <Row>
              <Col className="listCol">
                <FontAwesomeIcon
                  className="fontAwesomeIconMenu"
                  icon={faKey}
                ></FontAwesomeIcon>
              </Col>
              <Col>Skift adgangskode</Col>
            </Row>
          </Link>
        </li>
        <li className="listItem" onClick={handleLogout}>
          <Row>
            <Col className="listCol">
              <FontAwesomeIcon
                className="fontAwesomeIconMenu"
                icon={faSignOutAlt}
              ></FontAwesomeIcon>
            </Col>
            <Col>Log ud</Col>
          </Row>
        </li>
        <div className="listSection">
          <li className="listHeader">
            <h5>Kontakt os</h5>
          </li>
          <li className="listItem">
            <a href="mailto:info@holder100.dk">
              <Row>
                <Col className="listCol">
                  <FontAwesomeIcon
                    className="fontAwesomeIconMenu"
                    icon={faEnvelope}
                  ></FontAwesomeIcon>
                </Col>
                <Col>info@holder100.dk</Col>
              </Row>
            </a>
          </li>
          <li className="listItem">
            <a href="tel:33607608">
              <Row>
                <Col className="listCol">
                  <FontAwesomeIcon
                    className="fontAwesomeIconMenu"
                    icon={faPhoneAlt}
                  ></FontAwesomeIcon>
                </Col>
                <Col>33 607 608</Col>
              </Row>
            </a>
          </li>
        </div>
      </List>
    </Container>
  );
};
export default Menu;
