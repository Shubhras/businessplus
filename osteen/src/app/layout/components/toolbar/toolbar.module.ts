import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule,MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTooltipModule,MatSelectModule,MatDatepickerModule} from '@angular/material';
import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { ToolbarComponent } from 'app/layout/components/toolbar/toolbar.component';
import { DatePipe } from '@angular/common';
@NgModule({
    declarations: [
        ToolbarComponent,
       /*  VisionDialog,
        MissionDialog,
        ValuesDialog,
        MessageceoDialog */
    ],
    imports     : [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule,
        MatDialogModule,
        MatTooltipModule,
        MatSelectModule,
        MatDatepickerModule
    ],
    providers   : [
        DatePipe
    ],
    exports     : [
        ToolbarComponent
    ],
    //entryComponents : [VisionDialog, MissionDialog, ValuesDialog,MessageceoDialog]
})
export class ToolbarModule
{
}
