import React, { useState } from 'react';
import AppFooter from '../AppFooter';
import logo from "../Page/image/logo.png";
import user from "../Page/image/user.png";
import admin from "../Page/image/admin.jpg";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./page.css";
import {
    MDBContainer,
    MDBRow,
    MDBCol,
}
    from 'mdb-react-ui-kit';

const Page = () => {

    const handleAdminButtonClick = () => {
        window.location.href = 'https://zone3-admingpcainta.netlify.app/login';
    };

    const handleStalltenantButtonClick = () => {
        window.location.href = 'https://zone3-stalltenant-gpcainta.netlify.app/login';
    };


return (
         
 <div className="full-height-container">
    <Container className="mt-5">
        <Row className="justify-content-center">
            <Col xs={12} md={6}>
                <h2 className="text-center mb-4"> <img
                    src={logo}
                    alt="Logo"
                    style={{ width: "75px", height: "75px" }}
                /></h2>
            <h3 className="titlelog">Welcome To Utility Stalls In Zone-3 Cainta Greenpark Village</h3>
            </Col>
        </Row>
        
        <MDBContainer className="bodyformlink">
            <MDBRow>
                <MDBCol col='6' className="mb-5">
                        <div className="d-flex flex-column justify-content-center h-100 mb-4">
                            <div className="text-center">
                                <img src={admin}
                                    style={{ width: '177px' }} alt="logo" />
                                <h4 className="mt-1 mb-5 pb-1">We are The Hoa Team</h4>
                            </div>
                            <div className="text-center pt-1 mb-5 pb-1">
                                <button id="adminbtn" className="mb-4 w-100 gradient-custom-2" onClick={handleAdminButtonClick}>Admin</button>
                            </div>
                            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
                            <p className="mb-0">An admin page system serves as the control center for utility stall website management. It enables administrators to oversee and modify various aspects of the site, ensuring smooth operation and a positive user experience.</p>
                            </div>
                        </div>
                    </MDBCol>

                    <MDBCol col='6' className="mb-5">
                    <div className="d-flex flex-column  justify-content-center gradient-custom-2  h-100 mb-4">
                            <div className="text-center">
                                <img src={user}
                                    style={{ width: '185px' }} alt="logo" />
                                <h4 id="stalltitle" className="mt-1 mb-5 pb-1">I am one of the stall tenants.</h4>
                            </div>
                            <div className="text-center pt-1 mb-5 pb-1">
                                <button id="stalltbtn" className="mb-4" onClick={handleStalltenantButtonClick}>Stall Tenant</button>
                            </div>
                            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
                                <p id="definestallt" className="mb-0">In the Zone-3 Cainta Greenpark Village transactions, clarity and precision are paramount. This is particularly crucial in the formulation of bills for stalls and tenant utility services.</p>
                            </div>
                        </div>
                    </MDBCol>
                    
                </MDBRow>
            </MDBContainer>
        </Container>
    </div>
    );
};

export default Page;