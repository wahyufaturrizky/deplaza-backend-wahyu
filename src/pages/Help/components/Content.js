import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Search } from "./DataTable";
import toastr from 'toastr'
import swal from 'sweetalert';

import { Spinner } from '../../../components/spinner'

import axiosConfig from '../../../utils/axiosConfig';
import { withRouter } from 'react-router';
import Pagination from 'react-paginating';


const URL_STRING = '/helpdesk';
const URL_DETAIL = '/v1/product'

const DataTable = (props) => {
    const [helpdesk, setHelpdesk] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(0);
    const [start, setStart] = useState(1)
    const [problem, setProblem] = useState("");
    const [status, setStatus] = useState(0);
    const [id, setId] = useState(0)
    const [limit, setLimit] = useState(10)

    const headers = [
        { name: "No.", field: "id", sortable: false },
        { name: "User", field: "name", sortable: false },
        { name: "Masalah", field: "name", sortable: false },
        { name: "Status", field: "name", sortable: false },
        { name: "Aksi", field: "body", sortable: false }
    ];



    useEffect(() => {
        getHelpdesk()
    }, []);


    const getHelpdesk = () => {
        setLoading(true)
        axiosConfig.get(URL_STRING)
            .then(json => {
                setTotalItems(json.data.meta.total_data);
                setHelpdesk(json.data.data);
                setLoading(false)
            }).catch(error => toastr.error(error))
    }


    const helpdeskData = useMemo(() => {
        let computedHelpdesk = helpdesk;

        if (search) {
            computedHelpdesk = computedHelpdesk.filter(
                data =>
                    data.problem.toLowerCase().includes(search.toLowerCase())
            );
        }

        //Sorting helpdesk
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedHelpdesk = computedHelpdesk.sort(
                (a, b) =>
                    reversed * a[sorting.field].localeCompare(b[sorting.field])
            );
        }

        //Current Page slice
        return computedHelpdesk
    }, [helpdesk, search, sorting.field, sorting.order]);
    console.log(helpdeskData)

    const showModalEdit = async (idData) => {
        console.log(idData);
        await axiosConfig.get(`${URL_STRING}/${idData}`)
            .then(res => {
                setDetail(res.data.data)
            }).catch(error => toastr.error(error))
        setId(idData)
        window.$('#modal-edit').modal('show');
    }

    const hideModal = hideModalInfo => {
        window.$('#modal-lg').modal('hide');
    };


    // fungsi untuk menambah data
    const handleAddData = () => {
        const data = { user_id: user, problem: problem }
        axiosConfig.post(URL_STRING, data)
            .then(res => {
                getHelpdesk()
                toastr.success('Berhasil menambahkan data')
                hideModal()
            }).catch(error => toastr.error(error))
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
        const data = { user_id: user, problem: problem, status: status }
        axiosConfig.put(`${URL_STRING}/${id}`, data)
            .then(res => {
                getHelpdesk()
                toastr.success('Berhasil merubah data')
                window.$('#modal-edit').modal('hide');
                setId(0)
            }).catch(error => toastr.error(error))
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
                    const data = { _method: 'delete' }
                    axiosConfig.post(`${URL_STRING}/${id}/delete`, data)
                        .then(() => {
                            const categoryData = helpdesk.filter(category => category.id !== id)
                            setHelpdesk(categoryData)
                            toastr.success('Kategori berhasil dihapus')
                        })
                }
            });
    }

    // fungsi untuk handle pagination
    const handlePageChange = (page, e) => {
        setCurrentPage(page)
        setStart(page * 10 - 10 + 1)
        let nextPage = page;
        if (!nextPage || nextPage === 0) {
            nextPage = 1;
        }
        const offset = (nextPage - 1) * limit;
        axiosConfig.get(`${URL_STRING}?limit=10&offset=${offset}`)
            .then(json => {
                setCurrentPage(json.data.meta.current_page)
                setHelpdesk(json.data.data);
            }).catch(error => toastr.error(error))
    };

    return (
        <div className="content-wrapper">
            {/* Content Header (Page header) */}
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6" style={{ flexDirection: 'row', display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
                            <h5 className="m-0 text-dark">Menu Bantuan Jualan</h5>
                            <button type="button" class="btn btn-block btn-success btn-xs" style={{ width: 130, height: 40, marginTop: 7 }} data-toggle="modal" data-target="#modal-lg">Tambah Bantuan Jualan</button>
                            <button type="button" class="btn btn-block btn-danger btn-xs" style={{ width: 130, height: 40, }} >Hapus Sekaligus</button>
                        </div>{/* /.col */}
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Menu Bantuan Jualan</li>
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
                                            {loading === true ? <Spinner /> : helpdeskData.map((helpdesk, i) => (
                                                <tr>
                                                    <th scope="row" key={helpdesk.id}>
                                                        {i + start}
                                                    </th>
                                                    <td>{helpdesk.user_id}</td>
                                                    <td>{helpdesk.problem}</td>
                                                    <td>{helpdesk.status}</td>
                                                    <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginBottom: 10 }}>
                                                        <button type="button" style={{ marginTop: 9 }} class="btn btn-block btn-success">Lihat</button>
                                                        <button type="button" style={{ marginLeft: 5 }} class="btn btn-block btn-success" onClick={() => showModalEdit(helpdesk.id)}>Ubah</button>
                                                        <button type="button" style={{ marginLeft: 5 }} class="btn btn-block btn-danger" >Hapus</button>
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
                            <h4 className="modal-title">Tambah Bantuan</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">User</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="User" onChange={(e) => {
                                        setUser(e.target.value)
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Problem</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Masukkan Masalah" onChange={(e) => {
                                        setProblem(e.target.value)
                                    }} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            <button type="button" className="btn btn-default" onClick={hideModal}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleAddData}>Tambah Data</button>
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
                            <h4 className="modal-title">Ubah Data</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">User</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder={detail.user_id} onChange={(e) => {
                                        setUser(e.target.value)
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Problem</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder={detail.problem} onChange={(e) => {
                                        setProblem(e.target.value)
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Status</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder={detail.status} onChange={(e) => {
                                        setStatus(e.target.value)
                                    }} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            <button type="button" className="btn btn-default" onClick={hideModal}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={changeData}>Rubah Data</button>
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