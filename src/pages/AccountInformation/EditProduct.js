import React from 'react';
import Header from './components/Header'
import Menu from './components/Menu'
import Content from './components/Content'
import Footer from './components/Footer'
import Edit from './components/ContentEdit'

export default class AddProduct extends React.Component {
    render() {
        console.log('fff', this.props.location.state)
        return (
            <div>
                <Header />
                <Menu />
                <Edit data={this.props.location.state} />
                <Footer />
            </div>
        )
    }
}