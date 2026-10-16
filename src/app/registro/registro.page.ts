import { Component, signal } from '@angular/core';
import { AlertController } from '@ionic/angular/lazy';
import { ThemeService } from '../services/theme.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

// Convierte el valor AAAA-MM-DD del input en una fecha en hora local (sin la hora se leería en UTC)
function leerFecha(valor: string): Date {
  return new Date(`${valor}T00:00:00`);
}

// Validador personalizado (punto 6): la fecha de nacimiento no puede ser posterior a hoy
export function fechaNoFutura(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // De esto se encarga Validators.required
    }
    const fecha = leerFecha(control.value);
    if (isNaN(fecha.getTime())) {
      return { fechaInvalida: true };
    }
    return fecha > new Date() ? { fechaFutura: true } : null;
  };
}

// Validador personalizado: el usuario debe tener la edad mínima
export function edadMinima(anios: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // De esto se encarga Validators.required
    }
    const nacimiento = leerFecha(control.value);
    const hoy = new Date();
    if (isNaN(nacimiento.getTime()) || nacimiento > hoy) {
      return null; // Estos casos los informa fechaNoFutura
    }
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad < anios ? { edadMinima: { requerida: anios, actual: edad } } : null;
  };
}

// Datos que se guardan del último envío para poder descargarlos en PDF
export interface DatosRegistro {
  nombre: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
}

@Component({
  selector: 'app-registro',
  templateUrl: 'registro.page.html',
  styleUrls: ['registro.page.scss'],
  standalone: false,
})
export class RegistroPage {
  // Definición del formulario reactivo
  public registroForm: FormGroup;

  // Signal para gestionar el estado de envío
  public isSubmitting = signal<boolean>(false);

  // Último registro enviado (null hasta el primer envío): activa el botón de descarga
  public ultimoEnvio = signal<DatosRegistro | null>(null);

  // Fecha máxima del selector (hoy), en formato AAAA-MM-DD
  public hoy = new Date().toLocaleDateString('sv-SE');

  constructor(private fb: FormBuilder, private alertCtrl: AlertController, public theme: ThemeService) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
      // Patrón: mínimo 8 caracteres, al menos una letra y un número.
      // Teléfono español: 9 dígitos que empiezan por 6, 7, 8 o 9
      telefono: ['', [Validators.required, Validators.pattern(/^[6789]\d{8}$/)]],
      fechaNacimiento: ['', [Validators.required, fechaNoFutura(), edadMinima(18)]],
    });
  }

  // Getter de conveniencia para acceder a los controles en la vista
  get f() { return this.registroForm.controls; }

  // Mensaje de error de la fecha según el validador que falla
  get errorFecha(): string {
    const errores = this.f['fechaNacimiento'].errors;
    if (errores?.['required']) return 'La fecha de nacimiento es obligatoria.';
    if (errores?.['fechaFutura']) return 'La fecha no puede ser futura.';
    if (errores?.['edadMinima']) return 'Debes tener al menos 18 años.';
    return 'Introduzca una fecha válida.';
  }

  public async onSubmit(): Promise<void> {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched(); // Fuerza la visualización de errores
      return;
    }

    this.isSubmitting.set(true);

    try {
      const formData = this.registroForm.value;
      console.log('Payload a enviar a la API REST:', formData);

      // Simulación de llamada asíncrona a un backend HTTP
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Aquí se implementaría: this.httpClient.post('url', formData).subscribe(...)

      // Se guardan los datos enviados (sin la contraseña) antes de vaciar el formulario
      const { nombre, email, telefono, fechaNacimiento } = formData;
      this.ultimoEnvio.set({ nombre, email, telefono, fechaNacimiento });

      this.registroForm.reset();

      // Aviso al usuario de que el envío ha ido bien
      const alerta = await this.alertCtrl.create({
        header: 'Registro completado',
        message: 'El formulario se ha enviado correctamente.',
        buttons: ['Aceptar'],
      });
      await alerta.present();
    } catch (error) {
      console.error('Error al persistir los datos', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // Genera un PDF con los datos del último envío y lo descarga (punto 8)
  public async descargarPdf(): Promise<void> {
    const datos = this.ultimoEnvio();
    if (!datos) {
      return;
    }
    // jsPDF se carga solo al pulsar el botón, para no hacer más pesada la página
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    const [anio, mes, dia] = datos.fechaNacimiento.split('-');

    pdf.setFontSize(18);
    pdf.text('Registro de Usuario', 20, 25);
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
}
