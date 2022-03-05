
import React from "react";
import { Appcontext } from "./context";
import axios from "axios";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import "../css/app.css";
import { Bar } from "react-chartjs-2";

function YearData(){
  const{annual , setAnnual} = React.useContext(Appcontext)
  const{allData , setAllData} = React.useContext(Appcontext)
    
const authToken = window.localStorage.getItem("auth-key");


const instance = axios.create({
  baseURL: "https://moneymanager131297.herokuapp.com",
  headers: {
    "auth-token": authToken,
  },
});

    async function money(){
        try{
            //  initially get all the days data
            const response3 = await instance.get("/money_data")
            // console.log(response3.data)
            setAllData(response3.data)
        }catch(error){
            console.log(error)
        }
    }

    React.useEffect(()=>{
        money()
  // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

// filter data and get data related to a particular year
let getter2=[]
let aa = 1
 allData.forEach((item)=>{
    if(item.year=== annual.getFullYear() && item.expenditure.length !==0){
        return(getter2.push(item))
    }else{
        return 
    }
    
  })

//using reduce to sum all the incomes and expenditure 
  const qq2 =  getter2.map((value)=>{
    const oo = value.expenditure.reduce((acc , curr)=>{
        return (acc + +curr.amount)
    },0)
    return(oo)
  })
  
  const last2 = qq2.reduce((acc , curr)=>{
   return(acc + curr)
  },0)

  const yearIncomes = getter2.reduce((acc , curr)=>{
    return (acc + curr.income)
},0)


// chart data
let yexp1 = 0;
let yexp2 = 0;
let yexp3 = 0;

let yInc1 = 0;
let yInc2 = 0;
let yInc3 = 0;

 getter2.map((value)=>{

    if(value.year === (annual.getFullYear()-2) ){
      value.expenditure.reduce((acc , curr)=>{
        return yexp1 = (acc + +curr.amount)
    },yexp1)
    yInc1 = yInc1 + value.income

    }else if(value.year === (annual.getFullYear()-1)){
      value.expenditure.reduce((acc , curr)=>{
        return yexp2 = ( acc + +curr.amount)
    },yexp2)
    yInc2 = yInc2 + value.income

    }else if(value.year === (annual.getFullYear())){
      value.expenditure.reduce((acc , curr)=>{
        return yexp3 = ( acc + +curr.amount)
    },yexp3)
    yInc3 = yInc3 + value.income
    }else{
      return aa++
    }
    return aa++
  })



let countNumber = 0


    return(
        <>
        {/* datePicker */}
        <div className="calendarDiv">  
             <DatePickerComponent
              value={annual.getFullYear()}
              onChange={(event)=>{
                setAnnual(event.target.value)
              }}
              start="Year"
              depth="Year"
              />   
        </div>

        {/* cards */}
        <div className="incDetail">
            <div className="incomeCard" style={{borderLeft: "4px solid #4e73df"}}>
                <div className="inc">
                <h6 style={{color:"#4e73df"}}>INCOME (YEARLY)</h6>
                </div>
                <div className="exp">
                <i className="fas fa-rupee-sign fa-2x"></i>
                <h1 className="num">{yearIncomes}</h1>
                <div className="lists">
                  <i className="fas fa-money-bill fa-2x note"></i>
                </div>  
                </div>
            </div>
            <div className= "expenditureCard" style={{borderLeft: "4px solid orange"}}>
                <div className="exp">
                <h6 style={{color:"orange"}}>EXPENDITURE (YEARLY)</h6>
                </div>
                <div className="exp">
                <i className="fas fa-rupee-sign fa-2x"></i>
                <h1 className="num">{last2}</h1> 
                <div className="lists">
                <i className="fas fa-list fa-2x dcal"></i>
                </div>
                </div>        
            </div>
            <div className= "expenditureCard" style={{borderLeft: "4px solid yellowgreen"}}>
                  <div className="exp">
                  <h6 style={{color:"yellowgreen"}}>EARNINGS (YEARLY)</h6>
                  </div>
  
                  {/*  */}
                  <div className="exp">
                  <i className="fas fa-rupee-sign fa-2x"></i>
                  <h1 className="num" style={(yearIncomes - last2)<0 ?{color:'red'} : {color:"green"}}>
                    {yearIncomes - last2 }</h1>
                  <div className="lists">
                  <i className="fas fa-hand-holding-usd fa-2x dcal"></i>
                  </div>
                  </div>
                  
            </div>  
        </div>

        <div className="expDiv">
            <div className="expenditurerow">
            <div  className="dparent">
                <h5  className="dTitle"> DAILY EXPENDITURE (YEARLY)</h5>
            </div>
            <div className="expList">
            <table className="table table-hover" style={{textAlign:"center"}}>
            
                <thead>
                <tr>
                <th>#</th>
                <th>Year</th>
                <th>Title</th>
                <th>Amount</th>
                </tr>
                </thead>
                <tbody>
                 {  
                    getter2.map((item)=>{
                            
                     return(
                            item.expenditure.map((items)=>{
                              countNumber++
                            return(
                             <>
                            <tr key={items._id}>
                            <td>{countNumber}</td>
                            <td>{item.year}</td>
                            <td>{items.title}</td>
                            <td>{items.amount}</td>
                            </tr>
                            </>
                            )
                                  
                            })
                            )             
                        })
                    }
                </tbody>
            </table>
            </div>  
            </div> 
            <div className="chartDiv">
              <div  className="dparent">
                <h5  className="dTitle"> EARNING OVERVIEW (YEARLY)</h5>
              </div>
              <hr style={{marginTop:"0px"}}/>

              {/* chart div */}

            <div style={{paddingLeft:"40px" , paddingRight:"40px" , paddingBottom:"10px"}}>
                <Bar
                data={{
                  labels: [annual.getFullYear()-2 , annual.getFullYear()-1 , annual.getFullYear()],
                  datasets: [{
                      label: 'Total Expenditure',
                      data: [yexp1 , yexp2 , yexp3 ],
                      backgroundColor: [
                          'rgb(235, 68, 110 ,0.4)'
                      ],
                      borderColor:['rgb(235, 68, 110)'],
                      borderWidth: 1
                  },
                  {
                    label: 'Total Income',
                    data:[yInc1 , yInc2 , yInc3],
                    backgroundColor: [
                      'rgb(92, 209, 92 , 0.4)'
                  ],
                  borderColor:['rgb(92, 209, 92)'],
                  borderWidth: 1
                  }
                ]
                }}
                 height={350}
                 width={350}
                />
                </div>
            </div>     
        </div>
        
      </>



    )
}
export default YearData;