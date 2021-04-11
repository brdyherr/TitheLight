import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button, Modal, Form } from 'react-bootstrap';

import { getMe, deleteTithe, saveTithe} from '../utils/API';
import Auth from '../utils/auth';
import AddTitheForm from '../components/AddTitheForm';

const SavedTithes = () => {
  const [userData, setUserData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [updatedTithe, setUpdatedTithe] = useState({});

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


  
  const handleUpdate = async () => {
    console.log("UPDATING");
    console.log(updatedTithe); 
    console.log(userData); 
         // if data isn't here yet, say so
         if (!updatedTithe) {
          return; 
        }
    let existingTithes = userData.tithes;
    existingTithes.map(x => {
       if (updatedTithe._id == x._id) {
          x.amount = updatedTithe.amount; 
          return x;   
       }else {
         return x; 
       }
    });
    userData.tithes = existingTithes; 
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

 

    try {
      const response = await saveTithe(userData, token);

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
                  <Form.Control className='small'
                  name='searchInput'
                  defaultValue={tithe.amount}
                  type='number'
                  size='lg'
                  onChange = {(e) => setUpdatedTithe({titheId: tithe._id, date: tithe.date, amount: e.target.value})}
                  placeholder='Search for a donation'>
                  </Form.Control>
                  <Card.Text>Given on: {tithe.date}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteTithe(tithe._id)}>
                    Delete this donation!
                  </Button>
                  <Button className='btn-block btn-warning' onClick={() => handleUpdate()}>
                    Update this donation!
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
