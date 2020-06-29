import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { withRouter } from 'react-router-dom'
import toastr from 'toastr'
import Loader from 'react-loader-spinner'

import axiosConfig from '../../../utils/axiosConfig';


const URL_POST = '/product'
const URL_GET_CITY = '/shipment/cities'
const URL_GET_CATEGORY = '/category';

function AddProduct(props) {
    const [file, setFile] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState(0);
    const [brand, setBrand] = useState('');
    const [priceBasic, setPriceBasic] = useState(0);
    const [priceBenefit, setPriceBenefit] = useState(0);
    const [priceCommission, setPriceCommission] = useState(0);
    const [stock, setStock] = useState(0);
    const [weight, setWeight] = useState(0);
    const [cityId, setCityId] = useState(0);
    const [source, setSource] = useState('');
    const [cod, setCod] = useState(1);
    const [codCityId, setCodCityId] = useState([]);
    const [variation, setVariation] = useState([]);
    const [values, setValues] = useState({ val: [] });
    const [secondValues, setSecondValues] = useState({ val: [] });
    const [thirdValues, setThirdValues] = useState({ val: [] });
    const [nameVariation, setNameVariation] = useState('')
    const [nameSecondVariation, setNameSecondVariation] = useState('')
    const [nameThirdVariation, setNameThirdVariation] = useState('')
    const [getCity, setGetCity] = useState([])
    const [getCategory, setGetCategory] = useState([])
    const [urls, setUrls] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getDataCategory()
        getDataCity()
        window.$(document).ready(function () {
            window.$('.textarea').summernote({
                callbacks: {
                    onChange: function (contents) {
                        setDescription(contents)
                    }
                }
            })
            window.$('.select2bs4').select2({
                theme: 'bootstrap4'
            });
        });
    }, []);


    const getDataCity = () => {
        axiosConfig.get(`${URL_GET_CITY}`)
            .then(res =>
                res.data.rajaongkir.results.map(data => ({
                    value: data.city_id,
                    label: data.city_name,
                }))
            )
            .then(data => {
                setGetCity(data)
            })
            .catch(error => console.log(error));
    }

    const getDataCategory = () => {
        axiosConfig.get(`${URL_GET_CATEGORY}`)
            .then(res =>
                res.data.data.map(data => ({
                    value: data.id,
                    label: data.name,
                }))
            )
            .then(data => {
                setGetCategory(data)
            })
            .catch(error => console.log(error));
    }

    const optionsCategory = getCategory.map(i => i)
    const options = getCity.map(i => i)

    const optionsCod = [{ value: 0, label: 'Iya' }, { value: 1, label: 'Tidak' }]

    const handleChangeCodCities = (data) => {
        let catArray = [];
        data.map(i =>
            catArray.push(i.value)
        );
        setCodCityId(catArray)
    }

    const handleChangeCod = (id) => {
        setCod(id.value);
    };

    const handleChangeCities = (id) => {
        setCityId(id.value);
    };

    const handleChangeCategory = (id) => {
        setCategoryId(id.value);
    };

    function createInputs() {
        return (
            <div>
                {values.val.length > 0 ?
                    <div className="form-group">
                        <label style={{ marginLeft: -55, marginTop: 10 }}>Variasi 1</label><br />
                        <label>Nama</label>
                        <input type="text" className="form-control" onChange={(e) => setNameVariation(e.target.value)} />
                    </div> : null}
                {values.val.length > 0 ?
                    <label>Pilihan</label> : null}
                {values.val.map((el, i) =>
                    <div key={i} className="form-group">
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <input type="text" value={el || ''} onChange={handleChange.bind(i)} className="form-control" />
                            <button onClick={removeClick.bind(i)} class="btn btn-default"><i className="fas fa-trash" /></button>
                        </div>
                    </div>
                )}
                {values.val.length > 0 ?
                    <div className="form-group">
                        <button type="button" class="btn btn-block btn-primary btn-sm" onClick={addClick}><i className="fas fa-plus" /> Tambahkan Pilihan</button>
                        <label style={{ marginLeft: -55, marginTop: 10 }}>Variasi 2</label><br />
                        {secondValues.val.length > 0 ? null :
                            <button type="button" class="btn btn-block btn-primary btn-sm" onClick={addClick2}><i className="fas fa-plus" /> Tambah</button>}
                    </div> : null}
            </div>
        )
    }

    function createInputs2() {
        return (
            <div>
                {secondValues.val.length > 0 ?
                    <div className="form-group">
                        <label>Nama</label>
                        <input type="text" className="form-control" onChange={(e) => setNameSecondVariation(e.target.value)} />
                    </div> : null}
                {secondValues.val.length > 0 ?
                    <label>Pilihan</label> : null}
                {secondValues.val.map((el, i) =>
                    <div key={i} className="form-group">
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <input type="text" value={el || ''} onChange={handleSecondChange.bind(i)} className="form-control" />
                            <button onClick={removeSecondClick.bind(i)} class="btn btn-default"><i className="fas fa-trash" /></button>
                        </div>
                    </div>
                )}
                {secondValues.val.length > 0 ?
                    <div className="form-group">
                        <button type="button" class="btn btn-block btn-primary btn-sm" onClick={addClick2}><i className="fas fa-plus" /> Tambahkan Pilihan</button>
                        <label style={{ marginLeft: -55, marginTop: 10 }}>Variasi 3</label><br />
                        {thirdValues.val.length > 0 ? null :
                            <button type="button" class="btn btn-block btn-primary btn-sm" onClick={addClick3}><i className="fas fa-plus" /> Tambah</button>}
                    </div> : null}
            </div>
        )
    }

    function createInputs3() {
        return (
            <div>
                {thirdValues.val.length > 0 ?
                    <div className="form-group">
                        <label>Nama</label>
                        <input type="text" className="form-control" onChange={(e) => setNameThirdVariation(e.target.value)} />
                    </div> : null}
                {thirdValues.val.length > 0 ?
                    <label>Pilihan</label> : null}
                {thirdValues.val.map((el, i) =>
                    <div key={i} className="form-group">
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <input type="text" value={el || ''} onChange={handleThirdChange.bind(i)} className="form-control" />
                            <button onClick={removeThirdClick.bind(i)} class="btn btn-default"><i className="fas fa-trash" /></button>
                        </div>
                    </div>
                )}
                {thirdValues.val.length > 0 ?
                    <div className="form-group">
                        <button type="button" class="btn btn-block btn-primary btn-sm" onClick={addClick3}><i className="fas fa-plus" /> Tambahkan Pilihan</button>
                    </div> : null}
            </div>
        )
    }

    function handleChange(event) {
        let vals = [...values.val];
        vals[this] = event.target.value;
        setValues({ val: vals });
        // setVariation([...variation, nameVariation, ...values.val])
        console.log('vals', event);
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
            alert('Pilihan tidak boleh lebih dari 10')
        } else {
            setValues({ val: [...values.val, ''] })
        }
    }

    const addClick2 = () => {
        if (secondValues.val.length > 9) {
            alert('Pilihan tidak boleh lebih dari 10')
        } else {
            setSecondValues({ val: [...secondValues.val, ''] })
        }
    }

    const addClick3 = () => {
        if (thirdValues.val.length > 9) {
            alert('Pilihan tidak boleh lebih dari 10')
        } else {
            setThirdValues({ val: [...thirdValues.val, ''] })
        }
    }

    const removeClick = () => {
        let vals = [...values.val];
        vals.splice(this, 1);
        setValues({ val: vals });
    }

    const removeSecondClick = () => {
        let vals = [...secondValues.val];
        vals.splice(this, 1);
        setSecondValues({ val: vals });
    }

    const removeThirdClick = () => {
        let vals = [...thirdValues.val];
        vals.splice(this, 1);
        setThirdValues({ val: vals });
    }

    console.log('nameVariation', codCityId);


    const handleSubmit = async (e) => {
        if (!name) {
            toastr.warning('Mohon isi nama produk')
        } else if (!categoryId) {
            toastr.warning('Mohon isi kategori')
        } else if (!brand) {
            toastr.warning('Mohon isi brand')
        } else if (!priceBasic) {
            toastr.warning('Mohon isi harga pokok produk')
        } else if (!priceBenefit) {
            toastr.warning('Mohon isi benefit deplaza')
        } else if (!priceCommission) {
            toastr.warning('Mohon isi komisi')
        } else if (!stock) {
            toastr.warning('Mohon isi stok')
        } else if (!description) {
            toastr.warning('Mohon isi deskripsi')
        } else if (!weight) {
            toastr.warning('Mohon isi bert produk')
        } else if (!source) {
            toastr.warning('Mohon isi supplier')
        } else if (!cityId) {
            toastr.warning('Mohon isi kota asal produk')
        } else if (!codCityId) {
            toastr.warning('Mohon isi daerah cod')
        } else {
            setLoading(true)
            const test = [{[nameVariation]: values.val }, { [nameSecondVariation]: secondValues.val }, { [nameThirdVariation]: thirdValues.val }]
            const formData = new FormData();
            file.forEach((file) => formData.append('images[]', file));
            formData.append('name', name);
            formData.append('description', description);
            formData.append('category_id', parseInt(categoryId));
            formData.append('brand', brand);
            formData.append('price_basic', parseInt(priceBasic));
            formData.append('price_benefit', parseInt(priceBenefit));
            formData.append('price_commission', parseInt(priceCommission));
            formData.append('stock', parseInt(stock));
            formData.append('weight', parseInt(weight));
            formData.append('city_id', parseInt(cityId));
            formData.append('source', source);
            formData.append('cod', parseInt(cod));
            codCityId.forEach((file) => formData.append('cod_city_id[]', file));
            formData.append('user_id', 2);
            formData.append('variation', JSON.stringify(test))

            axiosConfig.post(URL_POST, formData)
                .then(res => {
                    props.history.push('/product')
                    window.location.reload(false);
                    setLoading(false)
                    toastr.success('Produk berhasil ditambah')
                    console.log(res);
                }).catch(error => toastr.error(error))
        }

    }

    const setFileUrls = (files) => {
        const item = files.map((file) => URL.createObjectURL(file));
        if (urls.length > 0) {
            urls.forEach((url) => URL.revokeObjectURL(url));
        }
        setUrls(item);
    }

    const displayUploadedFiles = (image) => {
        return image.map((url, i) => <img key={i} src={url} style={{ width: 100, height: 100, marginRight: 10 }} />);
    }

    const uploadMultipleFiles = (e) => {
        const files = [...file]; // Spread syntax creates a shallow copy
        files.push(...e.target.files); // Spread again to push each selected file individually
        setFileUrls(files)
        setFile(files);
    }

    const testV = nameVariation
    const testV2 = nameSecondVariation
    const testV3 = nameThirdVariation
    const obj = {}

    console.log('jj', [{ [nameVariation]: values.val }, { [nameSecondVariation]: secondValues.val }, { [nameThirdVariation]: thirdValues.val }]);


    return (
        <section class="content">
            <div class="container-fluid">
                <div className="card card-default">
                    <div className="card-header">
                        <h3 className="card-title">Tambah Produk</h3>
                        <div className="card-tools">
                            <button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
                            <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" /></button>
                        </div>
                    </div>
                    {/* /.card-header */}
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                {/* <MultipleUpload/> */}
                                <div className="form-group">
                                    <label htmlFor="exampleInputFile">Gambar Produk</label>
                                    {urls.length > 0 && <div className="form-group multi-preview">{displayUploadedFiles(urls)}</div>}
                                    <div className="input-group">
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" id="exampleInputFile" onChange={uploadMultipleFiles} multiple />
                                            <label className="custom-file-label" htmlFor="exampleInputFile">Pilih gambar</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Judul Produk</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Judul Produk" onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Kategori</label>
                                    <Select
                                        defaultValue={optionsCategory[0]}
                                        isMulti={false}
                                        options={optionsCategory}
                                        closeMenuOnSelect={true}
                                        onChange={handleChangeCategory} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Brand</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Tulis brand" onChange={(e) => setBrand(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Harga Pokok Produk</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="10000" onChange={(e) => setPriceBasic(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Benefit Deplaza</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="10000" onChange={(e) => setPriceBenefit(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Komisi</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="10000" onChange={(e) => setPriceCommission(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Stok Produk</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="100" onChange={(e) => setStock(e.target.value)} />
                                </div>
                                <label htmlFor="exampleInputEmail1">Variasi</label>
                                <div style={{ marginLeft: 50 }}>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            {createInputs()}
                                            {createInputs2()}
                                            {createInputs3()}
                                            {values.val.length === 0 ?
                                                <button type="button" class="btn btn-block btn-primary btn-sm" onClick={addClick}><i className="fas fa-plus" /> Aktifkan Variasi</button>
                                                : null
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Deskripsi Produk</label>
                                    <textarea className="textarea" placeholder="Place some text here" style={{ width: '100%', height: 200, fontSize: 14, lineHeight: 18, border: '1px solid #dddddd', padding: 10 }} defaultValue={""} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Berat Produk (kg)</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="1" onChange={(e) => setWeight(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Supplier (Sumber Produk)</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="tokopedia.com" onChange={(e) => setSource(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Kota Asal Produk</label>
                                    <Select
                                        defaultValue={options[0]}
                                        isMulti={false}
                                        options={options}
                                        closeMenuOnSelect={true}
                                        onChange={handleChangeCities} />
                                </div>
                                <div className="form-group">
                                    <label>Bisa COD / Tidak</label>
                                    <Select
                                        defaultValue={optionsCod[0]}
                                        isMulti={false}
                                        options={optionsCod}
                                        closeMenuOnSelect={true}
                                        onChange={handleChangeCod} />
                                </div>
                                <div className="form-group">
                                    <label>Daerah COD</label>
                                    <Select
                                        defaultValue={options[0]}
                                        isMulti={true}
                                        options={options}
                                        closeMenuOnSelect={true}
                                        onChange={handleChangeCodCities} />
                                </div>
                                {loading ? <button type="button" class="btn btn-block btn-primary"> <Loader
                                    type="Oval"
                                    color="#fff"
                                    height={20}
                                    width={20}
                                /> </button> :
                                    <button type="button" class="btn btn-block btn-primary" onClick={handleSubmit}>Simpan</button>
                                }
                            </div>
                            {/* /.row */}
                        </div>
                        {/* /.card-body */}
                    </div>
                </div>
            </div>
        </section>

    )
}

export default withRouter(AddProduct)