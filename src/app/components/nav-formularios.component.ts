import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular/lazy';

// Selector para pasar de un modelo de formulario al otro y compararlos (punto 12)
@Component({
  selector: 'app-nav-formularios',
  imports: [IonicModule, RouterModule],
  template: `
    <ion-toolbar>
      <ion-segment [value]="actual">
        <ion-segment-button value="reactivo" routerLink="/registro">
          <ion-label>Reactivo</ion-label>
        </ion-segment-button>
        <ion-segment-button value="driven" routerLink="/driven">
          <ion-label>Template-driven</ion-label>
        </ion-segment-button>
      </ion-segment>
    </ion-toolbar>
  `,
  styles: [`
    /* Punto 11 (RWD): en móviles muy estrechos (320 px) las pestañas reducen la letra para que quepa el texto */
    @media (max-width: 359px) {
      ion-segment-button {
        font-size: 12px;
        letter-spacing: 0;
        --padding-start: 4px;
        --padding-end: 4px;
      }
    }
  `],
})
export class NavFormulariosComponent {
  @Input() actual: 'reactivo' | 'driven' = 'reactivo';
}
