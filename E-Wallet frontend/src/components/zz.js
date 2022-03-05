
import axios from "axios";
import React from "react";
import NavBar from "./navBar";
// import Data from"./datePicker";
import { Appcontext } from "./context";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import Exp from "./expenditure";
import "./app.css"
// import "react-datepicker/dist/react-datepicker.css";


function App(){

const {data , setData}=React.useContext(Appcontext)
const{exp , setExp} = React.useContext(Appcontext)
//  const [arrays , setArrays] = React.useState()
const{income , setIncome} = React.useContext(Appcontext)
const{bankBalance , setBalance} = React.useContext(Appcontext)
const{aa , setaa} = React.useContext(Appcontext)

console.log(aa.getMonth())

const months = ["january" , "february" , "march" , "april" , "may" , "june" , "july" , "august" , 
"september" , "octomber" , "november" , "december"]

//get the money data if data exists for present day then give that else 
// insert the new one

 async function getMoneyData() {
   const response1 = await axios.post("http://localhost:3001/data", {
     year: new Date().getFullYear(),
     month: months[new Date().getMonth()],
     date: new Date().toLocaleDateString(),
     income: 0,
     expenditure: [],
   });
   setData(response1.data);
   //also get the initial bank balance for that user
   const response2 = await axios.post("http://localhost:3001/getBalance",{
    id	:"6178ecbfc98b95505738b1f7",
   })
   setBalance(response2.data);
   
   console.log(response1)

  //  initially get all the days data
  const response3 = await axios.get("http://localhost:3001/money_data")
  console.log(response3.data)
 }
 React.useEffect(async() => {
   await getMoneyData();
 }, []);
   

//when you add income update the income in the data of that date

async function addIncome(){
  try{
    const response = await axios.put(`http://localhost:3001/update_income/${data._id}`,{
      income: income === undefined ? data.income :(data.income) + (+income)
    })
    setData(response.data) 
  }catch(error){
    console.log(error)
  }
}

//when you add income your bank balance also dhould be updated

async function updateBalance1 (){
  try{
    const response = await axios.put("http://localhost:3001/updateBalance",{
      id	:"6178ecbfc98b95505738b1f7",
      balance : income === undefined ? bankBalance.balance : (bankBalance.balance) + (+income)
    })
    console.log(response.data)
    setBalance(response.data)
  }catch(error){
    console.log(error)
  }
}


//reduce to calculate the total expenditure on the day
const data1 = data ? data.expenditure.reduce((acc , current)=>{
  return ((+acc )+ (+current.amount))
},0): null


function handleChange(event){
  switch (event.target.name) {
    case "addIncome":
      setIncome(event.target.value)
      break;
    default:
      break;
  }
}

function handleSubmit(event){
  event.preventDefault()
  addIncome()
  updateBalance1()
}


  return(
      <>
      <NavBar/>
      <div className = "container-fluid">
        <div className = "row">
          <div className = "col-lg-2 col-md-3" style={{paddingTop:"20px"}}>
            <div className="dash">
              <button>MONTH EXP</button>
            </div>
            <div className="dash">
              <button>WEEKLY EXP</button>
            </div>
            <div className="dash">
              <button>YEARLY EXP</button>
            </div>
          </div>
          <div className = "col-lg-10 col-md-9">
          <DatePickerComponent
        value={months[aa.getMonth()]}
        onChange={(event)=>{
            setaa(event.target.value)
        }}
        start="Year"
        depth="Year"
        />
            <div style={{display:"flex" ,justifyContent: "space-around"}}>
              <div className="incomeCard">
                <div className="inc">
                <h1>Income</h1>
                </div>
                <div style={{textAlign:"center"}}>
                <h1>{data ? data.income : null}</h1>
                </div>


                <div className="inc">
                  <form onSubmit={handleSubmit}>
                    <input type="text" name="addIncome" value={income} onChange={handleChange}></input>
                    <button type="submit">Add Money</button>
                  </form>
                </div>


              </div>
              <div className= "expenditureCard">
                <div className="exp">
                <h1>expenditure</h1>
                </div>

                {/*  */}
                <div className="exp">
                {data1 ? <h1>{data1}</h1> : null}
                </div>
                
              </div>
              <div className= "expenditureCard">
                <div className="exp">
                <h1>Bank Balances</h1>
                </div>

                {/*  */}
                <div className="exp">
                <h1>{(bankBalance.balance)}</h1>
                </div>
                
              </div>
            </div>
            <div className="expDiv">
              <div className="expenditurerow">
                <div style={{display: "flex"}}>
                <h3> DAILY EXPENDITURE</h3>
                <button onClick={()=>{setExp(!exp)}}>+</button>
                </div>
                <div className="expList">
                  {
                   data && data.expenditure.length !==0 ?
                    <table>
                    <thead>
                      <th>Title</th>
                      <th>Amount</th>
                    </thead>
                   
                      { 
                        data.expenditure.map((item)=>{
                        console.log(item)
                         return(
                          <tr>
                            <td>{item.title}</td>
                            <td>{item.amount}</td>
                          </tr>
                         )
                       })
                      }
                    
                  </table>:<h3>No expenditure</h3>
                  }
                 
                </div>
              </div>
              <div className="expenditurerow">
                <h3>OverView</h3>
                <button>+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        exp === true ? <Exp/> : null
      }
      </>
  )
}
export default App;





























import axios from "axios";
import React from "react";
import NavBar from "./navBar";
import MonthlyData from "./datePicker";
import YearData from "./year";
// import Data from"./datePicker";
import { Appcontext } from "./context";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";

import Exp from "./expenditure";
import "./app.css"
// import "react-datepicker/dist/react-datepicker.css";


function App(){

const {data , setData}=React.useContext(Appcontext)
const{exp , setExp} = React.useContext(Appcontext)
//  const [arrays , setArrays] = React.useState()
const{income , setIncome} = React.useContext(Appcontext)
const{bankBalance , setBalance} = React.useContext(Appcontext)
const{aa , setaa} = React.useContext(Appcontext)
const {monthlyState , setMonthlyState} = React.useContext(Appcontext)
const {yearlyState , setyearlyState} = React.useContext(Appcontext)
const{allData , setAllData} = React.useContext(Appcontext)

const{mon , setMon} = React.useContext(Appcontext)
const{annual , setAnnual} = React.useContext(Appcontext)


console.log(aa.getMonth())

const months = ["january" , "february" , "march" , "april" , "may" , "june" , "july" , "august" , 
"september" , "octomber" , "november" , "december"]

//get the money data if data exists for present day then give that else 
// insert the new one

 async function getMoneyData() {
   const response1 = await axios.post("http://localhost:3001/data", {
     year: new Date().getFullYear(),
     month: months[new Date().getMonth()],
     date: aa.toLocaleDateString(),
     income: 0,
     expenditure: [],
   });
   setData(response1.data);
   //also get the initial bank balance for that user
   const response2 = await axios.post("http://localhost:3001/getBalance",{
    id	:"6178ecbfc98b95505738b1f7",
   })
   setBalance(response2.data);
   
   console.log(response1)
 }
 React.useEffect(async() => {
   await getMoneyData();
 }, [aa]);
   

//when you add income update the income in the data of that date

async function addIncome(){
  try{
    const response = await axios.put(`http://localhost:3001/update_income/${data._id}`,{
      income: income === undefined ? data.income :(data.income) + (+income)
    })
    setData(response.data) 
  }catch(error){
    console.log(error)
  }
}

//when you add income your bank balance also dhould be updated

async function updateBalance1 (){
  try{
    const response = await axios.put("http://localhost:3001/updateBalance",{
      id	:"6178ecbfc98b95505738b1f7",
      balance : income === undefined ? bankBalance.balance : (bankBalance.balance) + (+income)
    })
    console.log(response.data)
    setBalance(response.data)
  }catch(error){
    console.log(error)
  }
}


//reduce to calculate the total expenditure on the day
const data1 = data ? data.expenditure.reduce((acc , current)=>{
  return ((+acc )+ (+current.amount))
},0): null


function handleChange(event){
  switch (event.target.name) {
    case "addIncome":
      setIncome(event.target.value)
      break;
    default:
      break;
  }
}

function handleSubmit(event){
  event.preventDefault()
  addIncome()
  updateBalance1()
}

// for monthly data
const getter1 = allData.filter((item)=>{
  if(item.month=== months[mon.getMonth()] && item.expenditure.length !==0 && item.year === aa.getFullYear()){
      return(item)
  }else{
      return
  }
})

const qq =  getter1.map((value)=>{
  const oo = value.expenditure.reduce((acc , curr)=>{
      return (acc + +curr.amount)
  },0)
  return(oo)
})

const last = qq.reduce((acc , curr)=>{
 return(acc + curr)
},0)


// for yearly  data

const getter2 = allData.filter((item)=>{
  if(item.year=== annual.getFullYear() && item.expenditure.length !==0){
      return(item)
  }else{
      return
  }
})

const qq2 =  getter2.map((value)=>{
  const oo = value.expenditure.reduce((acc , curr)=>{
      return (acc + +curr.amount)
  },0)
  return(oo)
})

const last2 = qq2.reduce((acc , curr)=>{
 return(acc + curr)
},0)

  return(
      <>
      <NavBar/>
      <div className = "container-fluid">
        <div className = "row">
          <div className = "col-lg-2 col-md-3" style={{paddingTop:"20px"}}>
            <div className="dash">
              <button onClick={()=>{
                setMonthlyState(!monthlyState)
                setyearlyState(false)
                }}>MONTH EXP</button>
            </div>
            <div className="dash">
              <button>WEEKLY EXP</button>
            </div>
            <div className="dash">
              <button onClick={()=>{
                setyearlyState(!yearlyState)
                setMonthlyState(false)
                }}>YEARLY EXP</button>
            </div>
          </div>
          <div className = "col-lg-10 col-md-9">
            <div>
            {
              monthlyState===true ?
              <>
             
              <DatePickerComponent
              value={months[mon.getMonth()]}
              onChange={(event)=>{
                setMon(event.target.value)
              
              }}
              start="Year"
              depth="Year"
              />
              </>
               : null
                } 
              {
                 yearlyState === true ?
                 <>
                 
              <DatePickerComponent
              value={annual.getFullYear()}
              onChange={(event)=>{
                setAnnual(event.target.value)
              }}
              start="Year"
              depth="Year"
              /> </>
              : null
              }  
              
              {
                yearlyState===false && monthlyState===false ?
                <>
               
                 <DatePickerComponent
              value={aa.toLocaleDateString()}
              onChange={(event)=>{
                  setaa(event.target.value)
              }}
              /> 
              </>: null
              }
             
            
         </div>
            <div style={{display:"flex" ,justifyContent: "space-around"}}>
              <div className="incomeCard">
                <div className="inc">
                <h1>Income</h1>
                </div>
                <div style={{textAlign:"center"}}>
                <h1>{data ? data.income : null}</h1>
                </div>


                <div className="inc">
                  <form onSubmit={handleSubmit}>
                    <input type="text" name="addIncome" value={income} onChange={handleChange}></input>
                    <button type="submit">Add Money</button>
                  </form>
                </div>


              </div>
              <div className= "expenditureCard">
                <div className="exp">
                <h1>expenditure</h1>
                </div>

                {/*  */}
                {
                  monthlyState===true ? 
                  <div className="exp">
                  <h1>{last}</h1> 
                   </div> : yearlyState===true ?
                    <div className="exp">
                    <h1>{last2}</h1> 
                     </div> :
                  <div className="exp">
                  {data1 ? <h1>{data1}</h1> : null}
                  </div> 
                   
                }
               
                
              </div>
              {
                  monthlyState===true || yearlyState ===true ||
                 ( data ? data.date < new Date().toLocaleDateString():null)? null :
                  <div className= "expenditureCard">
                  <div className="exp">
                  <h1>Bank Balances</h1>
                  </div>
  
                  {/*  */}
                  <div className="exp">
                  <h1>{(bankBalance.balance)}</h1>
                  </div>
                  
                </div>
                }
             
            </div>
            <div className="expDiv">
              <div className="expenditurerow">
                <div style={{display: "flex"}}>
                <h3> DAILY EXPENDITURE</h3>
                <button onClick={()=>{setExp(!exp)}}>+</button>
                </div>
                {
                  monthlyState === false && yearlyState === false ? 
                  <div className="expList">
                  {
                   data && data.expenditure.length !==0 ?
                    <table>
                    <thead>
                      <th>Title</th>
                      <th>Amount</th>
                    </thead>
                   
                      { 
                        data.expenditure.map((item)=>{
                        console.log(item)
                         return(
                          <tr>
                            <td>{item.title}</td>
                            <td>{item.amount}</td>
                            <td><button>EDIT</button></td>
                            <td><button>DELETE</button></td>
                          </tr>
                         )
                       })
                      }
                    
                  </table>:<h3>No expenditure</h3>
                  }
                 
                </div> : yearlyState === true ? <YearData/> :
                <MonthlyData/>
                }
               
              </div>
              <div className="expenditurerow">
                <h3>OverView</h3>
                <button>+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        exp === true ? <Exp/> : null
      }
      </>
  )
}
export default App;



























let getter11 = []
allData.forEach((item)=>{
  if(item.date === (new Date(new Date().setDate(aa.getDate()-2)).toLocaleDateString()) && item.year === aa.getFullYear()){
    // console.log(new Date(new Date().setDate(aa.getDate()-2)).toLocaleDateString())
    return(getter11.push(item))
  }else if(item.date === (new Date(new Date().setDate(aa.getDate()-1)).toLocaleDateString()) && item.year === aa.getFullYear()){
    // console.log(new Date(new Date().setDate(aa.getDate()-1)).toLocaleDateString())
    return (getter11.push(item))
  }else if(item.date=== aa.toLocaleDateString() && item.year === aa.getFullYear() ){
    // console.log(aa.toLocaleDateString())
     return (getter11.push(item))
  }else{
    return
  }
})
