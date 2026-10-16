import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    // Punto 12: el mismo formulario hecho con el modelo template-driven
    path: 'driven',
    loadChildren: () => import('./driven/driven.module').then( m => m.DrivenPageModule)
  },
  {
    path: '',
    redirectTo: 'registro',
    pathMatch: 'full'
  },
  {
    // Cualquier ruta desconocida (por ejemplo la antigua /home) vuelve al registro.
    // Tiene que ir la última: el router prueba las rutas en orden.
    path: '**',
    redirectTo: 'registro'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
