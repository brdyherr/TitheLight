import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import { saveTithe } from '../utils/API';
import Auth from '../utils/auth';

const AddTitheForm = () => {
  // set initial form state
  const [userFormData, setUserFormData] = useState({ amount: 0.00 });
  // set state for form validation
  const [validated] = useState(false);
  // set state for alert
  const [showAlert, setShowAlert] = useState(false);

  // use effect to get the current token for the user.. 
  // no validation needed because modal is within the validated apage


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    try {

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

      const response = await saveTithe(userFormData, token);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { user } = await response.json();
    
      window.location = "/saved";
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      amount: 0.00
    });
  };

  return (
    <>
      {/* This is needed for the validation functionality above */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* show alert if server response is bad */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with adding your tithe!
        </Alert>

        <Form.Group>
          <Form.Label htmlFor='amount'>Amount</Form.Label>
          <Form.Control
            type='number'
            placeholder='Your amount'
            name='amount'
            onChange={handleInputChange}
            value={userFormData.amount}
            required
          />
          <Form.Control.Feedback type='invalid'>Amount is required!</Form.Control.Feedback>
        </Form.Group> 

        <Button
          disabled={!(userFormData.amount)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default AddTitheForm;
