import React from 'react';
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import Content from './components/Content'
import Footer from '../../components/Footer'

export default class Category extends React.Component {
    render() {
        return (
            <div>
                <Header name="Menu Kategori" />
                <Menu active="courier" />
                <Content />
                <Footer />
            </div>
        )
    }
}