import React, { useState } from 'react'
import { CCard, CCardHeader, CCardBody } from '@coreui/react'
import './onlinepayment.css'
import gcashlogo from '../onlinepayment/images/gcashlogo.png';
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

const Onlinepayment = () => {
  const [amount, setAmount] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [billType, setBillType] = useState('');
  

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>Online Payment</CCardHeader>
        <CCardBody>
          <table className="table">
            <thead>
              <tr>
                <th id="titlebill">Water Bill</th>
                <th id="titlebill">Electric Bill</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td id="tbodyonlinepay">
                  <p>
                    <code className="fromto23">₱795</code>
                  </p>
                </td>
                <td id="tbodyonlinepay">
                  <p>
                    <code className="fromto23">₱1,352</code>
                  </p>
                </td>
              </tr>
            </tbody>
            <Container className="mt-5">
                <Row>
                  <Col md={{ span: 6, offset: 3 }}>
                    <h2 className="mb-4">GCash Payment<img className='gcashlogo' src={gcashlogo} alt="GCash Logo"/></h2>
                    <Form.Group controlId="formBillType">
                        <Form.Label>Bill Type</Form.Label>
                        <Form.Control
                          as="select"
                          value={billType}
                          onChange={(e) => setBillType(e.target.value)}
                          required
                        >
                          <option value="">Select Bill</option>
                          <option value="Water Bill">Water Bill</option>
                          <option value="Electric Bill">Electric Bill</option>
                          <option value="Electric Bill and Water Bill">Electric Bill and Water Bill</option>
                        </Form.Control>
                      </Form.Group>              

                      <Form.Group className="formmarginstyle">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="formmarginstyle">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          placeholder="Enter phone number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Button className='btngcash' variant="primary" type="submit">
                        Pay with GCash
                      </Button>
                  </Col>
                </Row>
              </Container>
          </table>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Onlinepayment