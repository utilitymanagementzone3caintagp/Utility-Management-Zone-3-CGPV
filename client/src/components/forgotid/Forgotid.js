import axios from "axios";
import logo from "../../../src/pages/login/image/logo.png";
import { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { apiUrl } from "../../../server.json";
import "./Forgotid.css";
import { AppFooter } from "../../components/index";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CircularProgress } from "@material-ui/core";

const Forgotid = () => {
  const location = useLocation();
  console.log(location.state);
  const [userid, setUserid] = useState(location.state.userid);
  const [img, setImg] = useState(location.state.img);
  const [username, setUsername] = useState(location.state.username);
  const [surname, setSurname] = useState(location.state.surname);
  console.log(username, surname);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({});
  const [credentials, setCredentials] = useState({
    password: undefined,
    password2: undefined,
  });

  const { error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  //   Handle Change Function
  const handleChange = (e) => {
    e.preventDefault();
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  //Handle Click Function
  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (credentials.password == credentials.password2) {
        const res = await axios.put(
          `${apiUrl}/users/update/${userid}`,
          credentials
        );
        toast.success("Your password has been changed");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.warning("password not matched");
      }
    } catch (err) {
      toast.error("please fill required fields!");
    }
    setLoading(false);
  };

  return (
    <div className="body flex-grow-1">
      <body className="regBody4">
        <div
          className="login3"
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "block",
            margin: "0 auto",
          }}
        >
          <div className="logodiv">
            <img
              src={logo}
              alt="Logo"
              style={{ width: "75px", height: "75px" }}
            />
          </div>
          <h1 className="titleLog">
            Utility Management in Zone-3 Cainta Greenpark Village
          </h1>
          <div className="aContainer">
            <div className="profileuserview">
              {img && <img src={img} alt="Profile" className="profileImage" />}
              <div className="sp5">
                Reset Password:{username}&nbsp;{surname}
              </div>
            </div>
            <input
              type="password"
              className="lInput3"
              placeholder="New Password"
              id="password"
              onChange={handleChange}
            />
            <input
              type="password"
              className="lInput3"
              placeholder="Confirm Password"
              id="password2"
              onChange={handleChange}
            />
            <button
              disabled={loading}
              onClick={handleClick}
              className="Button12"
            >
              {loading ? (
                <CircularProgress size={19} color="white" />
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </body>
      <AppFooter />
    </div>
  );
};

export default Forgotid;