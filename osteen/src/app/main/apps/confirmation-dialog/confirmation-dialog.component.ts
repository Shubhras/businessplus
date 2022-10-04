import { Component, Input, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { User } from '../_models';
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls    : ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;

  constructor(
      public dialogRef: MatDialogRef<ConfirmationDialogComponent>
    ) { 
  }
  ngOnInit() {
  }
  public decline() {
    this.dialogRef.close(false);
  }
  public accept() {
    this.dialogRef.close(true);
  }
  public dismiss() {
   // this.activeModal.dismiss();
  }
}
