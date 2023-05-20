$(function () {


     $('#maestro_list').DataTable({
        responsive: true,
        autoWidth: true,
        destroy: true,
        deferRender: true,
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'searchdata'
            },
            dataSrc: "",
              headers: {
                'X-CSRFToken': csrftoken
            }
        },
        columns: [
            {"data": "id"},
            {"data": "tab_codigo"},
            {"data": "tab_desc"},
            {"data": "tab_texto1"},
            {"data": "id"},
        ],
        columnDefs: [
            {
                targets: [-3],
                orderable: false,
                render: function (data, type, row) {
                    var html = '';

                    $.each(row.groups, function (key, value) {
                      //  console.log(row.groups)
                        //console.log(value.name)
                        html += '<span class="badge badge-soft-dark">' + value.name + '</span> ';
                    });
                    //console.log(html)
                    return html;
                }
            },
            {
                targets: [-2],
                class: 'text-end',
                orderable: true,

            },
            {
                targets: [-1],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    var buttons = '<a href="/user/update/' + row.id + '/" class="btn btn-warning btn-sm">Editar</a> ';;
                    return buttons;
                }
            },
        ],
        initComplete: function (settings, json) {

        }
    });
});