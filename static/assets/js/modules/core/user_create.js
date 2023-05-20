var gettext = window.gettext || function (msgid) { return msgid; };

$(function () {
    $('#language').select2({
        theme: "bootstrap-5",
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
    });

    $('#basic-form').validate({
        rules: {
            username: {
                required: true,
                maxlength: 100
            },
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
            username: {
                required: gettext("Por favor ingresa un nombre de usuario."),
                maxlength: gettext("El nombre no puede tener más de 150 caracteres.")
            },
            first_name: {
                required: gettext("Por favor ingresa el nombre del usuario."),
                maxlength: gettext("El nombre no puede tener más de 100 caracteres.")
            },
            last_name: {
                required: gettext("Por favor ingresa el apellido del usuario."),
                maxlength: gettext("El apellido no puede tener más de 150 caracteres.")
            },
            email: {
                email: gettext("Por favor ingresa un correo electrónico válido."),
                required: gettext("Por favor ingresa un correo."),
                maxlength: gettext("El correo electrónico no puede tener más de 254 caracteres.")
            },
            password: {
                required: gettext("Por favor ingresa una contraseña."),
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
                    'action': 'submit-user',
                    'data': JSON.stringify($(this).serializeArray()),
                }, 
                dataSrc: "",
                headers: {
                    'X-CSRFToken': csrftoken
                },
                success: function (response) {
                    window.location.href=response;
                },
                error: function () {
                    window.location.href=response;
                }
            });
        }
    });
})
