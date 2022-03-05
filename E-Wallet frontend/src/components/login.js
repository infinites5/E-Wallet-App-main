
import axios from "axios";
import React, { useContext } from "react";
import "../css/login.css";
import { Appcontext } from "./context";
import { Link } from "react-router-dom";
import {useHistory} from "react-router-dom"

function Login() {
    let history = useHistory()
  const { name, setName } = useContext(Appcontext);
  const { password, setPassword } = useContext(Appcontext);
  const { result, setResult} = useContext(Appcontext);

  //log in with the information provided by the user
  async function getData() {
    try {
      const response = await axios.post("https://moneymanager131297.herokuapp.com/user/login", {
        email: name,
        password: password,
      });
     
      setResult(response.data);
      if(response.data.message !== "wrong password"){
        window.localStorage.setItem("auth-key", response.data.authToken);
        window.localStorage.setItem("infos" , JSON.stringify(response.data))
      }else{
        history.replace("/")
      }
     
      if(response.data.authToken){
          history.push("/dashboards")
          setResult("")
      }
      setName("")
      setPassword("")
    } catch (error) {
      console.log(error);
    }
  }

  //handle the changes in the form
  function handleChange(event) {
    switch (event.target.name) {
      case "userName": {
        setName(event.target.value);
        break;
      }
      case "password": {
        setPassword(event.target.value);
        break;
      }
      default: {
        break;
      }
    }
  }

  //handle submit
  function handleSubmit(event) {
    event.preventDefault();
    if(name==="" || password === ""){
      return alert("Enter valid data")
    }else{
      return  getData();
    }
   
    // setPopup(!popup);
  }
  return (
    <>
    {/* if user has not successfully logedin than render the sign in form again  */}
      
        <div className="containers">
          <div className="loginParent">
        <div className="logPic">
          <img  className="walletPics" src="./images/wallet.jpg" alt="wallets"/>
        </div>
          <div className="form">
            <form onSubmit={handleSubmit}>
              <div className="titles">
                <p className="welcome"> Login to your Wallet</p>
                <p style={{marginBottom:"0px"}}>{result ? result.message : null }</p>
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

              <input
                className="form-control text"
                type="password"
                value={password}
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
              ></input>
              <br />

              <button
                type="submit"
                className="btn-lg btn-block btn btn-primary btns"
              >
                Login
              </button>
              <div>
                <hr style={{marginTop:"30px" , marginBottom:"10px"}}/>
                <div className="resetDiv">
                  <Link
                    to="/forget_pass"
                    style={{ marginTop: "20px", marginBottom: "20px" }}
                  >
                    Forget Password ?{" "}
                  </Link>

                  <Link to="/register" style={{ marginBottom: "0" }}>
                    SignUp/Register
                  </Link>
                </div>
              </div>
            </form>
          </div>
          {/* if user log in successfully than render the url shortner */}
          </div>
        </div>
    </>
  );
}

export default Login;
