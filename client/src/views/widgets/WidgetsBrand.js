import React, { useEffect, useState, useContext  } from 'react';
import { AuthContext } from '../../context/AuthContext';
import PropTypes from 'prop-types'
import { CWidgetStatsD, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cibFacebook, cibLinkedin, cibTwitter, cilCalendar, cilBullhorn } from '@coreui/icons'
import { CChart } from '@coreui/react-chartjs'
import useFetch from '../../hooks/useFetch';
import homecaintaphoto from '../widgets/logo.png';

const WidgetsBrand = (props) => {
  const { data: meetingsData, loading, error, reFetch } = useFetch('/meetings');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    reFetch(); 
  }, []);

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
      Meetings: 'NA',
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
  }

  return (
    <>
    {user ? (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsD
          color="success"
          {...(props.withCharts && {
            chart: (
              <CChart
                className="position-absolute w-100 h-100"
                type="line"
                
                options={chartOptions}
              />
            ),
          })}
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
  </>
  )
}

WidgetsBrand.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsBrand