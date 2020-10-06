import jsPDF from "jspdf";
import "jspdf-autotable";
import JsBarcode from "jsbarcode";
// Date Fns is used to format the dates we receive
// from our API call
import { format } from "date-fns";
function textToBase64Barcode(text) {
  var canvas = document.createElement("canvas");
  JsBarcode(canvas, text, { format: "CODE39" });
  return canvas.toDataURL("image/png");
}
// define a generatePDF function that accepts a tickets argument
const generatePDF = async (product, city) => {
  // initialize jsPDF
  const doc = new jsPDF();
  const options = { pagesplit: true, maxWidth: 100 };
  // define the columns we want and their titles
  const tableColumn = [
    "No.",
    "Nama Lengkap",
    "Alamat Pengiriman",
    "Poduk yang Dipesan",
    "Spesifikasi Produk (warna, size, dll)",
    "Harga Barang Total",
    "Supplier",
    "Alamat Supplier",
  ];
  // define an empty array of rows
  const tableRows = [];

  // // for each ticket pass all its data into an array
  // const ticketData = [
  //   product.id,
  //   product.customer ? product.customer.fullname : "-",
  //   product.delivery.receiver_address,
  //   product[0].metadata_products,
  //   "-",
  //   "-",
  //   // called date-fns to format the date on the product
  //   //format(new Date(product.updated_at), "yyyy-MM-dd")
  // ];
  // // push each tickcet's info into a row
  // tableRows.push(ticketData);

  console.log(textToBase64Barcode("test"));
  let img = new Image();
  img.src =
    "https://www.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png";
  // startY is basically margin-top
  //doc.autoTable(tableColumn, tableRows, { startY: 20 });
  const date = Date().split(" ");
  // we use a date string to generate our filename.
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
  // ticket title. and margin-top + margin-left
  // doc.setFont("helvetica", "bold");
  // doc.text("Nomor Pesanan :", 20, 20);

  // doc.setFont("helvetica", "regular");
  // doc.text(product.invoice, 20, 30);

  // doc.setFont("helvetica", "bold");
  // doc.text("Alamat Pengiriman :", 20, 60);

  // doc.setFont("helvetica", "regular");
  // doc.text(product.delivery.receiver_address, 20, 70, options);

  // doc.setFont("helvetica", "bold");
  // doc.text("Produk yang dipesan :", 20, 100);

  doc.addImage(
    textToBase64Barcode(product.delivery.tracking_id),
    "PNG",
    70,
    20,
    70,
    30
  );
  doc.addImage(
    "https://scontent-sin6-1.cdninstagram.com/v/t51.2885-19/s150x150/58978615_178542163097844_408159929073926144_n.jpg?_nc_ht=scontent-sin6-1.cdninstagram.com&_nc_cat=100&_nc_ohc=yd2J-s-ORO4AX85DK2J&oh=42f36ea62e20cd4195673457db06dc91&oe=5FA21C33",
    "JPG",
    10,
    20,
    30,
    30
  );
  doc.addImage(product.delivery.courier.image_url, "JPG", 150, 20, 50, 30);
  doc.setFont("helvetica", "regular");
  doc.setFontSize(14);
  doc.text("Kota Asal :", 10, 60);

  doc.setFont("helvetica", "regular");
  doc.setFontSize(14);
  doc.text(product.sender.city, 50, 60, {
    maxWidth: 150,
    textAlign: "left",
    align: "justify",
  });

  doc.setFont("helvetica", "regular");
  doc.setFontSize(14);
  doc.text("Kota Tujuan :", 100, 60);

  doc.setFont("helvetica", "regular");
  doc.setFontSize(14);
  doc.text(`${city.type} ${city.city_name}`, 140, 60, {
    maxWidth: 150,
    textAlign: "left",
    align: "justify",
  });

  doc.setFont("helvetica", "regular");
  doc.setFontSize(14);
  doc.text("Jasa Kirim :", 10, 70);

  doc.setFont("helvetica", "regular");
  doc.setFontSize(14);
  doc.text(
    `${product.delivery.courier.name} ${product.delivery.package_courier}`,
    50,
    70
  );

  doc.setFont("helvetica", "regular");
  doc.setFontSize(14);
  doc.text("No. Invoice :", 10, 80);

  doc.setFont("helvetica", "regular");
  doc.setFontSize(14);
  doc.text(product.invoice, 50, 80);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Pengirim :", 10, 90);

  doc.setFont("helvetica", "regular");
  doc.setFontSize(13);
  doc.text("Nama :", 10, 100);

  doc.setFont("helvetica", "regular");
  doc.setFontSize(13);
  doc.text(product.seller.fullname, 30, 100);

  doc.setFont("helvetica", "regular");
  doc.setFontSize(13);
  doc.text("Alamat :", 10, 110);

  doc.setFont("helvetica", "regular");
  doc.setFontSize(13);
  doc.text(
    `${product.sender.alamat} Kode pos: ${product.sender.post_code}`,
    30,
    110,
    {
      maxWidth: 150,
      textAlign: "left",
      align: "justify",
    }
  );

  doc.setFont("helvetica", "regular");
  doc.setFontSize(13);
  doc.text("Kota :", 10, 120);

  doc.setFont("helvetica", "regular");
  doc.setFontSize(13);
  doc.text(product.sender.city, 30, 120, {
    maxWidth: 150,
    textAlign: "left",
    align: "justify",
  });

  doc.setFont("helvetica", "regular");
  doc.setFontSize(13);
  doc.text("Tlp :", 10, 130);

  doc.setFont("helvetica", "regular");
  doc.setFontSize(13);
  doc.text(product.sender.phone, 30, 130, {
    maxWidth: 150,
    textAlign: "left",
    align: "justify",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Penerima :", 100, 90);

  doc.setFont("helvetica", "regular");
  doc.setFontSize(13);
  doc.text("Nama :", 100, 100);

  doc.setFont("helvetica", "regular");
  doc.setFontSize(13);
  doc.text(product.customer.fullname, 120, 100);

  doc.setFont("helvetica", "regular");
  doc.setFontSize(13);
  doc.text("Alamat :", 100, 110);

  doc.setFont("helvetica", "regular");
  doc.setFontSize(13);
  doc.text(product.delivery.receiver_address, 120, 110, {
    maxWidth: 100,
    textAlign: "left",
    align: "justify",
  });

  doc.setFont("helvetica", "regular");
  doc.setFontSize(13);
  doc.text("Kota :", 100, 120);

  doc.setFont("helvetica", "regular");
  doc.setFontSize(13);
  doc.text(`${city.type} ${city.city_name}`, 120, 120, {
    maxWidth: 150,
    textAlign: "left",
    align: "justify",
  });

  doc.setFont("helvetica", "regular");
  doc.setFontSize(13);
  doc.text("Tlp :", 100, 130);

  doc.setFont("helvetica", "regular");
  doc.setFontSize(13);
  doc.text(product.customer.phone, 120, 130, {
    maxWidth: 150,
    textAlign: "left",
    align: "justify",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Total Harga :", 10, 140);

  const total =
    (await product.details[0].benefit) +
    product.details[0].commission +
    product.details[0].custom_commission +
    product.delivery.sipping_cost +
    product.details[0].price * product.details[0].qty;

  doc.setFont("helvetica", "regular");
  doc.setFontSize(13);
  doc.text(`Rp. ${total.toString()}`, 10, 150, {
    maxWidth: 150,
    textAlign: "left",
    align: "justify",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Estimasi Ongkos Kirim :", 100, 140);

  doc.setFont("helvetica", "regular");
  doc.setFontSize(10);
  doc.text(
    `Rp. ${product.delivery.sipping_cost.toString()} (Total Berat: ${
      product.details[0].product.weight
    } gram)`,
    150,
    140,
    {
      maxWidth: 150,
      textAlign: "left",
      align: "justify",
    }
  );

  // we define the name of our PDF file.
  doc.save(`resi_${product.customer.fullname}_${dateStr}.pdf`);
};

export default generatePDF;
