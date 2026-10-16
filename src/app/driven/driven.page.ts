import { Component, signal } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { AlertController } from '@ionic/angular/lazy';
import { ThemeService } from '../services/theme.service';
import { sha256 } from '../services/cifrado';
import { DatosRegistro, descargarRegistroPdf } from '../services/registro-pdf';
import { mensajeErrorFecha } from '../validators/fecha.validators';
import { PATRON_PASSWORD, PATRON_TELEFONO } from '../validators/patrones';

@Component({
  selector: 'app-driven',
  templateUrl: './driven.page.html',
  styleUrls: ['./driven.page.scss'],
  standalone: false,
})
export class DrivenPage {
  // Template-driven: no hay FormGroup en TypeScript. Solo un objeto modelo que
  // la plantilla rellena con [(ngModel)]; las reglas se escriben en el HTML.
  public modelo = {
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    fechaNacimiento: '',
  };

  // Los mismos patrones que el formulario reactivo, para usarlos en el atributo pattern
  public patronPassword = PATRON_PASSWORD;
  public patronTelefono = PATRON_TELEFONO;

  // Signal para gestionar el estado de envío
  public isSubmitting = signal<boolean>(false);

  // Último registro enviado (null hasta el primer envío): activa el botón de descarga
  public ultimoEnvio = signal<DatosRegistro | null>(null);

  // Fecha máxima del selector (hoy), en formato AAAA-MM-DD
  public hoy = new Date().toLocaleDateString('sv-SE');

  constructor(private alertCtrl: AlertController, public theme: ThemeService) {}

  // Mensaje de error de la fecha: se recibe el NgModel del campo desde la plantilla (#fecha="ngModel")
  public errorFecha(campo: NgModel): string {
    return mensajeErrorFecha(campo.errors);
  }

  // El formulario llega como NgForm desde la plantilla (#registroForm="ngForm")
  public async onSubmit(form: NgForm): Promise<void> {
    if (form.invalid) {
      form.control.markAllAsTouched(); // Fuerza la visualización de errores
      return;
    }

    this.isSubmitting.set(true);

    try {
      // Copia del modelo en el momento del envío
      const formData = { ...this.modelo };

      // Punto 10: la contraseña se cifra (hash SHA-256) antes de mostrarla o enviarla
      const payload = { ...formData, password: await sha256(formData.password) };
      console.log('Payload (template-driven) a enviar a la API REST:', payload);

      // Simulación de llamada asíncrona a un backend HTTP
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Se guardan los datos enviados (sin la contraseña) antes de vaciar el formulario
      const { nombre, email, telefono, fechaNacimiento } = formData;
      this.ultimoEnvio.set({ nombre, email, telefono, fechaNacimiento });

      // resetForm() vacía los campos y también el estado touched/dirty
      form.resetForm();

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

  // Descarga en PDF los datos del último envío (punto 8)
  public async descargarPdf(): Promise<void> {
    const datos = this.ultimoEnvio();
    if (datos) {
      await descargarRegistroPdf(datos, 'Registro de Usuario (template-driven)');
    }
  }
}
