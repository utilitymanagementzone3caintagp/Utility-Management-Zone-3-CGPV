import axios from "axios";
import { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./profile.css";


const Profile = () => {

  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  //Handle Change Function

  //Handle Click Function

  return (
    <>
    {user ? (
    <div className="mainContainer container">
      <div className="contentArea row">
        <div className="rightpro">
        <div className="right col-lg-8">
        <h3>Admin</h3>
          <div className="profilepic">  
            <img
              required
              className="imgprofile img-fluid rounded-circle"
              src={user.img ? user.img : "https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
              alt=""
            />
          </div>
          <div className="details mt-4">
          <button className="btn btn-primary btn-block mb-2">
            <NavLink
              to="/edituser"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              UPDATE
            </NavLink>
          </button>
            <div className="detailItem">
              <span className="itemKey">Name:</span>
              <span className="itemValue">
                {user.username}
                &nbsp;
                {user.surname}
              </span>
            </div>
            <div className="detailItem">
              <span className="itemKey">Sex:</span>
              <span className="itemValue">{user.sex}</span>
            </div>
            <div className="detailItem">
              <span className="itemKey">Birthdate:</span>
              <span className="itemValue">{user.birthdate}</span>
            </div>
            <div className="detailItem">
              <span className="itemKey">Email:</span>
              <span className="itemValue">{user.email}</span>
            </div>
            <div className="detailItem">
              <span className="itemKey">Phone:</span>
              <span className="itemValue">{user.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="left col-lg-4">
        </div>
      </div>
    </div>
     ) : (
      <div className="text-center mt-3">You are not logged in.</div>
    )}
  </>
  );
};

export default Profile;