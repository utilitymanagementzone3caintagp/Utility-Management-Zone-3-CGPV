import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import "./wid.css";
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { apiUrl } from "../../../server.json" 
import { Pie } from 'react-chartjs-2'; 

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react';
import { getStyle } from '@coreui/utils';
import { CChartBar, CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop, cilOptions, cilPeople } from '@coreui/icons';

const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null);
  const widgetChartRef2 = useRef(null);
  const { user } = useContext(AuthContext);

  const [userCount, setUserCount] = useState(0);
  const [waterBillAmount, setWaterBillAmount] = useState(0);
  const [electricBillAmount, setElectricBillAmount] = useState(0);
  const [previousBillAmount, setPreviousBillAmount] = useState(0);



  const calculateTotalBills = (billsData) => {
    let totalWaterBill = 0;
    let totalElectricBill = 0;
    let totalPreviousBill = 0;
  
    billsData.forEach((bill) => {
      totalWaterBill += parseFloat(bill.waterbill);
      totalElectricBill += parseFloat(bill.electricbill);
      totalPreviousBill += parseFloat(bill.currentbalance);
    });
  
    return {
      totalWaterBill,
      totalElectricBill,
      totalPreviousBill,
    };
  };
  
  
  

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary');
          widgetChartRef1.current.update();
        });
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info');
          widgetChartRef2.current.update();
        });
      }
    });
  }, [widgetChartRef1, widgetChartRef2]);


  useEffect(() => {
    // Fetch user count 
    const fetchUserCount = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        setUserCount(response.data.length);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
  }, []);


  useEffect(() => {
    // GET all bills
    const fetchAllBills = async () => {
      try {
        const response = await axios.get(`${apiUrl}/bills`);
        const billsData = response.data.data;
        const { totalWaterBill, totalElectricBill, totalPreviousBill } = calculateTotalBills(billsData);
        setWaterBillAmount(totalWaterBill);
        setElectricBillAmount(totalElectricBill);
        setPreviousBillAmount(totalPreviousBill);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };
  
    fetchAllBills();
  }, []);
  

  const pieChartData = {
    labels: ['Water Bills', 'Electric Bills', 'Previous Bill'],
    datasets: [
      {
        data: [waterBillAmount, electricBillAmount, previousBillAmount ],
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'], 
        hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'], 
      },
    ],
  };

  return (
    <>
    {user ? (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            <>
            <CIcon icon={cilPeople} style={{ width: '24px', height: '24px' }} />{userCount}
            </>
          }
          title="Users Registered"
          
          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-primary'),
                    data: [65, 59, 84, 84, 51, 55, 40],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 30,
                    max: 89,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={
            <>
              ₱{waterBillAmount}&nbsp; 
              <span className="fs-6 fw-normal"></span>
            </>
          }   
          title="Total Water Bills"
          
          chart={
            <CChartLine
              ref={widgetChartRef2}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: [1, 18, 9, 17, 34, 22, 11],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: -9,
                    max: 39,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={
            <>
              ₱{electricBillAmount}&nbsp; 
              <span className="fs-6 fw-normal"></span>
            </>
          }
          title="Total Electric Bills"
          
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40],
                    fill: true,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="danger"
          value={
            <>
              ₱{previousBillAmount}&nbsp; 
              <span className="fs-6 fw-normal"></span>
            </>
          }
          title="Total Previous Bills"
          
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                  'January',
                  'February',
                  'March',
                  'April',
                ],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <div className="pie-chart-container">
  <Pie className="pie-chart-canvas" data={pieChartData} />
</div>
    </CRow>
    ) : (
      <div className="text-center mt-3">You are not logged in. Admin</div>
    )}
  </>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
