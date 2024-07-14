import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { apiUrl } from "../../../server.json"
import { AuthContext } from "../../context/AuthContext";
import "./Edituser.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { toast } from "react-toastify";

const EditUser = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [credentials1, setCredentials1] = useState({
    password: undefined,
    username: undefined,
    surname: undefined,
    img: undefined,
    phone: undefined,
  });

  const isPasswordRequired = () => {
    return (
      isButtonClicked &&
      (!credentials1.password || credentials1.password.length < 6)
    );
  };
  
  const { error } = useContext(AuthContext);
  const navigate = useNavigate();


  //   Handle Change Function
  const handleChange = (e) => {
    e.preventDefault();
    const { id, value } = e.target;
    setCredentials1((prev) => ({ ...prev, [id]: value }));

    if (id === "password") {
      if (value.length < 6) {
        setPasswordError(true);
        e.target.setCustomValidity(
          "Password must be at least 6 characters long"
        );
      } else {
        setPasswordError(false);
        e.target.setCustomValidity("");
      }
      e.target.reportValidity();
    }
  };

  // Handle Click Function
  const handleClick = async (e) => {
    e.preventDefault();
    setIsButtonClicked(true);
    setLoading(true);

    if (credentials1.password && credentials1.password.length < 6) {
      setPasswordError(true);
      setLoading(false);
      return;
    }

    const updatedCredentials = { ...credentials1 };
    delete updatedCredentials.img;

    try {
      if (file) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");

        const uploadRes = await axios.post(
          'https://api.cloudinary.com/v1_1/druug7n6r/upload',
          data
        );
        const { url } = uploadRes.data;
        updatedCredentials.img = url;
      }

      const res = await axios.put(`${apiUrl}/users/update/${user._id}`, updatedCredentials);

      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });

      toast.success('Update Successful.');
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.warning('Old/New password is required! The most efficient way you can avoid being hacked');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login2">
      <div className="lContainer133">
        <img
          src={
            file
              ? URL.createObjectURL(file)
              : user.img
              ? user.img
              : "https://i.ibb.co/MBtjqXQ/no-avatar.gif"
          }
          alt=""
        />
        <br></br>
        <label htmlFor="file">
          <div id="iconsss">
            Profile picture: <DriveFolderUploadOutlinedIcon className="icon" />
          </div>
        </label>

        <div className="inputs">
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
          />

          <p id="oldpass">
            Required! type your old password or you can change your password as
            well.
          </p>

          <input
            type="username"
            className="lInput7"
            placeholder={user.username ? user.username : "Firstname"}
            id="username"
            onChange={handleChange}
            disabled
          />

           <input
            type="surname"
            className="lInput7"
            placeholder={user.surname ? user.surname : "LastName"}
            id="surname"
            onChange={handleChange}
            disabled
          />
          <input
            type="tel"
            className="lInput7"
            placeholder="Contact Number"
            id="phone"
            onChange={handleChange}
          />
          <input
            type="password"
            className={`lInput7 ${isPasswordRequired() ? "error" : ""}`}
            placeholder="Password"
            id="password"
            onChange={handleChange}
            required
            disabled={error}
            style={{ color: "black" }}
          />
          
        </div>
            <button onClick={handleClick} className="lButton999">
              Confirm
            </button>
        </div>
      </div>
  );
};

export default EditUser;
