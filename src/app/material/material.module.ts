import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';



const MaterialComponents = [
  MatIconModule,
  MatTooltipModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialComponents,
  ],
  exports: [MaterialComponents],
})
export class MaterialModule { }
