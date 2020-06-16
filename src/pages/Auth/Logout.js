import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class Logout extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }
  handleLogout() {
    localStorage.removeItem('dataUser')
    this.props.history.push("/");
  }
  render() {
    return (
        <li className="nav-item">
        <button onClick={this.handleLogout}  className="nav-link">
            <i className="nav-icon fas fa-arrow-left" />
            <Logout>
                <p>
                Logout
                </p>
               </Logout>
        </button>
    </li>
    );
  }
}
export default withRouter(Logout);