import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Search } from "./DataTable";
import toastr from "toastr";
import swal from "sweetalert";

import { Spinner } from "../../../components/spinner";
import axiosConfig from "../../../utils/axiosConfig";
import useDebounce from "../../../components/useDebounce";
import generatePDF from "./GeneratePdf";
import { withRouter } from "react-router";
import Pagination from "react-paginating";

const URL_STRING =
  "/orders?order_by=id&order_direction=desc&invoice=&start_date=&end_date=&status=&details=1";
const URL_SEARCH =
  "/orders?order_by=id&order_direction=desc&invoice=&start_date=&end_date=&status=&details=1";
const URL_DETAIL = "/orders";

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
  const [limit, setLimit] = useState(10);
  const [id, setId] = useState(0);
  const [indexingNumber, setIndexingNumber] = useState(null);
  const [indexingNumberDisplay, setIndexingNumberDisplay] = useState(false);

  const debouncedSearch = useDebounce(search, 1000);
  const headers = [
    { name: "No.", field: "id", sortable: false },
    { name: "Nama Lengkap", field: "name", sortable: true },
    { name: "Alamat Pengiriman", field: "name", sortable: true },
    { name: "Poduk yang Dipesan", field: "name", sortable: false },
    // { name: "Spesifikasi Produk (warna, size, dll)", field: "email", sortable: true },
    { name: "Harga Barang Total", field: "email", sortable: true },
    { name: "Supplier", field: "email", sortable: true },
    { name: "Alamat Supplier", field: "email", sortable: true },
  ];

  useEffect(() => {
    if (search) {
      axiosConfig
        .get(`${URL_SEARCH}&keyword=${debouncedSearch}`)
        .then((res) => {
          setLimit(res.data.meta.limit);
          setTotalItems(res.data.meta.total_result);
          setProducts(res.data.data);
        });
    } else {
      getProduct();
    }
  }, [debouncedSearch]);

  const getProduct = () => {
    setLoading(true);
    axiosConfig
      .get(URL_STRING)
      .then((json) => {
        setTotalItems(json.data.meta.total_result);
        setProducts(json.data.data);
        setLoading(false);
      })
      .catch((error) => toastr.error(error));
  };

  // fungsi untuk search
  const productsData = useMemo(() => {
    let computedProducts = products.map((x) => {
      // if (x.details[0].variation === "") {
      //     const v = JSON.parse(x.details[0].variation)
      // const object = Object.assign({ ...x }, x.details, { variationTest: v });
      // return object
      // }
      const v = x.details[0].variation;
      const object = Object.assign({ ...x }, x.details, { variationTest: v });
      return object;
    });

    //Sorting products
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedProducts = computedProducts.sort(
        (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
      );
    }

    //Current Page slice
    return computedProducts;
  }, [products, search, sorting.field, sorting.order]);
  console.log(productsData);

  const showModalEdit = async (idData) => {
    await axiosConfig.get(`${URL_DETAIL}/${idData}`).then((res) => {
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

  // fungsi untuk menambah data
  const handleAddCategory = () => {
    const data = { main_id: 0, name: title, active: 1 };
    axiosConfig.post(URL_DETAIL, data).then((res) => {
      // setelah berhasil post data, maka otomatis res.data.data yang berisi data yang barusan ditambahkan
      // akan langsung di push ke array yang akan di map, jadi data terkesan otomatis update
      // tanpa di reload
      let categoryData = [...products];
      categoryData.push(res.data.data);
      setProducts(categoryData);
      alert("success");
      hideModal();
    });
  };

  // fungsi untuk menampilkan detail data
  const categoryDetail = (id) => {
    axiosConfig.get(`${URL_DETAIL}/${id}`).then((res) => {
      setDetail(res.data.data);
    });
    window.$("#modal-detail").modal("show");
  };

  console.log(detail);

  // fungsi untuk ubah data
  const changeData = () => {
    const data = { main_id: 0, name: title, active: 1, _method: "put" };
    axiosConfig.post(`${URL_DETAIL}/${id}`, data).then((res) => {
      // let categoryData = [...comments]; // copying the olds array
      // categoryData[id] = res.data.data; // replace e.target.value with whatever you want to change it to
      // setComments(comments.map(usr => usr.id === id ? res.data.data :  { ...comments }));
      // setComments(categoryData); // ??
      // let categoryData = comments.findIndex((obj => obj.id === id));
      // categoryData = comments[categoryData] = res.data.data
      // setComments([...comments, categoryData])
      props.history.push("/category");
      alert("success");
      window.$("#modal-edit").modal("hide");
      setId(0);
    });
  };

  // fungsi untuk delete data
  const deleteData = (id) => {
    const data = { _method: "delete" };
    axiosConfig.post(`${URL_DETAIL}/${id}`, data).then(() => {
      const categoryData = products.filter((category) => category.id !== id);
      setProducts(categoryData);
      alert("success");
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
        .get(
          `${URL_SEARCH}&keyword=${debouncedSearch}&limit=10&offset=${offset}`
        )
        .then((res) => {
          setCurrentPage(res.data.meta.current_page);
          setProducts(res.data.data);
        })
        .catch((error) => toastr.error(error));
    } else {
      axiosConfig
        .get(`${URL_STRING}&limit=10&offset=${offset}`)
        .then((json) => {
          setCurrentPage(json.data.meta.current_page);
          setProducts(json.data.data);
        })
        .catch((error) => toastr.error(error));
    }

    if (page === 2) {
      setIndexingNumberDisplay(true);
      setIndexingNumber(11);
    } else if (page > 2) {
      setIndexingNumberDisplay(true);
      setIndexingNumber((page - 1) * 10);
    } else {
      setIndexingNumberDisplay(false);
    }
  };

  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
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
              <h1 className="m-0 text-dark">Menu Buyer</h1>
              {/* <button
                type='button'
                class='btn btn-block btn-success btn-sm'
                style={{ width: 130, height: 40, marginTop: 7 }}
              >
                Lihat Buyer
              </button> */}
              <button
                type="button"
                class="btn btn-block btn-danger btn-sm"
                style={{ width: 130, height: 40 }}
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
                <li className="breadcrumb-item active">Menu Buyer</li>
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
                        productsData.map((product, i) => {
                          // // console.log(typeof product.variationTest);
                          // let variation = null;
                          // let objKey = null;
                          // let variationOne = null;
                          // let variationTwo = null;
                          // let variationThree = null;
                          // let key2 = null;
                          // let key3 = null;
                          // let key4 = null;
                          // try {
                          //     // if plain js
                          //     variation = JSON.parse(product.variationTest);
                          //     objKey = Object.keys(variation)
                          //     key2 = Object.keys(variation[0])
                          //     key3 = Object.keys(variation[1])
                          //     key4 = Object.keys(variation[2])
                          //     //  variationOne = `${variation}`
                          //     variationOne = `${objKey[0] && Object.keys(variation[0])}: ${variation[0] && variation[0][key2]}`
                          //     variationTwo = `${objKey[1] && Object.keys(variation[1])}: ${variation[1] && variation[1][key3]}`
                          //     variationThree = `${objKey[2] && Object.keys(variation[2])}: ${variation[2] && variation[2][key4]}`
                          // }
                          // catch (e) {
                          //     // forget about it :)
                          // }
                          //const getVariation = `${objKey[0] === undefined ? null : `${Object.keys(variation[0])}:`} {variation[0] && variation[0][key2]}{'\n'}{objKey[1] === undefined ? null : `${Object.keys(variation[1])}:`} {variation[1] && variation[1][key3]}{'\n'}{objKey[2] === undefined ? null : `${Object.keys(variation[2])}:`} {variation[2] && variation[2][key4]}`

                          return (
                            <tr>
                              <th scope="row" key={product.id}>
                                {indexingNumberDisplay
                                  ? indexingNumber + i
                                  : i + 1}
                              </th>
                              <td>
                                {product.customer
                                  ? product.customer.fullname
                                  : "-"}
                              </td>
                              <td>{product.delivery.receiver_address}</td>
                              <td>{product[0].metadata_products}</td>
                              {/* {product === null ? <td>-</td> : 
                                                        <td>{objKey[0] === undefined ? null : `${Object.keys(variation[0])}:`} {variation[0] && variation[0][key2]}{'\n'}{objKey[1] === undefined ? null : `${Object.keys(variation[1])}:`} {variation[1] && variation[1][key3]}{'\n'}{objKey[2] === undefined ? null : `${Object.keys(variation[2])}:`} {variation[2] && variation[2][key4]}</td>
                                                       } */}
                              <td>Rp.{product.total_price}</td>
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
                                  style={{
                                    marginLeft: 5,
                                    marginTop: 9,
                                  }}
                                  class="btn btn-block btn-success btn-sm"
                                  onClick={() => generatePDF(product)}
                                >
                                  Download Pdf
                                </button>
                                <button
                                  type="button"
                                  style={{
                                    marginLeft: 5,
                                  }}
                                  class="btn btn-block btn-success btn-sm"
                                  onClick={() => categoryDetail(product.id)}
                                >
                                  Lihat
                                </button>
                              </div>
                            </tr>
                          );
                        })
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
              <h4 className="modal-title">Tambah Buyer</h4>
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
                  <label htmlFor="exampleInputEmail1">Judul Produk</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Judul Produk"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputFile">File input</label>
                  <div className="input-group">
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="exampleInputFile"
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
              <h4 className="modal-title">Detail Order</h4>
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
                  <label htmlFor="exampleInputEmail1">Nama Produk</label>
                  <h4>
                    {detail.details && detail.details[0].metadata_products}
                  </h4>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputFile">Total Harga</label>
                  <h4>{detail.total_price}</h4>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputFile">Nama</label>
                  <h4>{detail.customer ? detail.customer.fullname : "-"}</h4>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputFile">Alamat</label>
                  <h4>
                    {detail.delivery ? detail.delivery.receiver_address : "-"}
                  </h4>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputFile">Status</label>
                  <h4>{detail.status_label}</h4>
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
              <h4 className="modal-title">Ubah Produk</h4>
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
                  <label htmlFor="exampleInputEmail1">Judul Produk</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={detail.name}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputFile">File input</label>
                  <div className="input-group">
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="exampleInputFile"
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
