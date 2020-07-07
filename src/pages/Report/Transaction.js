import React from 'react';
import Header from '../../components/Header'
import Menu from './components/Menu'
import Footer from '../../components/Footer'
import TransactionList from './components/ContentTransaction'

export default class Transaction extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <Menu />
                <TransactionList />
                <Footer />
            </div>
        )
    }
}