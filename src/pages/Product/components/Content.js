import React, { useEffect, useState, useMemo } from "react";
import { withRouter } from "react-router";
import toastr from "toastr";
import swal from "sweetalert";

import { TableHeader, Search } from "./DataTable";
import { Spinner } from "../../../components/spinner";
import axiosConfig from "../../../utils/axiosConfig";
import useDebounce from "./DataTable/Search/useDebounce";
import axios from "axios";

import Pagination from "react-paginating";

const URL_STRING = "/product?order_direction=desc";
const URL_SEARCH = "/product?order_direction=desc&limit=10&keyword=";
const URL_DETAIL = "/product";

const DataTable = (props) => {
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [start, setStart] = useState(1);
  const [activePage, setActivePage] = useState(0);
  const [indexingNumber, setIndexingNumber] = useState(null);
  const [indexingNumberDisplay, setIndexingNumberDisplay] = useState(false);
  const [category, setCategory] = useState([]);
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const [id, setId] = useState(0);
  const debouncedSearch = useDebounce(search, 1000);

  const headers = [
    { name: "No.", field: "id", sortable: false },
    { name: "Gambar", field: "garmbar", sortable: false },
    { name: "Produk", field: "produk", sortable: false },
    { name: "Stock", field: "stock", sortable: false },
    { name: "Kategori", field: "kategori", sortable: false },
    { name: "Supplier", field: "supplier", sortable: false },
    { name: "Harga", field: "price_basic", sortable: false },
    { name: "Benefit", field: "price_benefit", sortable: false },
    { name: "Komisi", field: "price_commission", sortable: false },
    { name: "Diskon", field: "diskon", sortable: false },
    { name: "Total Harga", field: "totalHarga", sortable: false },
    { name: "Aksi", field: "body", sortable: false },
  ];

  useEffect(() => {
    if (search) {
      axiosConfig.get(`${URL_SEARCH}${debouncedSearch}`).then((res) => {
        setActivePage(res.data.meta.current_page);
        setLimit(res.data.meta.limit);
        setTotalItems(res.data.meta.total_result);
        setProducts(res.data.data);
      });
    } else {
      getProduct();
    }
  }, [debouncedSearch]);

  const getProduct = async () => {
    setLoading(true);
    axios
      .all([
        axiosConfig.get(`${URL_STRING}&limit=10`),
        axiosConfig.get("/category?limit=1000"),
      ])
      .then(
        axios.spread((product, category) => {
          setActivePage(product.data.meta.current_page);
          setLimit(product.data.meta.limit);
          setTotalItems(product.data.meta.total_result);
          setProducts(product.data.data);
          setCategory(category.data.data);
          setLoading(false);
        })
      )
      .catch((error) => toastr.error(error));
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

    //Current Page slice
    return computedProducts;
  }, [products, search, sorting.field, sorting.order]);
  console.log(productsData);

  const hideModal = (hideModalInfo) => {
    window.$("#modal-lg").modal("hide");
  };

  const testAdd = () => {
    props.history.push("/addProduct");
  };

  // fungsi untuk menampilkan detail data
  const categoryDetail = (id) => {
    axiosConfig.get(`${URL_DETAIL}/${id}`).then((res) => {
      setDetail(res.data.data);
    });
    window.$("#modal-detail").modal("show");
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
        axiosConfig.post(`${URL_DETAIL}/delete-batch`, data).then(() => {
          getProduct();
          toastr.success("Produk berhasil dihapus");
        });
      }
    });
  };

  const modalDelete = (id) => {
    swal({
      title: "Apakah anda yakin?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const data = { _method: "delete" };
        axiosConfig.post(`${URL_DETAIL}/${id}/delete`, data).then(() => {
          getProduct();
          toastr.success("Produk berhasil dihapus");
        });
      }
    });
  };

  //fungsi untuk handle pagination
  const handlePageChange = (page, e) => {
    setCurrentPage(page);
    // setStart(page * 10 - 20 + 51);
    let nextPage = page;
    if (!nextPage || nextPage === 0) {
      nextPage = 1;
    }
    const offset = (nextPage - 1) * limit;
    if (search) {
      axiosConfig
        .get(`${URL_SEARCH}${debouncedSearch}&offset=${offset}`)
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
              <h1 className="m-0 text-dark">Menu Produk</h1>
              <button
                type="button"
                class="btn btn-block btn-success btn-sm"
                style={{ width: 130, height: 40, marginTop: 7 }}
                onClick={testAdd}
              >
                Tambah Produk
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
                <li className="breadcrumb-item active">Menu Produk</li>
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
                          return (
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
                                {indexingNumberDisplay
                                  ? indexingNumber + i
                                  : i + 1}
                              </th>
                              {product.images.map((image) => (
                                <td>
                                  <img
                                    style={{ width: 100, height: 100 }}
                                    src={
                                      image
                                        ? image.image_url
                                        : "https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png"
                                    }
                                  />
                                </td>
                              ))}
                              <td>{product.name}</td>
                              <td>{product.stock}</td>
                              <td>
                                {category
                                  .filter((x) => x.id === product.category_id)
                                  .map((x) => x.name)}
                              </td>
                              <td>{product.source}</td>
                              <td>Rp. {product.price_basic}</td>
                              <td>Rp. {product.price_benefit}</td>
                              <td>Rp. {product.price_commission}</td>
                              <td>-</td>
                              <td>
                                Rp.{" "}
                                {product.price_basic + product.price_benefit}
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
                                <button
                                  type="button"
                                  style={{ marginTop: 9 }}
                                  class="btn btn-block btn-success btn-sm"
                                  onClick={() => categoryDetail(product.id)}
                                >
                                  Lihat
                                </button>
                                <button
                                  type="button"
                                  style={{ marginLeft: 5 }}
                                  class="btn btn-block btn-success btn-sm"
                                  onClick={() =>
                                    props.history.push("/editProduct", product)
                                  }
                                >
                                  Ubah
                                </button>
                                <button
                                  type="button"
                                  style={{ marginLeft: 5 }}
                                  class="btn btn-block btn-danger btn-sm"
                                  onClick={() => modalDelete(product.id)}
                                >
                                  Hapus
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
                            style={{ width: 100, height: 100, marginRight: 10 }}
                            src={
                              image.file_upload
                                ? image.image_url
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
                  <h4>
                    {detail &&
                      category
                        .filter((x) => x.id === detail.category_id)
                        .map((x) => x.name)}
                  </h4>
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
                  {detail.variation_data &&
                    detail.variation_data.map((item) => {
                      let tvariant = Object.keys(item)[0];
                      console.log(item[tvariant]);
                      return (
                        <div>
                          <h4>{Object.keys(item)}</h4>
                          <h5>{`${item[tvariant]}`}</h5>
                        </div>
                      );
                    })}
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputFile">Deskripsi</label>
                  <h6
                    dangerouslySetInnerHTML={{ __html: detail.description }}
                  />
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
