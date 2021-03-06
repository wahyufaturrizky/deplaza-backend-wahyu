import React, { useEffect, useState } from "react";
import toastr from "toastr";
import swal from "sweetalert";

import axiosConfig from "../../../utils/axiosConfig";
import Select from "react-select";
import { withRouter } from "react-router-dom";
import Loader from "react-loader-spinner";

const URL_POST = "/product";
const URL_GET_CITIES = "/shipment/cities";
const URL_GET_PROVINCE = "/shipment/provinces";
const URL_GET_CITY = "/shipment/city/province";
const URL_GET_CATEGORY = "/category?limit=1000";

function AddProduct(props) {
  const [file, setFile] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [brand, setBrand] = useState("");
  const [priceBasic, setPriceBasic] = useState(0);
  const [priceBenefit, setPriceBenefit] = useState(0);
  const [priceCommission, setPriceCommission] = useState(0);
  const [stock, setStock] = useState(0);
  const [weight, setWeight] = useState(0);
  const [cityId, setCityId] = useState(props.editData.city_id);
  const [source, setSource] = useState("");
  const [cod, setCod] = useState(1);
  const [awb, setAwb] = useState(0);
  const [codCityId, setCodCityId] = useState([]);
  const [variation, setVariation] = useState([]);
  const [values, setValues] = useState({ val: [] });
  const [secondValues, setSecondValues] = useState({ val: [] });
  const [thirdValues, setThirdValues] = useState({ val: [] });
  const [nameVariation, setNameVariation] = useState("");
  const [nameSecondVariation, setNameSecondVariation] = useState("");
  const [nameThirdVariation, setNameThirdVariation] = useState("");
  const [getCity, setGetCity] = useState([]);
  const [getCategory, setGetCategory] = useState([]);
  const [getProvince, setGetProvince] = useState([]);
  const [getCities, setGetCities] = useState([]);
  const [getSubdistrict, setGetSubdistrict] = useState([]);
  const [subdistrictId, setSubdistrictId] = useState(0);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDataCategory();
    getDataCity();
    getDataProvinces();
    window.$(document).ready(function () {
      window.$(".textarea").summernote({
        callbacks: {
          onChange: function (contents) {
            setDescription(contents);
          },
        },
      });
      window.$(".select2bs4").select2({
        theme: "bootstrap4",
      });
    });
  }, []);

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

  const getDataCategory = () => {
    axiosConfig
      .get(`${URL_GET_CATEGORY}`)
      .then((res) =>
        res.data.data.map((data) => ({
          value: data.id,
          label: data.name,
        }))
      )
      .then((data) => {
        setGetCategory(data);
      })
      .catch((error) => console.log(error));
  };

  const optionsCategory = getCategory.map((i) => i);
  const optionsCity = getCity.map((i) => i);
  const options = getProvince.map((i) => i);
  const optionsCities = getCities.map((i) => i);
  const optionsSub = getSubdistrict.map((i) => i);

  const optionsCod = [
    { value: 1, label: "Iya" },
    { value: 0, label: "Tidak" },
  ];

  const handleChangeCodProvince = (data) => {
    axiosConfig
      .get(`${URL_GET_CITY}/${data.value}`)
      .then((res) =>
        res.data.rajaongkir.results.map((data) => ({
          value: data.city_id,
          label: data.type + " " + data.city_name,
        }))
      )
      .then((data) => {
        setGetCity(data);
      })
      .catch((error) => console.log(error));
  };

  const handleChangeCodCity = (data) => {
    let catArray = [];
    data && data.map((i) => catArray.push(i.value));
    const getCityId = getCities.filter((obj) => {
      if (catArray.indexOf(obj.province_id) === -1) {
        return false;
      }
      return true;
    });
    const getDataCities = getCityId.map((id) => id.value);
    setCodCityId(getDataCities);
  };

  const handleChangeCod = (id) => {
    setCod(id.value);
  };

  const handleChangeAwb = (id) => {
    setAwb(id.value);
  };

  const handleChangeCities = (id) => {
    setCityId(id.value);
    axiosConfig
      .get(`shipment/subdistrict/city/${id.value}`)
      .then((res) =>
        res.data.rajaongkir.results.map((data) => ({
          value: data.subdistrict_id,
          label: "Kecamatan " + data.subdistrict_name,
        }))
      )
      .then((data) => {
        setGetSubdistrict(data);
      })
      .catch((error) => console.log(error));
  };

  const handleSubId = (id) => {
    setSubdistrictId(id.value);
  };

  const handleChangeCategory = (id) => {
    setCategoryId(id.value);
  };

  function createInputs() {
    return (
      <div>
        {values.val.length > 0 ? (
          <div className="form-group">
            <label style={{ marginLeft: -55, marginTop: 10 }}>Variasi 1</label>
            <br />
            <label>Nama</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setNameVariation(e.target.value)}
            />
          </div>
        ) : null}
        {values.val.length > 0 ? <label>Pilihan</label> : null}
        {values.val.map((el, i) => (
          <div key={i} className="form-group">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <input
                type="text"
                value={el || ""}
                onChange={handleChange.bind(i)}
                className="form-control"
              />
              <button onClick={removeClick.bind(i)} class="btn btn-default">
                <i className="fas fa-trash" />
              </button>
            </div>
          </div>
        ))}
        {values.val.length > 0 ? (
          <div className="form-group">
            <button
              type="button"
              class="btn btn-block btn-primary btn-sm"
              onClick={addClick}
            >
              <i className="fas fa-plus" /> Tambahkan Pilihan
            </button>
            <label style={{ marginLeft: -55, marginTop: 10 }}>Variasi 2</label>
            <br />
            {secondValues.val.length > 0 ? null : (
              <button
                type="button"
                class="btn btn-block btn-primary btn-sm"
                onClick={addClick2}
              >
                <i className="fas fa-plus" /> Tambah
              </button>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  function createInputs2() {
    return (
      <div>
        {secondValues.val.length > 0 ? (
          <div className="form-group">
            <label>Nama</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setNameSecondVariation(e.target.value)}
            />
          </div>
        ) : null}
        {secondValues.val.length > 0 ? <label>Pilihan</label> : null}
        {secondValues.val.map((el, i) => (
          <div key={i} className="form-group">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <input
                type="text"
                value={el || ""}
                onChange={handleSecondChange.bind(i)}
                className="form-control"
              />
              <button
                onClick={removeSecondClick.bind(i)}
                class="btn btn-default"
              >
                <i className="fas fa-trash" />
              </button>
            </div>
          </div>
        ))}
        {secondValues.val.length > 0 ? (
          <div className="form-group">
            <button
              type="button"
              class="btn btn-block btn-primary btn-sm"
              onClick={addClick2}
            >
              <i className="fas fa-plus" /> Tambahkan Pilihan
            </button>
            <label style={{ marginLeft: -55, marginTop: 10 }}>Variasi 3</label>
            <br />
            {thirdValues.val.length > 0 ? null : (
              <button
                type="button"
                class="btn btn-block btn-primary btn-sm"
                onClick={addClick3}
              >
                <i className="fas fa-plus" /> Tambah
              </button>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  function createInputs3() {
    return (
      <div>
        {thirdValues.val.length > 0 ? (
          <div className="form-group">
            <label>Nama</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setNameThirdVariation(e.target.value)}
            />
          </div>
        ) : null}
        {thirdValues.val.length > 0 ? <label>Pilihan</label> : null}
        {thirdValues.val.map((el, i) => (
          <div key={i} className="form-group">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <input
                type="text"
                value={el || ""}
                onChange={handleThirdChange.bind(i)}
                className="form-control"
              />
              <button
                onClick={removeThirdClick.bind(i)}
                class="btn btn-default"
              >
                <i className="fas fa-trash" />
              </button>
            </div>
          </div>
        ))}
        {thirdValues.val.length > 0 ? (
          <div className="form-group">
            <button
              type="button"
              class="btn btn-block btn-primary btn-sm"
              onClick={addClick3}
            >
              <i className="fas fa-plus" /> Tambahkan Pilihan
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  function handleChange(event) {
    let vals = [...values.val];
    vals[this] = event.target.value;
    setValues({ val: vals });
    // setVariation([...variation, nameVariation, ...values.val])
    console.log("vals", event);
  }

  function handleSecondChange(event) {
    let vals = [...secondValues.val];
    vals[this] = event.target.value;
    setSecondValues({ val: vals });
    // setVariation([...variation, nameSecondVariation, secondValues.val])
    console.log(vals);
  }

  function handleThirdChange(event) {
    let vals = [...thirdValues.val];
    vals[this] = event.target.value;
    setThirdValues({ val: vals });
    // setVariation([...variation, nameThirdVariation, thirdValues.val])
    console.log(vals);
  }

  const addClick = () => {
    if (values.val.length > 9) {
      alert("Pilihan tidak boleh lebih dari 10");
    } else {
      setValues({ val: [...values.val, ""] });
    }
  };

  const addClick2 = () => {
    if (secondValues.val.length > 9) {
      alert("Pilihan tidak boleh lebih dari 10");
    } else {
      setSecondValues({ val: [...secondValues.val, ""] });
    }
  };

  const addClick3 = () => {
    if (thirdValues.val.length > 9) {
      alert("Pilihan tidak boleh lebih dari 10");
    } else {
      setThirdValues({ val: [...thirdValues.val, ""] });
    }
  };

  const removeClick = () => {
    let vals = [...values.val];
    vals.splice(this, 1);
    setValues({ val: vals });
  };

  const removeSecondClick = () => {
    let vals = [...secondValues.val];
    vals.splice(this, 1);
    setSecondValues({ val: vals });
  };

  const removeThirdClick = () => {
    let vals = [...thirdValues.val];
    vals.splice(this, 1);
    setThirdValues({ val: vals });
  };

  console.log("ggg", props.editData.variation);
  // handle untuk submit data
  const handleSubmit = async (e) => {
    const dataLocal = localStorage.getItem("dataUser");
    const dataUser = JSON.parse(dataLocal);
    setLoading(true);
    const test = [
      { [nameVariation]: values.val },
      { [nameSecondVariation]: secondValues.val },
      { [nameThirdVariation]: thirdValues.val },
    ];
    const getListCod = getProvince.filter((el) =>
      props.editData.cod_city_data.toString().includes(el.value)
    );
    let getLabel = getListCod.map((item) => item.label);
    const getValue = getListCod.map((item) => item.value);
    let results = getValue.map(function (x, i) {
      return x;
    });
    const getCod =
      (await codCityId.length) < 1 ? props.editData.cod_city_data : codCityId;
    const getVariation =
      (await values.val.length) < 1
        ? props.editData.variation
        : JSON.stringify(test);
    const formData = new FormData();
    file.forEach((file) => formData.append("images[]", file));
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category_id", parseInt(categoryId));
    formData.append("brand", brand);
    formData.append("price_basic", parseInt(priceBasic));
    formData.append("price_benefit", parseInt(priceBenefit));
    formData.append("price_commission", parseInt(priceCommission));
    formData.append("stock", parseInt(stock));
    formData.append("weight", parseInt(weight));
    formData.append("city_id", parseInt(cityId));
    formData.append("subdistrict_id", parseInt(subdistrictId));
    formData.append("source", source);
    formData.append("cod", parseInt(cod));
    formData.append("is_awb_auto", parseInt(awb));
    formData.append("cod_city_id", JSON.stringify(getCod));
    formData.append("user_id", dataUser.id);
    formData.append("variation", getVariation);
    formData.append("_method", "put");

    axiosConfig
      .post(`${URL_POST}/${props.editData.id}`, formData)
      .then((res) => {
        props.history.push("/product");
        window.location.reload(false);
        setLoading(false);
        toastr.success("Produk berhasil diubah");
        console.log(res);
      })
      .catch((error) => toastr.error(error));
  };

  // fungsi untuk setFileUrls image
  const setFileUrls = (files) => {
    const item = files.map((file) => URL.createObjectURL(file));
    if (urls.length > 0) {
      urls.forEach((url) => URL.revokeObjectURL(url));
    }
    setUrls(item);
  };

  //fungsi untuk display image
  const displayUploadedFiles = (image) => {
    return image.map((url, i) => (
      <div>
        <img
          key={i}
          src={url}
          style={{ width: 100, height: 100, marginLeft: 10 }}
        />
        <button style={styles.buttonRemove} onClick={() => removeImage(i)}>
          X
        </button>
      </div>
    ));
  };

  //fungsi untuk hapus images
  const removeImage = (value) => {
    file.splice(value, 1);
    setFile(file);
    setFileUrls(file);
  };

  //fungsi untuk upload multiple image
  const uploadMultipleFiles = (e) => {
    const files = [...file]; // Spread syntax creates a shallow copy
    files.push(...e.target.files); // Spread again to push each selected file individually
    setFileUrls(files);
    setFile(files);
  };
  const getCityFrom = getCities.find((o) => o.value === cityId.toString());

  // const arrCod = getListCod.map((item, i) => [{ value: props.editData.cod_city_data[i], label: item.label, index: i }])
  const testGet = getCityFrom && {
    value: props.editData.city_id,
    label: getCityFrom.label,
  };
  // const getCod = getListCod && [{ value: 1, label: arrCod }]
  // const getIndex = arrCod.map(item => item.index)
  // const getListCod = getProvince.filter(el => props.editData.cod_city_data.toString().includes(el.value));
  // let getLabel = getListCod.map(item => item.label)
  // const getValue = getListCod.map(item => item.value)
  // let results = getValue.map(function (x, i) {
  //     return { value: x, label: getLabel[i] }
  // });

  return (
    <section class="content">
      <div class="container-fluid">
        <div className="card card-default">
          <div className="card-header">
            <h3 className="card-title">Edit Produk</h3>
            <div className="card-tools">
              <button
                type="button"
                className="btn btn-tool"
                data-card-widget="collapse"
              >
                <i className="fas fa-minus" />
              </button>
              <button
                type="button"
                className="btn btn-tool"
                data-card-widget="remove"
              >
                <i className="fas fa-times" />
              </button>
            </div>
          </div>
          {/* /.card-header */}
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                {/* <MultipleUpload/> */}
                <div className="form-group">
                  <label htmlFor="exampleInputFile">Gambar Produk</label>
                  {urls.length ? (
                    <div className="form-group multi-preview row">
                      {displayUploadedFiles(urls)}
                    </div>
                  ) : (
                    props.editData.images.map((item, i) => (
                      <div className="form-group multi-preview">
                        <img
                          key={i}
                          src={item.image_url}
                          style={{ width: 100, height: 100, marginRight: 10 }}
                        />
                      </div>
                    ))
                  )}
                  <div className="input-group">
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="exampleInputFile"
                        onChange={uploadMultipleFiles}
                        multiple
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="exampleInputFile"
                      >
                        Pilih gambar
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Judul Produk</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={props.editData.name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Kategori</label>
                  <Select
                    defaultValue={props.editData.category_id}
                    isMulti={false}
                    options={optionsCategory}
                    closeMenuOnSelect={true}
                    onChange={handleChangeCategory}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={props.editData.brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Harga Pokok Produk</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={props.editData.price_basic}
                    onChange={(e) => setPriceBasic(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Benefit Deplaza</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={props.editData.price_benefit}
                    onChange={(e) => setPriceBenefit(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Komisi</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={props.editData.price_commission}
                    onChange={(e) => setPriceCommission(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Stok Produk</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={props.editData.stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
                <label htmlFor="exampleInputEmail1">Variasi</label>
                <div style={{ marginLeft: 50 }}>
                  <div className="col-md-6">
                    <div className="form-group">
                      {createInputs()}
                      {createInputs2()}
                      {createInputs3()}
                      {values.val.length === 0 ? (
                        <button
                          type="button"
                          class="btn btn-block btn-primary btn-sm"
                          onClick={addClick}
                        >
                          <i className="fas fa-plus" /> Aktifkan Variasi
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Deskripsi Produk</label>
                  <textarea
                    className="textarea"
                    placeholder={props.editData.description}
                    style={{
                      width: "100%",
                      height: 200,
                      fontSize: 14,
                      lineHeight: 18,
                      border: "1px solid #dddddd",
                      padding: 10,
                    }}
                    defaultValue={""}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">
                    Berat Produk (gram)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={props.editData.weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">
                    Supplier (Sumber Produk)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder={props.editData.source}
                    onChange={(e) => setSource(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Kota Asal Produk</label>
                  <Select
                    value={testGet}
                    isMulti={false}
                    options={optionsCities}
                    closeMenuOnSelect={true}
                    onSelectResetsInput={true}
                    onChange={handleChangeCities}
                  />
                </div>
                <div className="form-group">
                  <label>Kecamatan Asal Produk</label>
                  <Select
                    defaultValue={optionsSub[0]}
                    isMulti={false}
                    options={optionsSub}
                    closeMenuOnSelect={true}
                    onChange={handleSubId}
                  />
                </div>
                <div className="form-group">
                  <label>Bisa COD / Tidak</label>
                  <Select
                    defaultValue={[
                      {
                        value: props.editData.cod,
                        label: props.editData.cod === 1 ? "Iya" : "Tidak",
                      },
                    ]}
                    isMulti={false}
                    options={optionsCod}
                    closeMenuOnSelect={true}
                    onChange={handleChangeCod}
                  />
                </div>
                <div className="form-group">
                  <label>Resi Otomatis / Tidak</label>
                  <Select
                    defaultValue={[
                      {
                        value: props.editData.is_awb_auto,
                        label:
                          props.editData.is_awb_auto === 1 ? "Iya" : "Tidak",
                      },
                    ]}
                    isMulti={false}
                    options={optionsCod}
                    closeMenuOnSelect={true}
                    onChange={handleChangeAwb}
                  />
                </div>
                <div className="form-group">
                  <label>Daerah COD</label>
                  <Select
                    defaultValue={options[0]}
                    isMulti={true}
                    options={options}
                    closeMenuOnSelect={true}
                    onChange={handleChangeCodCity}
                  />
                </div>
                {loading ? (
                  <button type="button" class="btn btn-block btn-primary">
                    {" "}
                    <Loader
                      type="Oval"
                      color="#fff"
                      height={20}
                      width={20}
                    />{" "}
                  </button>
                ) : (
                  <button
                    type="button"
                    class="btn btn-block btn-primary"
                    onClick={handleSubmit}
                  >
                    Simpan
                  </button>
                )}
              </div>
              {/* /.row */}
            </div>
            {/* /.card-body */}
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  buttonRemove: {
    border: "1px solid #fff",
    elevation: 5,
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: "#fff",
    position: "absolute",
    top: 25,
    marginLeft: -20,
  },
  imagePosition: {
    flexDirection: "row",
  },
};

export default withRouter(AddProduct);
