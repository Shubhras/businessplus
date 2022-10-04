import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatDividerModule,MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatTooltipModule,MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatToolbarModule } from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import { FuseShortcutsComponent,VisionMissionDialog } from './shortcuts.component';

@NgModule({
    declarations: [
        FuseShortcutsComponent,
        VisionMissionDialog,
    ],
    imports     : [
        CommonModule,
        RouterModule,

        FlexLayoutModule,
        MatCardModule,
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatListModule,
        MatTooltipModule,
        MatDialogModule,
        MatToolbarModule
    ],
    exports     : [
        FuseShortcutsComponent
    ],
    providers   : [
        CookieService
    ],
    entryComponents : [VisionMissionDialog]
})
export class FuseShortcutsModule
{
}
