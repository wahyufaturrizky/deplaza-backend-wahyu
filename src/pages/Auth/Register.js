import React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from "react-router";
import axiosConfig from "../../utils/axiosConfig"
import toastr from 'toastr'
import Loader from 'react-loader-spinner'

const URL_STRING = "/oauth/register"

class Register extends React.Component {
    state = {
        email: '',
        password: '',
        fullname: '',
        phone: '',
        username: '',
        loading: false
    }

    errorMessage = (message) => {
        toastr.error(message)
        this.setState({ loading: false })
    }

    // fungsi untuk register
    register = () => {
        const { email, password, fullname, phone, username } = this.state
        if (!fullname) {
            toastr.warning('Mohon isi nama anda')
        } else if (!username) {
            toastr.warning('Mohon isi username anda')

        } else if (!phone) {
            toastr.warning('Mohon isi no telepon anda')

        } else if (!email) {
            toastr.warning('Mohon isi email anda')

        } else if (!password) {
            toastr.warning('Mohon isi password anda')

        } else {
            this.setState({ loading: true })
            const data = { email, password, fullname, phone, username }
            axiosConfig.post(URL_STRING, data)
                .then(res => {
                    localStorage.setItem('dataUser', JSON.stringify(res.data.data));
                    this.props.history.push('/home')
                    window.location.reload(false);
                    this.setState({ loading: false })
                    toastr.success(`Berhasil register`)
                    console.log(res);
                }).catch(error => this.errorMessage(error))
        }
    }

    render() {
        const { loading } = this.state
        return (
            <div class="hold-transition register-page">
                <div className="register-box">
                    <div className="register-logo">
                        <Link to="/"><b>Deplaza</b>Admin</Link>
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
                                    {loading ? <button type="submit" className="btn btn-primary btn-block"><Loader
                                        type="Oval"
                                        color="#fff"
                                        height={20}
                                        width={20}
                                    /></button> :
                                        <button type="submit" className="btn btn-primary btn-block" onClick={this.register} disabled={loading ? true : false}>Sign Up</button>}
                                </div>
                                {/* /.col */}
                            </div>
                            <Link to="/" className="text-center">I already have a membership</Link>
                        </div>
                        {/* /.form-box */}
                    </div>{/* /.card */}
                </div>
            </div>
        )
    }

}
export default withRouter(Register)