// Datos que se guardan del último envío para poder descargarlos en PDF (sin la contraseña)
export interface DatosRegistro {
  nombre: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
}

// Genera un PDF con los datos del registro y lo descarga (punto 8)
export async function descargarRegistroPdf(datos: DatosRegistro, titulo = 'Registro de Usuario'): Promise<void> {
  // jsPDF se carga solo al pulsar el botón, para no hacer más pesada la página
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF();
  const [anio, mes, dia] = datos.fechaNacimiento.split('-');

  pdf.setFontSize(18);
  pdf.text(titulo, 20, 25);
  pdf.setFontSize(10);
  pdf.text(`Enviado el ${new Date().toLocaleString('es-ES')}`, 20, 33);

  const filas: [string, string][] = [
    ['Nombre completo', datos.nombre],
    ['Correo electrónico', datos.email],
    ['Teléfono', datos.telefono],
    ['Fecha de nacimiento', `${dia}/${mes}/${anio}`],
    ['Contraseña', '******** (no se incluye por seguridad)'],
  ];
  pdf.setFontSize(12);
  filas.forEach(([campo, valor], i) => {
    const y = 50 + i * 12;
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${campo}:`, 20, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(valor, 70, y);
  });

  pdf.save(`registro-${datos.nombre.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}
