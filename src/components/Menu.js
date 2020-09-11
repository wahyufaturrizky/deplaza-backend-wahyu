import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {withRouter} from 'react-router';
import axiosConifg from '../utils/axiosConfig'

function Menu(props) {
    const [menu, setMenu] = useState([])

    useEffect(() => {
        getMenu()
    }, [])
    const data = localStorage.getItem('dataUser');
    const dataUser = JSON.parse(data)

    const logout = () => {
        localStorage.removeItem('dataUser')
        props.history.push('/')
    }

const getMenu = () => {
    axiosConifg.get(`user/${dataUser.id}`)
    .then(res => setMenu(res.data.data.permissions))
    .catch(e => console.log(e))
}

console.log(dataUser.role === '4' ? 'sup' : dataUser.role === '1' ? 'adm' : dataUser.role === '0' ? 'reseller' : null);

const {active} = props

    return (
        /* Main Sidebar Container */
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            {/* Brand Logo */}
            <a href="#" className="brand-link">
                <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                <span className="brand-text font-weight-light">DeplazaAdmin</span>
            </a>
            {/* Sidebar */}
            <div className="sidebar">
                {/* Sidebar user panel (optional) */}
                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div className="image">
                        <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
                    </div>
                    <div className="info">
                        <a href="#" className="d-block">{dataUser.fullname}</a>
                    </div>
                </div>
                {/* Sidebar Menu */}
                {dataUser.role === '4' ? 
                <nav className="mt-2">
                <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    {/* Add icons to the links using the .nav-icon class
           with font-awesome or any other icon font library */}
                    <li className="nav-item has-treeview menu-open">
                        <Link to="/home"  className={active === "dashboard" ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-tachometer-alt" />
                            <p>
                                Dashboard
         
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/product" className={active === 'product' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Menu Produk
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/salesInformation" className={active === 'sales' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Informasi Penjualan
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/complaint" className={active === 'complaint' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Menu Komplain
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/complaintReason" className={active === 'reason' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Menu Alasan Komplain
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/commissionReport" className={active === 'report' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Penarikan Saldo
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link onClick={logout} className="nav-link">
                            <i className="nav-icon fas fa-arrow-left" />
                            <p>
                               Logout
                            </p>
                        </Link>
                    </li>
                </ul>
            </nav>
                : dataUser.role === '1' || dataUser.role === '3'  ? <nav className="mt-2">
                <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    {/* Add icons to the links using the .nav-icon class
           with font-awesome or any other icon font library */}
                    <li className="nav-item has-treeview menu-open">
                        <Link to="/home"  className={active === 'dashboard' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-tachometer-alt" />
                            <p>
                                Dashboard
         
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/product" className={active === 'product' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Menu Produk
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/seller"  className={active === 'seller' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Menu Seller
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/buyer"  className={active === 'buyer' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Data Buyer
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/address"  className={active === 'address' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Data Alamat Seller
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/salesInformation"  className={active === 'sales' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Informasi Penjualan
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/category" className={active === 'category' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Menu Kategori
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/bank"  className={active === 'bank' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Data Bank
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/accountInformation"  className={active === 'account' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Data Rekening
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/popUp" className={active === 'popup' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Menu Popup
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/notification" className={active === 'notification' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Menu Notifikasi
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/notification" className={active === 'notification' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Menu Notifikasi Seller
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/supplier" className={active === 'supplier' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Menu Supplier
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/complaint" className={active === 'complaint' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Menu Komplain
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/complaintReason" className={active === 'reason' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Menu Alasan Komplain
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/commissionReport" className={active === 'report' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Penarikan Saldo
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/help" className={active === 'help' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Menu Bantuan Jualan
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link onClick={logout} className="nav-link">
                            <i className="nav-icon fas fa-arrow-left" />
                            <p>
                               Logout
                            </p>
                        </Link>
                    </li>
                </ul>
            </nav> : <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    {/* Add icons to the links using the .nav-icon class
           with font-awesome or any other icon font library */}
                    <li className="nav-item has-treeview menu-open">
                        <Link to="/home"  className={active === 'dashboard' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-tachometer-alt" />
                            <p>
                                Dashboard
         
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/product" className={active === 'product' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Menu Produk
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/category" className={active === 'category' ? "nav-link active" : "nav-link"}>
                            <i className="nav-icon fas fa-th" />
                            <p>
                                Menu Kategori
                            </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link onClick={logout} className="nav-link">
                            <i className="nav-icon fas fa-arrow-left" />
                            <p>
                               Logout
                            </p>
                        </Link>
                    </li>
                    </ul>
            }
                
                {/* /.sidebar-menu */}
            </div>
            {/* /.sidebar */}
        </aside>

    )
}

export default withRouter(Menu)