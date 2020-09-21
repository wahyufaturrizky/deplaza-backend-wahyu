import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Search } from "./DataTable";
import Select from "react-select";
import toastr from "toastr";
import swal from "sweetalert";

import { Spinner } from "../../../components/spinner";
import axiosConfig from "../../../utils/axiosConfig";
import useDebounce from "../../../components/useDebounce";

import { withRouter } from "react-router";
import Pagination from "react-paginating";

const URL_STRING = "/address";
const URL_POST = "/address";
const URL_GET_CITIES = "/shipment/cities";
const URL_GET_PROVINCE = "/shipment/provinces";

const DataTable = (props) => {
  const [categories, setCategories] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [urls, setUrls] = useState("");
  const [id, setId] = useState(0);
  const [limit, setLimit] = useState(10);
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const [getCities, setGetCities] = useState([]);
  const [getProvince, setGetProvince] = useState([]);
  const [cityId, setCityId] = useState(0);
  const [provId, setProvId] = useState(0);
  const [cityName, setCityName] = useState("");
  const [provName, setProvName] = useState("");
  const [provinceId, setProvinceId] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(0);
  const [address, setAddress] = useState("");
  const [label, setLabel] = useState("");
  const [zip, setZip] = useState(0);

  const debouncedSearch = useDebounce(search, 1000);
  const headers = [
    { name: "No.", field: "id", sortable: false },
    { name: "Nama", field: "name", sortable: false },
    { name: "No Telepon", field: "name", sortable: false },
    { name: "Alamat", field: "name", sortable: false },
    { name: "Aksi", field: "body", sortable: false },
  ];

  useEffect(() => {
    if (search) {
      axiosConfig
        .get(`${URL_STRING}?limit=10&keyword=${debouncedSearch}`)
        .then((res) => {
          setLimit(res.data.meta.limit);
          setTotalItems(res.data.meta.total_result);
          setCategories(res.data.data);
        });
    } else {
      getData();
      getDataCity();
      getDataProvinces();
    }
  }, [debouncedSearch]);

  const getDataCity = () => {
    axiosConfig
      .get(`${URL_GET_CITIES}`)
      .then((res) =>
        res.data.rajaongkir.results.map((data) => ({
          value: data.city_id,
          province_id: data.province_id,
          label: data.type + " " + data.city_name,
        }))
      )
      .then((data) => {
        setGetCities(data);
      })
      .catch((error) => console.log(error));
  };

  const getDataProvinces = () => {
    axiosConfig
      .get(`${URL_GET_PROVINCE}`)
      .then((res) =>
        res.data.rajaongkir.results.map((data) => ({
          value: data.province_id,
          label: "Provinsi " + data.province,
        }))
      )
      .then((data) => {
        setGetProvince(data);
      })
      .catch((error) => console.log(error));
  };

  const getData = () => {
    setLoading(true);
    axiosConfig
      .get(URL_STRING)
      .then((json) => {
        setTotalItems(json.data.meta.total_data);
        setCategories(json.data.data);
        setLoading(false);
      })
      .catch((error) => toastr.error(error));
  };

  const options = getProvince.map((i) => i);
  const optionsCities = getCities.map((i) => i);

  const handleChangeCities = (id) => {
    setCityId(id.value);
    setCityName(id.label);
  };

  const handleChangeProv = (id) => {
    setProvId(id.value);
    setProvName(id.label);
  };

  const categoriesData = useMemo(() => {
    let computedCategories = categories;
    //Sorting comments
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedCategories = computedCategories.sort(
        (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
      );
    }

    return computedCategories;
  }, [categories, search, sorting.field, sorting.order]);
  console.log(categoriesData);

  const showModalEdit = async (idData) => {
    setId(idData);
    window.$("#modal-edit").modal("show");
  };

  const hideModal = (hideModalInfo) => {
    window.$("#modal-lg").modal("hide");
  };

  // fungsi untuk menambah data
  const handleAddCategory = () => {
    const formData = new FormData();
    formData.append("label", label);
    formData.append("receiver", name);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("prov_id", provId);
    formData.append("prov_name", provName);
    formData.append("city_id", cityId);
    formData.append("city_name", cityName);
    formData.append("zip_code", zip);
    formData.append("is_main", 1);
    axiosConfig
      .post(URL_POST, formData)
      .then((res) => {
        // setelah berhasil post data, maka otomatis res.data.data yang berisi data yang barusan ditambahkan
        // akan langsung di push ke array yang akan di map, jadi data terkesan otomatis update
        // tanpa di reload
        getData();
        toastr.success("Berhasil menambahkan Alamat");
        hideModal();
      })
      .catch((error) => toastr.error(error));
  };

  // fungsi untuk menampilkan detail data
  const categoryDetail = (id) => {
    axiosConfig.get(`${URL_POST}/${id}`).then((res) => {
      setDetail(res.data.data);
    });
    window.$("#modal-detail").modal("show");
  };

  // fungsi untuk ubah data
  const changeData = () => {
    const formData = new FormData();
    formData.append("label", label);
    formData.append("receiver", name);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("prov_id", provId);
    formData.append("prov_name", provName);
    formData.append("city_id", cityId);
    formData.append("city_name", cityName);
    formData.append("zip_code", zip);
    formData.append("is_main", 1);
    formData.append("_method", "put");
    axiosConfig
      .post(`${URL_POST}/${id}`, formData)
      .then((res) => {
        toastr.success("Berhasil merubah Alamat");
        getData();
        window.$("#modal-edit").modal("hide");
        setId(0);
      })
      .catch((error) => toastr.error(error));
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
        axiosConfig.post(`${URL_POST}/delete-batch`, data).then(() => {
          getData();
          toastr.success("Alamat berhasil dihapus");
        });
      }
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
        axiosConfig.delete(`${URL_POST}/${id}/delete`).then(() => {
          const categoryData = categories.filter(
            (category) => category.id !== id
          );
          setCategories(categoryData);
          toastr.success("Alamat berhasil dihapus");
        });
      }
    });
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
        .get(
          `${URL_STRING}?keyword=${debouncedSearch}&limit=10&offset=${offset}`
        )
        .then((res) => {
          setCurrentPage(res.data.meta.current_page);
          setCategories(res.data.data);
        })
        .catch((error) => toastr.error(error));
    } else {
      axiosConfig
        .get(`${URL_STRING}?limit=10&offset=${offset}`)
        .then((json) => {
          setCurrentPage(json.data.meta.current_page);
          setCategories(json.data.data);
        })
        .catch((error) => toastr.error(error));
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
              <h1 className="m-0 text-dark">Menu Alamat</h1>
              <button
                type="button"
                class="btn btn-block btn-success btn-sm"
                style={{ width: 130, height: 40, marginTop: 7 }}
                data-toggle="modal"
                data-target="#modal-lg"
              >
                Tambah Alamat
              </button>
              <button
                type="button"
                class="btn btn-block btn-danger btn-sm"
                style={{ width: 130, height: 40 }}
                onClick={modalDeleteMultiple}
              >
                Hapus Sekaligus
              </button>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Dashboard v2</li>
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
                                    style: { ...style.pageItem, ...activePage },
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
                        categoriesData.map((comment, i) => (
                          <tr>
                            <th scope="row" key={comment.id}>
                              <input
                                type="checkbox"
                                className="selectsingle"
                                value="{category.id}"
                                checked={checkedBoxes.find(
                                  (p) => p.id === comment.id
                                )}
                                onChange={(e) => toggleCheckbox(e, comment)}
                              />
                              &nbsp;&nbsp;
                              {i + 1}
                            </th>
                            <td>{comment.receiver}</td>
                            <td>{comment.phone}</td>
                            <td>
                              {comment.address}, Kota: {comment.city_name},
                              Provinsi: {comment.prov_name}, Kode Pos:{" "}
                              {comment.zip_code}{" "}
                            </td>
                            <div
                              style={{
                                flexDirection: "row",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-around",
                                marginBottom: 10,
                              }}
                            >
                              {/* <button type="button" style={{ width: 80, marginTop: 10 }} class="btn btn-block btn-success">Lihat</button> */}
                              <button
                                type="button"
                                style={{ width: 80, marginTop: 10 }}
                                class="btn btn-block btn-success"
                                onClick={() => showModalEdit(comment.id)}
                              >
                                Ubah
                              </button>
                              <button
                                type="button"
                                style={{ width: 80 }}
                                class="btn btn-block btn-danger"
                                onClick={() => deleteData(comment.id)}
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
              <h4 className="modal-title">Tambah Alamat</h4>
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
                  <label htmlFor="exampleInputEmail1">Nama</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Nama"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Label</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="rumah"
                    onChange={(e) => {
                      setLabel(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">No Telepon</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="0899999999"
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Alamat</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Alamat"
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Provinsi</label>
                  <Select
                    defaultValue={options[0]}
                    isMulti={false}
                    options={options}
                    closeMenuOnSelect={true}
                    onChange={handleChangeProv}
                  />
                </div>
                <div className="form-group">
                  <label>Kota</label>
                  <Select
                    defaultValue={optionsCities[0]}
                    isMulti={false}
                    options={optionsCities}
                    closeMenuOnSelect={true}
                    onChange={handleChangeCities}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Kode Pos</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="1542"
                    onChange={(e) => {
                      setZip(e.target.value);
                    }}
                  />
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
                Tambah Alamat
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
              <h4 className="modal-title">Detail Alamat</h4>
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
                  <label htmlFor="exampleInputEmail1">Gambar Alamat</label>
                  <div>
                    <img
                      src={
                        detail.image_url
                          ? detail.image_url
                          : "https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png"
                      }
                      style={{ width: 100, height: 100 }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Judul Alamat</label>
                  <h4>{detail.name}</h4>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputFile">Slug</label>
                  <h4>{detail.name}</h4>
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
              <h4 className="modal-title">Tambah Alamat</h4>
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
                  <label htmlFor="exampleInputEmail1">Nama</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Nama"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Label</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="rumah"
                    onChange={(e) => {
                      setLabel(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">No Telepon</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="0899999999"
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Alamat</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Alamat"
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Provinsi</label>
                  <Select
                    defaultValue={options[0]}
                    isMulti={false}
                    options={options}
                    closeMenuOnSelect={true}
                    onChange={handleChangeProv}
                  />
                </div>
                <div className="form-group">
                  <label>Kota</label>
                  <Select
                    defaultValue={optionsCities[0]}
                    isMulti={false}
                    options={optionsCities}
                    closeMenuOnSelect={true}
                    onChange={handleChangeCities}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Kode Pos</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="1542"
                    onChange={(e) => {
                      setZip(e.target.value);
                    }}
                  />
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
                Rubah Alamat
              </button>
            </div>
          </div>
          {/* /.modal-content */}
        </div>
        {/* /.modal-dialog */}
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
