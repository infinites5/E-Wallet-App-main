

import "../css/login.css";
import axios from "axios";
import React, { useContext } from "react";
// import Message from "./message";
import { Appcontext } from "./context";

function Forget() {
  const { name, setName } = useContext(Appcontext);
  const { setResult , result } = useContext(Appcontext);

  //api call for resetting the password
  async function resetPass() {
    try {
      const response = await axios.put("http://moneymanager131297.herokuapp.com/reset", {
        email: name,
      });
      setResult(response.data);
      setName("")
    } catch (error) {
      console.log(error);
    }
  }

  //handle any changes in the form
  function handleChange(event) {
    switch (event.target.name) {
      case "userName":
        setName(event.target.value);
        break;

      default:
        break;
    }
  }

  //handle submit
  function handleSubmit(event) {
    event.preventDefault();
    resetPass();
  }
  return (
    <>
      <div className="containers">
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="titles">
              <p className="welcome">Reset Your Password</p>
              <p>{result ? result.message : null}</p>
            </div>

            <input
              className="form-control text"
              type="email"
              value={name}
              name="userName"
              placeholder="Enter your email"
              required
              onChange={handleChange}
            ></input>
            <br />

            <button
              type="submit"
              className="btn-lg btn-block btn btn-primary btns"
            >
              Send Email
            </button>
          </form>
        </div>
      </div>
      {/* any error msg or successfull msg will be rendered here */}
    </>
  );
}

export default Forget;