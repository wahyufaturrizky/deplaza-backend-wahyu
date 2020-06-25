import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { ProtectedRoute } from "./route/protectedRoute";
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Category from './pages/Category/index'
import Product from './pages/Product/index'
import AddProduct from './pages/Product/AddProduct'
import EditProduct from './pages/Product/EditProduct';
import PopUp from './pages/PopUp/index'
import Seller from './pages/Seller/index'
import Buyer from './pages/Buyer/index'
import SalesInformation from './pages/SalesInformation/index'
import Notification from './pages/Notification/index'
import Supplier from './pages/Supplier/index'
import Complaint from './pages/Complaint'
import Report from './pages/Report'
import Help from './pages/Help'
import AccountInformation from './pages/AccountInformation'

export default function App() {
  return (
    <Router>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
        <ProtectedRoute exact path="/home" component={Home} />
        <ProtectedRoute exact path="/category" component={Category} />
        <ProtectedRoute exact path="/product" component={Product} />
        <ProtectedRoute exact path="/addProduct" component={AddProduct} />
        <ProtectedRoute exact path="/editProduct" component={EditProduct} />
        <ProtectedRoute exact path="/popUp" component={PopUp} />
        <ProtectedRoute exact path="/seller" component={Seller} />
        <ProtectedRoute exact path="/buyer" component={Buyer} />
        <ProtectedRoute exact path="/salesInformation" component={SalesInformation} />
        <ProtectedRoute exact path="/notification" component={Notification} />
        <ProtectedRoute exact path="/supplier" component={Supplier} />
        <ProtectedRoute exact path="/complaint" component={Complaint} />
        <ProtectedRoute exact path="/commissionReport" component={Report} />
        <ProtectedRoute exact path="/help" component={Help} />
        <ProtectedRoute exact path="/accountInformation" component={AccountInformation} />
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>

    </Router>
  );
}