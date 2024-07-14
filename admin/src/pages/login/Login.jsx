import axios from "axios";
import { apiUrl } from "../../../server.json";
import logo from "../login/image/logo.png";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.scss";
import { AppFooter } from "../../components/index";
import { CircularProgress } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";

const Login = () => {
  const [otpInput, setOtpInput] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);

  const [countdown, setCountdown] = useState(900);
  const [reloadPage, setReloadPage] = useState(false);

  const [credentials, setCredentials] = useState({
    email: undefined,
    password: "",
    otp: "",
    showPassword: false,
  });

  const { loading, error, dispatch, user } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setCredentials((prev) => ({
      ...prev,
      showPassword:
        prev.password && prev.password.length > 0 ? !prev.showPassword : false,
    }));
  };

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(`${apiUrl}/auth/login`, credentials);
      if (res.data.isAdmin) {
        toast.info("The verification otp number has been sent to your email.");
        setShowOtpForm(true);
      } else if (res.data.message === "You don't have permission to access") {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: { message: "You don't have permission to access" },
        });
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: { message: "You don't have permission to access" },
        });
      }
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  const handleOTPVerification = async () => {
    try {
      const res = await axios.post(`${apiUrl}/auth/verify-otp`, {
        email: credentials.email,
        otp: otpInput,
      });

      if (res.data) {
        dispatch({ type: "LOGIN_OTP_VERIFIED" });
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        toast.success("Login Successful!");
      } else {
        toast.error("Incorrect OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Incorrect OTP. Please try again.");
    }
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

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="body flex-grow-1">
      <div className="login">
        {!showOtpForm && (
          <div
            className="loginContainer"
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

            <div className="lContainer">
              <input
                type="text"
                placeholder="Admin Email"
                id="email"
                onChange={handleChange}
                className="lInput"
              />
              <input
                type={credentials.showPassword ? "text" : "password"}
                placeholder="Admin Password"
                id="password"
                onChange={handleChange}
                className="lInput"
              />
              <div
                className="password-icon"
                onClick={handleTogglePasswordVisibility}
              >
                {credentials.showPassword && credentials.password.length > 0 ? (
                  <VisibilityOff />
                ) : (
                  credentials.password.length > 0 && <Visibility />
                )}
              </div>

              <button
                disabled={loading}
                onClick={handleClick}
                className="lButton"
              >
                {loading ? (
                  <CircularProgress size={19} color="white" />
                ) : (
                  "Login"
                )}
              </button>
              {error && <span class="colorspan">{error.message}</span>}
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
              className={`lInput ${credentials.error && credentials.error.otp ? "error" : ""}`}
            />
            <button onClick={handleOTPVerification} className="lButton">
              Verify OTP
            </button>
          </div>
        )}
      </div>
      <AppFooter />
    </div>
  );
};

export default Login;
