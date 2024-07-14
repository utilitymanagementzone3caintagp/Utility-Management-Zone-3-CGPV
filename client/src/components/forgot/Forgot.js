import axios from "axios";
import logo from "../../../src/pages/login/image/logo.png";
import { apiUrl } from "../../../server.json";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import "./Forgot.css";
import { AppFooter } from "../../components/index";
import { Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { CircularProgress } from "@material-ui/core";

const Forgot = () => {
  const [otp, setOtp] = useState(null);
  const [otpExpiration, setOtpExpiration] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data } = useFetch(`/users/`);
  const [credentials, setCredentials] = useState("");
  const [userid, setUserid] = useState("");
  const [img, setImg] = useState("");
  const [username, setUsername] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setUseremail] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [info, setInfo] = useState({});
  const [error, setError] = useState({
    email: false,
    otp: false,
  });

  const [countdown, setCountdown] = useState(900);
  const [reloadPage, setReloadPage] = useState(false);

  const handleOTPVerification = async () => {
    try {
      const res = await axios.post(`${apiUrl}/auth/verify-otp`, {
        email: email,
        otp: otpInput,
      });

      if (res.data) {
        toast.success("OTP verified successfully.");
        navigate("/forgotid", { state: { userid, username, surname, img } });
      } else {
        toast.error("Incorrect OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Incorrect OTP. Please try again.");
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      data.forEach((element) => {
        if (credentials === element.email) {
          setUserid(element._id);
          setImg(element.img);
          setUsername(element.username);
          setSurname(element.surname);
          setUseremail(element.email);
        }
      });

      Swal.fire({
        icon: "success",
        title: "Connect Success",
        text: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error connecting email. Please try again.");
    }

    setLoading(false);
  };

  const handleclick = async (e) => {
    e.preventDefault();

    if (userid === "") {
      toast.error(
        "Email not found! Please check your email and reconnect it again."
      );
    } else {
      setLoading(true);

      try {
        const res = await axios.post(`${apiUrl}/auth/send-otp`, { email });

        if (res.status === 200) {
          toast.info(
            "Email Connected! The verification OTP has been sent to your email."
          );
          setShowOtpForm(true);
        } else {
          toast.error("Failed to send OTP. Please try again.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to send OTP. Please try again.");
      }

      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  useEffect(() => {
    let timer;
    if (showOtpForm && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(timer);
      setReloadPage(true);
    }

    return () => clearInterval(timer);
  }, [showOtpForm, countdown]);

  useEffect(() => {
    if (reloadPage) {
      window.location.reload();
    }
  }, [reloadPage]);

  return (
    <div className="body flex-grow-1">
      <body className="regBody123">
        {!showOtpForm && (
          <div
            className="login123"
            style={{
              maxWidth: "100%",
              height: "auto",
              display: "block",
              margin: "0 auto",
            }}
          >
            <NavLink
              to="/login"
              className="close-button"
              onClick={handleCancel}
            >
              <CloseIcon />
            </NavLink>
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
            <div className="Container99">
              <span className="sp">Connect Your Email to Reset Password </span>
              {info.message && (
                <Alert
                  severity={info.severity}
                  onClose={() => setInfo({})}
                  sx={{
                    width: "100%",
                    maxWidth: "400px",
                    fontSize: "13px",
                    position: "fixed",
                    left: "36%",
                    top: "29%",
                  }}
                >
                  {info.message}
                </Alert>
              )}

              <input
                type="text"
                className={`lInput ${error.email ? "error" : ""}`}
                placeholder="Email"
                id="email"
                onChange={(e) => setCredentials(e.target.value)}
              />

              <button
                disabled={loading}
                onClick={handleClick}
                className="lButton97"
              >
                Connect Email
              </button>
              <button
                disabled={loading}
                onClick={handleclick}
                className="lButton97"
              >
                {loading ? (
                  <CircularProgress size={19} color="white" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </div>
        )}
        {showOtpForm && (
          <div className="lContainer">
            <div className="logodiv">
              <img
                src={logo}
                alt="Logo"
                style={{ width: "75px", height: "75px" }}
              />
            </div>
            <div className="countdown-timer">
              {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? "0" : ""}
              {countdown % 60}
            </div>
            <input
              type="text"
              placeholder="Enter OTP"
              id="otp"
              value={otpInput}
              onChange={(e) => {
                const { value } = e.target;
                if (/^\d*$/.test(value)) { 
                  setOtpInput(value);
                }
              }}
              className={`lInput ${error.otp ? "error" : ""}`}
            />
            <button onClick={handleOTPVerification} className="lButton">
              Verify OTP
            </button>
          </div>
        )}
      </body>
      <AppFooter />
    </div>
  );
};

export default Forgot;