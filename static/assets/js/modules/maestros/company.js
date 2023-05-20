function cardaData() {

    if(language == 'en'){
    url='/static/assets/libs/datatables/language/en.json'
}else {
    url='/static/assets/libs/datatables/language/es.json'
}


    company = $('#company_list').DataTable({
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
                'action': 'company'
            },
            dataSrc: "",
            headers: {
                'X-CSRFToken': csrftoken
            }
        },
        columns: [
            {"data": "id"},
            {"data": "rut"},
            {"data": "name"},
            {"data": "gnl"},
            {"data": "address1"},
            {"data": "phone"},
            {"data": "email"},
            {
                data: "id", name: 'id',
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {

                    var buttons = '<button type="button" class="btn btn-sm btn-warning btn-edit-company"><span class="bx bx-edit"></span></button><span></span> <button type="button" class="btn btn-sm btn-danger btn-delete-company"><span class="bx bx-trash"></span></button>';


                    return buttons;
                }

            },

        ],

        initComplete: function (settings, json) {

        }
    });
}


$(function () {
    cardaData()

    $('#country').select2({
        theme: "bootstrap-5",
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        placeholder: '',
        dropdownParent: $('#new_company'),
    })
    $('#state').select2({
        theme: "bootstrap-5",
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        placeholder: '',
        disabled: true,
        dropdownParent: $('#new_company'),
    })
    $('#city').select2({
        theme: "bootstrap-5",
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        placeholder: '',
        disabled: true,
        dropdownParent: $('#new_company'),
    })


    $('#company-form').validate({
        rules: {
            rut: {
                required: true,
                maxlength: 20
            },
            name: {
                required: true,
                maxlength: 100
            },
            name_short: {
                required: true,
                maxlength: 20
            },
            name_fantasy: {
                maxlength: 100
            },
            gnl: {
                maxlength: 60
            },
            country: {
                required: true,
            },
            state: {
                required: true,
            },
            city: {
                required: true,
            },
            address1: {
                required: true,
                maxlength: 150
            },
            address2: {
                maxlength: 150
            },
            phone: {
                maxlength: 20
            },
            celphone: {
                maxlength: 20
            },
            email: {
                email: true,
                maxlength: 254
            }
        },
        messages: {
            rut: {
                required: "Por favor ingresa un Identificador Triubutario",
                maxlength: "El nombre no puede tener más de 20 caracteres"
            },
            name: {
                required: "Por favor ingresa un nombre",
                maxlength: "El nombre no puede tener más de 100 caracteres"
            },
            name_short: {
                required: "Por favor ingresa un nombre corto",
                maxlength: "El nombre corto no puede tener más de 20 caracteres"
            },
            name_fantasy: {
                maxlength: "El nombre fantasia no puede tener más de 100 caracteres"
            },
            gnl: {
                maxlength: "El GNL no puede tener más de 60 caracteres"
            },
            country: {
                required: "Por favor selecciona un Pais",
                // maxlength: "El nombre corto no puede tener más de 20 caracteres"
            },
            state: {
                required: "Por favor seleciona una Región",
                // maxlength: "El nombre corto no puede tener más de 20 caracteres"
            },
            city: {
                required: "Por favor selecciona una Comuna",
                // maxlength: "El nombre corto no puede tener más de 20 caracteres"
            },
            address1: {
                required: "Por favor ingresa una dirección",
                maxlength: "La dirección no puede tener más de 150 caracteres"
            },
            address2: {
                maxlength: "La dirección 2 no puede tener más de 150 caracteres"
            },
            phone: {
                maxlength: "El teléfono no puede tener más de 20 caracteres"
            },
            celphone: {
                maxlength: "El celular no puede tener más de 20 caracteres"
            },
            email: {
                email: "Por favor ingresa un correo electrónico válido",
                maxlength: "El correo electrónico no puede tener más de 254 caracteres"
            }
        },
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-control').addClass('is-invalid');
            error.insertAfter(element);
        },

    });

    $("#company-form").submit(function (e) {
        e.preventDefault();
        console.log('agag')
        if ($(this).valid()) {
            // Si el formulario es válido, enviar por Ajax
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'submit-company',
                    'data': JSON.stringify($(this).serializeArray()),


                }, dataSrc: "",
                headers: {
                    'X-CSRFToken': csrftoken
                },


                success: function (response) {
                    location.reload(true);
                },
                error: function () {
                   location.reload(true);
                }
            });
        }
    });


    $('#country').on('select2:select', function (e) {
        var data = e.params.data;
        $('#state').select2({
            ajax: {
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'state',
                    'country': data.id,
                },
                dataSrc: "",
                headers: {
                    'X-CSRFToken': csrftoken
                },
                processResults: function (data) {
                    console.log(data)
                    return {
                        results: $.map(data, function (obj) {
                            return {id: obj.tab_texto1 + '-' + obj.tab_codigo, text: obj.tab_desc};
                        })
                    };
                }
            },


            theme: "bootstrap-5",
            width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
            placeholder: '',
            disabled: false,
            dropdownParent: $('#new_company'),

        }).on('select2:opening', function (e) {
            $(this).val(null).trigger('change');
            $('#city').select2().val(null).trigger('change');
            $('#city').select2({
                theme: "bootstrap-5",
                width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
                placeholder: '',
                disabled: true,
                dropdownParent: $('#new_company'),
            })
        });

    }).on('select2:opening', function (e) {

        $(this).val(null).trigger('change');
        $('#state').select2().val(null).trigger('change');
        $('#city').select2().val(null).trigger('change');

        $('#state').select2({
            theme: "bootstrap-5",
            width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
            placeholder: '',
            disabled: true,
            dropdownParent: $('#new_company'),
        })
        $('#city').select2({
            theme: "bootstrap-5",
            width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
            placeholder: '',
            disabled: true,
            dropdownParent: $('#new_company'),
        })
    });
    // state

    $('#state').on('select2:select', function (e) {

        var data = e.params.data;

        $('#city').select2({
            ajax: {
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'city',
                    'state': data.id,
                },
                dataSrc: "",
                headers: {
                    'X-CSRFToken': csrftoken
                },
                processResults: function (data) {
                    return {
                        results: $.map(data, function (obj) {
                            return {
                                id: obj.tab_texto1 + '-' + obj.tab_texto2 + '-' + obj.tab_codigo,
                                text: obj.tab_desc
                            };
                        })
                    };
                }
            },


            theme: "bootstrap-5",
            width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
            placeholder: '',
            disabled: false,
            dropdownParent: $('#new_company'),

        }).on('select2:opening', function (e) {
            $(this).val(null).trigger('change');
        });


    })

});


$('#company_list').on('click', 'button.btn-delete-company', function (e) {
var data = company.row($(this).parents('tr')).data();
    console.log(data)
Swal.fire({
    toast: true,
    position: 'top',
    html: '<div class="mt-1 text-center">' +
        '<lord-icon src="https://cdn.lordicon.com/gsqxdxog.json" trigger="loop" colors="primary:#f7b84b,secondary:#f06548" style="width:70px;height:70px"></lord-icon>' +
        '<div class="mt-1 pt-1 fs-15">' +
        '<h4>Esta seguro ?</h4>' +
        '<p class="text-muted mx-1 mb-0">Esta operación no puede volver atras!</p>' +
        '</div>' +
        '</div>',
    showCancelButton: true,
    confirmButtonText: 'Si, Eliminar!',
    customClass: {
        confirmButton: "btn btn-primary w-xs me-2 mb-1",
        cancelButton: "btn btn-danger w-xs mb-1"
    },
    buttonsStyling: false
}).then((result) => {
    if (result.isConfirmed) {

        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'submit-delete',
                'id': data.id,


            }, dataSrc: "",
            headers: {
                'X-CSRFToken': csrftoken
            },


            success: function (response) {
                location.reload(true);
            },
            error: function () {
                location.reload(true);
            }
        });
    }
});

})
$('#company_list').on('click', 'button.btn-edit-company', function (e) {

    $('#state').select2({

        theme: "bootstrap-5",
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        placeholder: '',
        disabled: false,
        dropdownParent: $('#new_company'),

    }).on('select2:opening', function (e) {
        $(this).val(null).trigger('change');
        $('#city').select2().val(null).trigger('change');
        $('#city').select2({
            theme: "bootstrap-5",
            width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
            placeholder: '',
            disabled: true,
            dropdownParent: $('#new_company'),
        })
    });

    $('#city').select2({
        theme: "bootstrap-5",
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        placeholder: '',
        disabled: false,
        dropdownParent: $('#new_company'),
    })

    var data = company.row($(this).parents('tr')).data();
    console.log(data)

    $('#edit').val(1)
    $('#rut').val(data.rut).prop("readonly", true)
    $('#name').val(data.name)
    $('#name_short').val(data.name_short)
    $('#name_fantasy').val(data.name_fantasy)
    $('#gnl').val(data.gnl)
    $('#address1').val(data.address1)
    $('#address2').val(data.address2)
    $('#email').val(data.email)
    $('#country').val(1).trigger('change')
    $('#state').val(data.state.tab_texto1 + '-' + data.state.tab_codigo).trigger('change')
    console.log(data.state.tab_texto1 + '-' + data.state.tab_texto2 + '-' + data.state.tab_codigo)
    $('#city').val(data.city.tab_texto1 + '-' + data.city.tab_texto2 + '-' + data.city.tab_codigo).trigger('change')
    $('#phone').val(data.phone)
    $('#celphone').val(data.celphone)

    $('#new_company').modal('show');


})


