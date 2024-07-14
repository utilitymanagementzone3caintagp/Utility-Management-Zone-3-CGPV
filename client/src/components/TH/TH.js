import React, { useRef, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from "../../../server.json";
import { AuthContext } from '../../context/AuthContext';
import { CCard, CCardHeader, CCardBody, CTable } from '@coreui/react';
import "./th.css";
import { useReactToPrint } from 'react-to-print';

const TH = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransaction] = useState([]);
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
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(`${apiUrl}/transactions`);
        const filteredTransactions = user ? response.data.data.filter((transaction) => transaction.email === user.email) : [];
        setTransaction(filteredTransactions);
      } catch (error) {
        console.error('Error fetching billrecords:', error);
      }
    };

    fetchTransaction();
  }, [user]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredItems = transactions.filter(transaction =>
    transaction.paymentmethodtransaction.toLowerCase().includes(searchInput.toLowerCase()) ||
    transaction.billtypetransaction.toString().toLowerCase().includes(searchInput.toLowerCase()) ||
    transaction.amountoftransaction.toString().toLowerCase().includes(searchInput.toLowerCase()) ||
    transaction.dateoftransaction.toString().toLowerCase().includes(searchInput.toLowerCase()) ||
    transaction.statusoftransaction.toString().toLowerCase().includes(searchInput.toLowerCase())
  );
  const currentItems = searchInput ? filteredItems.slice(indexOfFirstItem, indexOfLastItem) : transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);


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
                if (e.key === '@' || e.key === '!' || e.key === '-' || e.key === '#' || e.key === '$' || e.key === '%' || e.key === '^' || e.key === '&' || e.key === '*' || e.key === '(' || e.key === ')' || e.key === '_' || e.key === '=' || e.key === '`'
              
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
                      <th id="titlebill">PAYMENT METHOD</th>
                      <th id="titlebill">BILL</th>
                      <th id="titlebill">AMOUNT</th>
                      <th id="titlebill">DATE</th>
                      <th id="titlebill">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                        {currentItems.map((transaction, index) => (
                          <tr key={index}>
                            <td id="tbodyonlinepay">
                              <p className='typebillclass'>{transaction.paymentmethodtransaction}</p>
                            </td>
                            <td id="tbodyonlinepay">
                              <p id="billsmountype">{transaction.billtypetransaction}</p>
                            </td>
                            <td id="tbodyonlinepay">
                              <p><code className="fromto23">₱{transaction.amountoftransaction}</code></p>
                            </td>
                            <td id="tbodyonlinepay">
                              <p><code className="fromto23">{transaction.dateoftransaction}</code></p>
                            </td>
                            <td id="tbodyonlinepay">
                              <p className={
                                transaction.statusoftransaction === 'PAID' ? 'status-paid' :
                                transaction.statusoftransaction === 'PENDING' ? 'status-processed' :
                                transaction.statusoftransaction === 'CANCELLED' ? 'status-cancelled' :
                                'status-processed'
                              }>
                                {transaction.statusoftransaction ? transaction.statusoftransaction : 'PENDING'}
                              </p>
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

export default TH;