import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from '../training.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Exercise} from '../exercise.model';
import {UiService} from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  availableExercises: Exercise[];
  exercisesSubscription: Subscription;
  isLoading = false;
  private isLoadingSub: Subscription;

  constructor(private trainingService: TrainingService, private uiService: UiService) {}

  ngOnInit() {
    this.isLoadingSub = this.uiService.loadingStateChanged.subscribe(
      isLoading => this.isLoading = isLoading
    );
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

  ngOnDestroy(): void {
    if (this.exercisesSubscription) {
      this.exercisesSubscription.unsubscribe();
    }
    if (this.isLoadingSub) {
      this.isLoadingSub.unsubscribe();
    }
  }

}
