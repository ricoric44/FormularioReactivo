import { Component, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

// Validador personalizado: la fecha no puede ser futura y el usuario debe tener la edad mínima
export function edadMinima(anios: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // De esto se encarga Validators.required
    }
    // Se añade la hora para que la fecha AAAA-MM-DD se lea en hora local y no en UTC
    const nacimiento = new Date(`${control.value}T00:00:00`);
    if (isNaN(nacimiento.getTime())) {
      return { fechaInvalida: true };
    }
    const hoy = new Date();
    if (nacimiento > hoy) {
      return { fechaFutura: true };
    }
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad < anios ? { edadMinima: { requerida: anios, actual: edad } } : null;
  };
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  // Definición del formulario reactivo
  public registroForm: FormGroup;

  // Signal para gestionar el estado de envío
  public isSubmitting = signal<boolean>(false);

  // Fecha máxima del selector (hoy), en formato AAAA-MM-DD
  public hoy = new Date().toLocaleDateString('sv-SE');

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
      // Patrón: mínimo 8 caracteres, al menos una letra y un número.
      fechaNacimiento: ['', [Validators.required, edadMinima(18)]],
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

      this.registroForm.reset();
    } catch (error) {
      console.error('Error al persistir los datos', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
