
import axios from "axios";
import React from "react";
import NavBar from "./navBar";
import MonthlyData from "./datePicker";
import YearData from "./year";
import { Appcontext } from "./context";
import { Link} from "react-router-dom";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { Bar } from "react-chartjs-2";
import {useHistory} from "react-router-dom"
import Exp from "./expenditure";
import "../css/app.css"
import jwt from "jsonwebtoken";



function App(){

let history = useHistory()

const {data , setData}=React.useContext(Appcontext)
const{exp , setExp} = React.useContext(Appcontext)
const{income , setIncome} = React.useContext(Appcontext)
const{aa , setaa} = React.useContext(Appcontext)
const {monthlyState , setMonthlyState} = React.useContext(Appcontext)
const {yearlyState , setyearlyState} = React.useContext(Appcontext)
const{allData , setAllData} = React.useContext(Appcontext)
const{setTitle} = React.useContext(Appcontext)
const{ setIds} = React.useContext(Appcontext)
const{dailyset , setDaily} = React.useContext(Appcontext)
const {setAmount} = React.useContext(Appcontext)


const months = ["january" , "february" , "march" , "april" , "may" , "june" , "july" , "august" , 
"september" , "octomber" , "november" , "december"]

const authToken = window.localStorage.getItem("auth-key");
  const instance = axios.create({
    baseURL: "https://moneymanager131297.herokuapp.com",
    headers: {
      "auth-token": authToken,
    },
  });

//get the money data if data exists for present day then give that else 
// insert the new one

const decoded = jwt.decode(authToken)

 async function getMoneyData() {
   if (decoded.exp * 1000 <= Date.now()) {
     history.push("/");
   } else {
     try {
       const response1 = await instance.post("/data", {
         year: new Date().getFullYear(),
         month: months[new Date().getMonth()],
         date: aa.toLocaleDateString(),
         income: 0,
         expenditure: [],
       });
       setData(response1.data);
       console.log(data)
     } catch (error) {
       console.log(error);
     }
   }
 }
 React.useEffect(() => {
   getMoneyData();
   money();
   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [aa]);

// get all money data
async function money(){
  if(decoded.exp*1000 <= Date.now()){
    history.push("/")
  }else{
  try{
      //  initially get all the days data
      if(authToken){
        const response3 = await instance.get("/money_data")
        setAllData(response3.data)
      }else{
        history.push("/")
      }
     
  }catch(error){
      console.log(error)
  }
}
}


//  edit the expenditure
// control onchanges
let cc = 0
function edit(value){
  setExp(!exp)
  setTitle(value.title)
  setAmount(value.amount)
  setIds(value._id)
}

// API CALL to delete the expenditure
let id = data ? data._id :null
async function deleteExp (value){
  try{
    const response = await instance.put(`/remove/${id}/${value._id}`)
    setData(response.data)
    setIds("")
  }catch(error){
    console.log(error)
  }
 
}


// API CALL to when you add income update the income in the data of that date
async function addIncome(){
  try{
    const response = await instance.put(`/update_income/${data._id}`,{
      income: income === undefined ? data.income :(data.income) + (+income)
    })
    setData(response.data) 
    setIncome("")
  }catch(error){
    console.log(error)
  }
}



//reduce to calculate the total expenditure on the day
const data1 = data ? data.expenditure.reduce((acc , current)=>{
  return ((+acc )+ (+current.amount))
},0): null

// handle change of income form

function handleChange(event){
  switch (event.target.name) {
    case "addIncome":
      setIncome(event.target.value)
      break;
    default:
      break;
  }
}

// handlesubmit of addIncome form 
function handleSubmit(event){
  event.preventDefault()
  if(income !== ""){
    return addIncome()
  }else{
    return alert ("Enter valid Value")
  }
  
}

// for  dates
let today = new Date(aa);
let dd1 = String(today.getDate()-2);
let dd2 = String(today.getDate()-1);
let dd3 = String(today.getDate());
let mm = String(today.getMonth() + 1); //January is 0!
let yyyy = today.getFullYear();
let today1 = mm + '/' + dd1 + '/' + yyyy;
let today2 = mm + '/' + dd2 + '/' + yyyy;
let today3 = mm + '/' + dd3 + '/' + yyyy;

// filter the data from allData and get only particular users data
let getter11 =[]
 allData.forEach((item)=>{
  if(item.date === (today1) ||
  (item.date === (today2) || 
  (item.date ===today3))){
    // console.log(item)
      return(getter11.push(item))
  }else{
      return 
  }
})

// All below data for the chart on the dashboard
// income chart data on y-axis
let count1 =0 ;
let count2 = 0 ;
let count3 = 0;
 getter11.map((value)=>{
  if(value.date===aa.toLocaleDateString()){
    return count3+=value.income
  }else if(value.date=== new Date(new Date().setDate(aa.getDate()-1)).toLocaleDateString()){
    return count2+=value.income
  }else if(value.date=== new Date(new Date().setDate(aa.getDate()-2)).toLocaleDateString()){
    return count1+=value.income
  }
  else {
    return cc++
  }
 
})
//expenditure data for the day
let exp1 = 0;
let exp2 = 0;
let exp3 = 0;

 getter11.map((value)=>{
  if(value.date===aa.toLocaleDateString()){
    value.expenditure.reduce((acc , curr)=>{
      return exp3 = (acc + +curr.amount)
  },0)
  }else if(value.date=== new Date(new Date().setDate(aa.getDate()-1)).toLocaleDateString()){
    value.expenditure.reduce((acc , curr)=>{
      return exp2 = (acc + +curr.amount)
  },0)
  }else if(value.date=== new Date(new Date().setDate(aa.getDate()-2)).toLocaleDateString()){
    value.expenditure.reduce((acc , curr)=>{
      return exp1 = (acc + +curr.amount)
  },0)
  }
  else {
    return  cc++
  }
return cc++
})

let countNumber = 0;
  return (
    <>
      <div className="container-fluid">
        {/* whole page is divided in two parts left side contains the navigation */}
        {/* and right side contail the user data */}
        <div className="row">
          {/* below has navigation elements */}
          <div className="col-lg-2 col-md-3 optionDivs">
            <div className="appName">
              <div>
                <i className="fas fa-wallet fa-2x appIcon"></i>
              </div>
              <div style={{ textAlign: "center" }}>
                <p className="app">Wallet</p>
              </div>
            </div>
            <hr />
            <div className="dashTitle">
              <ul type="none" style={{ padding: "0px" }}>
                <li style={{ color: "white" }} className="lis">
                  <i className="fas fa-tachometer-alt cal"></i>
                  Dashboard
                </li>
              </ul>
            </div>
            <hr />

            {/* navigation */}
            <div className="dashTitle">
              <ul type="none" style={{ padding: "0px" }}>
                <li
                  className="lis"
                  style={
                    yearlyState === false &&
                    monthlyState === false &&
                    dailyset === false
                      ? { backgroundColor: "yellowgreen", color: "white" }
                      : { backgroundColor: "#4e73df", color: "white" }
                  }
                >
                  <i className="far fa-dot-circle cal"></i>
                  <Link
                    to="/dashboards"
                    className="links"
                    onClick={() => {
                      setyearlyState(false);
                      setMonthlyState(false);
                      setDaily(false);
                      setaa(new Date());
                    }}
                  >
                    Today's
                  </Link>
                </li>
              </ul>
            </div>
            <hr />

            {/* navigation */}
            <div className="title1">
              <p className="t1">EXPENDITURE HISTORY</p>
            </div>
            <div
              className="dash"
              style={
                dailyset === true
                  ? { backgroundColor: "yellowgreen", color: "black" }
                  : { backgroundColor: "#4e73df", color: "white" }
              }
            >
              <Link
                to="/dashboards"
                className="links"
                onClick={() => {
                  setyearlyState(false);
                  setMonthlyState(false);
                  setDaily(true);
                }}
              >
                <i className="fas fa-calendar-check cal"></i>Date Wise
              </Link>
            </div>

            {/* navigation */}
            <div
              className="dash"
              style={
                monthlyState === true
                  ? { backgroundColor: "yellowgreen", color: "black" }
                  : { backgroundColor: "#4e73df", color: "white" }
              }
            >
              <Link
                to="/dashboards"
                className=" links"
                onClick={() => {
                  setyearlyState(false);
                  setMonthlyState(true);
                  setDaily(false);
                }}
              >
                {" "}
                <i className="fas fa-calendar-day cal"></i>Month Wise
              </Link>
            </div>

            {/* navigation */}
            <div
              className="dash"
              style={
                yearlyState === true
                  ? { backgroundColor: "yellowgreen", color: "black" }
                  : { backgroundColor: "#4e73df", color: "white" }
              }
            >
              <Link
                to="/dashboards"
                className="links"
                onClick={() => {
                  setMonthlyState(false);
                  setyearlyState(true);
                  setDaily(false);
                }}
              >
                {" "}
                <i className="fas fa-calendar-alt cal"></i>Year Wise
              </Link>
            </div>
            <hr />

            {/* settings option */}
            <div className="title1">
              <p className="t1">SETTINGS</p>
            </div>
            <div>
              <ul type="none" style={{ padding: "0px" }}>
                <li style={{ marginBottom: "10px" }} className="lis">
                  <Link to="/forget_pass" className="links">
                    <i className="fas fa-question cal"></i>Forget Password
                  </Link>
                </li>
                <li className="lis">
                  <Link to="/forget_pass" className="links">
                    <i className="fas fa-key cal"></i>Change Password
                  </Link>
                </li>
              </ul>
            </div>
            <hr />
          </div>
          <div className="col-lg-10 col-md-9 contentDiv">
            <NavBar />
            {monthlyState === true ? (
              <MonthlyData />
            ) : yearlyState === true ? (
              <YearData />
            ) : (
              <>
                <div style={{ display: "flex" }}>
                  {/* datepicker div */}
                  <div className="calendarDiv">
                    {dailyset === false ? (
                      <DatePickerComponent
                        value={aa.toLocaleDateString()}
                        onChange={(event) => {
                          setaa(event.target.value);
                        }}
                        min={new Date()}
                        max={new Date()}
                      />
                    ) : null}
                    {dailyset === true ? (
                      <DatePickerComponent
                        value={aa.toLocaleDateString()}
                        onChange={(event) => {
                          setaa(event.target.value);
                        }}
                        max={new Date()}
                      />
                    ) : null}
                  </div>
                  {dailyset === false ? (
                    <div className="addIncomes">
                      {/* addIncome form */}

                      <div className="inc">
                        <form
                          onSubmit={handleSubmit}
                          style={{ display: "flex" }}
                        >
                          <input
                            type="number"
                            className="amountss"
                            name="addIncome"
                            placeholder="enter amount"
                            value={income}
                            onChange={handleChange}
                            required
                          ></input>
                          <button type="submit" className="addMoneyBtns">
                            {" "}
                            + Add Money
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* cards showeing the various user data */}
                <div className="incDetail">
                  <div
                    className="incomeCard"
                    style={{ borderLeft: "4px solid #4e73df" }}
                  >
                    <div className="inc">
                      <h6 style={{ color: "#4e73df" }}>INCOME (DAILY)</h6>
                    </div>
                    <div className="exp">
                      <i className="fas fa-rupee-sign fa-2x"></i>
                      <h1 className="num">{data ? data.income : null}</h1>
                      <div className="lists">
                        <i className="fas fa-money-bill fa-2x note"></i>
                      </div>
                    </div>
                  </div>

                  {/* expenditure card */}
                  <div
                    className="expenditureCard"
                    style={{ borderLeft: "4px solid orange" }}
                  >
                    <div className="exp">
                      <h6 style={{ color: "orange" }}>EXPENDITURE (DAILY)</h6>
                    </div>
                    <div className="exp">
                      <i className="fas fa-rupee-sign fa-2x"></i>
                      {data1 ? (
                        <h1 className="num">{data1}</h1>
                      ) : (
                        <h1 className="num">0</h1>
                      )}
                      <div className="lists">
                        <i className="fas fa-list fa-2x dcal"></i>
                      </div>
                    </div>
                  </div>

                  {/* earning cards */}
                  <div
                    className="expenditureCard"
                    style={{ borderLeft: "4px solid yellowgreen" }}
                  >
                    <div className="exp">
                      <h6 style={{ color: "yellowgreen" }}>EARNINGS (DAILY)</h6>
                    </div>
                    <div className="exp">
                      <i className="fas fa-rupee-sign fa-2x"></i>
                      <h1
                        className="num"
                        style={
                          (data && data.income - data1) < 0
                            ? { color: "red" }
                            : { color: "green" }
                        }
                      >
                        {data ? data.income - data1 : 0}
                      </h1>
                      <div className="lists">
                        <i className="fas fa-hand-holding-usd fa-2x dcal"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* daily earning card */}
                <div className="expDiv">
                  <div className="expenditurerow">
                    <div className="dparent">
                      <h5 className="dTitle"> DAILY EXPENDITURE</h5>
                      <div className="dBtnDiv">
                        {dailyset === false ? (
                          <button
                            className="addBtns"
                            onClick={() => {
                              setExp(!exp);
                            }}
                          >
                            {" "}
                            + Add Expenditure
                          </button>
                        ) : null}
                      </div>
                    </div>
                    {/* <hr style={{marginTop:"0px"}}/> */}

                    {/* expenditure list */}
                    <div className="expList">
                      {data && data.expenditure.length !== 0 ? (
                        <table
                          className="table table-hover"
                          style={{ textAlign: "center" }}
                        >
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Expenditure</th>
                              <th>Amount</th>
                              {dailyset === false ? (
                                <th colSpan="2">Action</th>
                              ) : (
                                <th>Date</th>
                              )}
                            </tr>
                          </thead>
                          {/* <th></th> */}

                          <tbody>
                            {data.expenditure.map((item) => {
                              countNumber++;

                              return (
                                <tr key={item._id}>
                                  <td>{countNumber}</td>
                                  <td>{item.title}</td>
                                  <td>{item.amount}</td>
                                  {dailyset === false ? (
                                    <>
                                      <td>
                                        <button
                                          className="editbtn"
                                          onClick={() => {
                                            edit(item);
                                          }}
                                        >
                                          <i className="far fa-edit"></i>
                                        </button>
                                      </td>
                                      <td>
                                        <button
                                          className="deletebtn"
                                          onClick={() => {
                                            deleteExp(item);
                                          }}
                                        >
                                          <i className="fas fa-trash"></i>
                                        </button>
                                      </td>
                                    </>
                                  ) : (
                                    <td>{data.date}</td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <div className="noExpDiv">
                          <h1>+ Add</h1>
                          <h3>No Expenditure </h3>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="chartDiv">
                    <div className="dparent">
                      <h5 className="dTitle"> EARNING OVERVIEW (DAILY)</h5>
                    </div>
                    <hr style={{ marginTop: "0px" }} />

                    {/* graph data div */}
                    <div
                      style={{
                        paddingLeft: "40px",
                        paddingRight: "40px",
                        paddingBottom: "10px",
                      }}
                    >
                      <Bar
                        height={350}
                        width={350}
                        data={{
                          labels: [today1, today2, today3],
                          datasets: [
                            {
                              label: "Total Expenditure",
                              data: [exp1, exp2, exp3],
                              backgroundColor: ["rgb(235, 68, 110 ,0.4)"],
                              borderColor: ["rgb(235, 68, 110)"],
                              borderWidth: 1,
                            },
                            {
                              label: "Total Income",
                              data: [count1, count2, count3],
                              backgroundColor: ["rgb(92, 209, 92 , 0.4)"],
                              borderColor: ["rgb(92, 209, 92)"],
                              borderWidth: 1,
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {exp === true ? <Exp /> : null}
    </>
  );
}
export default App;