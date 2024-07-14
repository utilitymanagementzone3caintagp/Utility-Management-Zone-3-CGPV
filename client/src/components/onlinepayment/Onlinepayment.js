import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { apiUrl } from "../../../server.json";
import axios from "axios";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import "./onlinepayment.css";
import { toast } from "react-toastify";
import gcashlogo from "../onlinepayment/images/gcashlogo.png";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { format } from "date-fns";

const Modal = ({ closeModal }) => (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={closeModal}>
        <p id="closetimeicon">&times;</p>
      </span>
      <h3>Payment Processing</h3>
      <br></br>
      <p>
        Please wait a moment, while we are verifying your payment with your
        Gcash. The transaction status will be updated after 24 hours.
      </p>
    </div>
  </div>
);

const Onlinepayment = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [choosepayment, setChoosePayment] = useState("");
  const [GcashNumber, setGcashNumber] = useState("");
  const [billType, setBillType] = useState("");
  const [bills, setBills] = useState([]);
  const { user } = useContext(AuthContext);
  const [define, setDefine] = useState("");

  useEffect(() => {
    // Fetch bills data.
    const fetchBills = async () => {
      try {
        const response = await axios.get(`${apiUrl}/bills`);
        setBills(response.data.data);
      } catch (error) {
        console.error("Error fetching bills:", error);
      }
    };

    fetchBills();
  }, []);

  const filteredBills = user
    ? bills.filter((bill) => bill.email === user.email)
    : [];

  const waterBillAmount =
    filteredBills.length > 0 ? filteredBills[0].waterbill : 0;
  const electricBillAmount =
    filteredBills.length > 0 ? filteredBills[0].electricbill : 0;
  const currentBalance =
    filteredBills.length > 0 ? filteredBills[0].currentbalance : 0;

  const handleChange = (e) => {
    const selectedBillType = e.target.value;
    setBillType(selectedBillType);
    switch (selectedBillType) {
      case "Water":
        setAmount(waterBillAmount);
        setChoosePayment("GCash");
        break;
      case "Electric":
        setAmount(electricBillAmount);
        setChoosePayment("GCash");
        break;
      case "Electric&Water":
        setChoosePayment("GCash");

        // Calculate the total amount dynamically
        const totalAmount =
          parseFloat(waterBillAmount) + parseFloat(electricBillAmount);
        setAmount(totalAmount);
        break;
      case "Previous Bill":
        setAmount(currentBalance);
        break;
      default:
        setAmount("");
        break;
    }
  };

  const formatDate = (date) => {
    return format(date, "MMM dd, yyyy");
  };

  const handlePaymentSubmission = async () => {
    if (!GcashNumber || !billType) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      const transactionData = {
        paymentmethodtransaction: choosepayment,
        email: user.email,
        gcashnumber: GcashNumber,
        billtypetransaction: billType,
        amountoftransaction: amount,
        dateoftransaction: formatDate(new Date()),
      };

      const transactionResponse = await axios.post(
        `${apiUrl}/transactions`,
        transactionData
      );

      if (transactionResponse.status === 201) {
        const notificationData = {
          email: user.email,
          definenotifi: `${user.email} has sent ₱${amount} Gcash #${GcashNumber}`,
          timedatenotifi: formatDate(new Date()),
        };

        // POST request to create a notification
        const notificationResponse = await axios.post(
          `${apiUrl}/notifications`,
          notificationData
        );

        if (notificationResponse.status === 201) {
          setDefine(notificationData.definenotifi);
          toast.success("Payment Successful!");
          navigate("/transactionhistory");
        } else {
          toast.error("Error creating notification");
        }
      } else {
        toast.error("Error submitting transaction");
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    setShowModal(true);
  }, []);

  return (
    <>
      {user ? (
        <CCard className="mb-4">
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CCardHeader>Online Payment</CCardHeader>
            <CCardBody>
              <table className="table">
                <thead>
                  <tr>
                    <th id="titlebill">Water Bill</th>
                    <th id="titlebill">Electric Bill</th>
                    <th id="titlebill">Previous Bill</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td id="tbodyonlinepay">
                      <p>
                        <code className="fromto23">₱{waterBillAmount}</code>
                      </p>
                    </td>
                    <td id="tbodyonlinepay">
                      <p>
                        <code className="fromto23">₱{electricBillAmount}</code>
                      </p>
                    </td>
                    <td id="tbodyonlinepay">
                      <p>
                        <code className="fromto23">₱{currentBalance}</code>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <Container className="mt-5">
                <Row>
                  <Col md={{ span: 6, offset: 3 }}>
                    <h2 className="mb-4">
                      GCash Payment
                      <img
                        className="gcashlogo"
                        src={gcashlogo}
                        alt="GCash Logo"
                      />
                      <p id="gcashnumber">096532584</p>
                    </h2>
                    <Form.Group controlId="formBillType">
                      <Form.Label>Bill Type</Form.Label>
                      <Form.Control
                        as="select"
                        value={billType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Bill</option>
                        <option value="Water">Water</option>
                        <option value="Electric">Electric</option>
                        <option value="Electric&Water">Water&Electric</option>
                        <option value="Previous Bill">Previous</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group
                      className="formmarginstyle"
                      style={{ display: "none" }}
                    >
                      <Form.Label>Payment Method:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Payment Method"
                        value={choosepayment}
                        required
                        disabled
                      />
                    </Form.Group>

                    <Form.Group className="formmarginstyle">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="?"
                        value={amount}
                        required
                        disabled
                      />
                    </Form.Group>

                    <Form.Group className="formmarginstyle">
                      <Form.Label>Gcash Number</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter Gcash number"
                        value={GcashNumber}
                        onChange={(e) => {
                          const inputGcashNumber = e.target.value;
                          const numericGcashNumber = inputGcashNumber.replace(
                            /\D/g,
                            ""
                          );
                          setGcashNumber(numericGcashNumber);
                        }}
                        required
                      />
                    </Form.Group>

                    <Form.Group
                      className="formmarginstyle"
                      style={{ display: "none" }}
                    >
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Email"
                        value={user.email}
                        required
                        disabled
                      />
                    </Form.Group>

                    <Form.Group className="formmarginstyle">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Date"
                        value={formatDate(new Date())}
                        required
                        disabled
                      />
                    </Form.Group>

                    <Form.Group 
                    style={{ display: "none" }}
                     controlId="formNotificationEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={user.email}
                        required
                        disabled
                      />
                    </Form.Group>

                    <Form.Group 
                    style={{ display: "none" }} 
                    controlId="formNotificationDefinition">
                      <Form.Label>Notification Definition</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={`${user.email} has sent ₱${amount} Gcash #${GcashNumber}`}
                        value={define}
                        onChange={(e) => setDefine(e.target.value)}
                        required
                        disabled
                      />
                    </Form.Group>

                    <Form.Group 
                    style={{ display: "none" }} 
                    controlId="formNotificationDate">
                      <Form.Label>Date of Transaction</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter date of transaction"
                        value={formatDate(new Date())}
                        required
                        disabled
                      />
                    </Form.Group>

                    <Button
                      className="btngcash"
                      variant="primary"
                      type="button"
                      onClick={handlePaymentSubmission}
                    >
                      Pay with GCash
                    </Button>
                  </Col>
                </Row>
              </Container>
            </CCardBody>
          </CTable>
        </CCard>
      ) : (
        <div className="text-center mt-3">You are not logged in.</div>
      )}
      {showModal && <Modal closeModal={closeModal} />}
    </>
  );
};

export default Onlinepayment;