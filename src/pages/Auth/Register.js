import React from 'react'
import Axios from 'axios'
import {Link} from 'react-router-dom'
import { withRouter } from "react-router";

const URL_STRING = "/v1/oauth/register"

class Register extends React.Component {
    state = {
        email: '',
        password: '',
        fullname: '',
        phone: '',
        username: '',
    }

    // fungsi untuk register
    register = () => {
        const { email, password, fullname, phone, username } = this.state
        const data = {email, password, fullname, phone, username}
        Axios.post(URL_STRING, data)
            .then(res => {
                localStorage.setItem('dataUser', JSON.stringify(res.data.data));
               this.props.history.push('/home')
               console.log(res);
            })
    }

    render() {
        return (
            <div class="hold-transition register-page">
                <div className="register-box">
                    <div className="register-logo">
                        <a href="../../index2.html"><b>Deplaza</b>Admin</a>
                    </div>
                    <div className="card">
                        <div className="card-body register-card-body">
                            <p className="login-box-msg">Register a new membership</p>
                           
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" placeholder="Full name" onChange={(e) => {
                                        this.setState({
                                            fullname: e.target.value
                                        })
                                    }} />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-user" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" placeholder="Username" onChange={(e) => {
                                        this.setState({
                                            username: e.target.value
                                        })
                                    }} />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-user" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <input type="number" className="form-control" placeholder="Phone" onChange={(e) => {
                                        this.setState({
                                            phone: e.target.value
                                        })
                                    }} />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-phone" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <input type="email" className="form-control" placeholder="Email" onChange={(e) => {
                                        this.setState({
                                            email: e.target.value
                                        })
                                    }} />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-envelope" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <input type="password" className="form-control" placeholder="Password" onChange={(e) => {
                                        this.setState({
                                            password: e.target.value
                                        })
                                    }} />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-lock" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-8">
                                        <div className="icheck-primary">
                                            <input type="checkbox" id="agreeTerms" name="terms" defaultValue="agree" />
                                            <label htmlFor="agreeTerms">
                                                I agree to the <a href="#">terms</a>
                                            </label>
                                        </div>
                                    </div>
                                    {/* /.col */}
                                    <div className="col-4">
                                        <button className="btn btn-primary btn-block" onClick={this.register}>Register</button>

                                    </div>
                                    {/* /.col */}
                                </div>
                           
                            <div className="social-auth-links text-center">
                                <p>- OR -</p>
                                <a href="#" className="btn btn-block btn-primary">
                                    <i className="fab fa-facebook mr-2" />
              Sign up using Facebook
            </a>
                                <a href="#" className="btn btn-block btn-danger">
                                    <i className="fab fa-google-plus mr-2" />
              Sign up using Google+
            </a>
                            </div>
                            <a href="login.html" className="text-center">I already have a membership</a>
                        </div>
                        {/* /.form-box */}
                    </div>{/* /.card */}
                </div>
            </div>
        )
    }

}
export default withRouter(Register)