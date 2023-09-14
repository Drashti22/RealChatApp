  import { Injectable } from '@angular/core';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Observable, Subject } from 'rxjs';
  import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
  import { GoogleLoginProvider } from "@abacritt/angularx-social-login";

  export interface ExternalAuthDto {
    idToken: string;
  }
  @Injectable({
    providedIn: 'root'
  })
  export class AuthService {loggedInUserName: string | undefined;

    private baseUrl: string = "https://localhost:7132/api/user/"
    private tokenkey = 'auth_token'
    private authChangeSub = new Subject<boolean>();
    private extAuthChangeSub = new Subject<SocialUser>();
    public authChanged = this.authChangeSub.asObservable();
    public extAuthChanged = this.extAuthChangeSub.asObservable();

    constructor(private http: HttpClient, private externalAuthService: SocialAuthService) { 
        this.externalAuthService.authState.subscribe((user) => {
          console.log(user)
          this.extAuthChangeSub.next(user);
        })
      }

    signUp(userObj:any){
      return this.http.post<any>(`${this.baseUrl}register`, userObj)
    }
    login(loginObj:any){
      return this.http.post<any>(`${this.baseUrl}login`, loginObj)
    }
    
    
    isLoggedIn(): boolean{
      const token = this.getToken();
      console.log(token)
      return !!token;
    }
    getToken(){
      return localStorage.getItem(this.tokenkey);
    }
    storeToken(token: string){
      localStorage.setItem(this.tokenkey, token)
      console.log(token)
    }
    removeToken(): void {
      localStorage.removeItem(this.tokenkey);
    }
    getLoggedInUserId(): string | null {
      const userId = localStorage.getItem('user-Id');
      return userId ? userId : null;
    }
    setLoggedInUserId(id: string | null) {
      console.log('Setting user ID in local storage:', id);
      if (id !== null) {
        localStorage.setItem('user-Id', id.toString());
      }     
    }
    // LoginWithGoogle(credentials : string): Observable<any>{
    //   const header = new HttpHeaders().set('Content-type', 'application/json');
    //   return this.http.post(`${this.baseUrl}LoginWithGoogle`, JSON.stringify(credentials), {headers: header})
    // }
    public signInWithGoogle = ()=> {
      this.externalAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
      
    }
    externalLogin(googleUser: ExternalAuthDto): Observable<any> {
      return this.http.post<any>(`https://localhost:7132/api/User/GoogleAuthenticate`, googleUser);
    }
  }
