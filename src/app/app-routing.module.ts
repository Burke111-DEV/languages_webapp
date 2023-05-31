import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LearnLoopComponent } from './learn-loop/learn-loop.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'learn', component: LearnLoopComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  HomeComponent,
  LearnLoopComponent
]