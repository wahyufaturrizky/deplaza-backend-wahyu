import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Pagination, Search } from "./DataTable";
import toastr from 'toastr'
import swal from 'sweetalert';

import { Spinner } from '../../../components/spinner'
import axiosConfig from '../../../utils/axiosConfig';
import { withRouter } from 'react-router'

const URL_STRING = '/category?limit=50';
const URL_POST = '/category'

const DataTable = (props) => {
    const [categories, setCategories] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState([]);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null)
    const [urls, setUrls] = useState('')
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
        getData();
    }, []);


    const getData = () => {
        setLoading(true)
        axiosConfig.get(URL_STRING)
            .then(json => {
                setCategories(json.data.data);
                setLoading(false)
            }).catch(error => toastr.danger(error))
    };

    const categoriesData = useMemo(() => {
        let computedCategories = categories;

        if (search) {
            computedCategories = computedCategories.filter(
                comment =>
                    comment.name.toLowerCase().includes(search.toLowerCase()) ||
                    comment.slug.toLowerCase().includes(search.toLowerCase())
            );
        }

        setTotalItems(computedCategories.length);

        //Sorting comments
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedCategories = computedCategories.sort(
                (a, b) =>
                    reversed * a[sorting.field].localeCompare(b[sorting.field])
            );
        }

        //Current Page slice
        return computedCategories.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );
    }, [categories, currentPage, search, sorting.field, sorting.order]);
    console.log(categoriesData)

    const showModalEdit = async (idData) => {
        await axiosConfig.get(`${URL_POST}/${idData}`)
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
    const handleAddCategory = (e) => {
         e.preventDefault()
        const formData = new FormData();
        formData.append('image', image)
        formData.append('name', title);
        formData.append('active', 1);
        formData.append('main_id', 1);
        axiosConfig.post(URL_POST, formData)
            .then(res => {
                // setelah berhasil post data, maka otomatis res.data.data yang berisi data yang barusan ditambahkan
                // akan langsung di push ke array yang akan di map, jadi data terkesan otomatis update
                // tanpa di reload
                getData();
                toastr.success('Berhasil menambahkan kategori')
                hideModal()
            })
    }

    // fungsi untuk menampilkan detail data
    const categoryDetail = (id) => {
        axiosConfig.get(`${URL_POST}/${id}`)
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
        formData.append('main_id', 1);
        formData.append('_method', 'put');
        axiosConfig.post(`${URL_POST}/${id}`, formData)
            .then(res => {
                toastr.success('Berhasil merubah kategori')
                getData();
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
                    axiosConfig.post(`${URL_POST}/${id}/delete`, data)
                        .then(() => {
                            const categoryData = categories.filter(category => category.id !== id)
                            setCategories(categoryData)
                            toastr.success('Kategori berhasil dihapus')
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
        return  <img  src={item} style={{ width: 100, height: 100 }} />
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
                            <h1 className="m-0 text-dark">Menu Kategori</h1>
                            <button type="button" class="btn btn-block btn-success btn-sm" style={{ width: 130, height: 40, marginTop: 7 }} data-toggle="modal" data-target="#modal-lg">Tambah Kategori</button>
                            <button type="button" class="btn btn-block btn-danger btn-sm" style={{ width: 130, height: 40, }} data-toggle="modal" data-target="#modal-lg">Hapus Sekaligus</button>
                        </div>{/* /.col */}
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Dashboard v2</li>
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
                                            {loading === true ? <Spinner /> : categoriesData.map(comment => (
                                                <tr>
                                                    <th scope="row" key={comment.id}>
                                                        {comment.id}
                                                    </th>
                                                    <td>{comment.name}</td>
                                                    <td><img src={comment.image ? comment.image : 'https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png'} style={{ width: 100, height: 100 }} /></td>
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
                                {urls.length > 0 && displayUploadedFiles(urls)}
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">Gambar Kategori</label>
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
                            <button type="button" className="btn btn-primary" onClick={handleAddCategory}>Tambah Kategori</button>
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
                                    <label htmlFor="exampleInputEmail1">Gambar Kategori</label>
                                   <div><img src={detail.image ? detail.image : 'https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png'} style={{ width: 100, height: 100 }} /></div>
                                </div>
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
                                {urls.length > 0 && displayUploadedFiles(urls)}
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">Gambar Kategori</label>
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
            </div>
        </div>

    );
};

export default withRouter(DataTable);