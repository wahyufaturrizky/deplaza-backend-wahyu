import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Pagination, Search } from "./DataTable";
import Axios from 'axios';
import { Auth } from '../../../utils/auth';
import {withRouter} from 'react-router'

const URL_STRING = '/v1/product/categories';
const URL_POST = 'v1/product/category'

const DataTable = (props) => {
    const [comments, setComments] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState([]);
    const [id, setId] = useState(0)
    const ITEMS_PER_PAGE = 50;

    const headers = [
        { name: "No#", field: "id", sortable: false },
        { name: "Judul Kategori", field: "name", sortable: true },
        { name: "Gambar", field: "email", sortable: true },
        { name: "Kategori", field: "name", sortable: false },
        { name: "Aksi", field: "body", sortable: false }
    ];

    useEffect(() => {
        const getData = () => {
            let config = {
                headers: {
                    Authorization: `Bearer ${Auth()}`,
                    'Access-Control-Allow-Origin': '*',
                }
            }
            Axios.get(URL_STRING, config)
                .then(json => {
                    setComments(json.data.data);

                })
        };

        getData();
    }, []);

    const commentsData = useMemo(() => {
        let computedComments = comments;

        if (search) {
            computedComments = computedComments.filter(
                comment =>
                    comment.name.toLowerCase().includes(search.toLowerCase()) ||
                    comment.slug.toLowerCase().includes(search.toLowerCase())
            );
        }

        setTotalItems(computedComments.length);

        //Sorting comments
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedComments = computedComments.sort(
                (a, b) =>
                    reversed * a[sorting.field].localeCompare(b[sorting.field])
            );
        }

        //Current Page slice
        return computedComments.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );
    }, [comments, currentPage, search, sorting.field, sorting.order]);
    console.log(commentsData)

    const showModalEdit = async (idData) => {
        console.log(idData);

        let config = {
            headers: {
                Authorization: `Bearer ${Auth()}`,
                'Access-Control-Allow-Origin': '*',
            }
        }
        await Axios.get(`${URL_POST}/${idData}`, config)
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
        let config = {
            headers: {
                Authorization: `Bearer ${Auth()}`,
                'Access-Control-Allow-Origin': '*',
            }
        }
        Axios.post(URL_POST, data, config)
            .then(res => {
                // setelah berhasil post data, maka otomatis res.data.data yang berisi data yang barusan ditambahkan
                // akan langsung di push ke array yang akan di map, jadi data terkesan otomatis update
                // tanpa di reload
                let categoryData = [...comments]
                categoryData.push(res.data.data)
                setComments(categoryData)
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
        Axios.get(`${URL_POST}/${id}`, config)
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
        Axios.post(`${URL_POST}/${id}`, data, config)
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
        Axios.post(`${URL_POST}/${id}`, data, config)
            .then(() => {
                const categoryData = comments.filter(category => category.id !== id)
                setComments(categoryData)
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
                            <h1 className="m-0 text-dark">Menu Produk</h1>
                            <button type="button" class="btn btn-block btn-success btn-sm" style={{ width: 130, height: 40, marginTop: 7 }} data-toggle="modal" data-target="#modal-lg">Tambah Produk</button>
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
                                            {commentsData.map(comment => (
                                                <tr>
                                                    <th scope="row" key={comment.id}>
                                                        {comment.id}
                                                    </th>
                                                    <td>{comment.name}</td>
                                                    <td>{comment.email}</td>
                                                    <td>{comment.name}</td>
                                                    <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginBottom: 10 }}>
                                                        <button type="button" style={{ width: 80, marginTop: 10 }} class="btn btn-block btn-success" onClick={() => categoryDetail(comment.id)}>Lihat</button>
                                                        <button type="button" style={{ width: 80 }} class="btn btn-block btn-success" onClick={() => showModalEdit(comment.id)}>Ubah</button>
                                                        <button type="button" style={{ width: 80 }} class="btn btn-block btn-danger" onClick={() => deleteData(comment.id)}>Hapus</button>
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
                            <h4 className="modal-title">Tambah Kategori</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Judul Kategori</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Judul kategori" onChange={(e) => {
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
                            <h4 className="modal-title">Detail Kategori</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Judul Kategori</label>
                                    <h4>{detail.name}</h4>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">Slug</label>
                                    <h4>{detail.name}</h4>
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
                            <h4 className="modal-title">Ubah Kategori</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Judul Kategori</label>
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