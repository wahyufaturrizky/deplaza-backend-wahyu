import React, { useEffect, useState } from "react";
import axiosConfig from '../utils/axiosConfig'

const URL_GET = 'https://dev-rest-api.deplaza.id/v1/user'

export default function Content() {
    const [total, setTotal] = useState('')

    const data = localStorage.getItem('dataUser');
    const dataUser = JSON.parse(data)


    useEffect(() => {
        getTotalUser()
    }, []);

    const getTotalUser = () => {
        axiosConfig.get('/user')
            .then(res =>
                setTotal(res.data.meta.total_data)
            ).catch(error => console.log(error))
    }

    return (
        /* Content Wrapper. Contains page content */
        <div className="content-wrapper">
            {/* Content Header (Page header) */}
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h4 className="m-0 text-dark">Selamat Datang Admin {dataUser.fullname} di Deplaza</h4>
                        </div>{/* /.col */}
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Dashboard</li>
                            </ol>
                        </div>{/* /.col */}
                    </div>{/* /.row */}
                </div>{/* /.container-fluid */}
            </div>
            {/* /.content-header */}
            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    {/* Info boxes */}
                    <div className="row">
                        <div className="col-12 col-sm-6 col-md-4">
                            <div className="info-box mb-3" style={{ height: 100 }}>
                                <span className="info-box-icon bg-danger elevation-1" style={{ width: 100 }}><i className="fas fa-users" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text" style={{ alignSelf: 'flex-end' }}>Total Seller</span>
                                    <span className="info-box-number" style={{ alignSelf: 'flex-end' }}>{total}</span>
                                </div>
                                {/* /.info-box-content */}
                            </div>
                            {/* /.info-box */}
                        </div>
                        {/* /.col */}
                        {/* fix for small devices only */}
                        <div className="clearfix hidden-md-up" />
                        <div className="col-12 col-sm-6 col-md-4">
                            <div className="info-box mb-3" style={{ height: 100 }}>
                                <span className="info-box-icon bg-success elevation-1" style={{ width: 100 }}><i className="fas fa-shopping-cart" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text" style={{ alignSelf: 'flex-end' }}>Penjualan</span>
                                    <span className="info-box-number" style={{ alignSelf: 'flex-end' }}>760</span>
                                </div>
                                {/* /.info-box-content */}
                            </div>
                            {/* /.info-box */}
                        </div>
                        {/* /.col */}
                        <div className="col-12 col-sm-6 col-md-4">
                            <div className="info-box mb-3" style={{ height: 100 }}>
                                <span className="info-box-icon bg-warning elevation-1" style={{ width: 100 }}><i className="fas fa-users" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text" style={{ alignSelf: 'flex-end' }}>Total Buyer</span>
                                    <span className="info-box-number" style={{ alignSelf: 'flex-end' }}>2,000</span>
                                </div>
                                {/* /.info-box-content */}
                            </div>
                            {/* /.info-box */}
                        </div>
                        {/* /.col */}
                    </div>
                    {/* /.row */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title">Monthly Recap Report</h5>
                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                            <i className="fas fa-minus" />
                                        </button>
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-tool dropdown-toggle" data-toggle="dropdown">
                                                <i className="fas fa-wrench" />
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-right" role="menu">
                                                <a href="#" className="dropdown-item">Action</a>
                                                <a href="#" className="dropdown-item">Another action</a>
                                                <a href="#" className="dropdown-item">Something else here</a>
                                                <a className="dropdown-divider" />
                                                <a href="#" className="dropdown-item">Separated link</a>
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-tool" data-card-widget="remove">
                                            <i className="fas fa-times" />
                                        </button>
                                    </div>
                                </div>
                                {/* /.card-header */}
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <p className="text-center">
                                                <strong>Sales: 1 Jan, 2014 - 30 Jul, 2014</strong>
                                            </p>
                                            <div className="chart">
                                                {/* Sales Chart Canvas */}
                                                <canvas id="salesChart" height={180} style={{ height: 180 }} />
                                            </div>
                                            {/* /.chart-responsive */}
                                        </div>
                                        {/* /.col */}
                                        <div className="col-md-4">
                                            <p className="text-center">
                                                <strong>Goal Completion</strong>
                                            </p>
                                            <div className="progress-group">
                                                Add Products to Cart
                    <span className="float-right"><b>160</b>/200</span>
                                                <div className="progress progress-sm">
                                                    <div className="progress-bar bg-primary" style={{ width: '80%' }} />
                                                </div>
                                            </div>
                                            {/* /.progress-group */}
                                            <div className="progress-group">
                                                Complete Purchase
                    <span className="float-right"><b>310</b>/400</span>
                                                <div className="progress progress-sm">
                                                    <div className="progress-bar bg-danger" style={{ width: '75%' }} />
                                                </div>
                                            </div>
                                            {/* /.progress-group */}
                                            <div className="progress-group">
                                                <span className="progress-text">Visit Premium Page</span>
                                                <span className="float-right"><b>480</b>/800</span>
                                                <div className="progress progress-sm">
                                                    <div className="progress-bar bg-success" style={{ width: '60%' }} />
                                                </div>
                                            </div>
                                            {/* /.progress-group */}
                                            <div className="progress-group">
                                                Send Inquiries
                    <span className="float-right"><b>250</b>/500</span>
                                                <div className="progress progress-sm">
                                                    <div className="progress-bar bg-warning" style={{ width: '50%' }} />
                                                </div>
                                            </div>
                                            {/* /.progress-group */}
                                        </div>
                                        {/* /.col */}
                                    </div>
                                    {/* /.row */}
                                </div>
                                {/* ./card-body */}
                                <div className="card-footer">
                                    <div className="row">
                                        <div className="col-sm-3 col-6">
                                            <div className="description-block border-right">
                                                <span className="description-percentage text-success"><i className="fas fa-caret-up" /> 17%</span>
                                                <h5 className="description-header">$35,210.43</h5>
                                                <span className="description-text">TOTAL REVENUE</span>
                                            </div>
                                            {/* /.description-block */}
                                        </div>
                                        {/* /.col */}
                                        <div className="col-sm-3 col-6">
                                            <div className="description-block border-right">
                                                <span className="description-percentage text-warning"><i className="fas fa-caret-left" /> 0%</span>
                                                <h5 className="description-header">$10,390.90</h5>
                                                <span className="description-text">TOTAL COST</span>
                                            </div>
                                            {/* /.description-block */}
                                        </div>
                                        {/* /.col */}
                                        <div className="col-sm-3 col-6">
                                            <div className="description-block border-right">
                                                <span className="description-percentage text-success"><i className="fas fa-caret-up" /> 20%</span>
                                                <h5 className="description-header">$24,813.53</h5>
                                                <span className="description-text">TOTAL PROFIT</span>
                                            </div>
                                            {/* /.description-block */}
                                        </div>
                                        {/* /.col */}
                                        <div className="col-sm-3 col-6">
                                            <div className="description-block">
                                                <span className="description-percentage text-danger"><i className="fas fa-caret-down" /> 18%</span>
                                                <h5 className="description-header">1200</h5>
                                                <span className="description-text">GOAL COMPLETIONS</span>
                                            </div>
                                            {/* /.description-block */}
                                        </div>
                                    </div>
                                    {/* /.row */}
                                </div>
                                {/* /.card-footer */}
                            </div>
                            {/* /.card */}
                        </div>
                        {/* /.col */}
                    </div>
                </div>{/*/. container-fluid */}
            </section>
            {/* /.content */}
        </div>
        /* /.content-wrapper */
    )
}
