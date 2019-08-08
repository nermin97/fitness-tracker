import {Exercise} from './exercise.model';
import {Subject, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {UiService} from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import {Store} from '@ngrx/store';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UiService,
              private store: Store<{ui: fromRoot.State}>) {}


  fetchAvailableExercises() {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(map(docArray => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              name: doc.payload.doc.data()['name'],
              duration: doc.payload.doc.data()['duration'],
              calories: doc.payload.doc.data()['calories']
            };
          });
        })
        )
        .subscribe((exercises: Exercise[]) => { // this subscription replaces itself, it does not pollute the memory
          // this.uiService.loadingStateChanged.next(false);
          this.store.dispatch(new UI.StopLoading());
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
        }, error => {
          // this.uiService.loadingStateChanged.next(false);
          this.store.dispatch(new UI.StopLoading());
          this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
          this.exercisesChanged.next(null);
        })
    );
  }

  startExercise(selectedId: string) {
    // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({...this.runningExercise});
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: Date.now(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: Date.now(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(
    this.db.collection('finishedExercises').valueChanges().subscribe(
      (exercises: Exercise[]) => {
      this.finishedExercisesChanged.next(exercises);
    })
    );
  }

  private addDataToDatabase(exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
