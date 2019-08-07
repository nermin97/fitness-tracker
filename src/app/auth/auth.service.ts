import {User} from './user.module';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {TrainingService} from '../training/training.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router, private afAuth: AngularFireAuth, private trainingService: TrainingService) {}


  registerUser(authData: AuthData) {
    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.authSuccessfully();
    })
      .catch(err => {
        console.log(err);
      });
  }

  login(authData: AuthData) {
    this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.authSuccessfully();
      })
      .catch(err => {
        console.log(err);
      });
  }

  logout() {
    this.trainingService.cancelSubscriptions();
    this.afAuth.auth.signOut();
    this.isAuthenticated = false;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }


  isAuth() {
    return this.isAuthenticated;
  }

  private authSuccessfully() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
