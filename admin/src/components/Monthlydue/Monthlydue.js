import React, { useRef, useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { apiUrl } from "../../../server.json";
import { CCard, CCardHeader, CCardBody, CTable } from "@coreui/react";
import "./monthlydue.css";
import { useReactToPrint } from "react-to-print";
import { cilSettings } from "@coreui/icons";

import { Modal, Form, Button, FormControl } from "react-bootstrap";
import CIcon from "@coreui/icons-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Monthlydue = () => {
  const { user } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const itemsPerPage = 5;
  const componentRef = useRef();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddModal1, setShowAddModal1] = useState(false);

  const [addBill, setAddBill] = useState("");
  const [newBillrecordData, setNewBillRecordData] = useState({
    email: "",
    stallmonthly: "",
    electricbill: "",
    mthdateelectricbill: "",
    waterbill: "",
    mthdatewaterbill: "",
    currentbalance: "",
    mthdatecurrentbalance: "",
  });

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [updatedBillData, setUpdatedBillData] = useState({
    electricbill: "",
    mthdateelectricbill: "",
    waterbill: "",
    mthdatewaterbill: "",
    currentbalance: "",
    mthdatecurrentbalance: "",
  });

  const handleaddBill = async () => {
    try {
      const response = await axios.post(`${apiUrl}/bills`, newBillrecordData);
      setAddBill("add monthly due success.");
      handleCloseAddModal();
      toast.success("add monthly due success");
    } catch (error) {
      console.error("Error adding monthly due:", error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Transaction history",
  });

  const handleAddBillRecord = () => {
    setShowAddModal(true);
  };
  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleAddBillRecord1 = () => {
    setShowAddModal1(true);
  };
  const handleCloseAddModal1 = () => {
    setShowAddModal1(false);
  };

  useEffect(() => {
    const fetchBillMonthlydue = async () => {
      try {
        const response = await axios.get(`${apiUrl}/bills`);
        setBills(response.data.data);
      } catch (error) {
        console.error("Error fetching bill records:", error);
      }
    };
    fetchBillMonthlydue();
  }, []);

  const handleUpdateBill = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/bills/${id}`);
      setSelectedBill(response.data);
      setUpdatedBillData({
        email: response.data.email,
        electricbill: response.data.electricbill,
        mthdateelectricbill: response.data.mthdateelectricbill,
        waterbill: response.data.waterbill,
        mthdatewaterbill: response.data.mthdatewaterbill,
        currentbalance: response.data.currentbalance,
        mthdatecurrentbalance: response.data.mthdatecurrentbalance,
      });
      setShowUpdateModal(true);
    } catch (error) {
      console.error("Error fetching bill details:", error);
    }
  };
  const handleUpdateSubmit = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/bills/${selectedBill._id}`,
        updatedBillData
      );
      setShowUpdateModal(false);
      handleCloseAddModal();
      toast.success("update monthly due successfully");
      setTimeout(() => {
        navigate('/')
      }, 1500);
    } catch (error) {
      console.error("Error updating bill:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredItems = bills.filter(
    (bill) =>
      bill.email.toLowerCase().includes(searchInput.toLowerCase()) ||
      bill.electricbill.toLowerCase().includes(searchInput.toLowerCase()) ||
      bill.waterbill.toLowerCase().includes(searchInput.toLowerCase()) ||
      bill.currentbalance.toLowerCase().includes(searchInput.toLowerCase()) ||
      bill.stallmonthly.toLowerCase().includes(searchInput.toLowerCase())
  );

  const currentItems = searchInput
    ? filteredItems.slice(indexOfFirstItem, indexOfLastItem)
    : bills.slice(indexOfFirstItem, indexOfLastItem);

  const totalItems = searchInput ? filteredItems.length : bills.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <>
      {user ? (
        <CCard className="mb-4">
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CCardHeader>
              B.R{" "}
              <button className="printbtn" onClick={handlePrint}>
                Print
              </button>
              <label
                className="labeladdtransac"
                onClick={() => setShowAddModal(true)}
              >
                Add Monthly Due
              </label>
            </CCardHeader>
            <CCardBody>
              <div className="search-bar">
                <input
                  className="inputsearchbar"
                  type="text"
                  placeholder="Search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => {
                    const invalidChars = [
                      "@",
                      "!",
                      "-",
                      "#",
                      "$",
                      "%",
                      "^",
                      "&",
                      "*",
                      "(",
                      ")",
                      "_",
                      "=",
                      "`",
                      "~",
                      "+",
                    ];
                    if (invalidChars.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              {currentItems.length > 0 ? (
                <>
                  <table ref={componentRef} className="table">
                    <thead className="text-nowrap">
                      <tr>
                        <th id="titlebill">EMAIL:</th>
                        <th id="titlebill">ELECTRIC</th>
                        <th id="titlebill">WATER</th>
                        <th id="titlebill">PREVIOUS</th>
                        <th id="titlebill">UPDATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((bills) => (
                        <tr key={bills._id}>
                          <td id="tbodyonlinepay">
                            <p className="emailmonthly">
                              {bills.email}
                              <p className="stallmonthly">
                                {bills.stallmonthly}
                              </p>
                            </p>
                          </td>
                          <td id="tbodyonlinepay">
                            <p id="billsmountype">
                              ₱{bills.electricbill}
                              <p className="emailtypebill">
                                ({bills.mthdateelectricbill})
                              </p>
                            </p>
                          </td>
                          <td id="tbodyonlinepay">
                            <p>
                              <code className="fromto23">
                                ₱{bills.waterbill}
                              </code>
                              <p className="emailtypebill">
                                ({bills.mthdatewaterbill})
                              </p>
                            </p>
                          </td>
                          <td id="tbodyonlinepay">
                            <p>
                              <code className="fromto23">
                                ₱{bills.currentbalance}
                              </code>
                              <p className="emailtypebill">
                                ({bills.mthdatecurrentbalance})
                              </p>
                            </p>
                          </td>

                          <td id="tbodyonlinepay">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => handleUpdateBill(bills._id)}
                            >
                              UPDATE
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pagebtnslice">
                    <button
                      className="btnnextpage"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="totalpagescount">
                      {currentPage}/{totalPages}
                    </span>
                    <button
                      className="btnprevious"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={
                        (searchInput &&
                          indexOfLastItem >= filteredItems.length) ||
                        (!searchInput && currentPage === totalPages)
                      }
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center mt-3">Search not found.</div>
              )}
            </CCardBody>
            <Modal show={showAddModal} onHide={handleCloseAddModal}>
              <Modal.Header closeButton>
                <Modal.Title>New Monthly Due</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form className="Formlisttt">
                  <Form.Group controlId="formemailtr">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="example@gmail.com"
                      value={newBillrecordData.email}
                      onChange={(e) =>
                        setNewBillRecordData({
                          ...newBillrecordData,
                          email: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="billtypelab" controlId="formbilltype">
                    <Form.Label>Stall Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Stall Name"
                      value={newBillrecordData.stallmonthly}
                      onChange={(e) =>
                        setNewBillRecordData({
                          ...newBillrecordData,
                          stallmonthly: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="billtypelab" controlId="formbilltype">
                    <Form.Label>Electric Bill</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Amount"
                      value={newBillrecordData.electricbill}
                      onChange={(e) =>
                        setNewBillRecordData({
                          ...newBillrecordData,
                          electricbill: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="billtypelab" controlId="formbilltype">
                    <Form.Label>Monthly Due Electric Bill</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Mar15-Apr15"
                      value={newBillrecordData.mthdateelectricbill}
                      onChange={(e) =>
                        setNewBillRecordData({
                          ...newBillrecordData,
                          mthdateelectricbill: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="billtypelab" controlId="formamount">
                    <Form.Label>Water Bill</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Amount"
                      value={newBillrecordData.waterbill}
                      onChange={(e) =>
                        setNewBillRecordData({
                          ...newBillrecordData,
                          waterbill: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="billtypelab" controlId="formamount">
                    <Form.Label>Monthly Due Water Bill</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Mar15-Apr15"
                      value={newBillrecordData.mthdatewaterbill}
                      onChange={(e) =>
                        setNewBillRecordData({
                          ...newBillrecordData,
                          mthdatewaterbill: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="billtypelab" controlId="formamount">
                    <Form.Label>Previous Bill</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Amount"
                      value={newBillrecordData.currentbalance}
                      onChange={(e) =>
                        setNewBillRecordData({
                          ...newBillrecordData,
                          currentbalance: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="billtypelab" controlId="formamount">
                    <Form.Label>Month Previous Bill</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Mar15-May15"
                      value={newBillrecordData.mthdatecurrentbalance}
                      onChange={(e) =>
                        setNewBillRecordData({
                          ...newBillrecordData,
                          mthdatecurrentbalance: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleaddBill}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal
              show={showUpdateModal}
              onHide={() => setShowUpdateModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Update Monthly Due</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form className="Formlisttt">
                  <Form.Group controlId="formemailtr">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="example@gmail.com"
                      disabled
                      value={updatedBillData.email}
                      onChange={(e) =>
                        setUpdatedBillData({
                          ...updatedBillData,
                          email: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="billtypelab" controlId="formbilltype">
                    <Form.Label>Electric Bill</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Amount"
                      value={updatedBillData.electricbill}
                      onChange={(e) =>
                        setUpdatedBillData({
                          ...updatedBillData,
                          electricbill: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="billtypelab" controlId="formbilltype">
                    <Form.Label>Monthly Due Electric Bill</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Mar15-Apr15"
                      value={updatedBillData.mthdateelectricbill}
                      onChange={(e) =>
                        setUpdatedBillData({
                          ...updatedBillData,
                          mthdateelectricbill: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="billtypelab" controlId="formbilltype">
                    <Form.Label>Water Bill</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Amount"
                      value={updatedBillData.waterbill}
                      onChange={(e) =>
                        setUpdatedBillData({
                          ...updatedBillData,
                          waterbill: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="billtypelab" controlId="formbilltype">
                    <Form.Label>Monthly Due Water Bill</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Mar15-Apr15"
                      value={updatedBillData.mthdatewaterbill}
                      onChange={(e) =>
                        setUpdatedBillData({
                          ...updatedBillData,
                          mthdatewaterbill: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="billtypelab" controlId="formbilltype">
                    <Form.Label>Previous Bill</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Amount"
                      value={updatedBillData.currentbalance}
                      onChange={(e) =>
                        setUpdatedBillData({
                          ...updatedBillData,
                          currentbalance: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="billtypelab" controlId="formbilltype">
                    <Form.Label>Month Previous Bill</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Mar15-May15"
                      value={updatedBillData.mthdatecurrentbalance}
                      onChange={(e) =>
                        setUpdatedBillData({
                          ...updatedBillData,
                          mthdatecurrentbalance: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleUpdateSubmit}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </CTable>
        </CCard>
      ) : (
        <div className="text-center mt-3">You are not logged in.</div>
      )}
    </>
  );
};

export default Monthlydue;