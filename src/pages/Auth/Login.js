import React from 'react'
import { Link } from 'react-router-dom'
import { Auth } from "../../utils/auth";
import axiosConfig from '../../utils/axiosConfig'
import Loader from 'react-loader-spinner'
import toastr from 'toastr'

const URL_STRING = "/oauth/login"

export default class Login extends React.Component {
    state = {
        username: '',
        password: '',
        loading: false
    }

    componentDidMount() {
        this.props.history.push(Auth() ? '/home' : '/')
    }

    errorMessage = (message) => {
        toastr.error('Username atau password anda salah')
        this.setState({ loading: false })
    }

    // fungsi untuk login
    login = () => {
        const { username, password } = this.state
        if (!username) {
            toastr.warning('Mohon isi username anda')
        } else if (!password) {
            toastr.warning('Mohon isi password anda')

        } else {
            this.setState({ loading: true })
            const data = { username, password }
            axiosConfig.post(URL_STRING, data)
                .then(res => {
                    localStorage.setItem('dataUser', JSON.stringify(res.data.data));
                    this.props.history.push('/home')
                    window.location.reload(false);
                    this.setState({ loading: false })
                    toastr.success(`Berhasil login`)
                    console.log(res);
                }).catch(error => this.errorMessage(error))
        }

    }

    render() {
        const { loading } = this.state
        return (
            <body class="hold-transition login-page">
                <div className="login-box">
                    <div className="login-logo">
                        <Link to="/"><b>Deplaza</b>Admin</Link>
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
                                        <input type="checkbox" id="remember" />
                                        <label htmlFor="remember">
                                            Remember Me
                                         </label>
                                    </div>
                                </div>
                                {/* /.col */}
                                <div className="col-4">
                                    {loading ? <button type="submit" className="btn btn-primary btn-block"><Loader
                                        type="Oval"
                                        color="#fff"
                                        height={20}
                                        width={20}
                                    /></button> :
                                        <button type="submit" className="btn btn-primary btn-block" onClick={this.login} disabled={loading ? true : false}>Sign In</button>}
                                </div>
                                {/* /.col */}
                            </div>
                            <div className="social-auth-links text-center mb-3">
                                <p>- OR -</p>
                                <Link to="/register" className="btn btn-block btn-primary">
                                    Register
                                 </Link>
                            </div>
                            {/* /.social-auth-links */}
                            <p className="mb-1">
                                <a href="forgot-password.html">I forgot my password</a>
                            </p>
                        </div>
                        {/* /.login-card-body */}
                    </div>
                </div>
            </body>
        )
    }

}
