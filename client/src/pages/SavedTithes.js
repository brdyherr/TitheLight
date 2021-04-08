import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button, Modal } from 'react-bootstrap';

import { getMe, deleteTithe } from '../utils/API';
import Auth from '../utils/auth';
import AddTitheForm from '../components/AddTitheForm';

const SavedTithes = () => {
  const [userData, setUserData] = useState({});
  const [showModal, setShowModal] = useState(false);


  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;
  console.log("Length is ", userDataLength);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }

        const response = await getMe(token);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        const user = await response.json(); 
        console.log("FOUND THE USER" + JSON.stringify(user));
        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };

    

    getUserData();
  }, [userDataLength]);

  // create function that accepts the tithe's mongo _id value as param and deletes the tithe from the database
  const handleDeleteTithe = async (titheId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await deleteTithe(titheId, token);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
    
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing Tithe and Offerings!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.tithes.length
            ? `Viewing ${userData.tithes.length} saved ${userData.tithes.length === 1 ? 'tithe' : 'tithes'}:`
            : 'You have no saved tithes!'}
        </h2>
        <h3>
        <Button onClick={() => setShowModal(true)}>Add Tithe</Button>
          </h3> 
        <CardColumns>
          {userData.tithes.map((tithe) => {
            return (
              <Card key={tithe._id} border='dark'>
                <Card.Body>
                  <Card.Title>Amount Given:</Card.Title>
                  <p className='small'>${tithe.amount}</p>
                  <Card.Text>Given on: {tithe.date}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteTithe(tithe.titheId)}>
                    Delete this donation!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
        <Modal
         size='lg'
         show={showModal}
         onHide={() => setShowModal(false)}
         > 
        <Modal.Header closeButton>
            <Modal.Title id='add-tithe-modal'>
               Add Tithe
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
               <AddTitheForm handleModalClose={() => setShowModal(false)} />
          </Modal.Body>
          </Modal>
      </Container>
    </>
  );
};

export default SavedTithes;
