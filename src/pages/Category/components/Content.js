import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Search } from "./DataTable";
import toastr from 'toastr'
import swal from 'sweetalert';

import { Spinner } from '../../../components/spinner'
import axiosConfig from '../../../utils/axiosConfig';
import { withRouter } from 'react-router'
import Pagination from 'react-paginating';

const URL_STRING = '/category';
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
    const [limit, setLimit] = useState(10)
    const [checkedBoxes, setCheckedBoxes] = useState([])

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
                setTotalItems(json.data.meta.total_data);
                setCategories(json.data.data);
                setLoading(false)
            }).catch(error => toastr.error(error))
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

        return computedCategories
    }, [categories, search, sorting.field, sorting.order]);
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
            }).catch(error => toastr.error(error))
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
            }).catch(error => toastr.error(error))
    }

    const modalDeleteMultiple = (id) => {
        swal({
            title: "Apakah anda yakin?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const data = {_method: 'delete', id: checkedBoxes }
                    axiosConfig.post(`${URL_POST}/delete-batch`, data)
                        .then(() => {
                            getData();
                            toastr.success('Kategori berhasil dihapus')
                        })
                }
            });
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
                    axiosConfig.delete(`${URL_POST}/${id}/delete`)
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
        return <img src={item} style={{ width: 100, height: 100 }} />
    }

    const uploadSingleFile = (e) => {
        setFileUrls(e.target.files[0])
        setImage(e.target.files[0]);
    }

    // fungsi untuk handle pagination
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
                setCategories(json.data.data);
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
                            <h1 className="m-0 text-dark">Menu Kategori</h1>
                            <button type="button" class="btn btn-block btn-success btn-sm" style={{ width: 130, height: 40, marginTop: 7 }} data-toggle="modal" data-target="#modal-lg">Tambah Kategori</button>
                            <button type="button" class="btn btn-block btn-danger btn-sm" style={{ width: 130, height: 40, }} onClick={modalDeleteMultiple}>Hapus Sekaligus</button>
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
                                            {loading === true ? <Spinner /> : categoriesData.map((comment, i) => (
                                                <tr>
                                                    <th scope="row" key={comment.id}>
                                                        <input type="checkbox" className="selectsingle" value="{category.id}" checked={checkedBoxes.find((p) => p.id === comment.id)} onChange={(e) => toggleCheckbox(e, comment)} />
									                         &nbsp;&nbsp;
                                                        {i + 1}
                                                    </th>
                                                    <td>{comment.name}</td>
                                                    <td><img src={comment.image_url ? comment.image_url : 'https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png'} style={{ width: 100, height: 100 }} /></td>
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
                                    <div><img src={detail.image_url ? detail.image_url : 'https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png'} style={{ width: 100, height: 100 }} /></div>
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