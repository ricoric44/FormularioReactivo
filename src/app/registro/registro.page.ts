import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular/lazy';
import { ThemeService } from '../services/theme.service';
import { sha256 } from '../services/cifrado';
import { DatosRegistro, descargarRegistroPdf } from '../services/registro-pdf';
import { edadMinima, fechaNoFutura, mensajeErrorFecha } from '../validators/fecha.validators';
import { PATRON_PASSWORD, PATRON_TELEFONO } from '../validators/patrones';

@Component({
  selector: 'app-registro',
  templateUrl: 'registro.page.html',
  styleUrls: ['registro.page.scss'],
  standalone: false,
})
export class RegistroPage {
  // Definición del formulario reactivo: la estructura y las reglas están en TypeScript
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
      password: ['', [Validators.required, Validators.pattern(PATRON_PASSWORD)]],
      telefono: ['', [Validators.required, Validators.pattern(PATRON_TELEFONO)]],
      fechaNacimiento: ['', [Validators.required, fechaNoFutura(), edadMinima(18)]],
    });
  }

  // Getter de conveniencia para acceder a los controles en la vista
  get f() { return this.registroForm.controls; }

  // Mensaje de error de la fecha según el validador que falla
  get errorFecha(): string {
    return mensajeErrorFecha(this.f['fechaNacimiento'].errors);
  }

  public async onSubmit(): Promise<void> {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched(); // Fuerza la visualización de errores
      return;
    }

    this.isSubmitting.set(true);

    try {
      const formData = this.registroForm.value;

      // Punto 10: la contraseña se cifra (hash SHA-256) antes de mostrarla o enviarla,
      // así nunca aparece en texto plano en la consola
      const payload = { ...formData, password: await sha256(formData.password) };
      console.log('Payload a enviar a la API REST:', payload);

      // Simulación de llamada asíncrona a un backend HTTP
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Aquí se implementaría: this.httpClient.post('url', payload).subscribe(...)

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

  // Descarga en PDF los datos del último envío (punto 8)
  public async descargarPdf(): Promise<void> {
    const datos = this.ultimoEnvio();
    if (datos) {
      await descargarRegistroPdf(datos);
    }
  }
}
