import { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext';
import { apiUrl } from '../../../server.json'
import "./addstallst.css";
import { CCard, CCardHeader, CCardBody } from '@coreui/react';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined'
import { useNavigate } from 'react-router-dom'
import { CircularProgress } from '@material-ui/core'
import { toast } from 'react-toastify'


const Addstallst = () => {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [stall, setStall] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [sex, setSex] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)
  const [info, setInfo] = useState({})
  const [month, setMonth] = useState(''); 
  const [day, setDay] = useState('');
  const [year, setYear] = useState(''); 
  const navigate = useNavigate();


  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 200 }, (_, i) => 2099 - i); 


  const handleUserame = (e) => {
    setUsername(e.target.value)
    setSubmitted(false)
  }

  const handleSurname = (e) => {
    setSurname(e.target.value)
    setSubmitted(false)
  }

  // Handling the email change
  const handleEmail = (e) => {
    setEmail(e.target.value)
    setSubmitted(false)
  }

  // Handling the stall
  const handleStall = (e) => {
    setStall(e.target.value)
    setSubmitted(false)
  }

  // Handling the password change
  const handlePassword = (e) => {
    const passwordValue = e.target.value
    setPassword(passwordValue)
    setSubmitted(false)

    const isValidPassword = passwordValue.length >= 6
    const passwordInput = e.target
    setError(!isValidPassword)

    if (!isValidPassword) {
      passwordInput.setCustomValidity('Password must be at least 6 characters long')
    } else {
      passwordInput.setCustomValidity('')
    }
    passwordInput.reportValidity()
  }

  const handlePhone = (e) => {
    setPhone(e.target.value)
    setSubmitted(false)
  }


  const handleYearChange = (e) => {
    setYear(e.target.value);
    setSubmitted(false);
  };
  const handleBirthdate = (e) => {
    setBirthdate(e.target.value)
    setSubmitted(false)
  }
  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setSubmitted(false);
  };

  const handleDayChange = (e) => {
    setDay(e.target.value);
    setSubmitted(false);
  };


  const handleSex = (e) => {
    setSex(e.target.value)
    setSubmitted(false)
  }

  const handleClick = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (password.length < 6) {
      setError(true)
      setLoading(false)
      return
    }

    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', 'upload')
    try {
      const uploadRes = await axios.post(
        'https://api.cloudinary.com/v1_1/druug7n6r/upload',
        data,
      )
      const { url } = uploadRes.data
      const newUser = {
        username,
        surname,
        email,
        password,
        phone,
        stall,
        birthdate: `${month} ${day} ${year}`, 
        sex,
        ...info,
        img: url,
      }

      await axios.post(`${apiUrl}/auth/register`, newUser)
      setSubmitted(true)
      toast.success('Your stall tenant addition has been successful.')
        navigate('/')
    } catch (err) {
      console.log(err)
      toast.error('Error, please fill each field')
    } finally {
      setLoading(false)
    }
  }

  
  return (
    <>
    {user ? (
      <CCard className="mb-4">
        <CCardHeader>
          NEW
        </CCardHeader>
        <CCardBody>
          <table className="table">
           
            <tbody>
              <tr>
                <div className="loginContainer">
                  <div className="registerr123">
                    <div className="left1">
                      <img
                        src={file ? URL.createObjectURL(file) : 'https://i.ibb.co/n7L9Tcw/noavatar.jpg'}
                        alt=""
                      />
                    </div>

                    <label htmlFor="file">
                      <div id="iconss">
                        <p id="profilepiccname">Profile picture:</p>
                        <DriveFolderUploadOutlinedIcon className="icon" />
                      </div>
                    </label>

                    <div className="inputs">
                      <input
                        type="file"
                        id="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        style={{ display: 'none' }}
                      />

                      {info.message && (
                        <Alert
                          severity={info.severity}
                          onClose={() => setInfo({})}
                          sx={{
                            width: '100%',
                            maxWidth: '400px',
                            fontSize: '14px',
                            position: 'fixed',
                            left: '33%',
                            top: '35%',
                          }}
                        >
                          {info.message}
                        </Alert>
                      )}

                      <div className="forminputmain">
                        <input
                          onChange={handleUserame}
                          className="rInput"
                          type="text"
                          id="username"
                          placeholder="First Name"
                        />
                        <input
                          onChange={handleSurname}
                          className="rInput"
                          type="text"
                          id="surname"
                          placeholder="Last Name"
                        />
                        <input
                          onChange={handleEmail}
                          type="email"
                          id="email"
                          className="rInput"
                          placeholder="Email"
                        />
                        <input
                          onChange={handlePassword}
                          className={`rInput ${error ? 'error' : ''}`}
                          type="password"
                          id="password"
                          placeholder="Password"
                          style={{ color: 'black' }}
                        />
                        <input
                          onChange={handlePhone}
                          type="text"
                          id="phone"
                          className="rInput"
                          placeholder="Contact Number"
                        />
                        <input
                          onChange={handleStall}
                          type="text"
                          id="stall"
                          className="rInput"
                          placeholder="Stall Name"
                        />
                        <div className="birthdate-selects">
                          <label>Birthdate:</label>
                          <br></br>
                            <select value={month} onChange={handleMonthChange} className="rInput1">
                              <option value="">Month</option>
                              {months.map((month, index) => (
                                <option key={index} value={month}>{month}</option>
                              ))}
                            </select>
                            <select value={day} onChange={handleDayChange} className="daybirth">
                              <option value="">Day</option>
                              {days.map((day, index) => (
                                <option key={index} value={day}>{day}</option>
                              ))}
                            </select>
                            <select value={year} onChange={handleYearChange} className="yearbirth">
                              <option value="">Year</option>
                              {years.map((year, index) => (
                                <option key={index} value={year}>{year}</option>
                              ))}
                            </select>
                          </div>
                        <div className="genderselect">
                        <label>Gender:</label>
                        <br></br>
                          <div className="maleselect">
                            <label>
                              <input
                                className="rInput2"
                                type="radio"
                                name="sex"
                                value="Male"
                                onChange={handleSex}
                              />
                              Male
                            </label>
                          </div>

                          <div className="femaleselect">
                            <label>
                              <input
                                className="rInput2"
                                type="radio"
                                name="sex"
                                value="Female"
                                onChange={handleSex}
                              />
                              Female
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button disabled={loading} onClick={handleClick} className="lButton">
                      {loading ? <CircularProgress size={19} color="white" /> : 'Submit'}
                    </button>
                  </div>
                </div>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      ) : (
        <div className="text-center mt-3">You are not logged in. Admin</div>
      )}
    </>
  );
};

export default Addstallst; 