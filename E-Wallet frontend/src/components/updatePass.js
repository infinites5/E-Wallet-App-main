
import React  from "react";
import axios from "axios";
import{useHistory} from "react-router-dom"
import "../css/update.css"
import { Appcontext } from "./context";

function UpdatePass(props) {
  let history = useHistory();

  const [pass1, setPass1] = React.useState("");
  const [pass2, setPass2] = React.useState("");
  const { setResult, result } = React.useContext(Appcontext);

  const [tk] = React.useState(props.match.params.id);

  async function setNewPass() {
    try {
      const response = await axios.put(
        "https://moneymanager131297.herokuapp.com/updatePassword",
        {
          newpassword: pass1,
          token: tk,
        }
      );
      setResult(response.data);
      if (response.data.message === "password reseted successfully") {
        history.push("/");
        setResult("");
      }
      // else{
      //     history.push("/forget_pass")
      // }
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(event) {
    switch (event.target.name) {
      case "pass1":
        setPass1(event.target.value);
        break;
      case "pass2":
        setPass2(event.target.value);
        break;
      default:
        break;
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (pass1 === pass2) {
      setNewPass();
      localStorage.clear();
    } else {
      return alert("please check your password");
    }
  }
  return (
    <>
      <div className="back">
        <div className="mid">
          <div className="titles">
            <i className="fas fa-user-lock fa-3x lock"></i>
            <p className="welcome">Set New Password</p>
            <p>{result ? result.message : null}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              className="form-control text"
              value={pass1}
              type="password"
              name="pass1"
              placeholder="Enter new password"
              onChange={handleChange}
              required
            ></input>
            <br />
            <input
              className="form-control text"
              value={pass2}
              type="password"
              name="pass2"
              placeholder="Confirm new password"
              onChange={handleChange}
              required
            ></input>
            <br />
            <button
              type="submit"
              className="btn-lg btn-block btn btn-primary btns"
            >
              Reset
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdatePass;