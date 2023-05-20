$(function () {
    $('#tablagenerica').select2({
        theme: "bootstrap-5",
        //width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-66') ? '66%' : 'style',
    });
    if (language == 'en') {
        url = '/static/assets/libs/datatables/language/en.json'
    } else {
        url = '/static/assets/libs/datatables/language/es.json'
    }
    $('#tg_list').DataTable({
        language: {
            url: url,
        },
    })


})

$('#tablagenerica').on('select2:select', function (e) {
    console.log('select')
    var data = e.params.data;

    $('#modal-title').text(gettext('Nuevo ') + gettext(data.text))

    //hideden form
    $('#tab_codtabla').val(data.id.split(',')[0])

    if (data.id.split(',')[1] == 'None') {
        $('#l_tab_texto1').text('ref')
        $('#l_tab_texto1').addClass('d-none');
        $('#tab_texto1').prop('disabled', true);
        $('#tab_texto1').addClass('d-none');
    } else {
        $('#l_tab_texto1').text('ref: ' + gettext(data.id.split(',')[1]))
        $('#l_tab_texto1').removeClass('d-none');
        $('#tab_texto1').prop('disabled', false);
        $('#tab_texto1').removeClass('d-none');
    }

    if (data.id.split(',')[2] == 'None') {
        $('#l_tab_texto2').text('ref')
        $('#l_tab_texto2').addClass('d-none');
        $('#tab_texto2').prop('disabled', true);
        $('#tab_texto2').addClass('d-none');

    } else {
        $('#l_tab_texto2').text('ref: ' + gettext(data.id.split(',')[2]))
        $('#l_tab_texto2').removeClass('d-none');
        $('#tab_texto2').prop('disabled', false);
        $('#tab_texto2').removeClass('d-none');
    }

    if (data.id.split(',')[3] == 'None') {
        $('#l_tab_texto3').text('ref')
        $('#l_tab_texto3').addClass('d-none');
        $('#tab_texto3').prop('disabled', true);
        $('#tab_texto3').addClass('d-none');

    } else {
        $('#l_tab_texto3').text('ref: ' + gettext(data.id.split(',')[3]))
        $('#l_tab_texto3').removeClass('d-none');
        $('#tab_texto3').prop('disabled', false);
        $('#tab_texto3').removeClass('d-none');
    }


    console.log(data)
    $('#btn-table').text(gettext('Nuevo ') + gettext(data.text))
    $('#title-table').text(gettext('Mantenedor Tabla ') + gettext(data.text))
    $('#texto1').text('ref: ' + gettext(data.id.split(',')[1]))
    $('#texto2').text(gettext(data.id.split(',')[2]))
    $('#texto3').text(gettext(data.id.split(',')[3]))

    $('#div-table').removeClass('d-none')


    tg_list = $('#tg_list').DataTable({
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
                'action': 'searchdata',
                'table_id': data.id.split(',')[0]
            },
            dataSrc: "",
            headers: {
                'X-CSRFToken': csrftoken
            }
        },
        columns: [
            {"data": "tab_codigo"},
            {"data": "tab_desc"},
            {"data": "tab_texto1"},
            {"data": "tab_texto2"},
            {"data": "tab_texto3"},
            {
                data: "id", name: 'id',
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {

                    var buttons = '<button type="button" class="btn btn-sm btn-warning btn-edit-table"><span class="bx bx-edit"></span></button> <span></span> <button type="button" class="btn btn-sm btn-danger btn-delete"><span class="bx bx-trash"></span></button>';
                    return buttons;
                }

            },
        ],

    });


}).on('select2:opening', function (e) {

    $(this).val(null).trigger('change');
    $('#div-table').addClass('d-none')
    $('#tg_list').DataTable().clear().draw();
});


$('#table-form').validate({
    rules: {
        tab_codigo: {
            required: true,
            number: true

        },
        tab_desc: {
            required: true,
            maxlength: 60
        },

    },
    messages: {
        tab_codigo: {
            required: gettext("Por favor ingresa un código"),
            number: gettext("El código ingresado no es valido.")
        },
        tab_desc: {
            required: gettext("Por favor ingresa una descripción"),
            maxlength: gettext("La descripción no puede tener más de 60 caracteres")
        },
    },
    errorPlacement: function (error, element) {
        error.addClass('invalid-feedback');
        element.closest('.form-control').addClass('is-invalid');
        error.insertAfter(element);
    },

});

$("#table-form").submit(function (e) {
    e.preventDefault();
    console.log('agag')
    if ($(this).valid()) {
        // Si el formulario es válido, enviar por Ajax
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'submit-table',
                'data': JSON.stringify($(this).serializeArray()),


            }, dataSrc: "",
            headers: {
                'X-CSRFToken': csrftoken
            },


            success: function (response) {
                //location.reload(true);
                tg_list.ajax.reload();
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: gettext('Tabla genérica guardada correctamente'),
                    showConfirmButton: false,
                    timer: 3000
                })

            },
            error: function () {
                tg_list.ajax.reload();
                //location.reload(true);
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: gettext('Error no fue posible guardar tabla genérica'),
                    showConfirmButton: false,
                    timer: 3000
                })
            }
        });

        $('#new_table').modal('hide')
        $('#tab_codigo').val('')
        $('#tab_desc').val('')
        $('#tab_texto1').val('')
        $('#tab_texto2').val('')
        $('#tab_texto3').val('')
    }
});


$('#tg_list').on('click', 'button.btn-edit-table', function (e) {
    var data = tg_list.row($(this).parents('tr')).data();
    console.log(data)
});