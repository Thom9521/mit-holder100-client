import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logoBlack from '../../assets/images/logoBlack.svg';
import globalConsts from '../../globalConsts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Loader from 'react-loader-spinner';

// Reactstrap components
import {
  Container,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
} from 'reactstrap';

// Child component that renderes the header
const Header = (props) => {
  // Destructuring the props
  const { chosenCompanyHeader } = props;

  // States with React Hooks
  const [userCompanies, setUserCompanies] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fetchedCompanies, setFetchedCompanies] = useState(false);
  const [chosenCompany, setChosenCompany] = useState({
    id: '0',
    name: ''
  });

  // Toggle dropdown
  const toggle = () => setDropdownOpen(!dropdownOpen);

  // useEffect with React Hooks. Runs when the component has mounted
  useEffect(() => {
    let isMounted = true;
    if (userCompanies.length === 0 && !fetchedCompanies) {
      var wordPressID = localStorage.getItem('ID');
      var wordPressToken = localStorage.getItem('token');

      // Data for the POST request to get the logged in user
      const userData = new FormData();
      userData.append('id', wordPressID);
      userData.append('token', wordPressToken);

      // POST request to get the logged in user
      axios({
        method: 'POST',
        url: `${globalConsts[0]}/users/me.php`,
        data: userData,
      })
        .then((response) => {
          if (isMounted) {
            setFetchedCompanies(true);
            const companyArray = response.data.companies;
            if (companyArray !== undefined) {
              setUserCompanies(companyArray);
              setChosenCompany(companyArray[0])
            }
            chosenCompanyHeader(
              companyArray[0],
              true
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return () => {
      isMounted = false;
    };
    // Clean up. The following states will only be updated once when mounted
  }, [chosenCompanyHeader, userCompanies, fetchedCompanies, chosenCompany]);

  // Handles the choice of company
  const handleChosenCompany = (e) => {
    e.preventDefault();
    setChosenCompany({ id: e.target.value, name: e.target.name });
    chosenCompanyHeader({ id: e.target.value, name: e.target.name }, true);
  };

  return (
    <Container className="headerContainerContainer">
      <Row>
        <Col className="col-xl-12 col-lg-12 col-md-6 col-sm-6 col-xs-6 col-6">
          <Link to={{ pathname: '/tasks', state: chosenCompany }}>
            <img
              className="holder100Image"
              src={logoBlack}
              alt="Holder100 logo"
            />
          </Link>
        </Col>
        <Col className="col-xl-12 col-lg-12 col-md-6 col-sm-6 col-xs-6 col-6 dropdownCol">
          <Dropdown
            isOpen={dropdownOpen}
            toggle={toggle}
            className="dropdownStyles dropdownStylesHeader"
          >
            <DropdownToggle>
              {userCompanies !== '' && chosenCompany.name !== '' ? chosenCompany.name : (
                <Loader
                  className="loaderHeader"
                  type="TailSpin"
                  color="#ff9414"
                  height={23}
                  width={23}
                />
              )}{' '}
              <FontAwesomeIcon
                className="fontAwesomeIconHeader"
                icon={faCaretDown}
              ></FontAwesomeIcon>
            </DropdownToggle>
            <DropdownMenu>
              {/* <DropdownItem
                className="mb-2 mt-1"
                name="Alle firmaer"
                value="0"
                onClick={(e) => handleChosenCompany(e)}
              >
                Alle firmaer
              </DropdownItem> */}
              {/*Mapping through the array of companies if it is not empty */}
              {userCompanies !== '' &&
                userCompanies.map((company, index) => (
                  <DropdownItem
                    key={index}
                    className="mb-2 mt-1"
                    name={company.name}
                    value={company.id}
                    onClick={(e) => handleChosenCompany(e)}
                  >
                    {company.name}
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>
    </Container>
  );
};
export default Header;
