import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'app/main/apps/welcome-screen/newUser.component';

//import { DialogComponent } from 'app/layout/components/footer/newUser.component';
// export interface DialogData {
//     animal: string;
//     name: string;
// }
@Component({
    selector: 'footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})

export class FooterComponent {
    animal: string;
    name: string;
    // barwidth: number = 10;
    // show: boolean = false;
    buttonshow: boolean = true;

    open = false;
    close() {
        this.open = false;
    }
    /**
     * Constructor
     */
    constructor(public dialog: MatDialog, private route: ActivatedRoute,) { }
    // next() {
    //     this.show = true;
    //     this.barwidth = 20;
    //     this.buttonshow = false;
    // }
    // openDialog(): void {
    //     const dialogRef = this.dialog.open(DialogComponent, {
    //         panelClass: 'custom-dialog-container',
    //         width: '200px',
    //         data: {}
    //     });
    //     dialogRef.afterClosed().subscribe(result => {


    //     });

    // }
    // openDialog(): void {
    //     const dialogRef = this.dialog.open(DialogComponent, {
    //         width: '200px',
    //         height: '500px',
    //         data: { name: this.name, animal: this.animal }
    //     });

    // dialogRef.afterClosed().subscribe(result => {
    //     console.log('The dialog was closed');
    //     this.animal = result;
    // });
    //}

    openDialog(): void {
        const dialogRef = this.dialog.open(DialogComponent, {
          panelClass: 'custom-dialog-container',
          disableClose:false,
          width: '397px',
          data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
    
    
        });
    
      }

}

// @Component({
//     selector: 'dialog-overview-example-dialog',
//     templateUrl: 'newUser.component.html',
// })
// export class DialogOverviewExampleDialog {

//     constructor(
//         public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
//         @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

//     onNoClick(): void {
//         this.dialogRef.close();
//     }

// }
