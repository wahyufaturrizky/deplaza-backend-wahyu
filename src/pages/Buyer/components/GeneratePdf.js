import jsPDF from "jspdf";
import "jspdf-autotable";
// Date Fns is used to format the dates we receive
// from our API call
import { format } from "date-fns";

// define a generatePDF function that accepts a tickets argument
const generatePDF = product => {
  // initialize jsPDF
  const doc = new jsPDF();

  // define the columns we want and their titles
  const tableColumn = ["No.", "Nama Lengkap", "Alamat Pengiriman", "Poduk yang Dipesan", "Spesifikasi Produk (warna, size, dll)", "Harga Barang Total", "Supplier", "Alamat Supplier"];
  // define an empty array of rows
  const tableRows = [];

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
      variation = JSON.parse(product.variationTest);
      objKey = Object.keys(variation)
      key2 = Object.keys(variation[0])
      key3 = Object.keys(variation[1])
      key4 = Object.keys(variation[2])
      //  variationOne = `${variation}`
      variationOne = `${objKey[0] && Object.keys(variation[0])}: ${variation[0] && variation[0][key2]}`
      variationTwo = `${objKey[1] && Object.keys(variation[1])}: ${variation[1] && variation[1][key3]}`
      variationThree = `${objKey[2] && Object.keys(variation[2])}: ${variation[2] && variation[2][key4]}`
  }
  catch (e) {
      // forget about it :)
  }
  // for each ticket pass all its data into an array
    const ticketData = [
      product.id,
      product.customer ? product.customer.fullname : '-',
      product.delivery.receiver_address,
      product[0].metadata_products,
      `${objKey[0] === undefined ? null : Object.keys(variation[0])}: ${variation[0] && variation[0][key2]}${'\n'}${objKey[1] === undefined ? null : Object.keys(variation[1])}: ${variation[1] && variation[1][key3]}${'\n'}${objKey[2] === undefined ? null : Object.keys(variation[2])}: ${variation[2] && variation[2][key4]}`,
       product.total_price,
      '-',
      '-',
      // called date-fns to format the date on the product
      //format(new Date(product.updated_at), "yyyy-MM-dd")
    ];
    // push each tickcet's info into a row
    tableRows.push(ticketData);


  // startY is basically margin-top
  doc.autoTable(tableColumn, tableRows, { startY: 20 });
  const date = Date().split(" ");
  // we use a date string to generate our filename.
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
  // ticket title. and margin-top + margin-left
  doc.text("Data Pembeli.", 14, 15);
  // we define the name of our PDF file.
  doc.save(`report_${product.customer.fullname}_${dateStr}.pdf`);
};

export default generatePDF;