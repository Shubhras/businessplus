import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {MatPaginator, MatSort, MatTableDataSource ,MatDialog,MatDialogRef, MAT_DIALOG_DATA , MatButtonModule, MatChipsModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatRippleModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule,MatMenuModule,MatDialogModule,MatTooltipModule,NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS,MatDatepickerModule,MatToolbarModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { AddkpidataComponent} from './addkpidata.component';
// import {addActualDialod} from './addactual.component';
import { TwoDigitDecimaNumberDirective } from '../../directives/two-digit-decima-number.directive';
import { from } from 'rxjs';
import { DatePipe } from '@angular/common';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
const routes: Routes = [
    {
        path     : '**',
        component: AddkpidataComponent,
        resolve  : {
        }
    }
];
@NgModule({
    declarations: [
        AddkpidataComponent,
        // addActualDialod,
        TwoDigitDecimaNumberDirective
    ],
    imports     : [
        CommonModule,
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        MatInputModule,
        MatDialogModule ,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),
        ChartsModule,
        NgxChartsModule,
        FuseSharedModule,
        FuseWidgetModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatToolbarModule,
        MatButtonToggleModule
    ],
    providers   : [DatePipe],
    // entryComponents : [addActualDialod]
})
export class AddkpidataModule
{
}

