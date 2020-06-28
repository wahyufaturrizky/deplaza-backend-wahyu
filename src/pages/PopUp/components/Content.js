import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Pagination, Search } from "./DataTable";
import toastr from 'toastr'
import swal from 'sweetalert';

import { Spinner } from '../../../components/spinner'
import axiosConfig from '../../../utils/axiosConfig';
import { withRouter } from 'react-router';
import AddProductComponent from './AddProduct'

const URL_STRING = '/popup';
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
    const [description, setDescription] = useState("")
    const [image, setImage] = useState(null)
    const [urls, setUrls] = useState('')
    const [id, setId] = useState(0)
    const ITEMS_PER_PAGE = 10;

    const headers = [
        { name: "No#", field: "id", sortable: false },
        { name: "Gambar", field: "name", sortable: true },
        { name: "Judul Popup", field: "name", sortable: true },
        { name: "Deskripsi", field: "name", sortable: false },
        { name: "Aksi", field: "body", sortable: false }
    ];



    useEffect(() => {
        getProduct()
    }, []);


    const getProduct = () => {
        setLoading(true)
        axiosConfig.get(URL_STRING)
            .then(json => {
                setProducts(json.data.data);
                setLoading(false)
            }).catch(error => toastr.danger(error))
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
        await axiosConfig.get(`${URL_STRING}/${idData}`)
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

    const handleAddPopup = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('image', image)
        formData.append('name', title);
        formData.append('active', 1);

        axiosConfig.post(URL_STRING, formData)
            .then(res => {
                // setelah berhasil post data, maka otomatis res.data.data yang berisi data yang barusan ditambahkan
                // akan langsung di push ke array yang akan di map, jadi data terkesan otomatis update
                // tanpa di reload
                getProduct();
                toastr.success('Popup berhasil ditambahkan')
                hideModal()
            }).catch(error => toastr.danger(error))
    }

    // fungsi untuk menampilkan detail data
    const categoryDetail = (id) => {
        axiosConfig.get(`${URL_STRING}/${id}`)
            .then(res => {
                setDetail(res.data.data)
            })
        window.$('#modal-detail').modal('show');
    }


    // fungsi untuk ubah data
    const changeData = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('image', image)
        formData.append('name', title);
        formData.append('active', 1);
        formData.append('_method', 'put');

        axiosConfig.post(`${URL_STRING}/${id}`, formData)
            .then(res => {
                getProduct()
                toastr.success('Popup berhasil dirubah')
                window.$('#modal-edit').modal('hide');
                setId(0)
            }).catch(error => toastr.danger(error))
    }


    const deleteData = (id) => {
        swal({
            title: "Apakah anda yakin?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const data = { _method: 'delete' }
                    axiosConfig.post(`${URL_STRING}/${id}/delete`, data)
                        .then(() => {
                            const categoryData = products.filter(category => category.id !== id)
                            setProducts(categoryData)
                            toastr.success('Popup berhasil dihapus')
                        })
                }
            });
    }

    const setFileUrls = (files) => {
        const item = URL.createObjectURL(files)
        if (urls.length > 0) {
            URL.revokeObjectURL(urls)
        }
        setUrls(item);
    }

    const displayUploadedFiles = (item) => {
        return <img src={item} style={{ width: 100, height: 100 }} />
    }

    const uploadSingleFile = (e) => {
        setFileUrls(e.target.files[0])
        setImage(e.target.files[0]);
    }

    return (
        <div className="content-wrapper">
            {/* Content Header (Page header) */}
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6" style={{ flexDirection: 'row', display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
                            <h1 className="m-0 text-dark">Menu Popup</h1>
                            <button type="button" class="btn btn-block btn-success btn-sm" style={{ width: 130, height: 40, marginTop: 7 }} data-toggle="modal" data-target="#modal-lg">Tambah Popup</button>
                            <button type="button" class="btn btn-block btn-danger btn-sm" style={{ width: 130, height: 40, }} data-toggle="modal" data-target="#modal-lg">Hapus Sekaligus</button>
                        </div>{/* /.col */}
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Menu Popup</li>
                            </ol>
                        </div>{/* /.col */}
                    </div>{/* /.row */}
                </div>{/* /.container-fluid */}
            </div>
            {/* Main content */}
            {addProduct ? <AddProductComponent /> :
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
                                                            {i+1}
                                                        </th>
                                                        <td><img style={{ width: 100, height: 100 }} src={product.image ? product.image : 'https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png'} /></td>
                                                        <td>{product.name}</td>
                                                        <td>{product.description}</td>
                                                        <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginBottom: 10 }}>
                                                            <button type="button" style={{ marginTop: 8 }} class="btn btn-block btn-success" onClick={() => showModalEdit(product.id)}>Ubah</button>
                                                            <button type="button" style={{ marginLeft: 5 }} class="btn btn-block btn-danger" onClick={() => deleteData(product.id)}>Hapus</button>
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
            }
            <div className="modal fade" id="modal-lg">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Tambah Popup</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Judul Popup</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Judul Produk" onChange={(e) => {
                                        setTitle(e.target.value)
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Deskripsi</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Judul Produk" onChange={(e) => {
                                        setDescription(e.target.value)
                                    }} />
                                </div>
                                {urls.length > 0 && displayUploadedFiles(urls)}
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">Gambar Popup</label>
                                    <div className="input-group">
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" id="exampleInputFile" onChange={uploadSingleFile} />
                                            <label className="custom-file-label" htmlFor="exampleInputFile">Pilih Gambar</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            <button type="button" className="btn btn-default" onClick={hideModal}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleAddPopup}>Save changes</button>
                        </div>
                    </div>
                    {/* /.modal-content */}
                </div>
                {/* /.modal-dialog */}
            </div>
            <div className="modal fade" id="modal-edit">
                <div className="modal-dialog modal-edit">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Tambah Popup</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Judul Popup</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder={detail.name} onChange={(e) => {
                                        setTitle(e.target.value)
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Deskripsi</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Deskripsi" onChange={(e) => {
                                        setDescription(e.target.value)
                                    }} />
                                </div>
                                {urls.length > 0 && displayUploadedFiles(urls)}
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">Gambar Popup</label>
                                    <div className="input-group">
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" id="exampleInputFile" onChange={uploadSingleFile} />
                                            <label className="custom-file-label" htmlFor="exampleInputFile">Pilih Gambar</label>
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
                {/* /.modal-dialog */}
            </div>
        </div>

    );
};

export default withRouter(DataTable);