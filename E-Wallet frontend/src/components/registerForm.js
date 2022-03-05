

import axios from "axios";
import React, { useContext } from "react";
import {useHistory} from "react-router-dom"
import "../css/login.css";
import { Appcontext } from "./context";


function RegisterForm() {
    let history = useHistory()
  const { name, setName } = useContext(Appcontext);
  const { password, setPassword} = useContext(Appcontext);
  const [firstName , setFirstName] = React.useState("");
  const[ resultss,  setResultss] = React.useState([])
//   addeing new user data to database
  async function registerNew() {
    try {
      const response = await axios.post("https://moneymanager131297.herokuapp.com/user/register", {
        email: name,
        password: password,
        name: firstName,
      });
      setName("")
      setPassword("")
      if(response.data.message==="Registered successfully"){
        history.replace("/")
      }
      setResultss(response.data);
    } catch (error) {
      console.log(error);
    }
  }

//   handle changes in form
  function handleChange(event) {
    switch (event.target.name) {
      case "firstName":
        setFirstName(event.target.value);
        break;
      case "userName":
        setName(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      default:
        break;
    }
  }
// handle submit
  function handleSubmit(event) {
    event.preventDefault();
    if(firstName==="" || name=== "" || password===""){
      return alert("Enter valid data")
    }else{
      return  registerNew();
    }
    
  }
  return (
    <>
      <div className="containers">
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="titles">
              <p className="welcome">Register</p>
              <p>{ resultss ? resultss : null }</p>
            </div>

            <input
              className="form-control text"
              type="text"
              value={firstName}
              name="firstName"
              placeholder="Enter your first name"
              required
              onChange={handleChange}
            ></input>
            <br />

            <input
              className="form-control text"
              type="email"
              value={name}
              name="userName"
              placeholder="Register your email"
              required
              onChange={handleChange}
            ></input>
            <br />

            <input
              className="form-control text"
              type="password"
              value={password}
              name="password"
              placeholder="Create password"
              onChange={handleChange}
              required
            ></input>
            <br />

            <button
              type="submit"
              className="btn-lg btn-block btn btn-primary btns"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    
    </>
  );
}

export default RegisterForm;
