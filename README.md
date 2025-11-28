# Sistema de Solicitud de Reembolso

Sistema web para gestionar solicitudes de reembolso con almacenamiento local en el navegador (localStorage). **No requiere servidor ni Node.js**.

## Uso

1. Abre el archivo `public/index.html` en tu navegador
   - Puedes hacer doble clic en el archivo
   - O arrastrarlo a tu navegador
   - O usar: Archivo → Abrir → Seleccionar `index.html`

2. Para ver las solicitudes guardadas:
   - Abre `public/admin.html` en tu navegador
   - O haz clic en el enlace "Ver solicitudes guardadas" en el formulario

## Características

- ✅ Formulario completo con validación en tiempo real
- ✅ Almacenamiento de datos en archivo JSON local
- ✅ Subida de archivos de identificación (imágenes y PDF)
- ✅ Panel de administración para ver todas las solicitudes
- ✅ Interfaz moderna y responsive
- ✅ Validación de formato para CLABE (18 dígitos)
- ✅ Formato automático para fecha de caducidad

## Datos que se solicitan

1. **Nombre completo del titular** (requerido)
2. **Banco** (requerido)
3. **Tipo de cuenta** (requerido): Tradicional o CLABE interbancaria
4. **Número de cuenta** (requerido)
5. **Fecha de caducidad** (requerido): Formato MM/AA
6. **Código de seguridad** (requerido): 3 dígitos de la tarjeta
7. **Monto a reembolsar** (requerido)
8. **Motivo del reembolso** (opcional)
9. **Identificación oficial** (opcional): JPG, PNG o PDF

## Características adicionales

- ✅ **Exportar datos**: Botón en el panel de administración para descargar todas las solicitudes como archivo JSON
- ✅ **Limpiar datos**: Opción para eliminar todas las solicitudes guardadas
- ✅ **Sin servidor**: Todo funciona directamente en el navegador
- ✅ **Datos persistentes**: Los datos se guardan en localStorage del navegador

## Archivos importantes

- Los datos se guardan en **localStorage** del navegador
- Los archivos de identificación se convierten a base64 y se guardan junto con los datos
- Puedes exportar todos los datos como JSON desde el panel de administración

## Notas importantes

⚠️ **Almacenamiento**: 
- Los datos se guardan en el navegador donde se completan los formularios
- Si limpias los datos del navegador, se perderán las solicitudes
- **Recomendación**: Exporta los datos regularmente usando el botón "Exportar JSON" en el panel de administración

⚠️ **Privacidad**: 
- Los datos solo se guardan localmente en tu navegador
- Nadie más puede acceder a ellos a menos que tengan acceso físico a tu computadora
- Los archivos exportados contienen toda la información, guárdalos de forma segura

