import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { DrivenPageRoutingModule } from './driven-routing.module';

import { DrivenPage } from './driven.page';
import { NavFormulariosComponent } from '../components/nav-formularios.component';
import { EdadMinimaDirective, FechaNoFuturaDirective } from '../validators/fecha.validators';

@NgModule({
  imports: [
    CommonModule,
    // Template-driven: basta con FormsModule (ngForm, ngModel y los validadores como atributos)
    FormsModule,
    IonicModule,
    DrivenPageRoutingModule,
    NavFormulariosComponent,
    // Validadores personalizados de la fecha en forma de directiva
    FechaNoFuturaDirective,
    EdadMinimaDirective
  ],
  declarations: [DrivenPage]
})
export class DrivenPageModule {}
