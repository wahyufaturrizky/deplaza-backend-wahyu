/* eslint-disable no-use-before-define */
import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Search } from "./DataTable";
import toastr from "toastr";
import swal from "sweetalert";

import { Spinner } from "../../../components/spinner";
import axiosConfig from "../../../utils/axiosConfig";
import useDebounce from "../../../components/useDebounce";
import generatePDF from "./GeneratePdf";

import { withRouter } from "react-router";
import Select from "react-select";
import moment from "moment";
import Pagination from "react-paginating";

import "moment/locale/id";
moment.locale("id");

const URL_STRING =
  "/orders?order_by=id&order_direction=desc&invoice=&start_date=&end_date=&status=&details=1";
const URL_DETAIL = "/orders";
const URL_TRACING = "/shipment/tracing";

const DataTable = (props) => {
  const initial = null;
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(0);
  const [getCourier, setGetCourier] = useState([]);
  const [courierId, setCourierId] = useState(0);
  const [detail, setDetail] = useState([]);
  const [trackingId, setTrackingId] = useState(initial);
  const [packageCourier, setPackageCourier] = useState("");
  const [getTracing, setGetTracing] = useState([]);
  const [service, setService] = useState("");
  const [limit, setLimit] = useState(10);
  const [city, setCity] = useState([]);
  const [indexingNumber, setIndexingNumber] = useState(null);
  const [indexingNumberDisplay, setIndexingNumberDisplay] = useState(false);

  const debouncedSearch = useDebounce(search, 1000);

  // header table
  const headers = [
    { name: "No.", field: "id", sortable: false },
    { name: "Tanggal", field: "name", sortable: false },
    { name: "Seller", field: "name", sortable: false },
    { name: "Buyer", field: "name", sortable: false },
    { name: "Produk", field: "email", sortable: false },
    { name: "Varian", field: "email", sortable: false },
    { name: "Jumlah", field: "email", sortable: false },
    { name: "Komisi", field: "email", sortable: false },
    { name: "Komisi Kustom", field: "email", sortable: false },
    { name: "Benefit", field: "email", sortable: false },
    { name: "Harga + Ongkir", field: "email", sortable: false },
    { name: "Total", field: "email", sortable: false },
    { name: "Alamat", field: "email", sortable: false },
    { name: "No Hp", field: "email", sortable: false },
    { name: "Status", field: "email", sortable: false },
    { name: "Pembayaran", field: "email", sortable: false },
    { name: "Aksi", field: "body", sortable: false },
  ];

  useEffect(() => {
    if (search) {
      axiosConfig
        .get(`${URL_STRING}&keyword=${debouncedSearch}`)
        .then((res) => {
          setLimit(res.data.meta.limit);
          setTotalItems(res.data.meta.total_result);
          setData(res.data.data);
        });
    } else {
      getData();
      getDataCourier();
    }
  }, [debouncedSearch]);

  // fungsi untuk fetching data
  const getData = () => {
    setLoading(true);
    axiosConfig
      .get(URL_STRING)
      .then((res) => {
        setTotalItems(res.data.meta.total_data);
        setData(res.data.data);
        setLoading(false);
      })
      .catch((error) => toastr.error(error));
  };

  const getCity = (idcity) => {
    axiosConfig.get(`shipment/city/${idcity}`).then((res) => {
      setCity(res.data.rajaongkir.results);
    });
  };

  console.log("daa", city);
  // fungsi untuk fetching data tracing
  const tracingData = () => {
    setLoading(true);
    axiosConfig
      .get(URL_TRACING)
      .then((res) => {
        setGetTracing(res.data.data);
        setLoading(false);
      })
      .catch((error) => toastr.error(error));
  };

  console.log(getTracing);

  // fungsi untuk fecthing data kurir
  const getDataCourier = async () => {
    await axiosConfig
      .get("/courier")
      .then((res) =>
        res.data.data.map((data) => ({
          value: data.id,
          label: `${data.description} (${data.name})`,
        }))
      )
      .then((data) => {
        setGetCourier(data);
      })
      .catch((error) => toastr.error(error));
  };

  // fungsi untuk map kurir untuk select option
  const optionsCourier = getCourier.map((i) => i);

  console.log(optionsCourier);
  const dataCourier = optionsCourier.find((o) =>
    o.value === detail.delivery ? detail.delivery.courier_id : 2
  );
  // fungsi untuk handle select option
  const handleCourier = (id) => {
    setCourierId(id.value);
  };

  // fungsi untuk search
  const salesData = useMemo(() => {
    let computedSales = data.map((x) => {
      const object = Object.assign({ ...x }, x.details);
      return object;
    });

    //Sorting products
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedSales = computedSales.sort(
        (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
      );
    }

    return computedSales;
  }, [data, search, sorting.field, sorting.order]);
  console.log("salesData", salesData);

  const showModalEdit = async (idData) => {
    await setId(idData);
    await axiosConfig.get(`${URL_DETAIL}/${idData}`).then((res) => {
      setDetail(res.data.data);
    });
    window.$("#modal-edit").modal("show");
  };

  const showModalStatus = async (id) => {
    axiosConfig.get(`${URL_DETAIL}/${id}`).then((res) => {
      setDetail(res.data.data);
    });
    window.$("#modal-status").modal("show");
  };

  const hideModal = (hideModalInfo) => {
    setId(0);
    window.$("#modal-status").modal("hide");
  };

  // fungsi untuk handle error
  const handleError = (message) => {
    const errorMessage =
      message === "Request failed with status code 422"
        ? "No resi sudah di input / belum melakukan pembayaran"
        : message;
    toastr.error(errorMessage);
  };

  // fungsi untuk input resi
  const handleInputResi = (e) => {
    if (!trackingId) {
      toastr.warning("Mohon isi no resi");
    } else {
      const data = {
        tracking_id: trackingId,
        courier_id: courierId,
        package_courier:
          service === "" ? detail.delivery.package_courier : service,
      };
      axiosConfig
        .post(`orders/${id}/sent`, data)
        .then(async (res) => {
          await setTrackingId(initial);
          window.location.reload(false);
          await toastr.success("Berhasil input resi");
          await window.$("#modal-edit").modal("hide");
        })
        .catch((error) => handleError(error.message));
    }
  };

  // fungsi untuk edit resi
  const handleEditResi = () => {
    if (!trackingId) {
      toastr.warning("Mohon isi no resi");
    } else {
      const data = {
        tracking_id: trackingId,
        courier_id: courierId,
        package_courier:
          service === "" ? detail.delivery.package_courier : service,
      };
      axiosConfig
        .post(`orders/${id}/change-delivery`, data)
        .then(async (res) => {
          await setTrackingId(initial);
          await window.$("#modal-edit").modal("hide");
          await toastr.success("Berhasil edit resi");
          window.location.reload(false);
        })
        .catch((error) => handleError(error.message));
    }
  };

  // fungsi untuk delete data
  const deleteData = (id) => {
    const data = { _method: "delete" };
    axiosConfig.post(`${URL_DETAIL}/${id}`, data).then(() => {
      const categoryData = data.filter((category) => category.id !== id);
      setData(categoryData);
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
          `${URL_STRING}&keyword=${debouncedSearch}&limit=10&offset=${offset}`
        )
        .then((res) => {
          setCurrentPage(res.data.meta.current_page);
          setData(res.data.data);
        })
        .catch((error) => toastr.error(error));
    } else {
      axiosConfig
        .get(`${URL_STRING}&limit=10&offset=${offset}`)
        .then((json) => {
          setCurrentPage(json.data.meta.current_page);
          setData(json.data.data);
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

  // fungsi untuk menampilkan detail data
  const salesDetail = (id) => {
    axiosConfig.get(`${URL_DETAIL}/${id}`).then((res) => {
      setDetail(res.data.data);
    });
    window.$("#modal-detail").modal("show");
  };

  // fungsi untuk change status
  const changeStatus = (key, idOrder) => {
    console.log("key", key.indexOf(10) !== -1);
    if (key.indexOf(10) !== -1) {
      axiosConfig
        .post(`/orders/${idOrder}/ready-to-send`)
        .then((res) => {
          getData();
          toastr.success("Barang siap dikirim");
          window.$("#modal-status").modal("hide");
        })
        .catch((error) => toastr.error(error.response.data.message));
    } else if (key.indexOf(2) !== -1) {
      axiosConfig
        .post(`/orders/${idOrder}/confirm`)
        .then((res) => {
          getData();
          toastr.success("Berhasil Konfirmasi Pembayaran");
          window.$("#modal-status").modal("hide");
        })
        .catch((error) => toastr.error(error));
    } else if (key.indexOf(3) !== -1) {
      axiosConfig
        .post(`/orders/${idOrder}/process`)
        .then((res) => {
          getData();
          toastr.success("Pesanan sedang diproses");
          window.$("#modal-status").modal("hide");
        })
        .catch((error) => toastr.error(error));
    } else if (key.indexOf(4) !== -1) {
      setId(idOrder);
      window.$("#modal-status").modal("hide");
      window.$("#modal-edit").modal("show");
    } else if (key.indexOf(9) !== -1) {
      axiosConfig
        .post(`/orders/${idOrder}/reject`)
        .then((res) => {
          getData();
          toastr.success("Berhasil Menolak Pesanan");
          window.$("#modal-status").modal("hide");
        })
        .catch((error) => toastr.error(error));
    } else if (key.indexOf(1) !== -1) {
      axiosConfig
        .post(`/orders/${idOrder}/confirm`)
        .then((res) => {
          getData();
          toastr.success("Berhasil Konfirmasi Pembayaran");
          window.$("#modal-status").modal("hide");
        })
        .catch((error) => toastr.error(error));
    } else {
      console.log("error");
    }
  };

  const handleGeneratePDF = async (pdfId, idcity) => {
    await axiosConfig.get(`shipment/city/${idcity}`).then((res) => {
      const kkk = res.data.rajaongkir.results;
      axiosConfig
        .post(`/orders/${pdfId}/cetak-resi`)
        .then((res) => generatePDF(res.data.data, kkk))
        .catch((error) => toastr.error(error));
    });
  };

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0 text-dark">Informasi Penjualan</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Informasi Penjualan</li>
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
                              {"??????"}
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
                                {"???"}
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
                                {"???"}
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
                              {"??????"}
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
                      {loading ? (
                        <Spinner />
                      ) : (
                        salesData &&
                        salesData.map((sale, i) => {
                          let variation = null;
                          let objKey = null;
                          let variationOne = null;
                          let variationTwo = null;
                          let variationThree = null;
                          let key2 = null;
                          let key3 = null;
                          let key4 = null;
                          try {
                            // if plain js
                            variation = JSON.parse(sale[0].variation);
                            objKey = Object.keys(variation);
                            key2 = Object.keys(variation[0]);
                            key3 = Object.keys(variation[1]);
                            key4 = Object.keys(variation[2]);
                            //  variationOne = `${variation}`
                            variationOne = `${
                              variation[0] && Object.keys(variation[0])
                            }: ${variation[0] && variation[0][key2]}`;
                            variationTwo = `${
                              variation[1] && Object.keys(variation[1])
                            }: ${variation[1] && variation[1][key3]}`;
                            variationThree = `${
                              variation[2] && Object.keys(variation[2])
                            }: ${variation[2] && variation[2][key4]}`;
                          } catch (e) {
                            // forget about it :)
                          }

                          // const keyVarian = sale[0].product.variation_data && sale[0].product.variation_data.map((data,i) => {
                          //     let tvariant = Object.keys(data)[0]
                          //     if(tvariant!=""){
                          //        return tvariant
                          //  }})

                          //  const keyValue = sale[0].product.variation_data && sale[0].product.variation_data.map((data,i) => {
                          //     let tvariant = Object.keys(data)[0]
                          //     if(tvariant!=""){
                          //        return data[tvariant].map((val,j) => {
                          //            return `${tvariant}: ${val}`
                          //         })
                          //  }})

                          //  console.log(keyValue);
                          return (
                            <tr>
                              <th scope="row" key={sale && sale.id}>
                                {indexingNumberDisplay
                                  ? indexingNumber + i
                                  : i + 1}
                              </th>
                              <td>
                                {moment(sale && sale.created_at).format(
                                  "MMMM Do YYYY, h:mm"
                                )}
                              </td>
                              <td>
                                {sale && sale.seller.fullname}{" "}
                                {sale[0].product.user_id !== 2 ? (
                                  <button
                                    type="button"
                                    class="btn btn-block btn-warning btn-xs"
                                    onClick={() =>
                                      toastr.warning("Produk dari reseller")
                                    }
                                  >
                                    Reseller
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    class="btn btn-block btn-success btn-xs"
                                    onClick={() =>
                                      toastr.warning(
                                        "Produk dari Admin deplaza"
                                      )
                                    }
                                  >
                                    Admin
                                  </button>
                                )}{" "}
                              </td>
                              <td>
                                {sale && sale.customer
                                  ? sale.customer.fullname
                                  : "-"}
                              </td>
                              <td>{sale && sale[0].metadata_products}</td>
                              {variation ? (
                                <td>
                                  {objKey[0] === undefined ? (
                                    <td>-</td>
                                  ) : (
                                    `${
                                      variation[0] && Object.keys(variation[0])
                                    }:`
                                  )}{" "}
                                  {variation[0] && variation[0][key2]}
                                  {"\n"}
                                  {objKey[1] === undefined ? (
                                    <td>-</td>
                                  ) : (
                                    `${
                                      variation[1] && Object.keys(variation[1])
                                    }:`
                                  )}{" "}
                                  {variation[1] && variation[1][key3]}
                                  {"\n"}
                                  {objKey[2] === undefined ? (
                                    <td>-</td>
                                  ) : (
                                    `${
                                      variation[2] && Object.keys(variation[2])
                                    }:`
                                  )}{" "}
                                  {variation[2] && variation[2][key4]}
                                </td>
                              ) : (
                                <td>-</td>
                              )}
                              <td>{sale && sale[0].qty}</td>
                              <td>{sale && sale[0].commission}</td>
                              <td>{sale && sale[0].custom_commission}</td>
                              <td>{sale && sale[0].benefit}</td>
                              <td>
                                {sale &&
                                  sale[0].price + sale.delivery.sipping_cost}
                              </td>
                              <td>
                                {sale &&
                                  sale[0].benefit +
                                    sale[0].commission +
                                    sale[0].custom_commission +
                                    sale.delivery.sipping_cost +
                                    sale[0].price * sale[0].qty}
                              </td>
                              <td>{sale && sale.delivery.receiver_address}</td>
                              <td>
                                {sale && sale.customer
                                  ? sale.customer.phone
                                  : "-"}
                              </td>
                              <td>{sale && sale.status_label}</td>
                              <td>{sale && sale.is_cod ? "COD" : "TF"}</td>
                              <td>
                                <button
                                  type="button"
                                  class="btn btn-block btn-success btn-xs"
                                  onClick={() => salesDetail(sale.id)}
                                >
                                  Lihat
                                </button>
                                {sale[0].product.is_awb_auto === 1 ? null : (
                                  <button
                                    type="button"
                                    class="btn btn-block btn-success btn-xs"
                                    onClick={() => showModalEdit(sale.id)}
                                  >
                                    Input Resi
                                  </button>
                                )}
                                {sale[0].product.is_awb_auto === 0 ? null : (
                                  <button
                                    type="button"
                                    class="btn btn-block btn-success btn-xs"
                                    onClick={() => {
                                      sale.delivery.tracking_id
                                        ? handleGeneratePDF(
                                            sale.id,
                                            sale.delivery.receiver_city
                                          )
                                        : toastr.error(
                                            "Silahkan rubah status terlebih dahulu"
                                          );
                                    }}
                                  >
                                    Cetak Resi
                                  </button>
                                )}
                                <button
                                  type="button"
                                  class="btn btn-block btn-success btn-xs"
                                  onClick={() =>
                                    sale.status_label === "Sedang di Dikirim"
                                      ? toastr.success(
                                          "Pesanan sedang dikirim, menunggu konfirmasi dari seller"
                                        )
                                      : showModalStatus(sale.id)
                                  }
                                >
                                  Rubah Status
                                </button>
                              </td>
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
              <h4 className="modal-title">Detail Order</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">??</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Bukti Transfer</label>
                  <div>
                    {detail.payment &&
                    detail.payment.metadata_decode.length > 0 ? (
                      <td>
                        {detail.payment &&
                          detail.payment.metadata_decode.map((image) => (
                            <img
                              style={{
                                width: 725,
                                height: 350,
                                marginRight: 10,
                              }}
                              src={image.bukti_bayar}
                            />
                          ))}
                      </td>
                    ) : (
                      <td>
                        Bukti transfer belum di upload atau metode pembayaran
                        cod
                      </td>
                    )}
                  </div>
                </div>
                {console.log("data detail", detail)}
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">No. Invoice</label>
                  <h4>{detail.invoice}</h4>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Seller</label>
                  <h4>{detail.seller && detail.seller.fullname}</h4>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Buyer</label>
                  <h4>{detail.customer && detail.customer.fullname}</h4>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Produk</label>
                  <h4>
                    {detail.details && detail.details[0].metadata_products}
                  </h4>
                </div>
                {/* <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Varian</label>
                  {detail.details
                    ? JSON.parse(detail.details[0].variation).map((data, i) => {
                        let tvariant = Object.keys(data)[0];
                        console.log(data[tvariant]);
                        return (
                          <h4>
                            {tvariant} : {data[tvariant]}
                          </h4>
                        );
                      })
                    : console.log("data_varian", "kosong")}
                </div> */}
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Jumlah</label>
                  <h4>{detail.details && detail.details[0].qty}</h4>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Total</label>
                  <h4>
                    {detail.details &&
                      detail.details[0].benefit +
                        detail.details[0].commission +
                        detail.details[0].custom_commission +
                        detail.delivery.sipping_cost +
                        detail.details[0].price * detail.details[0].qty}
                  </h4>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Alamat Pengiriman</label>
                  <h4>{detail.delivery && detail.delivery.receiver_address}</h4>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">No Resi</label>
                  <h4>{detail.delivery ? detail.delivery.tracking_id : "-"}</h4>
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
      <div className="modal fade" id="modal-edit">
        <div className="modal-dialog modal-edit">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Input Resi</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">??</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">No. Resi</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={detail.delivery && detail.delivery.tracking_id}
                    defaultValue={
                      detail.delivery && detail.delivery.tracking_id
                    }
                    onChange={(e) => {
                      setTrackingId(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Kurir</label>
                  <Select
                    defaultValue={optionsCourier[0]}
                    isMulti={false}
                    options={optionsCourier}
                    closeMenuOnSelect={true}
                    onChange={handleCourier}
                  />
                  {/* <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={dataCourier && dataCourier.label}
                    defaultValue={dataCourier && dataCourier.label}
                  /> */}
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Jenis Layanan</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    onChange={(e) => {
                      setService(e.target.value);
                    }}
                    placeholder={
                      detail.delivery && detail.delivery.package_courier
                    }
                    defaultValue={
                      detail.delivery && detail.delivery.package_courier
                    }
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
                onClick={
                  detail.status_label === "Sedang di Dikirim"
                    ? handleEditResi
                    : handleInputResi
                }
              >
                {detail.status_label === "Sedang di Dikirim"
                  ? "Edit Resi"
                  : "Input Resi"}
              </button>
            </div>
          </div>
          {/* /.modal-content */}
        </div>
      </div>
      <div className="modal fade" id="modal-status">
        <div className="modal-dialog modal-status">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Rubah Status</h4>
              <button
                type="button"
                className="close"
                onClick={hideModal}
                aria-label="Close"
              >
                <span aria-hidden="true">??</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="card-body">
                {detail.available_status_label ? (
                  <div className="form-group">
                    {Object.keys(
                      detail.available_status_label
                        ? detail.available_status_label
                        : "null"
                    ).map((key, i) => (
                      <button
                        type="button"
                        value={key}
                        class="btn btn-block btn-success btn-sm"
                        onClick={() => changeStatus(key, detail.id)}
                      >
                        {detail.available_status_label[key] ===
                        "Sedang di Dikirim"
                          ? "Input Resi"
                          : detail.available_status_label[key]}
                      </button>
                    ))}
                  </div>
                ) : (
                  <Spinner />
                )}
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
