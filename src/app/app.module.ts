// src/app/app.module.ts
// Este módulo ya no se usa directamente, ya que estamos usando bootstrapApplication
import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    CoreModule,
    SharedModule
  ]
})
export class AppModule { }