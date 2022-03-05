
import axios from "axios"
import React from "react"
import { Appcontext } from "./context"
import "../css/expenditure.css"

function Exp(){
    const{title , setTitle} = React.useContext(Appcontext)
    const {amount , setAmount} = React.useContext(Appcontext)
    const {data , setData} =React.useContext(Appcontext)
    const{exp , setExp} = React.useContext(Appcontext)
    const{ids ,  setIds} = React.useContext(Appcontext)


    const authToken = window.localStorage.getItem("auth-key");
    const instance = axios.create({
      baseURL: "https://moneymanager131297.herokuapp.com",
      headers: {
        "auth-token": authToken,
      },
    });


    let id = data._id
    async function editExp (){
        const response = await instance.put(`/update_exp/${id}/${ids}`,{
            title : title,
            amount : amount,
        })
        setData(response.data)
        setIds("")
        setTitle("")
        setAmount("")
    }


    function handleChange(event){
        switch (event.target.name) {
            case "title":
                setTitle(event.target.value)
                break;
            case "amount":
                setAmount(event.target.value)
                break;
            default:
                break;
        }
    }

    async function expenditure(data){

        console.log(data)
        try{
            const response = await instance.put(`/add_exp/${data._id}`,{
                title : title,
                amount : amount
            })
            // console.log(response.data)
            // const prev = [...data]
            // const index = prev.findIndex((item)=>item._id === response.data._id)
            // prev[index] = response.data
            setData(response.data)
            setTitle("")
            setAmount("")
        }catch(error){
            console.log(error)
        }
    }

    function handleSubmit(event){
        event.preventDefault()
        if(ids && title !== "" && amount!== ""){
           editExp()
        }else if(title === "" || amount=== ""){
           return alert("enter valid data")
        }else{
            expenditure(data)
        }
        
     
        setExp(!exp)
    }

    return(
        <>
        <div className="block">
            <div className="block2">
                <div style={{textAlign:"center" , backgroundColor:"#4e73df"}}>
                    <p className="expPopUp">Add Expenditure</p>
                </div>
                <div style={{padding:"25px"}}>
                    <form onSubmit={handleSubmit}>
                        <input type="text" className="form-control text"  name="title" value={title} 
                        onChange={handleChange}  required placeholder="Expenditure Title"/><br/>
                        <input type="number" className="form-control text" name="amount" value={amount} 
                        onChange={handleChange}  required placeholder="Enter Amount"/><br/>
                        <div className="buttonss">
                        <button class="btn  btn1" type="submit"> + Add</button>
                        <button class="btn btn-danger" onClick={()=>{
                            setExp(false)
                        }}>Cancel</button>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default Exp;