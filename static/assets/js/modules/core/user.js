

$(function () {

if(language == 'en'){
    url='/static/assets/libs/datatables/language/en.json'
}else {
    url='/static/assets/libs/datatables/language/es.json'
}
    $('#user_list').DataTable({
        language: {
            url: url,
        },
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
            {"data": "full_name"},
            {"data": "username"},
            {"data": "email"},
            {"data": "email"},
            // {
            //
            //     data: "modules", name: 'modules',
            //     class: 'text-justify',
            //     orderable: false,
            //     render: function (data, type, row) {
            //         var html = '';
            //
            //         $.each(row.modules, function (key, value) {
            //             //  console.log(row.groups)
            //             //console.log(value.name)
            //             html += '<span class="badge badge-label bg-dark">' + value.name + '</span> ';
            //         });
            //         //console.log(html)
            //         return html;
            //     }
            // },
            {

                data: "groups", name: 'groups',
                class: 'text-justify',
                orderable: false,
                render: function (data, type, row) {
                    var html = '';

                    $.each(row.groups, function (key, value) {
                        //  console.log(row.groups)
                        //console.log(value.name)
                        html += '<span class="badge badge-label bg-secondary">' + value.name + '</span> ';
                    });
                    //console.log(html)
                    return html;
                }
            },
            {"data": "last_login"},
            {
                data: "id", name: 'id',
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {

                    var buttons = '<a href="/user/update/' + row.id + '/"><button type="button" class="btn btn-sm btn-warning"><span class="bx bx-edit"></span></button></a> <span></span> <button type="button" class="btn btn-sm btn-danger btn-delete"><span class="bx bx-trash"></span></button>';


                    return buttons;
                }

            },
        ],

    });


});