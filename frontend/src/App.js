import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import ListEmployeeComponent from './components/ListEmployeeComponent';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import CreateEmployeeComponent from './components/CreateEmployeeComponent';
import ViewEmployeeComponent from './components/ViewEmployeeComponent';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import ProfileComponent from './components/ProfileComponent';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div>
        <Router>
              <HeaderComponent />
                <div className="container">
                    <Switch> 
                          <Route path = "/" exact component = {LoginComponent}></Route>
                          <Route path = "/register" component = {RegisterComponent}></Route>
                          <ProtectedRoute path = "/employees" component = {ListEmployeeComponent}></ProtectedRoute>
                          <ProtectedRoute path = "/add-employee/:id" component = {CreateEmployeeComponent}></ProtectedRoute>
                          <ProtectedRoute exact path = "/view-employee" component = {ViewEmployeeComponent}></ProtectedRoute>
                          <ProtectedRoute path = "/profile" component = {ProfileComponent}></ProtectedRoute>
                          {/* <Route path = "/update-employee/:id" component = {UpdateEmployeeComponent}></Route> */}
                    </Switch>
                </div>
              <FooterComponent />
        </Router>
    </div>
    
  );
}

export default App;
