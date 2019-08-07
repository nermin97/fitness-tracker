import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Exercise} from '../exercise.model';
import {TrainingService} from '../training.service';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  private paginatorSizeOptions = [];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.dataSource.data = this.trainingService.getCompletedOrCancelledExercises();
    this.setPaginatorSizeOptions();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private setPaginatorSizeOptions() {
    const size: number = this.dataSource.data.length;
    if(size === 0){
      return;
    } else if(size === 1) {
      this.paginatorSizeOptions = [1];
    } else if(size > 1 && size <= 5) {
      this.paginatorSizeOptions = [1, size];
    } else if(size > 5 && size <= 10) {
      this.paginatorSizeOptions = [1, 5, size];
    } else if(size > 10 && size <= 20) {
      this.paginatorSizeOptions = [1, 5, 10, size];
    } else if(size > 20) {
      this.paginatorSizeOptions = [1, 5, 10, 20, size];
    }
  }

}
