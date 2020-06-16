$(function () {
    
    $("#example1").DataTable({
      "responsive": true,
     
      "autoWidth": false,
      language: {
        emptyTable: " ", // 
        loadingRecords: "Please wait .. ", // default Loading...
        zeroRecords: " "
       }
       
    });
    $('#example2').DataTable({
      "paging": true,
      "lengthChange": false,
      "searching": false,
      "ordering": true,
      "info": true,
      "autoWidth": false,
      "responsive": true,
    });
  });