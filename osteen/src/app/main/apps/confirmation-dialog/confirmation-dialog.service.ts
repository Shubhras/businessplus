import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
@Injectable()
export class ConfirmationDialogService {
  constructor(
  public dialog: MatDialog) { }
  public confirm(title: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'confirm-dial'
      // data: element
    });
    dialogRef.componentInstance.title = title;
    return dialogRef;   
  }
}

