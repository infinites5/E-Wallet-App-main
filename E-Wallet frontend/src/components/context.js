import React from "react";

export const Appcontext = React.createContext()

export const ContextProvider =(props)=>{
    const[title , setTitle] = React.useState("")
    const[amount , setAmount] = React.useState("")
    const [exp , setExp] = React.useState(false)
    const [data , setData] = React.useState()
    const [income , setIncome] = React.useState()
    const [bankBalance , setBalance] = React.useState({})
    const[totalExp , setTotal] = React.useState()
    const[aa , setaa] = React.useState(new Date())
    const[allData , setAllData] = React.useState([])
    const[monthlyState , setMonthlyState] = React.useState(false)
    const[yearlyState , setyearlyState] = React.useState(false)
    const [monthlyexp , setMonthlyExp] = React.useState(0)
    const [mon ,setMon] = React.useState(new Date())
    const [annual , setAnnual]= React.useState(new Date())
    const [ids , setIds] = React.useState("")
    const [dailyset , setDaily] = React.useState(false)


    const [name, setName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [result, setResult] = React.useState([]);
    const [popup, setPopup] = React.useState(false);


    return(
        <Appcontext.Provider value={{title , setTitle , amount , setAmount,
        exp , setExp , data , setData ,income , setIncome ,bankBalance , setBalance,
        totalExp , setTotal , aa , setaa ,allData , setAllData ,monthlyState , setMonthlyState,
        yearlyState , setyearlyState , monthlyexp , setMonthlyExp,mon ,setMon ,annual , setAnnual,
        ids , setIds ,name, setName ,password, setPassword ,result, setResult , popup, setPopup,
        dailyset , setDaily}}>
            {props.children}
        </Appcontext.Provider>
    )
}