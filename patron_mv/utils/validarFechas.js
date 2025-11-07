export function validarFechas(fechaInicio, fechaFin) {
  const fechaInicioObj =
    typeof fechaInicio === "string" ? new Date(fechaInicio) : fechaInicio;
  const fechaFinObj =
    typeof fechaFin === "string" ? new Date(fechaFin) : fechaFin;

  if (isNaN(fechaInicioObj.getTime()) || isNaN(fechaFinObj.getTime())) {
    return "Una o ambas fechas no son válidas";
  }
  if (fechaFinObj < fechaInicioObj) {
    return "La fecha de fin no puede ser anterior a la fecha de inicio";
  }
  console.log(fechaFinObj, "  ", fechaInicioObj);

  if (fechaFinObj.getTime() === fechaInicioObj.getTime()) {
    return "La fecha de fin no puede ser igual a la fecha de inicio";
  }
  return true;
}
