import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

// Convierte el valor AAAA-MM-DD del input en una fecha en hora local (sin la hora se leería en UTC)
function leerFecha(valor: string): Date {
  return new Date(`${valor}T00:00:00`);
}

// Validador personalizado (punto 6): la fecha de nacimiento no puede ser posterior a hoy
export function fechaNoFutura(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // De esto se encarga el validador required
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
      return null; // De esto se encarga el validador required
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

// Mensaje de error de la fecha según el validador que falla (lo usan las dos páginas)
export function mensajeErrorFecha(errores: ValidationErrors | null): string {
  if (errores?.['required']) return 'La fecha de nacimiento es obligatoria.';
  if (errores?.['fechaFutura']) return 'La fecha no puede ser futura.';
  if (errores?.['edadMinima']) return 'Debes tener al menos 18 años.';
  return 'Introduzca una fecha válida.';
}

// En un formulario template-driven los validadores personalizados se usan como directivas:
// se registran en NG_VALIDATORS y Angular los aplica al ngModel del mismo elemento.

@Directive({
  selector: '[appFechaNoFutura][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: FechaNoFuturaDirective, multi: true }],
})
export class FechaNoFuturaDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return fechaNoFutura()(control);
  }
}

@Directive({
  selector: '[appEdadMinima][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: EdadMinimaDirective, multi: true }],
})
export class EdadMinimaDirective implements Validator {
  @Input('appEdadMinima') anios = 18;

  validate(control: AbstractControl): ValidationErrors | null {
    return edadMinima(this.anios)(control);
  }
}
