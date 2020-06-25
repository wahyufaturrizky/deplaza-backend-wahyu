import React from 'react'
import { Link } from 'react-router-dom'
import { Auth } from "../../utils/auth";
import Axios from 'axios'
import $ from 'jquery'

const URL_STRING = "https://dev-rest-api.deplaza.id/v1/oauth/login"
const baseApiUrl = 'https://dev-rest-api.deplaza.id/';
const username = 'admin@admin.com';
const password = 'password';

export default class Login extends React.Component {
    state = {
        username: 'testing',
        password: '12345',
    }

    // componentDidMount() {
    //     this.props.history.push(Auth() ? '/home' : '/')
    // }

    // fungsi untuk login
    login = () => {
        const { username, password } = this.state
        const data = { username, password }

        let config = {
            headers: {
                'Content-Type': 'application/form-data'
              
            }
        }

        Axios.post(URL_STRING, data)
            .then(res => {
                localStorage.setItem('dataUser', JSON.stringify(res.data.data));
                this.props.history.push('/home')
                console.log(res);
            })
    }

    // tesAkses = () => {
    //     $.get(baseApiUrl, {}, r => {
    //         console.log(r);
    //     })
    // }

    // tesLogin = () => {
    //     $.post(`${baseApiUrl}/v1/oauth/login`, {
    //         username: username,
    //         password: password
    //     }, r => {
    //         console.log(r);
    //         if (r.data.token) {
    //            const token = r.data.token
    //             console.log(token)
    //         }
    //     })
    // }

    render() {
        return (
            <body class="hold-transition login-page">
                <div className="login-box">
                    <div className="login-logo">
                        <a href="../../index2.html"><b>Deplaza</b>Admin</a>
                    </div>
                    {/* /.login-logo */}
                    <div className="card">
                        <div className="card-body login-card-body">
                            <p className="login-box-msg">Sign in to start your session</p>
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" placeholder="Email/Username/No.hp" onChange={(e) => {
                                        this.setState({
                                            username: e.target.value
                                        })
                                    }}/>
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
                                        <input type="checkbox" id="remember" />
                                        <label htmlFor="remember">
                                            Remember Me
                                         </label>
                                    </div>
                                </div>
                                {/* /.col */}
                                <div className="col-4">
                                    <button type="submit" className="btn btn-primary btn-block" onClick={this.login}>Sign In</button>
                                </div>
                                {/* /.col */}
                            </div>
                            <div className="social-auth-links text-center mb-3">
                                <p>- OR -</p>
                                <a href="#" className="btn btn-block btn-primary">
                                    <i className="fab fa-facebook mr-2" /> Sign in using Facebook
                                 </a>
                                <a href="#" className="btn btn-block btn-danger">
                                    <i className="fab fa-google-plus mr-2" /> Sign in using Google+
                                 </a>
                            </div>
                            {/* /.social-auth-links */}
                            <p className="mb-1">
                                <a href="forgot-password.html">I forgot my password</a>
                            </p>
                            <p className="mb-0">
                                <Link to="/register" className="text-center">Register</Link>
                                {/* <a href="register.html" >Register a new membership</a> */}
                            </p>
                        </div>
                        {/* /.login-card-body */}
                    </div>
                </div>
            </body>
        )
    }

}
