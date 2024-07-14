import axios from "axios";
import { useContext, useState, useEffect } from "react";
import "./dashboard.css";
import classNames from "classnames";
import { apiUrl } from "../../../server.json";
import logocainta from "./favicon.ico";
import { AuthContext } from "../../context/AuthContext";
import { Modal, Form, Button, FormControl } from "react-bootstrap";
import { toast } from "react-toastify";
import moment from "moment";
import { Visibility } from "@mui/icons-material";

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cifPh,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilPencil,
  cilTrash,
  cilLowVision,
} from "@coreui/icons";

import WidgetsBrand from "../widgets/WidgetsBrand";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
import MainChart from "./MainChart";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  const [showModal1, setShowModal1] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [viewedUser, setViewedUser] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const currentPHTime = moment().utcOffset("+0800").format("MMMM D, YYYY h:mm A");

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    const userToEdit = users.find((user) => user._id === userId);
    setEditedUser(userToEdit);
    setShowModal(true);
  };

  const handleView = (userId) => {
    const userToView = users.find((user) => user._id === userId);
    setViewedUser(userToView);
    setShowModal1(true);
  };

  const handleCloseModal = () => {
    setEditedUser(null);
    setViewedUser(null);
    setShowModal(false);
    setShowModal1(false);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/users/update/${editedUser._id}`,
        editedUser,
      );
      console.log("User updated:", response.data);
      const updatedUsers = users.map((user) =>
        user._id === editedUser._id ? response.data : user,
      );
      setUsers(updatedUsers);
      setShowModal(false);
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.prompt('Type "DELETE" to confirm delete:');
    if (confirmDelete === "DELETE") {
      try {
        setIsLoading(true);
        await axios.delete(`${apiUrl}/users/${userId}`);
        console.log("User deleted:", userId);
        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);
        toast.success("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Error deleting user. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Confirmation failed. User not deleted.");
    }
  };


  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchInput.toLowerCase()) ||
        user.email.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); 
  }, [searchInput, users]);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem); 


  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);


  return (
    <>
      <WidgetsDropdown className="mb-4" />

      <WidgetsBrand className="mb-4" withCharts />
      <CRow>
        <CCol xs>
          {user ? (
            <CCard className="mb-4">
              <CCardHeader>
                <img src={logocainta} alt="Logo" height={25} />{" "}
              </CCardHeader>
              <Form className="mt-4">
                <FormControl
                  type="text"
                  placeholder="Search by name or email"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  style={{ width: '280px', marginLeft: '10px' }} 
                  onKeyPress={(e) => {
                    const invalidChars = ['@', '-', '!', '#', '$', '%', '^', '&', '*', '(', ')', '_', '=', '`', '~', '+', 
                    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' ];
                    if (invalidChars.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form>
              <CCardBody>
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        <CIcon icon={cilPeople} />
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Name
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Contact#
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Email
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Gender
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Birthdate
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Actions
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                  {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          User not found
                        </td>
                      </tr>
                        ) : (
                      currentUsers.map((user) => (
                      <CTableRow key={user._id}>
                        <CTableDataCell className="text-center">

                          <CAvatar
                            size="md"
                            src={user.img}
                            style={{
                              height: "40px",
                              overflow: "hidden",
                              borderRadius: "50%"
                            }}
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>
                            {user.username}&nbsp;{user.surname}
                          </div>
                          <div className="small text-body-secondary text-nowrap">
                            {user.stall}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {user.phone}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex justify-content-between text-nowrap">
                            <div className="fw-semibold">{user.email}</div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {user.sex}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-semibold text-nowrap">
                            {user.birthdate}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex justify-content-between align-items-center">
                            <CIcon
                              icon={cilPencil}
                              className="text-primary"
                              id="iconaction"
                              onClick={() => handleEdit(user._id)}
                            />
                            <Visibility
                                className="text-primary"
                                id="iconaction"
                                onClick={() => handleView(user._id)}
                              />
                            <CIcon
                              icon={cilTrash}
                              className="text-danger"
                              id="iconaction"
                              onClick={() => handleDelete(user._id)}
                              style={{ display: 'none' }}
                            />
                          </div>
                        </CTableDataCell>
                        <Modal show={showModal} onHide={handleCloseModal}>
                          <Modal.Header closeButton>
                            <Modal.Title>Edit User</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Form className="Formlisttt">
                              <Form.Group controlId="formUsername">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                  disabled
                                  type="text"
                                  placeholder="Enter firstname"
                                  value={editedUser ? editedUser.username : ""}
                                  onChange={(e) =>
                                    setEditedUser({
                                      ...editedUser,
                                      username: e.target.value,
                                    })
                                  }
                                />
                              </Form.Group>
                              <Form.Group
                                className="lastnametitle"
                                controlId="formLastname"
                              >
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                  disabled
                                  type="text"
                                  placeholder="Enter lastname"
                                  value={editedUser ? editedUser.surname : ""}
                                  onChange={(e) =>
                                    setEditedUser({
                                      ...editedUser,
                                      surname: e.target.value,
                                    })
                                  }
                                />
                              </Form.Group>
                              <Form.Group
                                className="emailtitle"
                                controlId="formEmail"
                              >
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                  disabled
                                  type="email"
                                  placeholder="Enter email"
                                  value={editedUser ? editedUser.email : ""}
                                  onChange={(e) =>
                                    setEditedUser({
                                      ...editedUser,
                                      email: e.target.value,
                                    })
                                  }
                                />
                              </Form.Group>
                              <Form.Group
                                className="phonetitle"
                                controlId="formContact"
                              >
                                <Form.Label>Contact#</Form.Label>
                                <Form.Control
                                  type="phone"
                                  placeholder="Enter contact#"
                                  value={editedUser ? editedUser.phone : ""}
                                  onChange={(e) =>
                                    setEditedUser({
                                      ...editedUser,
                                      phone: e.target.value,
                                    })
                                  }
                                />
                              </Form.Group>
                              <Form.Group
                                className="stalltitle"
                                controlId="formContact"
                              >
                                <Form.Label>Stall</Form.Label>
                                <Form.Control
                                  type="stall"
                                  placeholder="Enter stall"
                                  value={editedUser ? editedUser.stall : ""}
                                  onChange={(e) =>
                                    setEditedUser({
                                      ...editedUser,
                                      stall: e.target.value,
                                    })
                                  }
                                />
                              </Form.Group>
                              <Button
                                className="btneditsavechanges"
                                variant="primary"
                                onClick={handleSaveChanges}
                              >
                                Save Changes
                              </Button>
                            </Form>
                          </Modal.Body>
                        </Modal>
                        <Modal show={showModal1} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                          <Modal.Title>User Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          {viewedUser && (
                            <Form>

                            <div className="d-flex justify-content-center mb-3">
                                <img
                                  src={viewedUser.img}
                                  className="img-fluid rounded-circle"
                                  style={{ width: "100px", height: "100px" }}
                                    />
                              </div>

                              <Form.Group controlId="formUsername">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                  disabled
                                  type="text"
                                  value={viewedUser.username}
                                />
                              </Form.Group>

                              <Form.Group className="lastnametitle" controlId="formUsername">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                  disabled
                                  type="text"
                                  value={viewedUser.surname}
                                />
                              </Form.Group>

                              <Form.Group className="lastnametitle" controlId="formUsername">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                  disabled
                                  type="text"
                                  value={viewedUser.email}
                                />
                              </Form.Group>

                              <Form.Group className="lastnametitle" controlId="formUsername">
                                <Form.Label>Contact Number</Form.Label>
                                <Form.Control
                                  disabled
                                  type="text"
                                  value={viewedUser.phone}
                                />
                              </Form.Group>

                              <Form.Group className="lastnametitle" controlId="formUsername">
                                <Form.Label>Gender</Form.Label>
                                <Form.Control
                                  disabled
                                  type="text"
                                  value={viewedUser.sex}
                                />
                              </Form.Group>

                            </Form>
                          )}
                        </Modal.Body>
                      </Modal>
                      </CTableRow>
                     ))
                    )}
                  </CTableBody>
                </CTable>
                <div className="pagebtnslice">
                <button className="btnprevious" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </button>
                <span className='totalpagescount'>{currentPage}/{totalPages}</span>
                <button className="btnnextpage" onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastItem >= users.length}>
                  Next
                </button>
              </div>
              </CCardBody>
            </CCard>
          ) : (
            <div className="text-center mt-3"></div>
          )}
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;