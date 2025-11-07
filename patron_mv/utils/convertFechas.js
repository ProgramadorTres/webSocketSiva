export function convertirAFecha(fechaString) {
  const fecha = new Date(fechaString);
  if (isNaN(fecha.getTime())) {
    return "No es una fecha valida";
  } else {
    return fecha;
  }
}
