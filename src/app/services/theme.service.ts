import { Injectable, effect, signal } from '@angular/core';

const STORAGE_KEY = 'formulario-modo-oscuro';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // Valor inicial: lo que eligió el usuario la última vez o,
  // si nunca lo ha cambiado, la preferencia del sistema operativo.
  dark = signal(this.initialValue());

  constructor() {
    // Cada vez que cambia el signal, se aplica la paleta oscura de Ionic
    // (clase .ion-palette-dark en <html>) y se guarda la elección.
    effect(() => {
      const dark = this.dark();
      document.documentElement.classList.toggle('ion-palette-dark', dark);
      try {
        localStorage.setItem(STORAGE_KEY, String(dark));
      } catch {
        // Navegación privada sin almacenamiento: el modo funciona igual
      }
    });
  }

  toggle(): void {
    this.dark.update(value => !value);
  }

  private initialValue(): boolean {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {
      // Sin acceso a localStorage
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
