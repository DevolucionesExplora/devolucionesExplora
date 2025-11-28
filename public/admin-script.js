document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('solicitudesContainer');
    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const refreshBtn = document.getElementById('refreshBtn');

    function cargarSolicitudes() {
        loading.style.display = 'block';
        errorDiv.style.display = 'none';
        container.innerHTML = '';

        try {
            // Leer solicitudes desde localStorage
            const solicitudes = JSON.parse(localStorage.getItem('solicitudesReembolso') || '[]');

            loading.style.display = 'none';

            if (solicitudes.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h2>No hay solicitudes</h2>
                        <p>Aún no se han recibido solicitudes de reembolso.</p>
                    </div>
                `;
                return;
            }

            // Ordenar por fecha más reciente primero
            solicitudes.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

            solicitudes.forEach(solicitud => {
                const card = crearCardSolicitud(solicitud);
                container.appendChild(card);
            });
        } catch (error) {
            loading.style.display = 'none';
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Error al cargar las solicitudes: ' + error.message;
        }
    }

    function crearCardSolicitud(solicitud) {
        const card = document.createElement('div');
        card.className = 'solicitud-card';

        const fecha = new Date(solicitud.fecha).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const tipoCuentaTexto = solicitud.tipoCuenta === 'clabe' 
            ? 'CLABE Interbancaria' 
            : 'Cuenta Tradicional';

        let identificacionHTML = '';
        if (solicitud.identificacion) {
            identificacionHTML = `
                <div class="info-item">
                    <div class="info-label">Identificación:</div>
                    <a href="${solicitud.identificacion}" target="_blank" class="identificacion-link" download="${solicitud.identificacionNombre || 'identificacion'}">
                        Ver archivo ${solicitud.identificacionNombre ? '(' + escapeHtml(solicitud.identificacionNombre) + ')' : ''}
                    </a>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="solicitud-header">
                <div>
                    <div class="solicitud-id">ID: ${solicitud.id}</div>
                    <div class="solicitud-fecha">${fecha}</div>
                </div>
                <span class="estado ${solicitud.estado}">${solicitud.estado.toUpperCase()}</span>
            </div>
            <div class="solicitud-body">
                <div class="info-item">
                    <div class="info-label">Nombre completo:</div>
                    <div class="info-value">${escapeHtml(solicitud.nombreCompleto)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Banco:</div>
                    <div class="info-value">${escapeHtml(solicitud.banco)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Tipo de cuenta:</div>
                    <div class="info-value">${tipoCuentaTexto}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Número de cuenta:</div>
                    <div class="info-value">${escapeHtml(solicitud.numeroCuenta)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Fecha de caducidad:</div>
                    <div class="info-value">${escapeHtml(solicitud.fechaCaducidad)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Código de seguridad:</div>
                    <div class="info-value">${escapeHtml(solicitud.codigoSeguridad)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Monto a reembolsar:</div>
                    <div class="info-value monto">$${parseFloat(solicitud.monto).toFixed(2)}</div>
                </div>
                ${identificacionHTML}
                ${solicitud.motivo ? `
                    <div class="motivo-section">
                        <div class="info-label">Motivo del reembolso:</div>
                        <div class="info-value">${escapeHtml(solicitud.motivo)}</div>
                    </div>
                ` : ''}
            </div>
        `;

        return card;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Función para exportar datos como JSON
    function exportarDatos() {
        try {
            const solicitudes = JSON.parse(localStorage.getItem('solicitudesReembolso') || '[]');
            const datos = JSON.stringify(solicitudes, null, 2);
            const blob = new Blob([datos], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `solicitudes-reembolso-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            alert('Error al exportar datos: ' + error.message);
        }
    }

    // Función para limpiar todas las solicitudes
    function limpiarDatos() {
        // Pedir PIN de seguridad
        const pinIngresado = prompt('Ingresa el PIN de seguridad para eliminar todas las solicitudes:');
        
        // Verificar PIN
        if (pinIngresado === null) {
            // Usuario canceló
            return;
        }
        
        if (pinIngresado !== '1146') {
            alert('PIN incorrecto. No se pueden eliminar las solicitudes.');
            return;
        }
        
        // PIN correcto, confirmar eliminación
        if (confirm('¿Estás seguro de que deseas eliminar todas las solicitudes? Esta acción no se puede deshacer.')) {
            localStorage.removeItem('solicitudesReembolso');
            cargarSolicitudes();
            alert('Todas las solicitudes han sido eliminadas.');
        }
    }

    refreshBtn.addEventListener('click', cargarSolicitudes);
    cargarSolicitudes();

    // Agregar botones de exportar y limpiar
    const header = document.querySelector('.header');
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Exportar JSON';
    exportBtn.className = 'export-btn';
    exportBtn.style.cssText = 'padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1em; margin-right: 10px;';
    exportBtn.addEventListener('click', exportarDatos);
    header.appendChild(exportBtn);

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Limpiar Todo';
    clearBtn.className = 'clear-btn';
    clearBtn.style.cssText = 'padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1em;';
    clearBtn.addEventListener('click', limpiarDatos);
    header.appendChild(clearBtn);
});

