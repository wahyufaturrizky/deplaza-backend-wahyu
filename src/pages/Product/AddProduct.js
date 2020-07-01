import React from 'react';
import Header from '../../components/Header'
import Menu from './components/Menu'
import Footer from './components/Footer'
import Add from './components/ContentAdd'

export default class AddProduct extends React.Component {
    render() {
        return (
            <div>
                <Header name="Tambah Produk" />
                <Menu />
                <Add />
                <Footer />
            </div>
        )
    }
}