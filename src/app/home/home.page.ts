import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
      // Patrón: mínimo 8 caracteres, al menos una letra y un número.
    });
  }

  // Getter de conveniencia para acceder a los controles en la vista
  get f() { return this.registroForm.controls; }

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
