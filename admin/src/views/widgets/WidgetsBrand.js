import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import PropTypes from 'prop-types';
import { CWidgetStatsD, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { CChart } from '@coreui/react-chartjs'
import { cibFacebook, cibLinkedin, cibTwitter, cilCalendar, cilPencil,
  cilTrash, cilBullhorn } from '@coreui/icons'
import useFetch from '../../hooks/useFetch';
import homecaintaphoto from '../widgets/logo.png';
import { Modal, Form, Button } from 'react-bootstrap';
import { apiUrl } from "../../../server.json";

const WidgetsBrand = (props) => {
  const { data: meetingsData, loading, error, reFetch } = useFetch('/meetings');
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState({
    id: '',
    Meetings: '',
  });

  useEffect(() => {
    reFetch();
  }, []);

  const handleEditMeeting = (meeting) => {
    setMeetingDetails({
      id: meeting._id,
      Meetings: meeting.dateyr,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${apiUrl}/meetings/${meetingDetails.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateyr: meetingDetails.Meetings,
        }),
      });
      if (response.ok) {
        setShowModal(false);
        reFetch();
      } else {
        // Handle error
        console.error('Failed to update meeting');
      }
    } catch (error) {
      console.error('Error updating meeting:', error);
    }
  };

  const renderMeetingInfo = () => {
    if (loading) return 'Loading...';
    if (error) return 'Error fetching data';

    if (meetingsData && meetingsData.data && meetingsData.data.length > 0) {
      const latestMeeting = meetingsData.data[0];

      return {
        Meetings: latestMeeting.dateyr,
      };
    }

    return {
      Meetings: 'No meetings found',
    };
  };

  const chartOptions = {
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  };

  return (
    <>
      {user ? (
        <CRow className={props.className} xs={{ gutter: 4 }}>
          <CCol sm={6} xl={4} xxl={3}>
            <CIcon className='editmeetingbtn' icon={cilPencil} onClick={() => handleEditMeeting(meetingsData.data[0])} />
            <CWidgetStatsD
              color="success"
              icon={<CIcon icon={cilBullhorn} height={52} className="my-4 text-white" />}
              values={[
                {
                  title: <span style={{ fontSize: '12px' }}>Announcement</span>,
                  value: <span style={{ fontSize: '14px' }}>{renderMeetingInfo().Meetings}</span>,
                },
              ]}
            />
          </CCol>
        </CRow>
      ) : (
        <div className="text-center mt-3">
            <img 
            src={homecaintaphoto} 
            alt="Cainta Green Park" 
            style={{
                maxWidth: "75px", 
                height: "75px",   
                display: "block", 
                margin: "0 auto" 
            }}
        />
        </div>
      )}

      <Modal className="modalannouncement" show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Announcement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="Formlisttt">
            <Form.Group controlId="formMeeting">
              <Form.Control
                as="textarea"
                placeholder="Post Announcement"
                value={meetingDetails.Meetings}
                onChange={(e) => setMeetingDetails({ ...meetingDetails, Meetings: e.target.value })}
                style={{ height: '140px' }} 
              />
            </Form.Group>

            <Button className='updatebtnmeeting' variant="primary" onClick={handleUpdate}>
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

WidgetsBrand.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
};

export default WidgetsBrand;