import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Search } from "./DataTable";
import Select from "react-select";

import { Spinner } from "../../../components/spinner";
import axiosConfig from "../../../utils/axiosConfig";
import useDebounce from "./DataTable/Search/useDebounce";
import Pagination from "react-paginating";
import toastr from "toastr";
import swal from "sweetalert";
import { withRouter } from "react-router";

const URL_STRING = "supplier";
const URL_DETAIL = "v1/product";
const URL_CITIES = "shipment/cities";

const DataTable = (props) => {
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [desc, setDesc] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [getCities, setGetCities] = useState([]);
  const [postalCode, setPostalCode] = useState("0");
  const [image, setImage] = useState(null);
  const [urls, setUrls] = useState("");
  const [limit, setLimit] = useState(10);
  const [id, setId] = useState(0);
  const [checkedBoxes, setCheckedBoxes] = useState([]);

  const debouncedSearch = useDebounce(search, 1000);

  const headers = [
    { name: "No.", field: "id", sortable: false },
    { name: "Nama", field: "name", sortable: false },
    { name: "Gudang", field: "gudang", sortable: false },
    { name: "Transaksi", field: "Transaksi", sortable: false },
    { name: "Jumlah", field: "jumlah", sortable: false },
    { name: "Tarik", field: "tarik", sortable: false },
    { name: "Sisa", field: "sisa", sortable: false },
    { name: "Aksi", field: "body", sortable: false },
  ];

  useEffect(() => {
    if (search) {
      axiosConfig
        .get(`${URL_STRING}?keyword=${debouncedSearch}`)
        .then((res) => {
          setLimit(res.data.meta.limit);
          setTotalItems(res.data.meta.total_result);
          setProducts(res.data.data);
        });
    } else {
      getProduct();
      getDataCity();
    }
  }, [debouncedSearch]);

  const getProduct = () => {
    setLoading(true);
    axiosConfig.get(URL_STRING).then((json) => {
      setTotalItems(json.data.meta.total_result);
      setProducts(json.data.data);
      setLoading(false);
    });
  };

  const getDataCity = () => {
    axiosConfig
      .get(`${URL_CITIES}`)
      .then((res) =>
        res.data.rajaongkir.results.map((data) => ({
          value: data.city_id,
          postal_code: data.postal_code,
          label: data.type + " " + data.city_name,
        }))
      )
      .then((data) => {
        setGetCities(data);
      })
      .catch((error) => console.log(error));
  };

  const optionsCities = getCities.map((i) => i);

  const handleChangeCities = (id) => {
    setPostalCode(id.postal_code);
  };

  // fungsi untuk search
  const productsData = useMemo(() => {
    let computedProducts = products;

    //Sorting products
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedProducts = computedProducts.sort(
        (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
      );
    }

    return computedProducts;
  }, [products, search, sorting.field, sorting.order]);
  console.log(postalCode);

  const showModalEdit = async (idData) => {
    console.log(idData);

    await axiosConfig.get(`${URL_STRING}/${idData}`).then((res) => {
      setDetail(res.data.data);
    });
    setId(idData);
    window.$("#modal-edit").modal("show");
  };

  const hideModal = (hideModalInfo) => {
    window.$("#modal-lg").modal("hide");
  };

  const testAdd = () => {
    props.history.push("/addProduct");
  };
  console.log(products);
  // fungsi untuk menambah data
  const handleAddCategory = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("fullname", fullname);
    formData.append("phone", phone);
    formData.append("username", username);
    formData.append("supplier[alamat]", address);
    formData.append("supplier[post_code]", postalCode);
    formData.append("supplier[status]", 1);
    axiosConfig
      .post(URL_STRING, formData)
      .then((res) => {
        // setelah berhasil post data, maka otomatis res.data.data yang berisi data yang barusan ditambahkan
        // akan langsung di push ke array yang akan di map, jadi data terkesan otomatis update
        // tanpa di reload
        getProduct();
        toastr.success("Berhasil menambahkan supplier");
        hideModal();
      })
      .catch((error) => toastr.error(error.response.data.message));
  };

  // fungsi untuk menampilkan detail data
  const categoryDetail = (id) => {
    axiosConfig.get(`${URL_DETAIL}/${id}`).then((res) => {
      setDetail(res.data.data);
    });
    window.$("#modal-detail").modal("show");
  };

  // fungsi untuk ubah data
  const changeData = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("fullname", fullname);
    formData.append("phone", phone);
    formData.append("username", username);
    formData.append("supplier[alamat]", address);
    formData.append("supplier[post_code]", postalCode);
    formData.append("supplier[status]", 1);
    formData.append("_method", "put");
    axiosConfig.post(`${URL_STRING}/${id}`, formData).then((res) => {
      getProduct();
      toastr.success("Berhasil merubah supplier");
      window.$("#modal-edit").modal("hide");
      setId(0);
    });
  };

  const deleteData = (id) => {
    swal({
      title: "Apakah anda yakin?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axiosConfig.delete(`${URL_STRING}/${id}/delete`).then(() => {
          const productData = products.filter((data) => data.id !== id);
          setProducts(productData);
          toastr.success("Supplier berhasil dihapus");
        });
      }
    });
  };

  const modalDeleteMultiple = (id) => {
    swal({
      title: "Apakah anda yakin?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const data = { _method: "delete", id: checkedBoxes };
        axiosConfig.post(`${URL_STRING}/delete-batch`, data).then(() => {
          getProduct();
          toastr.success("Supplier berhasil dihapus");
        });
      }
    });
  };

  // fungsi untuk handle pagination
  const handlePageChange = (page, e) => {
    setCurrentPage(page);
    let nextPage = page;
    if (!nextPage || nextPage === 0) {
      nextPage = 1;
    }
    const offset = (nextPage - 1) * limit;
    if (search) {
      axiosConfig
        .get(`${URL_STRING}?${debouncedSearch}&offset=${offset}`)
        .then((res) => {
          setCurrentPage(res.data.meta.current_page);
          setProducts(res.data.data);
        })
        .catch((error) => toastr.error(error));
    } else {
      axiosConfig
        .get(`${URL_STRING}?limit=10&offset=${offset}`)
        .then((json) => {
          setCurrentPage(json.data.meta.current_page);
          setProducts(json.data.data);
        })
        .catch((error) => toastr.error(error));
    }
  };

  const setFileUrls = (files) => {
    const item = URL.createObjectURL(files);
    if (urls.length > 0) {
      URL.revokeObjectURL(urls);
    }
    setUrls(item);
  };

  const displayUploadedFiles = (item) => {
    return <img src={item} style={{ width: 100, height: 100 }} />;
  };

  const uploadSingleFile = (e) => {
    setFileUrls(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  // fungsi checkbox delete
  const toggleCheckbox = (e, item) => {
    if (e.target.checked) {
      let arr = checkedBoxes;
      arr.push(item.id);

      setCheckedBoxes(arr);
    } else {
      let items = checkedBoxes.splice(checkedBoxes.indexOf(item.id), 1);

      setCheckedBoxes(items);
    }
    console.log(checkedBoxes);
  };

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div
              className="col-sm-6"
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <h1 className="m-0 text-dark">Menu Supplier</h1>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <button
                  type="button"
                  class="btn btn-block btn-success btn-xs"
                  style={{ height: 40, marginTop: 7, marginRight: 10 }}
                  data-toggle="modal"
                  data-target="#modal-lg"
                >
                  Tambah Supplier
                </button>
                <button
                  type="button"
                  class="btn btn-block btn-success btn-xs"
                  style={{ height: 40, marginTop: 7, marginRight: 10 }}
                >
                  Log Aktivitas
                </button>
                <button
                  type="button"
                  class="btn btn-block btn-danger btn-xs"
                  style={{ marginTop: 6 }}
                  onClick={modalDeleteMultiple}
                >
                  Hapus Sekaligus
                </button>
              </div>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Menu Supplier</li>
              </ol>
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
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
                          getPageItemProps,
                        }) => (
                          <div>
                            <button
                              {...getPageItemProps({
                                pageValue: 1,
                                onPageChange: handlePageChange,
                                style: style.pageItem,
                                className: "page-link",
                              })}
                            >
                              {"❮❮"}
                            </button>
                            {hasPreviousPage && (
                              <button
                                {...getPageItemProps({
                                  pageValue: previousPage,
                                  onPageChange: handlePageChange,
                                  style: style.pageItem,
                                  className: "page-link",
                                })}
                              >
                                {"❮"}
                              </button>
                            )}

                            {pages.map((page) => {
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
                                    style: {
                                      ...style.pageItem,
                                      ...activePage,
                                    },
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
                                  className: "page-link",
                                })}
                              >
                                {"❯"}
                              </button>
                            )}

                            <button
                              {...getPageItemProps({
                                pageValue: totalPages,
                                onPageChange: handlePageChange,
                                style: style.pageItem,
                                className: "page-link",
                              })}
                            >
                              {"❯❯"}
                            </button>
                          </div>
                        )}
                      </Pagination>
                    </div>
                    <div className="col-md-6 d-flex flex-row-reverse">
                      <Search
                        onSearch={(value) => {
                          setSearch(value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  </div>

                  <table className="table table-striped">
                    <TableHeader
                      headers={headers}
                      onSorting={(field, order) => setSorting({ field, order })}
                    />
                    <tbody>
                      {loading === true ? (
                        <Spinner />
                      ) : (
                        productsData.map((product) => (
                          <tr>
                            <th scope="row" key={product.id}>
                              <input
                                type="checkbox"
                                className="selectsingle"
                                value="{product.id}"
                                checked={checkedBoxes.find(
                                  (p) => p.id === product.id
                                )}
                                onChange={(e) => toggleCheckbox(e, product)}
                              />
                              &nbsp;&nbsp;
                              {product.id}
                            </th>
                            <td>{product.name}</td>
                            <td>{product.alamat}</td>
                            <td>{product.detail}</td>
                            <td>{product.detail}</td>
                            <td>-</td>
                            <td>-</td>
                            <div
                              style={{
                                flexDirection: "row",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-around",
                                marginBottom: 10,
                              }}
                            >
                              <button
                                type="button"
                                style={{ marginTop: 9 }}
                                class="btn btn-block btn-success"
                              >
                                Lihat
                              </button>
                              <button
                                type="button"
                                style={{ marginLeft: 5 }}
                                class="btn btn-block btn-success"
                                onClick={() => showModalEdit(product.id)}
                              >
                                Ubah
                              </button>
                              <button
                                type="button"
                                style={{ marginLeft: 5 }}
                                class="btn btn-block btn-danger"
                                onClick={() => deleteData(product.id)}
                              >
                                Hapus
                              </button>
                            </div>
                          </tr>
                        ))
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
              <h4 className="modal-title">Tambah Supplier</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Fullname</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Fullname"
                    onChange={(e) => {
                      setFullname(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Username"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Phone"
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Kota</label>
                  <Select
                    defaultValue={optionsCities[0]}
                    isMulti={false}
                    options={optionsCities}
                    closeMenuOnSelect={true}
                    onChange={handleChangeCities}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Alamat</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Judul Produk"
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Kode Pos</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Kode Pos"
                    value={postalCode}
                    onChange={(e) => {
                      setPostalCode(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Judul Produk"
                    onChange={(e) => {
                      setDesc(e.target.value);
                    }}
                  />
                </div>
                {urls.length > 0 && displayUploadedFiles(urls)}
                <div className="form-group">
                  <label htmlFor="exampleInputFile">Image</label>
                  <div className="input-group">
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="exampleInputFile"
                        onChange={uploadSingleFile}
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="exampleInputFile"
                      >
                        Choose file
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer justify-content-between">
              <button
                type="button"
                className="btn btn-default"
                onClick={hideModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddCategory}
              >
                Save changes
              </button>
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
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Gambar Produk</label>
                  <div>
                    {detail.images &&
                      detail.images.map((image) => (
                        <td>
                          <img
                            style={{ width: 100, height: 100 }}
                            src={
                              image.file_upload
                                ? image.file_upload
                                : "https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png"
                            }
                          />
                        </td>
                      ))}
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
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
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
              <h4 className="modal-title">Ubah Supplier</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Fullname</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={detail.name}
                    onChange={(e) => {
                      setFullname(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={detail.user && detail.user.username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={detail.user && detail.user.email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={detail.user && detail.user.phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Kota</label>
                  <Select
                    defaultValue={optionsCities[0]}
                    isMulti={false}
                    options={optionsCities}
                    closeMenuOnSelect={true}
                    onChange={handleChangeCities}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Alamat</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={detail.alamat}
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Kode Pos</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={detail.post_code}
                    value={postalCode}
                    onChange={(e) => {
                      setPostalCode(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={detail.desc}
                    onChange={(e) => {
                      setDesc(e.target.value);
                    }}
                  />
                </div>
                {urls.length > 0 && displayUploadedFiles(urls)}
                <div className="form-group">
                  <label htmlFor="exampleInputFile">Image</label>
                  <div className="input-group">
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="exampleInputFile"
                        onChange={uploadSingleFile}
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="exampleInputFile"
                      >
                        Choose file
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer justify-content-between">
              <button
                type="button"
                className="btn btn-default"
                onClick={hideModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={changeData}
              >
                Save changes
              </button>
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
    textDecoration: "none",
  },
  pageItemActive: {
    color: "#fff",
    backgroundColor: "#0275d8",
    borderColor: "#fff",
  },
  listGroup: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: 0,
  },
  listGroupItem: {
    position: "relative",
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "center",
    padding: "0.75rem 1.25rem",
    marginBottom: "-1px",
    backgroundColor: "#fff",
    border: "1px #fff",
  },
};
export default withRouter(DataTable);
