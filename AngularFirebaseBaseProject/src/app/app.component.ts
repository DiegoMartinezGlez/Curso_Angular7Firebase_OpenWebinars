import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = environment.title;

  constructor( public auth: AuthService,
               private toastr: ToastrService ) {

  }

  signEmail() {
    this.auth.login().catch( error => {
      if (error.code==='auth/wrong-password') {
        this.toastr.error('Contraseña no válida', 'Error login')
      } else if (error.code==='auth/invalid-email'){
        this.toastr.error('Formato email no válido', 'Error login')
      }
    })
  }

}
