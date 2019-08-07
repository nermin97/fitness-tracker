import {Component, Inject, Output} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-stop-training',
  template: '<h1 mat-dialog-title>Are you sure?</h1>' +
            '<mat-dialog-content>' +
              '<p>You already got {{passedData.progress}}%</p>' +
            '</mat-dialog-content>' +
            '<mat-dialog-actions>' +
            ' <button color="primary" mat-raised-button [mat-dialog-close]="true">Yes</button>' +
            ' <button color="warn" mat-raised-button [mat-dialog-close]="false">No</button>' +
            '</mat-dialog-actions>'

})
export class StopTrainingComponent {

  constructor(@Inject(MAT_DIALOG_DATA) private passedData: any) {
  }
}
