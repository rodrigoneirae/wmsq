$(function () {
    // var currentHash = window.location.hash;
    // console.log(currentHash)
    // if (currentHash === "#tab-permiso") {
    //
    //     $('a[href="#tab-permiso"]').tab('show');
    //
    // }

       $('#language').select2({
        theme: "bootstrap-5",
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
    });


})

$('#basic-form').validate({
    rules: {

        first_name: {
            required: true,
            maxlength: 150
        },
        last_name: {
            required: true,
            maxlength: 150
        },
        email: {
            email: true,
            required: true,
            maxlength: 254
        },
        password: {
            required: true,
        },


    },
    messages: {

        first_name: {
            required: "Por favor ingresa el nombre del usuario",
            maxlength: "El nombre no puede tener más de 100 caracteres"
        },
        first_name: {
            required: "Por favor ingresa el apellido del usuario",
            maxlength: "El apellido no puede tener más de 150 caracteres"
        },
        email: {
            email: "Por favor ingresa un correo electrónico válido",
            required: "Por favor ingresa un correo",
            maxlength: "El correo electrónico no puede tener más de 254 caracteres"
        },
        password: {
            required: "Por favor ingresar una password",
        },
    },
    errorPlacement: function (error, element) {
        error.addClass('invalid-feedback');
        element.closest('.form-control').addClass('is-invalid');
        error.insertAfter(element);
    },

});

$("#basic-form").submit(function (e) {
    e.preventDefault();
    if ($(this).valid()) {
        // Si el formulario es válido, enviar por Ajax
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'data-user',
                'data': JSON.stringify($(this).serializeArray()),


            }, dataSrc: "",
            headers: {
                'X-CSRFToken': csrftoken
            },


            success: function (response) {


                window.location.href = response
            },
            error: function () {


                window.location.href = response
            }
        });
    }
});

$('.status').click(function () {

    ids = $(this).attr('id').split('-')


    if ($(this).prop("checked")) {

        estado = 1
    } else {
        estado = 0
    }


    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            'action': 'modulo',
            'id_usuario': ids[0],
            'id_modulo': ids[1],
            'estado': estado,


        }, dataSrc: "",
        headers: {
            'X-CSRFToken': csrftoken
        },
        success: function (response) {

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Acceso modulo ' + response,
                showConfirmButton: false,
                timer: 3000
            })


        }


    })

})

$(".add-perfil").click(function () {
    $('#modal-title-perfil').text('Nuevo Perfil para ' + this.id)
    $('#modulo').val(this.id)
});


$('#gruop-form').validate({
    rules: {

        name: {
            required: true,
            maxlength: 50
        },


    },
    messages: {
        name: {
            required: "Por favor ingresa un nombre de Perfil",
            maxlength: "El nombre no puede tener más de 50 caracteres"
        },


    },
    errorPlacement: function (error, element) {
        error.addClass('invalid-feedback');
        element.closest('.form-control').addClass('is-invalid');
        error.insertAfter(element);
    },

});

$("#gruop-form").submit(function (e) {
    e.preventDefault();
    if ($(this).valid()) {
        // Si el formulario es válido, enviar por Ajax
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'submit-gruop',
                'data': JSON.stringify($(this).serializeArray()),


            }, dataSrc: "",
            headers: {
                'X-CSRFToken': csrftoken
            },


            success: function (response) {

                window.location.reload(true);
            },
            error: function () {

                window.location.reload(true);
            }
        });
    }
});

$(".config-perfil").click(function () {

    console.log(this.id)

    $('#modal-title-config-perfil').text('Configuración perfil:  ' + this.id)
    $('#modulo_grupo').val(this.id)


    ids = $(this).attr('id').split('-')

    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            'action': 'submit-config-gruop',
            'id_modulo': ids[0],
            'id_grupo': ids[1],


        }, dataSrc: "",
        headers: {
            'X-CSRFToken': csrftoken
        },


        success: function (response) {
            $('#inputs-permisos').empty()
            for (var i = 0; i < response.length; i++) {

                if (response[i].estado) {

                    s = 'checked = ""'
                } else {
                    s = ''
                }


                $('#inputs-permisos').append('<div class="form-check form-switch mb-3">\n' +
                    '                                                        <input name="' + response[i].codename + '" class="form-check-input" ' + s + ' type="checkbox" role="switch" id="' + response[i].codename + '-' + ids[1] + '" >\n' +
                    '                                                        <label class="form-check-label" for="' + response[i].codename + '">' + response[i].nombre + '</label>\n' +
                    '                                                    </div>');
            }

            // $('.agregarpermiso').click(function () {
            //
            //     ids = $(this).attr('id').split('-')
            //     estado = 0
            //
            //     if ($(this).is(":checked")) {
            //         estado = 1
            //
            //     }
            //
            //     $.ajax({
            //         url: window.location.pathname,
            //         type: 'POST',
            //         data: {
            //             'action': 'submit-gruop-perimission',
            //             'permission': ids[0],
            //             'grupo': ids[1],
            //             'estado': estado,
            //
            //
            //         }, dataSrc: "",
            //         headers: {
            //             'X-CSRFToken': csrftoken
            //         },
            //
            //
            //         success: function (response) {
            //
            //             //window.location.reload(true);
            //         },
            //         error: function () {
            //
            //             //window.location.reload(true);
            //         }
            //     });
            //
            //
            // });
        },
        error: function () {

            //window.location.reload(true);
        }
    });


});

$("#modulo-gruop-form").submit(function (e) {
    e.preventDefault();
    if ($(this).valid()) {
        // Si el formulario es válido, enviar por Ajax
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'submit-gruop-perimission',
                'data': JSON.stringify($(this).serializeArray()),


            }, dataSrc: "",
            headers: {
                'X-CSRFToken': csrftoken
            },


            success: function (response) {

                window.location.href = window.location.pathname + '#tab-permiso';
                window.location.reload(true);
            },
            error: function () {

                window.location.reload(true);
            }
        });
    }
});