import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Pagination, Search } from "./DataTable";

import { Spinner } from '../../../components/spinner'
import Axios from 'axios';
import { Auth } from '../../../utils/auth';
import { withRouter } from 'react-router';

const URL_STRING = 'v1/product?limit=1000';
const URL_DETAIL = 'v1/product'

const DataTable = (props) => {
    const [products, setProducts] = useState([{ id: 1, name: 'test', description: 'test', detail: 'test' }]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addProduct, setAddProduct] = useState(false);
    const [id, setId] = useState(0)
    const ITEMS_PER_PAGE = 10;

    const headers = [
        { name: "No.", field: "id", sortable: false },
        { name: "Nama", field: "name", sortable: false },
        { name: "Gudang", field: "gudang", sortable: false },
        { name: "Transaksi", field: "Transaksi", sortable: false },
        { name: "Jumlah", field: "jumlah", sortable: false },
        { name: "Tarik", field: "tarik", sortable: false },
        { name: "Sisa", field: "sisa", sortable: false },
        { name: "Aksi", field: "body", sortable: false }
    ];



    useEffect(() => {

    }, []);


    const onLoadTables = () => {

    }


    const getProduct = () => {
        setLoading(true)
        let config = {
            headers: {
                Authorization: `Bearer ${Auth()}`,
                'Access-Control-Allow-Origin': '*',
                Origin: 'x-requested-with'
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
                    product.detail.toLowerCase().includes(search.toLowerCase())
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

    console.log('detail', detail.images);

    return (
        <div className="content-wrapper">
            {/* Content Header (Page header) */}
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6" style={{ flexDirection: 'row', display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
                            <h1 className="m-0 text-dark" >Menu Supplier</h1>
                            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-around', }}>
                                <button type="button" class="btn btn-block btn-success btn-xs" style={{ height: 40, marginTop: 7, marginRight: 10 }}>Tambah Supplier</button>
                                <button type="button" class="btn btn-block btn-success btn-xs" style={{ height: 40, marginTop: 7, marginRight: 10 }}>Log Aktivitas</button>
                                <button type="button" class="btn btn-block btn-danger btn-xs" style={{ marginTop: 6 }} data-toggle="modal" data-target="#modal-lg">Hapus Sekaligus</button>
                            </div>
                        </div>{/* /.col */}
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Menu Supplier</li>
                            </ol>
                        </div>{/* /.col */}
                    </div>{/* /.row */}
                </div>{/* /.container-fluid */}
            </div>
            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="row w-100">
                                <div className="col mb-3 col-12 text-center">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Pagination
                                                total={totalItems}
                                                itemsPerPage={ITEMS_PER_PAGE}
                                                currentPage={currentPage}
                                                onPageChange={page => setCurrentPage(page)}
                                            />
                                        </div>
                                        <div className="col-md-6 d-flex flex-row-reverse">
                                            <Search
                                                onSearch={value => {
                                                    setSearch(value);
                                                    setCurrentPage(1);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <table className="table table-striped">
                                        <TableHeader
                                            headers={headers}
                                            onSorting={(field, order) =>
                                                setSorting({ field, order })
                                            }
                                        />
                                        <tbody>
                                            {loading === true ? <Spinner /> : productsData.map(product => (
                                                <tr>
                                                    <th scope="row" key={product.id}>
                                                        {product.id}
                                                    </th>
                                                    <td>{product.name}</td>
                                                    <td>{product.description}</td>
                                                    <td>{product.detail}</td>
                                                    <td>{product.detail}</td>
                                                    <td>Rp. 10000</td>
                                                    <td>{product.id}</td>
                                                    <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginBottom: 10 }}>
                                                        <button type="button" style={{ marginTop: 9 }} class="btn btn-block btn-success" >Lihat</button>
                                                        <button type="button" style={{ marginLeft: 5 }} class="btn btn-block btn-success">Ubah</button>
                                                        <button type="button" style={{ marginLeft: 5 }} class="btn btn-block btn-danger">Hapus</button>
                                                    </div>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="modal fade" id="modal-lg">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Tambah Produk</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Judul Produk</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Judul Produk" onChange={(e) => {
                                        setTitle(e.target.value)
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">File input</label>
                                    <div className="input-group">
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" id="exampleInputFile" />
                                            <label className="custom-file-label" htmlFor="exampleInputFile">Choose file</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            <button type="button" className="btn btn-default" onClick={hideModal}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleAddCategory}>Save changes</button>
                        </div>
                    </div>
                    {/* /.modal-content */}
                </div>
                {/* /.modal-dialog */}
            </div>
            <div className="modal fade" id="modal-detail">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Detail Produk</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Gambar Produk</label>
                                    <div>
                                        {detail.images && detail.images.map(image =>
                                            <td>
                                                <img style={{ width: 100, height: 100 }} src={image.file_upload ? image.file_upload : 'https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png'} /></td>

                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Nama Produk</label>
                                    <h4>{detail.name}</h4>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">Kategori</label>
                                    <h4>{detail.category_id}</h4>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">Brand</label>
                                    <h4>{detail.brand}</h4>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">Harga Pokok Produk</label>
                                    <h4>{detail.price_basic}</h4>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">Benefit Deplaza</label>
                                    <h4>{detail.price_benefit}</h4>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">Komisi</label>
                                    <h4>{detail.price_commission}</h4>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">Stock</label>
                                    <h4>{detail.stock}</h4>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">Variasi</label>
                                    <h4>{detail.variation}</h4>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">Deskripsi</label>
                                    <h4>{detail.description}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
                {/* /.modal-content */}
            </div>
            {/* /.modal-dialog */}
            <div className="modal fade" id="modal-edit">
                <div className="modal-dialog modal-edit">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Ubah Produk</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Judul Produk</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder={detail.name} onChange={(e) => {
                                        setTitle(e.target.value)
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">File input</label>
                                    <div className="input-group">
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" id="exampleInputFile" />
                                            <label className="custom-file-label" htmlFor="exampleInputFile">Choose file</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            <button type="button" className="btn btn-default" onClick={hideModal}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={changeData}>Save changes</button>
                        </div>
                    </div>
                    {/* /.modal-content */}
                </div>
            </div>
        </div>

    );
};

export default withRouter(DataTable);