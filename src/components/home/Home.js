import React, { useState } from 'react';
import Menu from '../menu/Menu';
import Tasks from '../tasks/Tasks';
import SpecificTask from '../specificTask/SpecificTask';
import Information from '../information/Information';
import ChangePassword from '../changePassword/ChangePassword';

// Reactstrap components
import { Container, Row, Col } from 'reactstrap';

const Home = () => {
  const [chosenMenuPage, setChosenMenuPage] = useState('');

  const handleMenuPage = (childData) => {
    setChosenMenuPage(childData);
  };

  return (
    <Container className="contentWrapper">
      <Row>
        <Col lg="3">
          <Menu selectedMenuPage={handleMenuPage} />
        </Col>
        <Col>
          <Container className="homeContainer">
            {(chosenMenuPage === 'Tasks' || chosenMenuPage === '') && <Tasks selectedMenuPage={handleMenuPage} />}
            {chosenMenuPage === 'ChangePassword' && <ChangePassword />}
            {chosenMenuPage === 'Information' && <Information />}
            {chosenMenuPage === 'Task' && <SpecificTask />}
          </Container>
        </Col>
      </Row>
    </Container>
  );
};
export default Home;
