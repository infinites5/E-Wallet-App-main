import React from "react";
import { Appcontext } from "./context";
import axios from "axios";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { Bar } from "react-chartjs-2";
import "../css/app.css";

function MonthlyData() {
  const { mon, setMon } = React.useContext(Appcontext);
  const { allData, setAllData } = React.useContext(Appcontext);
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "octomber",
    "november",
    "december",
  ];

  const authToken = window.localStorage.getItem("auth-key");
  const instance = axios.create({
    baseURL: "https://moneymanager131297.herokuapp.com",
    headers: {
      "auth-token": authToken,
    },
  });

  async function money() {
    try {
      //  initially get all the days data
      const response3 = await instance.get("/money_data");
      setAllData(response3.data);
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    money();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mon]);
  let zz = 0;
  let getter1 = [];
  // update to userId when u add login flow
  allData.forEach((item) => {
    if (
      item.month === months[mon.getMonth()] &&
      item.expenditure.length !== 0 &&
      item.year === mon.getFullYear()
    ) {
      return getter1.push(item);
    } else {
      return;
    }
  });

  const qq = getter1.map((value) => {
    const oo = value.expenditure.reduce((acc, curr) => {
      return acc + +curr.amount;
    }, 0);
    return oo;
  });

  // console.log(qq)
  const last = qq.reduce((acc, curr) => {
    return acc + curr;
  }, 0);

  const monthlyIncome = getter1.reduce((acc, curr) => {
    return acc + curr.income;
  }, 0);

  //   expchart data logic
  let mExp3 = 0;
  let mExp2 = 0;
  let mExp1 = 0;

  let mInc3 = 0;
  let mInc2 = 0;
  let mInc1 = 0;
  getter1.map((value) => {
    if (value.month === months[mon.getMonth()]) {
      // console.log(value)
      value.expenditure.reduce((acc, curr) => {
        return (mExp3 = acc + +curr.amount);
      }, mExp3);
      mInc3 = mInc3 + value.income;
    } else if (value.month === months[mon.getMonth() - 1]) {
      value.expenditure.reduce((acc, curr) => {
        return (mExp2 = acc + +curr.amount);
      }, mExp2);
      mInc2 = mInc2 + value.income;
    } else if (value.month === months[mon.getMonth() - 2]) {
      value.expenditure.reduce((acc, curr) => {
        return (mExp3 = acc + +curr.amount);
      }, mExp3);
      mInc3 = mInc3 + value.income;
    } else {
      return zz++;
    }
    return zz++;
  });

  // console.log(getter1)

  let countNumber = 0;

  return (
    <>
      {/* datePicker */}
      <div className="calendarDiv">
        <DatePickerComponent
          value={months[mon.getMonth()]}
          onChange={(event) => {
            setMon(event.target.value);
          }}
          start="Year"
          depth="Year"
        />
      </div>

      {/* cards */}
      <div className="incDetail">
        <div className="incomeCard" style={{ borderLeft: "4px solid #4e73df" }}>
          <div className="inc">
            <h6 style={{ color: "#4e73df" }}>INCOME (MONTHLY)</h6>
          </div>
          <div className="exp">
            <i className="fas fa-rupee-sign fa-2x"></i>
            <h1 className="num">{monthlyIncome}</h1>
            <div className="lists">
              <i className="fas fa-money-bill fa-2x note"></i>
            </div>
          </div>
        </div>
        <div
          className="expenditureCard"
          style={{ borderLeft: "4px solid orange" }}
        >
          <div className="exp">
            <h6 style={{ color: "orange" }}>EXPENDITURE (MONTHLY)</h6>
          </div>
          <div className="exp">
            <i className="fas fa-rupee-sign fa-2x"></i>
            <h1 className="num">{last}</h1>
            <div className="lists">
              <i className="fas fa-list fa-2x dcal"></i>
            </div>
          </div>
        </div>
        <div
          className="expenditureCard"
          style={{ borderLeft: "4px solid yellowgreen" }}
        >
          <div className="exp">
            <h6 style={{ color: "yellowgreen" }}>EARNINGS (MONTHLY)</h6>
          </div>

          {/*  */}
          <div className="exp">
            <i className="fas fa-rupee-sign fa-2x"></i>
            <h1
              className="num"
              style={
                monthlyIncome - last < 0 ? { color: "red" } : { color: "green" }
              }
            >
              {monthlyIncome - last}
            </h1>
            <div className="lists">
              <i className="fas fa-hand-holding-usd fa-2x dcal"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="expDiv">
        <div className="expenditurerow">
          <div className="dparent">
            <h5 className="dTitle"> MONTHLY EXPENDITURE (MONTHLY)</h5>
          </div>

          {/* expenditure list div */}
          <div className="expList">
            <table
              className="table table-hover"
              style={{ textAlign: "center" }}
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Expenditure</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {getter1.map((item) => {
                  return item.expenditure.map((items) => {
                    countNumber++;
                    return (
                      <>
                        <tr key={items._id}>
                          <td>{countNumber}</td>
                          <td>{item.date}</td>
                          <td>{items.title}</td>
                          <td>{items.amount}</td>
                        </tr>
                      </>
                    );
                  });
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="chartDiv">
          <div className="dparent">
            <h5 className="dTitle"> EARNING OVERVIEW (MONTHLY)</h5>
          </div>
          <hr style={{ marginTop: "0px" }} />

          {/* chart div */}
          <div
            style={{
              paddingLeft: "40px",
              paddingRight: "40px",
              paddingBottom: "10px",
            }}
          >
            <Bar
              data={{
                labels: [
                  months[mon.getMonth() - 2],
                  months[mon.getMonth() - 1],
                  months[mon.getMonth()],
                ],
                datasets: [
                  {
                    label: "Total Expenditure",
                    data: [mExp1, mExp2, mExp3],
                    backgroundColor: ["rgb(235, 68, 110 ,0.4)"],
                    borderColor: ["rgb(235, 68, 110)"],
                    borderWidth: 1,
                  },
                  {
                    label: "Total Income",
                    data: [mInc1, mInc2, mInc3],
                    backgroundColor: ["rgb(92, 209, 92 , 0.4)"],
                    borderColor: ["rgb(92, 209, 92)"],
                    borderWidth: 1,
                  },
                ],
              }}
              height={350}
              width={350}
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default MonthlyData;
