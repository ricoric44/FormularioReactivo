import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular/lazy';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroPage } from './registro.page';

import { RegistroPageRoutingModule } from './registro-routing.module';
import { NavFormulariosComponent } from '../components/nav-formularios.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegistroPageRoutingModule,
    NavFormulariosComponent
  ],
  declarations: [RegistroPage]
})
export class RegistroPageModule {}
