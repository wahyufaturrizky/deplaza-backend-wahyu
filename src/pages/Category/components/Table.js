import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Pagination, Search } from "./DataTable";
import Axios from 'axios';
import {Auth} from '../../../utils/auth';

const URL_STRING = '/v1/product/categories';

const DataTable = () => {
    const [comments, setComments] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });

    const ITEMS_PER_PAGE = 50;

    const headers = [
        { name: "No#", field: "id", sortable: false },
        { name: "Judul Kategori", field: "name", sortable: true },
        { name: "Gambar", field: "email", sortable: true },
        { name: "Kategori", field: "name", sortable: false },
        { name: "Aksi", field: "body", sortable: false }
    ];

    useEffect(() => {
        const getData = () => {
            let config = {
                headers: {
                    Authorization: `Bearer ${Auth()}`,
                    'Access-Control-Allow-Origin': '*',
                }
            }
            Axios.get(URL_STRING, config)
                .then(json => {
                    setComments(json.data.data);
                    
                })
        };

        getData();
    }, []);

    const commentsData = useMemo(() => {
        let computedComments = comments;

        if (search) {
            computedComments = computedComments.filter(
                comment =>
                    comment.name.toLowerCase().includes(search.toLowerCase()) ||
                    comment.slug.toLowerCase().includes(search.toLowerCase())
            );
        }

        setTotalItems(computedComments.length);

        //Sorting comments
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedComments = computedComments.sort(
                (a, b) =>
                    reversed * a[sorting.field].localeCompare(b[sorting.field])
            );
        }

        //Current Page slice
        return computedComments.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );
    }, [comments, currentPage, search, sorting]);

    return (
        <>

            <div className="row w-100">
                <div className="col mb-3 col-12 text-center">
                    <div className="row">
                        <div className="col-md-6">
                            <Pagination
                                total={totalItems}
                                itemsPerPage={ITEMS_PER_PAGE}
                                currentPage={currentPage}
                                onPageChange={page => setCurrentPage(page)}
                            />
                        </div>
                        <div className="col-md-6 d-flex flex-row-reverse">
                            <Search
                                onSearch={value => {
                                    setSearch(value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>

                    <table className="table table-striped">
                        <TableHeader
                            headers={headers}
                            onSorting={(field, order) =>
                                setSorting({ field, order })
                            }
                        />
                        <tbody>
                            {commentsData.map(comment => (
                                <tr>
                                    <th scope="row" key={comment.id}>
                                        {comment.id}
                                    </th>
                                    <td>{comment.name}</td>
                                    <td>{comment.email}</td>
                                    <td>{comment.name}</td>
                                    <div style={{flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}> 
                                    <button type="button" style={{width: 80, marginTop: 10}} class="btn btn-block btn-success ">Lihat</button>
                                    <button type="button" style={{width: 80}} class="btn btn-block btn-success ">Ubah</button>
                                    <button type="button" style={{width: 80}} class="btn btn-block btn-danger ">Hapus</button>
                                    </div>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default DataTable;