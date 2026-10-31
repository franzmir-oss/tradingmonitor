# Bloqueo automático de fechas (Google Sheets)

Con esto, cada vez que un cliente reserva una fecha, se guarda en una hoja de
Google Sheets y la fecha aparece como **Agotado** para todo el mundo.

## Configuración (una sola vez, unos 5 minutos)

1. Entra en https://sheets.google.com y crea una hoja nueva, por ejemplo «Reservas Otoño».
2. En el menú: **Extensiones → Apps Script**.
3. Borra lo que haya, pega el contenido de `google-apps-script.gs` y pulsa **Guardar**.
4. Pulsa **Implementar → Nueva implementación**:
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
5. Pulsa **Implementar**, autoriza los permisos y copia la **URL de la aplicación web**
   (termina en `/exec`).
6. Abre `index.html`, busca `bookingsApi: ''` y pega la URL entre las comillas:
   `bookingsApi: 'https://script.google.com/macros/s/XXXX/exec',`

## Uso del día a día

- Cada reserva aparece como una fila nueva en la hoja «Reservas», con la fecha,
  el nombre, los apellidos, el correo, el teléfono y el día en que se hizo la reserva.
- **Para liberar una fecha** (por ejemplo, si no llega el Bizum en 24 h), borra su fila.
- Para bloquear una fecha a mano, añade una fila con la fecha en formato `2026-11-07`.

Mientras `bookingsApi` esté vacío, la página solo recuerda las reservas en el
navegador de quien reservó; las demás personas **no** las verían bloqueadas.
