import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { apiUrl } from "../../../server.json";
import "./login.css";
import { AppFooter } from "../../components/index";
import logo from "../login/image/logo.png";
import { Alert } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CircularProgress } from "@material-ui/core";
import { toast } from "react-toastify";

const Login = () => {
  const [otpInput, setOtpInput] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);

  const [countdown, setCountdown] = useState(900);
  const [reloadPage, setReloadPage] = useState(false);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    otp: "",
    error: {
      email: false,
      password: false,
      otp: false,
    },
    showPassword: false,
  });

  const { loading, error, dispatch, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setCredentials((prev) => ({
      ...prev,
      showPassword: prev.password.length > 0 ? !prev.showPassword : false,
    }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [id]: value,
      error: {
        ...prev.error,
        [id]: value.trim() === "",
      },
    }));
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

  const handleClick = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setCredentials((prev) => ({
        ...prev,
        error: {
          email: !credentials.email,
          password: !credentials.password,
        },
      }));
      return;
    }
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(`${apiUrl}/auth/login`, credentials);
      if (!res.data.otpVerified) {
        toast.info("The verification otp number has been sent to your email.");
        setShowOtpForm(true);
      }
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  const handleRegisterNowClick = () => {
    dispatch({ type: "RESET_ERROR" });
  };
  const handleForgotPasswordClick = () => {
    dispatch({ type: "RESET_ERROR" });
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

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
      <body className="logBody">
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
            <div
              className="login"
              style={{
                maxWidth: "100%",
                height: "auto",
                display: "block",
                margin: "0 auto",
              }}
            >
              <div className="lContainer">
                <input
                  type="text"
                  placeholder={
                    credentials.error.email ? "Email is required" : "Email"
                  }
                  id="email"
                  onChange={handleChange}
                  className={`lInput ${credentials.error.email ? "error" : ""}`}
                />
                <input
                  type={credentials.showPassword ? "text" : "password"}
                  placeholder={
                    credentials.error.email
                      ? "Password is required"
                      : "Password"
                  }
                  id="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className={`lInput ${credentials.error.password ? "error" : ""}`}
                />
                <div
                  className="password-icon"
                  onClick={handleTogglePasswordVisibility}
                >
                  {credentials.showPassword &&
                  credentials.password.length > 0 ? (
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
              </div>
              {error && <span class="colorspan">{error.message}</span>}
              <br></br>
              <br></br>
              <span className="shr123">
                <button className="createacctbtn">
                  <Link
                    to="/register"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Create account
                  </Link>
                </button>
                <br />
                <br />
                <NavLink
                  to="/forgot"
                  style={{ color: "inherit", textDecoration: "none" }}
                  onClick={handleForgotPasswordClick}
                >
                  <span className="sh2">Forgot password</span>
                </NavLink>
              </span>
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
              className={`lInput ${credentials.error.otp ? "error" : ""}`}
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

export default Login;