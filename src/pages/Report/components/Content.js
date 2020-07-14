import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Search } from "./DataTable";
import Select from 'react-select';

import toastr from 'toastr'
import swal from 'sweetalert';

import { Spinner } from '../../../components/spinner'
import Axios from 'axios'
import axiosConfig from '../../../utils/axiosConfig';
import { withRouter } from 'react-router';
import Pagination from 'react-paginating';
import moment from 'moment'
import 'moment/locale/id';
moment.locale('id');


const URL_STRING = '/withdrawal';
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
    const [status, setStatus] = useState(0)
    const [bank, setBank] = useState([])
    const [id, setId] = useState(0)
    const [limit, setLimit] = useState(10)
    const [checkedBoxes, setCheckedBoxes] = useState([])

    const headers = [
        { name: "No#", field: "id", sortable: false },
        { name: "Nama Seller", field: "name", sortable: true },
        { name: "Withdrawal No", field: "name", sortable: true },
        { name: "Rekening", field: "name", sortable: true },
        { name: "Tgl Penarikan", field: "name", sortable: false },
        { name: "Jumlah yang ditarik", field: "name", sortable: false },
        { name: "Status", field: "name", sortable: false },
        { name: "Aksi", field: "body", sortable: false }
    ];



    useEffect(() => {
        getProduct()
    }, []);


    const getProduct = () => {
        setLoading(true)
        Axios.all([axiosConfig.get(URL_STRING), axiosConfig.get('/bank')])
            .then(
                Axios.spread((withdrawal, bank) => {
                    setTotalItems(withdrawal.data.meta.total_data);
                    setProducts(withdrawal.data.data);
                    setBank(bank.data.data)
                    setLoading(false)
                })
            )
    }

    // list array options
    const optionsStatus = [{ value: 0, label: 'Tidak Setujui' }, { value: 1, label: 'Setujui' }]

    // fungsi untuk set id status
    const handleChangeStatus = (id) => {
        setStatus(id.value);
    };

    const productsData = useMemo(() => {
        let computedProducts = products;

        if (search) {
            computedProducts = computedProducts.filter(
                product =>
                    product.name.toLowerCase().includes(search.toLowerCase()) ||
                    product.slug.toLowerCase().includes(search.toLowerCase())
            );
        }

        //Sorting products
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedProducts = computedProducts.sort(
                (a, b) =>
                    reversed * a[sorting.field].localeCompare(b[sorting.field])
            );
        }

        //Current Page slice
        return computedProducts
    }, [products, search, sorting.field, sorting.order]);
    console.log(productsData)

    const showModalEdit = async (idData) => {
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

    // fungsi untuk menambah data
    const handleAddCategory = () => {
        const data = { main_id: 0, name: title, active: 1 }
        axiosConfig.post(URL_DETAIL, data)
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
        axiosConfig.get(`${URL_DETAIL}/${id}`)
            .then(res => {
                setDetail(res.data.data)
            })
        window.$('#modal-detail').modal('show');
    }


    // fungsi untuk ubah data
    const changeData = () => {
        const data = { approval: status, _method: 'put' }
        axiosConfig.put(`${URL_STRING}/${id}`, data)
            .then(res => {
                getProduct()
                toastr.success('Berhasil rubah status')
                window.$('#modal-edit').modal('hide');
                setId(0)
            }).catch(error => toastr.error(error))
    }

    // fungsi untuk multiple delete
    const modalDeleteMultiple = (id) => {
        swal({
            title: "Apakah anda yakin?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const data = { _method: 'delete', id: checkedBoxes }
                    axiosConfig.post(`${URL_STRING}/delete-batch`, data)
                        .then(() => {
                            getProduct()
                            toastr.success('Berhasil dihapus')
                        })
                }
            });
    }

    // fungsi untuk delete data
    const deleteData = (id) => {
        swal({
            title: "Apakah anda yakin?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axiosConfig.delete(`${URL_STRING}/${id}/delete`)
                        .then(() => {
                            getProduct()
                            toastr.success('berhasil menghapus')
                        })
                }
            });
    }

    const handlePageChange = (page, e) => {
        setCurrentPage(page)
        let nextPage = page;
        if (!nextPage || nextPage === 0) {
            nextPage = 1;
        }
        const offset = (nextPage - 1) * limit;
        axiosConfig.get(`${URL_STRING}&limit=10&offset=${offset}`)
            .then(json => {
                setCurrentPage(json.data.meta.current_page)
                setProducts(json.data.data);
            }).catch(error => toastr.error(error))
    };

    // fungsi checkbox delete
    const toggleCheckbox = (e, item) => {
        if (e.target.checked) {
            let arr = checkedBoxes;
            arr.push(item.id);

            setCheckedBoxes(arr);
        } else {
            let items = checkedBoxes.splice(checkedBoxes.indexOf(item.id), 1);

            setCheckedBoxes(items)
        }
        console.log(checkedBoxes);
    }

    return (
        <div className="content-wrapper">
            {/* Content Header (Page header) */}
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6" style={{ flexDirection: 'row', display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
                            <h1 className="m-0 text-dark">Report Komisi Seller</h1>
                            <button type="button" class="btn btn-block btn-danger btn-sm" style={{ width: 130, height: 40, }} onClick={modalDeleteMultiple}>Hapus Sekaligus</button>
                        </div>{/* /.col */}
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Report Komisi Seller</li>
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
                                        <div class="col-md-12 d-flex justify-content-between">
                                            <Pagination
                                                total={totalItems}
                                                limit={limit}
                                                pageCount={5}
                                                currentPage={currentPage}
                                            >
                                                {({
                                                    pages,
                                                    currentPage,
                                                    hasNextPage,
                                                    hasPreviousPage,
                                                    previousPage,
                                                    nextPage,
                                                    totalPages,
                                                    getPageItemProps
                                                }) => (
                                                        <div>
                                                            <button
                                                                {...getPageItemProps({
                                                                    pageValue: 1,
                                                                    onPageChange: handlePageChange,
                                                                    style: style.pageItem,
                                                                    className: "page-link"
                                                                })}

                                                            >
                                                                {'❮❮'}
                                                            </button>
                                                            {hasPreviousPage && (
                                                                <button
                                                                    {...getPageItemProps({
                                                                        pageValue: previousPage,
                                                                        onPageChange: handlePageChange,
                                                                        style: style.pageItem,
                                                                        className: "page-link"
                                                                    })}
                                                                >
                                                                    {'❮'}
                                                                </button>
                                                            )}

                                                            {pages.map(page => {
                                                                let activePage = null;
                                                                if (currentPage === page) {
                                                                    activePage = style.pageItemActive;
                                                                }
                                                                return (
                                                                    <button
                                                                        {...getPageItemProps({
                                                                            pageValue: page,
                                                                            key: page,
                                                                            onPageChange: handlePageChange,
                                                                            className: "page-link",
                                                                            style: { ...style.pageItem, ...activePage }
                                                                        })}
                                                                    >
                                                                        {page}
                                                                    </button>
                                                                );
                                                            })}

                                                            {hasNextPage && (
                                                                <button
                                                                    {...getPageItemProps({
                                                                        pageValue: nextPage,
                                                                        onPageChange: handlePageChange,
                                                                        style: style.pageItem,
                                                                        className: "page-link"
                                                                    })}
                                                                >
                                                                    {'❯'}
                                                                </button>
                                                            )}

                                                            <button
                                                                {...getPageItemProps({
                                                                    pageValue: totalPages,
                                                                    onPageChange: handlePageChange,
                                                                    style: style.pageItem,
                                                                    className: "page-link"
                                                                })}
                                                            >
                                                                {'❯❯'}
                                                            </button>
                                                        </div>
                                                    )}
                                            </Pagination>
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
                                            {loading === true ? <Spinner /> : productsData.map((product, i) => {
                                                const getBank = bank.find(o => o.id === product.account.bank_id)
                                                return (
                                                    <tr>
                                                        <th scope="row" key={product.id}>
                                                            <input type="checkbox" className="selectsingle" value="{product.id}" checked={checkedBoxes.find((p) => p.id === product.id)} onChange={(e) => toggleCheckbox(e, product)} />
									                         &nbsp;&nbsp;
                                                            {i + 1}
                                                        </th>
                                                        <td>{product.user.fullname}</td>
                                                        <td>{product.withdrawal_no}</td>
                                                        <td>{getBank && getBank.name} {product.account && product.account.number} a.n {product.account && product.account.name} </td>
                                                        <td>{moment(product.created_at).format('MMMM Do YYYY, h:mm')}</td>
                                                        <td>Rp.{product.amount}</td>
                                                        <td>{product.approval === 0 ? 'Belum disetujui' : `Telah disetujui pada ${moment(product.approval_at).format('MMMM Do YYYY, h:mm')}`}</td>
                                                        <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginBottom: 10 }}>
                                                            <button type="button" style={{ marginTop: 9 }} class="btn btn-block btn-success">Lihat</button>
                                                            <button type="button" style={{ marginLeft: 5 }} class="btn btn-block btn-success" onClick={() => showModalEdit(product.id)}>Ubah</button>
                                                            <button type="button" style={{ marginLeft: 5 }} class="btn btn-block btn-danger" onClick={() => deleteData(product.id)}>Hapus</button>
                                                        </div>
                                                    </tr>
                                                )
                                            }

                                            )}
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
                            <h4 className="modal-title">Ubah Status</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Ubah Status</label>
                                    <Select
                                        defaultValue={optionsStatus[0]}
                                        isMulti={false}
                                        options={optionsStatus}
                                        closeMenuOnSelect={true}
                                        onChange={handleChangeStatus} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            <button type="button" className="btn btn-default" onClick={hideModal}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={changeData}>Ubah Status</button>
                        </div>
                    </div>
                    {/* /.modal-content */}
                </div>
            </div>
        </div>

    );
};
const style = {
    pageItem: {
        display: "inline",
        position: "relative",
        padding: "0.5rem 0.75rem",
        marginLeft: "-1px",
        lineHeight: "1.25",
        color: "#0275d8",
        backgroundColor: "#fff",
        border: "1px solid #fff",
        touchAction: "manipulation",
        textDecoration: "none"
    },
    pageItemActive: {
        color: "#fff",
        backgroundColor: "#0275d8",
        borderColor: "#fff"
    },
    listGroup: {
        display: "flex",
        flexDirection: "column",
        paddingLeft: 0
    },
    listGroupItem: {
        position: "relative",
        display: "flex",
        flexFlow: "row wrap",
        alignItems: "center",
        padding: "0.75rem 1.25rem",
        marginBottom: "-1px",
        backgroundColor: "#fff",
        border: "1px #fff"
    }
}
export default withRouter(DataTable);