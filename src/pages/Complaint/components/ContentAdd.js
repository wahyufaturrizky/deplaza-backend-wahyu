import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Pagination, Search } from "./DataTable";
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from "react-promise-tracker";
import { Spinner } from '../../../components/spinner'
import Axios from 'axios';
import { Auth } from '../../../utils/auth';
import { withRouter } from 'react-router';
import AddProductComponent from './AddProduct'

const URL_STRING = '/v1/products';
const URL_DETAIL = '/v1/product'

const DataTable = (props) => {
    const [products, setProducts] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addProduct, setAddProduct] = useState(false);
    const [id, setId] = useState(0)
    const ITEMS_PER_PAGE = 50;

    const headers = [
        { name: "No#", field: "id", sortable: false },
        { name: "Gambar Produk", field: "name", sortable: true },
        { name: "Nama Produk", field: "name", sortable: true },
        { name: "Kategori", field: "name", sortable: false },
        { name: "Brand", field: "email", sortable: true },
        { name: "Harga Pokok Produk", field: "email", sortable: true },
        { name: "Benefit Deplaza", field: "email", sortable: true },
        { name: "Komisi", field: "email", sortable: true },
        { name: "Aksi", field: "body", sortable: false }
    ];



    useEffect(() => {
        getProduct();
    }, []);


    const onLoadTables = () => {
        setProducts([])
    }


    const getProduct = () => {
        setLoading(true)
        let config = {
            headers: {
                Authorization: `Bearer ${Auth()}`,
                'Access-Control-Allow-Origin': '*',
            }
        }
        Axios.get(URL_STRING, config)
            .then(json => {
                setProducts(json.data.data);
                setLoading(false)
            })
    }


    const productsData = useMemo(() => {
        let computedProducts = products;

        if (search) {
            computedProducts = computedProducts.filter(
                product =>
                    product.name.toLowerCase().includes(search.toLowerCase()) ||
                    product.slug.toLowerCase().includes(search.toLowerCase())
            );
        }

        setTotalItems(computedProducts.length);

        //Sorting products
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedProducts = computedProducts.sort(
                (a, b) =>
                    reversed * a[sorting.field].localeCompare(b[sorting.field])
            );
        }

        //Current Page slice
        return computedProducts.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );
    }, [products, currentPage, search, sorting.field, sorting.order]);
    console.log(productsData)

    const showModalEdit = async (idData) => {
        console.log(idData);

        let config = {
            headers: {
                Authorization: `Bearer ${Auth()}`,
                'Access-Control-Allow-Origin': '*',
            }
        }
        await Axios.get(`${URL_DETAIL}/${idData}`, config)
            .then(res => {
                setDetail(res.data.data)
            })
        setId(idData)
        window.$('#modal-edit').modal('show');
    }

    const hideModal = hideModalInfo => {
        window.$('#modal-lg').modal('hide');
    };

    const testAdd = () => {
        props.history.push('/addProduct')
    }

    // fungsi untuk menambah data
    const handleAddCategory = () => {
        const data = { main_id: 0, name: title, active: 1 }
        let config = {
            headers: {
                Authorization: `Bearer ${Auth()}`,
                'Access-Control-Allow-Origin': '*',
            }
        }
        Axios.post(URL_DETAIL, data, config)
            .then(res => {
                // setelah berhasil post data, maka otomatis res.data.data yang berisi data yang barusan ditambahkan
                // akan langsung di push ke array yang akan di map, jadi data terkesan otomatis update
                // tanpa di reload
                let categoryData = [...products]
                categoryData.push(res.data.data)
                setProducts(categoryData)
                alert('success')
                hideModal()
            })
    }

    // fungsi untuk menampilkan detail data
    const categoryDetail = (id) => {
        let config = {
            headers: {
                Authorization: `Bearer ${Auth()}`,
                'Access-Control-Allow-Origin': '*',
            }
        }
        Axios.get(`${URL_DETAIL}/${id}`, config)
            .then(res => {
                setDetail(res.data.data)
            })
        window.$('#modal-detail').modal('show');
    }


    // fungsi untuk ubah data
    const changeData = () => {
        const data = { main_id: 0, name: title, active: 1, _method: 'put' }
        let config = {
            headers: {
                Authorization: `Bearer ${Auth()}`,
                'Access-Control-Allow-Origin': '*',
            }
        }
        Axios.post(`${URL_DETAIL}/${id}`, data, config)
            .then(res => {
                // let categoryData = [...comments]; // copying the old datas array
                // categoryData[id] = res.data.data; // replace e.target.value with whatever you want to change it to
                // setComments(comments.map(usr => usr.id === id ? res.data.data :  { ...comments }));
                // setComments(categoryData); // ??
                // let categoryData = comments.findIndex((obj => obj.id === id));
                // categoryData = comments[categoryData] = res.data.data
                // setComments([...comments, categoryData])
                props.history.push('/category')
                alert('success')
                window.$('#modal-edit').modal('hide');
                setId(0)
            })
    }

    // fungsi untuk delete data
    const deleteData = (id) => {
        const data = { _method: 'delete' }
        let config = {
            headers: {
                Authorization: `Bearer ${Auth()}`,
                'Access-Control-Allow-Origin': '*',
            }
        }
        Axios.post(`${URL_DETAIL}/${id}`, data, config)
            .then(() => {
                const categoryData = products.filter(category => category.id !== id)
                setProducts(categoryData)
                alert('success')
            })
    }
    return (
        <div className="content-wrapper">
            {/* Content Header (Page header) */}
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6" style={{ flexDirection: 'row', display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
                        </div>{/* /.col */}
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Menu Produk</li>
                            </ol>
                        </div>{/* /.col */}
                    </div>{/* /.row */}
                </div>{/* /.container-fluid */}
            </div>
            {/* Main content */}
            <AddProductComponent />
        </div>
    );
};

export default withRouter(DataTable);