import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotComponent } from './forgot/forgot.component';
import { SearchComponent } from './search/search.component';
import { TitleComponent } from './title/title.component';

const routes: Routes = [
  {
      path: '',
      component: MainComponent
    },
    { 
      path: 'search/:query', 
      component: SearchComponent },
    { 
      path: 'title/:movie', 
      component: TitleComponent },
    {
    path: 'login',
    component: LoginComponent
  }
  ,
    {
    path: 'signup',
    component: SignupComponent
  }
  ,
    {
    path: 'profile',
    component: ProfileComponent
  }
  ,
  {
  path: 'forgot',
  component: ForgotComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
