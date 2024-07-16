import React, { useRef, useState, useContext, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../../server.json";
import { AuthContext } from "../../context/AuthContext";
import { CCard, CCardHeader, CCardBody, CTable } from "@coreui/react";
import { cilSettings, cilPrint } from "@coreui/icons";
import "./th.css";
import { useReactToPrint } from "react-to-print";

import { Modal, Form, Button, FormControl } from "react-bootstrap";
import CIcon from "@coreui/icons-react";

import { NoEncryption } from "@mui/icons-material";
import { toast } from "react-toastify";
import { format, parse } from "date-fns";

const TH = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedStatus, setSelectedStatus] = useState("");
  const itemsPerPage = 5;
  const componentRef = useRef();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTransactionStatus, setEditedTransactionStatus] = useState("");
  const [editedTransactionId, setEditedTransactionId] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [addTransactionStatus, setAddTransactionStatus] = useState("");

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("F2F");
  const [newTransactionData, setNewTransactionData] = useState({
    email: "",
    paymentmethodtransaction: "F2F",
    billtypetransaction: "",
    amountoftransaction: "",
    gcashnumber: "",
    stallnametra: "",
    dateoftransaction: "",
  });
  const [define, setDefine] = useState("");

  const formatDate = (date) => {
    return format(date, "MMM dd, yyyy");
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Transaction history",
  });

  const handleEditTransactionStatus = () => {
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleAddTransactionStatus = () => {
    setShowAddModal(true);
  };
  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${apiUrl}/transactions`);
        setTransactions(response.data.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredItems = transactions.filter(
    (transaction) =>
      transaction.email.toLowerCase().includes(searchInput.toLowerCase()) ||
      transaction.paymentmethodtransaction
        .toLowerCase()
        .includes(searchInput.toLowerCase()) ||
      transaction.billtypetransaction
        .toString()
        .toLowerCase()
        .includes(searchInput.toLowerCase()) ||
      transaction.amountoftransaction
        .toString()
        .toLowerCase()
        .includes(searchInput.toLowerCase()) ||
      transaction.dateoftransaction
        .toString()
        .toLowerCase()
        .includes(searchInput.toLowerCase()) ||
      transaction.gcashnumber
        .toString()
        .toLowerCase()
        .includes(searchInput.toLowerCase())
  );

  const currentItems = searchInput
    ? filteredItems.slice(indexOfFirstItem, indexOfLastItem)
    : transactions.slice(indexOfFirstItem, indexOfLastItem);

  const totalItems = searchInput ? filteredItems.length : transactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSortByDate = () => {
    const sortedTransactions = [...transactions].sort((a, b) => {
      const dateA = parse(a.dateoftransaction, "MMM dd, yyyy", new Date());
      const dateB = parse(b.dateoftransaction, "MMM dd, yyyy", new Date());

      if (sortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    setTransactions(sortedTransactions);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSaveChanges = async () => {
    try {
      const transactionToUpdate = transactions.find(
        (transaction) => transaction._id === editedTransactionId
      );

      if (!transactionToUpdate) {
        console.error("Transaction not found for ID:", editedTransactionId);
        return;
      }

      let notificationMessage = "";
      if (editedTransactionStatus === "PAID") {
        notificationMessage = `Your payment of ₱${transactionToUpdate.amountoftransaction} for ${transactionToUpdate.billtypetransaction} was successful.`;
      } else if (editedTransactionStatus === "CANCELLED") {
        notificationMessage = `Your payment of ₱${transactionToUpdate.amountoftransaction} for ${transactionToUpdate.billtypetransaction} has been cancelled.`;
      }

      const notificationResponse = await axios.post(
        `${apiUrl}/usernotifications`,
        {
          email: transactionToUpdate.email || "",
          userdefinenotifi: notificationMessage,
          usertimedatenotifi: formatDate(new Date()),
        }
      );

      const newNotification = notificationResponse.data.usernotification;

      const transactionResponse = await axios.put(
        `${apiUrl}/transactions/${editedTransactionId}`,
        {
          statusoftransaction: editedTransactionStatus,
        }
      );

      const updatedTransactions = transactions.map((transaction) =>
        transaction._id === editedTransactionId
          ? {
              ...transaction,
              statusoftransaction: editedTransactionStatus,
              notification: newNotification,
            }
          : transaction
      );

      setTransactions(updatedTransactions);
      handleCloseEditModal();
      toast.success("Transaction status updated successfully");
    } catch (error) {
      console.error(
        "Error adding notification and updating transaction status:",
        error
      );
    }
  };

  const handleAddTransaction = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/transactions`,
        newTransactionData
      );

      setAddTransactionStatus("add transaction success.");
      handleCloseAddModal();
      toast.success("add transaction success");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  return (
    <>
      {user ? (
        <CCard className="newvie">
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
                Add Transaction
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
                      "-",
                    ];
                    if (invalidChars.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>

              <div className="selectionpaid">
                <Form.Select
                  className="inputselectionpaid"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="CANCELLED">CANCELLED</option>
                </Form.Select>
              </div>

              <div className="tablebillamount">
                {currentItems.length > 0 ? (
                  <>
                    <table ref={componentRef} className="table">
                      <thead>
                        <tr>
                          <th id="titlebill">EMAIL</th>
                          <th id="titlebill">PAYMENT METHOD</th>
                          <th id="titlebill">BILL</th>
                          <th id="titlebill">AMOUNT</th>
                          <th id="titlebill" onClick={handleSortByDate}>
                            DATE
                            {sortOrder === "asc" ? (
                              <span className="sort-icon"> ▲</span>
                            ) : (
                              <span className="sort-icon"> ▼</span>
                            )}
                          </th>
                          <th id="titlebill">STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems
                          .filter((transaction) =>
                            selectedStatus
                              ? transaction.statusoftransaction ===
                                selectedStatus
                              : true
                          )
                          .map((transaction, index) => (
                            <tr key={index}>
                              <td id="tbodyonlinepay">
                                <p id="billsmountype">{transaction.email}</p>
                              </td>
                              <td id="tbodyonlinepay">
                                <p id="typebillclass">
                                  {transaction.paymentmethodtransaction}
                                  {transaction.gcashnumber && (
                                    <p id="gcashnumberrr">
                                      {transaction.gcashnumber}
                                    </p>
                                  )}
                                  {transaction.stallnametra && (
                                    <p id="gcashnumberrr">
                                      {transaction.stallnametra}
                                    </p>
                                  )}
                                </p>
                              </td>

                              <td id="tbodyonlinepay">
                                <p id="billsmountype">
                                  {transaction.billtypetransaction}
                                </p>
                              </td>
                              <td id="tbodyonlinepay">
                                <p>
                                  <code id="fromto23">
                                    ₱{transaction.amountoftransaction}
                                  </code>
                                </p>
                              </td>
                              <td id="tbodyonlinepay">
                                <p>
                                  <code id="typebillclass">
                                    {transaction.dateoftransaction}
                                  </code>
                                </p>
                              </td>
                              <td id="tbodyonlinepay">
                                <code id="typebillclass">
                                  <p
                                    className={
                                      transaction.statusoftransaction ===
                                      "PENDING"
                                        ? "status-processed"
                                        : transaction.statusoftransaction ===
                                            "PAID"
                                          ? "status-paid"
                                          : transaction.statusoftransaction ===
                                              "CANCELLED"
                                            ? "status-cancelled"
                                            : "status-processed"
                                    }
                                  >
                                    {transaction.statusoftransaction
                                      ? transaction.statusoftransaction
                                      : "PENDING"}
                                    {transaction.statusoftransaction !==
                                      "PAID" &&
                                      transaction.statusoftransaction !==
                                        "CANCELLED" && (
                                        <CIcon
                                          id="settingstat"
                                          icon={cilSettings}
                                          className="nav-icon custom-icon-size"
                                          onClick={() => {
                                            setEditedTransactionId(
                                              transaction._id
                                            );
                                            setEditedTransactionStatus(
                                              transaction.statusoftransaction ||
                                                ""
                                            );
                                            handleEditTransactionStatus();
                                          }}
                                        />
                                      )}
                                  </p>
                                </code>
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
              </div>
            </CCardBody>

            <Modal show={showEditModal} onHide={handleCloseEditModal}>
              <Modal.Header closeButton>
                <Modal.Title>Transaction Status</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form className="Formlisttt">
                  <Form.Group controlId="formTransactionStatus">
                    <Form.Label>New Status</Form.Label>
                    <Form.Select
                      value={editedTransactionStatus}
                      onChange={(e) =>
                        setEditedTransactionStatus(e.target.value)
                      }
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group style={{ display: "none" }} controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={
                        transactions.find(
                          (transaction) =>
                            transaction._id === editedTransactionId
                        )?.email || ""
                      }
                      disabled
                    />
                  </Form.Group>

                  <Form.Group style={{ display: "none" }} controlId="formEmail">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="amount"
                      placeholder="Enter amount"
                      value={
                        transactions.find(
                          (transaction) =>
                            transaction._id === editedTransactionId
                        )?.amountoftransaction || ""
                      }
                      disabled
                    />
                  </Form.Group>

                  <Form.Group
                    style={{ display: "none" }}
                    controlId="formUserDefinedNotif"
                  >
                    <Form.Label>User Defined Notification</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={`₱${
                        transactions.find(
                          (transaction) =>
                            transaction._id === editedTransactionId
                        )?.amountoftransaction || ""
                      } ${editedTransactionStatus}`}
                      value={define}
                      onChange={(e) =>
                        setEditedTransactionStatus(e.target.value)
                      }
                      disabled
                    />
                  </Form.Group>

                  <Form.Group
                    style={{ display: "none" }}
                    controlId="formUserDefinedNotif"
                  >
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter notification"
                      value={formatDate(new Date())}
                      required
                      disabled
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEditModal}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={showAddModal} onHide={handleCloseAddModal}>
              <Modal.Header closeButton>
                <Modal.Title>New Transaction</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form className="Formlisttt">
                  <Form.Group controlId="formemailtr">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="example@gmail.com"
                      value={newTransactionData.email}
                      onChange={(e) =>
                        setNewTransactionData({
                          ...newTransactionData,
                          email: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group
                    className="billtypelab"
                    controlId="formTransactionStatus"
                  >
                    <Form.Label>Payment Methods</Form.Label>
                    <Form.Select
                      value={newTransactionData.paymentmethodtransaction}
                      onChange={(e) =>
                        setNewTransactionData({
                          ...newTransactionData,
                          paymentmethodtransaction: e.target.value,
                        })
                      }
                    >
                      <option value="F2F">F2F</option>
                      <option value="Gcash">Gcash</option>
                    </Form.Select>
                  </Form.Group>

                  {newTransactionData.paymentmethodtransaction === "F2F" ? (
                    <Form.Group
                      className="billtypelab"
                      controlId="formbilltypelab"
                    >
                      <Form.Label>Stall Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Fruit Store"
                        value={newTransactionData.stallnametra}
                        onChange={(e) =>
                          setNewTransactionData({
                            ...newTransactionData,
                            stallnametra: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  ) : (
                    <Form.Group
                      className="billtypelab"
                      controlId="formbilltypelab"
                    >
                      <Form.Label>Gcash Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="0986526954"
                        value={newTransactionData.gcashnumber}
                        onChange={(e) =>
                          setNewTransactionData({
                            ...newTransactionData,
                            gcashnumber: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  )}

                  <Form.Group
                    className="billtypelab"
                    controlId="formbilltypelab"
                  >
                    <Form.Label>Bill Type</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Water/Electric"
                      value={newTransactionData.billtypetransaction}
                      onChange={(e) =>
                        setNewTransactionData({
                          ...newTransactionData,
                          billtypetransaction: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="billtypelab" controlId="formamount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Amount"
                      value={newTransactionData.amountoftransaction}
                      onChange={(e) =>
                        setNewTransactionData({
                          ...newTransactionData,
                          amountoftransaction: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="billtypelab" controlId="formdate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Jan 26, 2024"
                      value={newTransactionData.dateoftransaction}
                      onChange={(e) =>
                        setNewTransactionData({
                          ...newTransactionData,
                          dateoftransaction: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleAddTransaction}>
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

export default TH;
