import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatDatepickerModule,MatCheckboxModule,MatTooltipModule,MatCardModule,MatToolbarModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { QtlySummaryComponent} from 'app/main/apps/strategic-obj/quarterly-summary/qtly-summary.component';
import { AddQtlySummary} from 'app/main/apps/strategic-obj/quarterly-summary/add-qtly-summary.component';
import { EditQtlySummary} from 'app/main/apps/strategic-obj/quarterly-summary/edit-qtly-summary.component';
//import { DatePipe } from '@angular/common';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
const routes: Routes = [
    {
        path     : '**',
        component: QtlySummaryComponent,
        resolve  : {
        }
    }
];
@NgModule({
    declarations: [
        QtlySummaryComponent,
        AddQtlySummary,
        EditQtlySummary
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
        MatDatepickerModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatBottomSheetModule,
        MatCardModule,
        AngularEditorModule,
        AngularFontAwesomeModule,
        MatToolbarModule
    ],
    providers   : [
        //DatePipe
    ],
   entryComponents : [AddQtlySummary, EditQtlySummary]
})
export class QtlySummaryModule
{
}

