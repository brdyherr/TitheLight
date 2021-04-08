// see TitheForm.js for comments
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { createTithe } from '../utils/API';

const TitheForm = () => {
  const [titheFormData, setTitheFormData] = useState({ amount: 0.00 });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTitheFormData({ ...titheFormData, [name]: value });
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
      const response = await createTithe(titheFormData);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setTitheFormData({
      amount: ''
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with adding your tithe!
        </Alert>

        <Form.Group>
          <Form.Label htmlFor='amount'>Amount:</Form.Label>
          <Form.Control
            type='number'
            placeholder='Your amount'
            name='amount'
            onChange={handleInputChange}
            value={titheFormData.amount}
            required
          />
          <Form.Control.Feedback type='invalid'>Amount is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(titheFormData.amount)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default TitheForm;
