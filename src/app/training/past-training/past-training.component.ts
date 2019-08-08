import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Exercise} from '../exercise.model';
import {TrainingService} from '../training.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  paginatorSizeOptions = [];
  private finishedExercisesSubscription: Subscription;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
      this.finishedExercisesSubscription = this.trainingService.finishedExercisesChanged
        .subscribe((exercises: Exercise[]) => {
      this.dataSource.data = exercises;
      this.setPaginatorSizeOptions();
    });
      this.trainingService.fetchCompletedOrCancelledExercises();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private setPaginatorSizeOptions() {
    const size = this.dataSource.data.length;
    if (size === 0) {
      return;
    } else if (size === 1) {
      this.paginatorSizeOptions = [1];
    } else if (size > 1 && size <= 5) {
      this.paginatorSizeOptions = [1, size];
    } else if (size > 5 && size <= 10) {
      this.paginatorSizeOptions = [1, 5, size];
    } else if (size > 10 && size <= 20) {
      this.paginatorSizeOptions = [1, 5, 10, size];
    } else if (size > 20) {
      this.paginatorSizeOptions = [1, 5, 10, 20, size];
    }
  }

  ngOnDestroy(): void {
    if (this.finishedExercisesSubscription) {
      this.finishedExercisesSubscription.unsubscribe();
    }
  }

}
