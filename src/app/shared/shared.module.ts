// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { FilterTasksPipe } from './pipes/filter-tasks.pipe';

/**
 * Módulo compartido que contiene pipes y funcionalidades exportables
 * En Angular 17, estamos utilizando componentes independientes (standalone),
 * por lo que los módulos de Material y otras dependencias de componentes
 * se importan directamente en cada componente en lugar de gestionarse
 * a través de este módulo compartido.
 */
@NgModule({
  // Solo incluye elementos no independientes como pipes o directivas
  declarations: [
    FilterTasksPipe
  ],
  exports: [
    FilterTasksPipe
  ]
})
export class SharedModule { }