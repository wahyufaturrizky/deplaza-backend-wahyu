import React, { useEffect, useState, useMemo } from "react";
import SingleUpload from "./singleUpload"
import MultipleUpload from "./multipleUpload"
import CatInputs from './categoryInput';


export default function AddProduct() {
    let fileObj = [];
    let fileArray = [];
    const [file, setFile] = useState([]);

    useEffect(() => {
        window.$(document).ready(function() {
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

    const blankCat = { name: '', age: '' };
    const [catState, setCatState] = useState([
        { ...blankCat },
    ]);

    
    const addCat = () => {
        setCatState([...catState, { ...blankCat }]);
    };

    const handleCatChange = (e) => {
        const updatedCats = [...catState];
        updatedCats[e.target.dataset.idx][e.target.className] = e.target.value;
        setCatState(updatedCats);
    };

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
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Judul Produk" />
                                </div>
                                <div className="form-group">
                                    <label>Kategori</label>
                                    <select className="form-control select2bs4" >
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
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Tulis brand" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Harga Pokok Produk</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Brand</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Tulis brand" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Benefit Deplaza</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Tulis brand" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Komisi</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Tulis brand" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Stok Produk</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Tulis brand" />
                                </div>
                            </div>
                            {/* /.col */}
                        </div>
                        {/* /.row */}
                    </div>
                    {/* /.card-body */}
                    <div className="card-footer">
                        Visit <a href="https://select2.github.io/">Select2 documentation</a> for more examples and information about
    the plugin.
  </div>
                </div>
            </div>
        </section>

    )
}
