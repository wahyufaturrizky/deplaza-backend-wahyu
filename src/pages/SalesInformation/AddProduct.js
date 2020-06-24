import React from 'react';
import Header from './components/Header'
import Menu from './components/Menu'
import Content from './components/Content'
import Footer from './components/Footer'
import Add from './components/ContentAdd'

export default class AddProduct extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <Menu />
                <Add />
                <Footer />
            </div>
        )
    }
}