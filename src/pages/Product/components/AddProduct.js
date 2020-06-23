import React, { useEffect, useState, useMemo } from "react";
import Axios from 'axios'
import { Auth } from '../../../utils/auth';


const URL_POST = 'v1/product'


export default function AddProduct() {
    let fileObj = [];
    let fileArray = [];
    const [file, setFile] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [brand, setBrand] = useState('');
    const [priceBasic, setPriceBasic] = useState('');
    const [priceBenefit, setPriceBenefit] = useState('');
    const [priceCommission, setPriceCommission] = useState('');
    const [stock, setStock] = useState('');
    const [weight, setWeight] = useState('');
    const [cityId, setCityId] = useState('');
    const [source, setSource] = useState('');
    const [cod, setCod] = useState(1);
    const [codCityId, setCodCityId] = useState('');
    const [variation, setVariation] = useState([]);
    const [values, setValues] = useState({ val: [], name: '' });
    const [secondValues, setSecondValues] = useState({ val: [] });
    const [thirdValues, setThirdValues] = useState({ val: [] });
    const [nameVariation, setNameVariation] = useState('')
    const [nameSecondVariation, setNameSecondVariation] = useState('')
    const [nameThirdVariation, setNameThirdVariation] = useState('')


    useEffect(() => {
        window.$(document).ready(function () {
            window.$('.textarea').summernote()
            window.$('.select2bs4').select2({
                theme: 'bootstrap4'
            });
        });
    }, []);

    const uploadMultipleFiles = (e) => {
        fileObj.push(e.target.files)
        for (let i = 0; i < fileObj[0].length; i++) {
            fileArray.push(URL.createObjectURL(fileObj[0][i]))
        }
        setFile(fileArray)
    }

    const uploadFiles = (e) => {
        e.preventDefault()
        console.log(file)
    }

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
        console.log('vals', event);
    }

    function handleSecondChange(event) {
        let vals = [...secondValues.val];
        vals[this] = event.target.value;
        setSecondValues({ val: vals });
        console.log(vals);
    }

    function handleThirdChange(event) {
        let vals = [...thirdValues.val];
        vals[this] = event.target.value;
        setThirdValues({ val: vals });
        console.log(vals);
    }

    function handleDropdownChange(e) {
        alert('aaa')
        let vals = 0;
        vals[this] = e
        setCod(vals);
    }
    const dropdownlist = [0, 1]

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

    const handleSubmit = async () => {
        await handleVariation()
        const data = {
            name, description, categoryId, brand, priceBasic, priceBenefit, priceCommission, stock, weight, cityId, source, cod, codCityId,
            file, user_id: 2, variation
        }
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
                // let categoryData = [...categories]
                // categoryData.push(res.data.data)
                // setCategories(categoryData)
                alert('success')
                console.log(res);

            })
    }

    const handleVariation = () => {
        setVariation([...variation, nameVariation, values.val, nameSecondVariation, secondValues.val, nameThirdVariation, thirdValues.val])
    }

    console.log('value1', cod, codCityId);

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
                                    {file.length > 0 ?
                                        <div className="form-group multi-preview">
                                            {file.map(url => (
                                                <img src={url} alt="..." style={{ width: 100, height: 100 }} />
                                            ))}
                                        </div> : null}
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
                                    <select className="form-control select2bs4" onSelect={(e) => setCategoryId(e.target.value)} >
                                        <option selected="selected">Alabama</option>
                                        <option>Alaska</option>
                                        <option>California</option>
                                        <option>Delaware</option>
                                        <option>Tennessee</option>
                                        <option>Texas</option>
                                        <option>Washington</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Brand</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Tulis brand" onChange={(e) => setBrand(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Harga Pokok Produk</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="" onChange={(e) => setPriceBasic(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Benefit Deplaza</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Tulis brand" onChange={(e) => setPriceBenefit(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Komisi</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Tulis brand" onChange={(e) => setPriceCommission(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Stok Produk</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Tulis brand" onChange={(e) => setStock(e.target.value)} />
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
                                    <textarea className="textarea" placeholder="Place some text here" style={{ width: '100%', height: 200, fontSize: 14, lineHeight: 18, border: '1px solid #dddddd', padding: 10 }} defaultValue={""} onChange={(e) => setDescription(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Berat Produk</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="" onChange={(e) => setWeight(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Supplier (Sumber Produk)</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="" onChange={(e) => setSource(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Kota Asal Produk</label>
                                    <select className="form-control select2bs4" onSelect={(e) => setCityId(e.target.value)}>
                                        <option selected="selected">Alabama</option>
                                        <option>Alaska</option>
                                        <option>California</option>
                                        <option>Delaware</option>
                                        <option>Tennessee</option>
                                        <option>Texas</option>
                                        <option>Washington</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Bisa COD / Tidak</label>
                                    <select
                                        className="form-control"
                                        id="first"
                                        value={dropdownlist[1]}
                                        onChange={e => alert(e.target.value)}
                                        onBlur={e => setCod(e.target.value)}
                                        disabled={!dropdownlist.length}>
                                        {dropdownlist.map(item => <option key={item} value={item}>
                                            {item === 1 ? 'Iya' : 'Tidak'}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Daerah COD</label>
                                    <select className="form-control select2bs4" onSelect={(e) => setCodCityId(e.target.value)} >
                                        <option selected="selected">Iya</option>
                                        <option>Tidak</option>
                                    </select>
                                </div>
                                <button type="button" class="btn btn-block btn-primary" onClick={handleSubmit}>Simpan</button>
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
