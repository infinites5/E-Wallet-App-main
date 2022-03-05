import React from 'react';
import ReactDOM from 'react-dom';

import { ContextProvider } from './components/context';
import App from './components/App';
import Login from"./components/login";
import Forget from "./components/forget";
import UpdatePass from "./components/updatePass";
import RegisterForm from "./components/registerForm";
import { BrowserRouter, Route, Switch , Redirect } from "react-router-dom";

ReactDOM.render(
<ContextProvider>
  <BrowserRouter>
  <Switch>
    <Route exact path="/verifyEmail/:id" component={UpdatePass}/>
    <Route exact  path="/" render={()=>{
      const isLogged = window.localStorage.getItem("auth-key")
      return(
        isLogged ? <Redirect to="/dashboards"/> : <Login/>
      )
    }}/>
    <Route exact  path="/dashboards" component={App}/>
    <Route path="/forget_pass" component={Forget} />
    <Route path="/register" component={RegisterForm} />
  </Switch>
  </BrowserRouter>
</ContextProvider>,
  document.getElementById('root')
);
