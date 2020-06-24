import React from 'react';
import PropTypes from 'prop-types';

const CatInputs = ({ idx, catState, handleCatChange }) => {
    console.log(idx, catState, handleCatChange);
    
    const catId = `name-${idx}`;
    const ageId = `age-${idx}`;
    return (
        <div>
            <label htmlFor={catId}>{`Variasi ${idx + 1}`}</label>
            <div key={`cat-${idx}`} className="form-group">
                <label htmlFor={catId}>Nama</label>
                <input
                    type="text"
                    name={catId}
                    data-idx={idx}
                    id={catId}
                    className="form-control"
                    value={catState[idx].name}
                    onChange={handleCatChange}
                    placeholder="Masukkan Nama Variasi, contoh: warna, dll"
                />
                <label htmlFor={ageId}>Pilihan</label>
                <input
                    type="text"
                    name={ageId}
                    data-idx={idx}
                    id={ageId}
                    className="form-control"
                    value={catState[idx].age}
                    onChange={handleCatChange}
                    placeholder="Masukkan Pilihan Variasi, contoh: merah, dll"

                />
            </div>
        </div>
    );
};

CatInputs.propTypes = {
    idx: PropTypes.number,
    catState: PropTypes.array,
    handleCatChange: PropTypes.func,
};

export default CatInputs;

