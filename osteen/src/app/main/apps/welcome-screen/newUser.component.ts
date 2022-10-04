import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'app-dialog',
    templateUrl: 'newUser.component.html',
    styleUrls: ['newUser.component.css'],
})
export class DialogComponent {
    // barwidth: number = 10;
    // show: boolean = false;
    buttonshow: boolean = true;

    filterData: any;
    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }
    ngOnInit() {
        this.filterData = this.data;
        console.log("filter", this.filterData);

        const rightMostPos = window.innerWidth - Number(this.filterData.left);
        console.log(rightMostPos);

        this.dialogRef.updatePosition({
            bottom: `${this.filterData.bottom}px`,
            right: `${rightMostPos}px`
        });
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    // next() {
    //     this.show = true;
    //     this.barwidth = 20;
    //     this.buttonshow = false;
    // }

}