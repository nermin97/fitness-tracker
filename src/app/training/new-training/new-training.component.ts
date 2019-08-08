import {Component, OnInit} from '@angular/core';
import {TrainingService} from '../training.service';
import {NgForm} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {Exercise} from '../exercise.model';
import {UiService} from '../../shared/ui.service';
import * as fromRoot from '../../app.reducer';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  availableExercises: Exercise[];
  exercisesSubscription: Subscription;
  isLoading$: Observable<boolean>;

  constructor(private trainingService: TrainingService,
              private uiService: UiService,
              private store: Store<{ui: fromRoot.State}>) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercisesSubscription = this.trainingService.exercisesChanged
      .subscribe(exercises => {
        this.availableExercises = exercises;
      });
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
