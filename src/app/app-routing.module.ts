import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { UserlistComponent } from './Components/userlist/userlist.component';
import { AuthGuard } from './Gaurds/auth.guard';
import { MessageHistoryComponent } from  './Components/message-history/message-history.component';
import { LogsComponent } from './Components/logs/logs.component';

const routes: Routes = [
  {path : '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'dashboard', component:DashboardComponent, canActivate: [AuthGuard],
    children:[{
      path: 'conversation/:userId',
      component: MessageHistoryComponent,
      outlet: 'chatOutlet'
    }]
  } ,
  {path: 'logs' , component: LogsComponent}  
  ]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  // providers: [AuthGuard]
})
export class AppRoutingModule { }
