import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgToastModule } from 'ng-angular-popup';
import { UserlistComponent } from './Components/userlist/userlist.component';
import { TokenInterceptor } from './Interceptors/token.interceptor';
import { MessageHistoryComponent } from './Components/message-history/message-history.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { LogsComponent } from './Components/logs/logs.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { GroupComponent } from './Components/group/group.component';
import { DialogBoxComponent } from './Components/dialog-box/dialog-box.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UserDialogComponent } from './Components/user-dialog/user-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    UserlistComponent,
    MessageHistoryComponent,
    DashboardComponent,
    LogsComponent,
    GroupComponent,
    DialogBoxComponent,
    UserDialogComponent,
    
  ],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgToastModule, 
    FormsModule, BrowserAnimationsModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    MatDialogModule

  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi:true
  },
  {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '414420117584-8ggttrr52sgf1cge36h8argahdv4nkaj.apps.googleusercontent.com', {
            }
          )
        },
      ],
      onError: (err) => {
        console.error(err);
      }
    } as SocialAuthServiceConfig
  }

],
  bootstrap: [AppComponent]
})
export class AppModule { }
