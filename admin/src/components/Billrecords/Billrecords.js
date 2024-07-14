import React, { useRef, useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { apiUrl } from "../../../server.json";
import { CCard, CCardHeader, CCardBody, CTable } from "@coreui/react";
import "./billrecords.css";
import { useReactToPrint } from "react-to-print";

import { Modal, Form, Button, FormControl } from "react-bootstrap";
import CIcon from "@coreui/icons-react";
import { toast } from "react-toastify";

const Billrecords = () => {
  const { user } = useContext(AuthContext);
  const [billrecords, setBillrecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const itemsPerPage = 5;
  const componentRef = useRef();

  const [showAddModal, setShowAddModal] = useState(false);

  const [addBillRecord, setAddBillRecord] = useState("");
  const [newBillrecordData, setNewBillRecordData] = useState({
    email: "",
    typebill: "",
    typebillamount: "",
    fromdate: "",
    todate: "",
    yrtype: "",
  });

  const handleaddBillRecord = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/billrecords`,
        newBillrecordData
      );
      setAddBillRecord("add transaction success.");
      handleCloseAddModal();
      toast.success("add billrecord success");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error adding transaction:", error);
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

  useEffect(() => {
    const fetchBillRecords = async () => {
      try {
        const response = await axios.get(`${apiUrl}/billrecords`);
        setBillrecords(response.data.data);
      } catch (error) {
        console.error("Error fetching bill records:", error);
      }
    };
    fetchBillRecords();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredItems = billrecords.filter(
    (billrecord) =>
      billrecord.typebill.toLowerCase().includes(searchInput.toLowerCase()) ||
      billrecord.typebillamount
        .toLowerCase()
        .includes(searchInput.toLowerCase()) ||
      billrecord.fromdate.toLowerCase().includes(searchInput.toLowerCase()) ||
      billrecord.todate.toLowerCase().includes(searchInput.toLowerCase()) ||
      billrecord.yrtype.toLowerCase().includes(searchInput.toLowerCase()) ||
      billrecord.email.toLowerCase().includes(searchInput.toLowerCase())
  );

  const currentItems = searchInput
    ? filteredItems.slice(indexOfFirstItem, indexOfLastItem)
    : billrecords.slice(indexOfFirstItem, indexOfLastItem);

  const totalItems = searchInput ? filteredItems.length : billrecords.length;
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
                Add Bill Record
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
                    <thead>
                      <tr>
                        <th id="titlebill">BILL:</th>
                        <th id="titlebill">AMOUNT</th>
                        <th id="titlebill">FROM</th>
                        <th id="titlebill">TO</th>
                        <th id="titlebill">YEAR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((billrecord) => (
                        <tr key={billrecord._id}>
                          <td id="tbodyonlinepay">
                            <p className="typebillclass">
                              {billrecord.typebill}
                              <p className="emailtypebill">
                                {billrecord.email}
                              </p>
                            </p>
                          </td>
                          <td id="tbodyonlinepay">
                            <p id="billsmountype">
                              ₱{billrecord.typebillamount}
                            </p>
                          </td>
                          <td id="tbodyonlinepay">
                            <p>
                              <code className="fromto23">
                                {billrecord.fromdate}
                              </code>
                            </p>
                          </td>
                          <td id="tbodyonlinepay">
                            <p>
                              <code className="fromto23">
                                {billrecord.todate}
                              </code>
                            </p>
                          </td>
                          <td id="tbodyonlinepay">
                            <p className="yeartpye">{billrecord.yrtype}</p>
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
                <Modal.Title>New Bill Records</Modal.Title>
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
                    <Form.Label>Bill</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Water/Electric"
                      value={newBillrecordData.typebill}
                      onChange={(e) =>
                        setNewBillRecordData({
                          ...newBillrecordData,
                          typebill: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="billtypelab" controlId="formamount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Amount"
                      value={newBillrecordData.typebillamount}
                      onChange={(e) =>
                        setNewBillRecordData({
                          ...newBillrecordData,
                          typebillamount: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="billtypelab" controlId="formamount">
                    <Form.Label>From Date</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Feb 15"
                      value={newBillrecordData.fromdate}
                      onChange={(e) =>
                        setNewBillRecordData({
                          ...newBillrecordData,
                          fromdate: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="billtypelab" controlId="formamount">
                    <Form.Label>To Date</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Mar 15"
                      value={newBillrecordData.todate}
                      onChange={(e) =>
                        setNewBillRecordData({
                          ...newBillrecordData,
                          todate: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="billtypelab" controlId="formamount">
                    <Form.Label>Year</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="2024"
                      value={newBillrecordData.yrtype}
                      onChange={(e) =>
                        setNewBillRecordData({
                          ...newBillrecordData,
                          yrtype: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleaddBillRecord}>
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

export default Billrecords;