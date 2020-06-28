import React, { useEffect, useState, useMemo } from "react";
import { withRouter } from 'react-router';
import toastr from 'toastr'
import swal from 'sweetalert';

import { TableHeader, Pagination, Search } from "./DataTable";
import { Spinner } from '../../../components/spinner'
import axiosConfig from '../../../utils/axiosConfig';



const URL_STRING = '/product?limit=1000';
const URL_DETAIL = '/product'

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
    const ITEMS_PER_PAGE = 10;

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


    const getProduct = () => {
        setLoading(true)

        axiosConfig.get(URL_STRING)
            .then(json => {
                setProducts(json.data.data);
                setLoading(false)
            }).catch(error => toastr.error(error))
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

    
    const hideModal = hideModalInfo => {
        window.$('#modal-lg').modal('hide');
    };

    const testAdd = () => {
        props.history.push('/addProduct')
    }


    // fungsi untuk menampilkan detail data
    const categoryDetail = (id) => {

        axiosConfig.get(`${URL_DETAIL}/${id}`)
            .then(res => {
                setDetail(res.data.data)
            })
        window.$('#modal-detail').modal('show');
    }



    const modalDelete = (id) => {
        swal({
            title: "Apakah anda yakin?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const data = { _method: 'delete' }
                    axiosConfig.post(`${URL_DETAIL}/${id}/delete`, data)
                        .then(() => {
                            const categoryData = products.filter(category => category.id !== id)
                            setProducts(categoryData)
                            toastr.success('Produk berhasil dihapus')
                        })
                }
            });
    }

    return (
        <div className="content-wrapper">
            {/* Content Header (Page header) */}
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6" style={{ flexDirection: 'row', display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
                            <h1 className="m-0 text-dark">Menu Produk</h1>
                            <button type="button" class="btn btn-block btn-success btn-sm" style={{ width: 130, height: 40, marginTop: 7 }} onClick={testAdd}>Tambah Produk</button>
                            <button type="button" class="btn btn-block btn-danger btn-sm" style={{ width: 130, height: 40, }} data-toggle="modal" data-target="#modal-lg">Hapus Sekaligus</button>
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
                                                {loading === true ? <Spinner /> : productsData.map((product, i) => (
                                                    <tr>
                                                        <th scope="row" key={product.id}>
                                                            {i + 1}
                                                        </th>
                                                        <td><img style={{ width: 100, height: 100 }} src={product.image > 0 ? product.image : 'https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png'} /></td>
                                                        <td>{product.name}</td>
                                                        <td>{product.category_id}</td>
                                                        <td>{product.brand}</td>
                                                        <td>{product.price_basic}</td>
                                                        <td>{product.price_benefit}</td>
                                                        <td>{product.price_commission}</td>
                                                        <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginBottom: 10 }}>
                                                            <button type="button" style={{ marginTop: 9 }} class="btn btn-block btn-success btn-sm" onClick={() => categoryDetail(product.id)}>Lihat</button>
                                                            <button type="button" style={{ marginLeft: 5 }} class="btn btn-block btn-success btn-sm" onClick={() => props.history.push('/editProduct', product)}>Ubah</button>
                                                            <button type="button" style={{ marginLeft: 5 }} class="btn btn-block btn-danger btn-sm" onClick={() => modalDelete(product.id)}>Hapus</button>
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
                                                <img style={{ width: 100, height: 100, marginRight: 10 }} src={image.file_upload ? image.file_upload : 'https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png'} /></td>

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
        </div>

    );
};

export default withRouter(DataTable);