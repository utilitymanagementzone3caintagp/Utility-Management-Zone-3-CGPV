import React, { useRef, useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { apiUrl } from "../../../server.json";
import { CCard, CCardHeader, CCardBody, CTable } from '@coreui/react';
import "./billrecords.css";
import { useReactToPrint } from 'react-to-print';


const Billrecords = () => {
  const { user } = useContext(AuthContext);
  const [billrecords, setBillrecord] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const itemsPerPage = 5;
  const componentRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Transaction history',
  });

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchBillrecord = async () => {
      try {
        const response = await axios.get(`${apiUrl}/billrecords`);
        const filteredRecords = user ? response.data.data.filter((record) => record.email === user.email) : [];
        setBillrecord(filteredRecords);
      } catch (error) {
        console.error('Error fetching billrecords:', error);
      }
    };

    fetchBillrecord();
  }, [user]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredItems = billrecords.filter(record =>
    record.typebill.toLowerCase().includes(searchInput.toLowerCase()) ||
    record.typebillamount.toString().toLowerCase().includes(searchInput.toLowerCase()) ||
    record.fromdate.toString().toLowerCase().includes(searchInput.toLowerCase()) ||
    record.todate.toString().toLowerCase().includes(searchInput.toLowerCase()) ||
    record.yrtype.toString().toLowerCase().includes(searchInput.toLowerCase())
  );
  const currentItems = searchInput ? filteredItems.slice(indexOfFirstItem, indexOfLastItem) : billrecords.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const btnpagefunct = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {user ? (
        <CCard className="newvie">
          <CTable align="middle" className="mb-0 border" hover responsive>
          <CCardHeader>
            B.R <button className='printbtn' onClick={handlePrint}>Print</button>
          </CCardHeader>
          <CCardBody>
          <div className="search-bar">
          <input
              className='inputsearchbar'
              type="text"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === '@' || e.key === '!' || e.key === '#' || e.key === '-' || e.key === '$' || e.key === '%' || e.key === '^' || e.key === '&' || e.key === '*' || e.key === '(' || e.key === ')' || e.key === '_' || e.key === '=' || e.key === '`'
              
                || e.key === '~' || e.key === '_' || e.key === '+') {
                  e.preventDefault();
                }
              }}
            />
            </div>

         <div className='tablebillamount'>
            {currentItems.length > 0 ? (
              <>
                <p id="printre">Please print the document with a watermark. If your document does not have a watermark, it will not be considered valid.</p>
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
                    {currentItems.map((record, index) => (
                      <tr key={index}>
                        <td id="tbodyonlinepay">
                          <p className='typebillclass'>{record.typebill}</p>
                        </td>
                        <td id="tbodyonlinepay">
                          <p id="billsmountype">₱{record.typebillamount}</p>
                        </td>
                        <td id="tbodyonlinepay">
                          <p><code className="fromto23">{record.fromdate}</code></p>
                        </td>
                        <td id="tbodyonlinepay">
                          <p><code className="fromto23">{record.todate}</code></p>
                        </td>
                        <td id="tbodyonlinepay">
                          <p className='yeartpye'>{record.yrtype}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pagebtnslice">
                  <button className='btnnextpage' onClick={() => btnpagefunct(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                  <span className='totalpagescount'>{currentPage}/{totalPages}</span>
                  <button className='btnprevious' onClick={() => btnpagefunct(currentPage + 1)} disabled={indexOfLastItem >= filteredItems.length}>Next</button>
                </div>
              </>
            ) : (
              <div className="text-center mt-3">Search not found.</div>
            )}
        </div>  
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

export default Billrecords;