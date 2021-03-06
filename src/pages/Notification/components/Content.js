import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Search } from "./DataTable";
import toastr from 'toastr'
import swal from 'sweetalert';
import Select from 'react-select';

import { Spinner } from '../../../components/spinner'
import axiosConfig from '../../../utils/axiosConfig';
import useDebounce from '../../../components/useDebounce'

import { withRouter } from 'react-router';
import Pagination from 'react-paginating';

const URL_STRING = '/notification';
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
    const [id, setId] = useState(0)
    const [user, setUser] = useState("0")
    const [type, setType] = useState("")
    const [content, setContent] = useState("")
    const [date, setDate] = useState("")
    const [status, setStatus] = useState(0)
    const [limit, setLimit] = useState(10)
    const [checkedBoxes, setCheckedBoxes] = useState([])
    const [getData, setData] = useState([])


    const debouncedSearch = useDebounce(search, 1000);


    const headers = [
        { name: "No.", field: "id", sortable: false },
        { name: "Judul Notifikasi", field: "name", sortable: false },
        { name: "Isi Notifikasi", field: "name", sortable: false },
        { name: "Keterangan", field: "name", sortable: false },
        { name: "Aksi", field: "body", sortable: false }
    ];


    useEffect(() => {
        if (search) {
            axiosConfig.get(`${URL_STRING}?keyword=${debouncedSearch}`)
                .then(res => {
                    setLimit(res.data.meta.limit)
                    setTotalItems(res.data.meta.total_result);
                    setProducts(res.data.data)
                })
        } else {
            getProduct();
            getUser()
        }
    }, [debouncedSearch]);

    const getProduct = () => {
        setLoading(true)
        axiosConfig.get(URL_STRING)
            .then(json => {
                setTotalItems(json.data.meta.total_data);
                setProducts(json.data.data);
                setLoading(false)
            })
    }

    const getUser = () => {
        axiosConfig.get('/user?limit=1000000')
            .then(res =>
                res.data.data.map(data => ({
                    value: data.id,
                    label: data.fullname,
                }))
            )
            .then(json => {
                setData(json);
            }).catch(error => toastr.error(error))
    }

    console.log('user', getData);

    const options = getData.map(i => i)

    const handleChange = (id) => {
        console.log('id', id.value);
        setUser(id.value);
    };

    const productsData = useMemo(() => {
        let computedProducts = products;


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


    // $('#reservationtime').datetimepicker({
    //     timePicker: true,
    //     timePickerIncrement: 30,
    //     locale: {
    //         format: 'MM/DD/YYYY hh:mm A'
    //     }
    // });

    const hideModal = hideModalInfo => {
        window.$('#modal-lg').modal('hide');
    };

    // fungsi untuk menambah data
    const handleAddCategory = () => {
        const data = { user_id: user, title: title, type: type, content: content, send_datetime: date }
        axiosConfig.post(URL_STRING, data)
            .then(res => {
                // setelah berhasil post data, maka otomatis res.data.data yang berisi data yang barusan ditambahkan
                // akan langsung di push ke array yang akan di map, jadi data terkesan otomatis update
                // tanpa di reload
                let categoryData = [...products]
                categoryData.push(res.data.data)
                setProducts(categoryData)
                toastr.success('Berhasil menambahkan data')
                hideModal()
            }).catch(error => toastr.error(error))
    }

    // fungsi untuk menampilkan detail data
    const categoryDetail = (id) => {
        axiosConfig.get(`${URL_STRING}/${id}`)
            .then(res => {
                setDetail(res.data.data)
            }).catch(error => toastr.error(error))
        window.$('#modal-detail').modal('show');
    }


    // fungsi untuk ubah data
    const changeData = () => {
        const data = { status: status, _method: 'put' }
        axiosConfig.put(`${URL_STRING}/${id}`, data)
            .then(res => {
                getProduct()
                toastr.success('Berhasil ubah status')
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
                            toastr.success('Notifikasi berhasil dihapus')
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
                    const data = { _method: 'delete' }
                    axiosConfig.post(`${URL_STRING}/${id}/delete`, data)
                        .then(() => {
                            const notificationData = products.filter(notification => notification.id !== id)
                            setProducts(notificationData)
                            toastr.success('Notifikasi berhasil dihapus')
                        }).catch(error => toastr.error(error))
                }
            });
    }

    // fungsi untuk handle pagination
    const handlePageChange = (page, e) => {
        setCurrentPage(page)
        let nextPage = page;
        if (!nextPage || nextPage === 0) {
            nextPage = 1;
        }
        const offset = (nextPage - 1) * limit;
        if (search) {
            axiosConfig.get(`${URL_STRING}?keyword=${debouncedSearch}&limit=10&offset=${offset}`)
                .then(res => {
                    setCurrentPage(res.data.meta.current_page)
                    setProducts(res.data.data)
                }).catch(error => toastr.error(error))
        } else {
            axiosConfig.get(`${URL_STRING}?limit=10&offset=${offset}`)
                .then(json => {
                    setCurrentPage(json.data.meta.current_page)
                    setProducts(json.data.data);
                }).catch(error => toastr.error(error))
        }
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
                            <h1 className="m-0 text-dark">Menu Notifikasi</h1>
                            <button type="button" class="btn btn-block btn-success btn-sm" style={{ width: 130, height: 40, marginTop: 7 }} data-toggle="modal" data-target="#modal-lg">Tambah Notifikasi</button>
                            <button type="button" class="btn btn-block btn-danger btn-sm" style={{ width: 130, height: 40, }} onClick={modalDeleteMultiple}>Hapus Sekaligus</button>
                        </div>{/* /.col */}
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Menu Notifikasi</li>
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
                                                                {'??????'}
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
                                                                    {'???'}
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
                                                                    {'???'}
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
                                                                {'??????'}
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
                                            {loading === true ? <Spinner /> : productsData.map((product, i) => (
                                                <tr>
                                                    <th scope="row" key={product.id}>
                                                        <input type="checkbox" className="selectsingle" value="{product.id}" checked={checkedBoxes.find((p) => p.id === product.id)} onChange={(e) => toggleCheckbox(e, product)} />
									                         &nbsp;&nbsp;
                                                        {i + 1}
                                                    </th>
                                                    <td>{product.title}</td>
                                                    <td>{product.content}</td>
                                                    <td>{product.type}</td>
                                                    <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginBottom: 10 }}>
                                                        <button type="button" style={{ marginTop: 9 }} class="btn btn-block btn-success" onClick={() => categoryDetail(product.id)}>Lihat</button>
                                                        <button type="button" style={{ marginLeft: 5 }} class="btn btn-block btn-success" onClick={() => showModalEdit(product.id)}>Ubah</button>
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
            <div className="modal fade" id="modal-lg">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Tambah Notifikasi</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">??</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">User ID</label>
                                    <Select
                                        defaultValue={options[0]}
                                        isMulti={false}
                                        options={options}
                                        closeMenuOnSelect={true}
                                        onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Judul</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Judul" onChange={(e) => {
                                        setTitle(e.target.value)
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Tipe</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Promo" onChange={(e) => {
                                        setType(e.target.value)
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Content</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Content" onChange={(e) => {
                                        setContent(e.target.value)
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Waktu Kirim</label>
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"><i class="far fa-clock"></i></span>
                                        </div>
                                        <input type="text" class="form-control float-right" id="reservationtime" onChange={(e) => {
                                            setDate(e.target.value)
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            <button type="button" className="btn btn-default" onClick={hideModal}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleAddCategory}>Tambah Data</button>
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
                            <h4 className="modal-title">Detail Notifikasi</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">??</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Judul</label>
                                    <h4>{detail.title}</h4>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">Type</label>
                                    <h4>{detail.type}</h4>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">Content</label>
                                    <h4>{detail.content}</h4>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">Status</label>
                                    <h4>{detail.status}</h4>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">User Id</label>
                                    <h4>{detail.user_id}</h4>
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
                            <h4 className="modal-title">Ubah Notifikasi</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">??</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="card-body">
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
                            <button type="button" className="btn btn-primary" onClick={changeData}>Ubah</button>
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