import React from 'react';
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import Footer from '../../components/Footer'
import Edit from './components/ContentEdit'

export default class AddProduct extends React.Component {
    render() {
        console.log('fff', this.props.location.state)
        return (
            <div>
                <Header name="Edit Produk" />
                <Menu active="product"/>
                <Edit data={this.props.location.state} />
                <Footer />
            </div>
        )
    }
}