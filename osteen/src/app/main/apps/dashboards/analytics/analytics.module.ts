import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatInputModule, MatDialogModule, MatDatepickerModule, MatToolbarModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { AnalyticsDashboardComponent, ChangeStatusDialog } from 'app/main/apps/dashboards/analytics/analytics.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AddTaskOverviewDialog } from 'app/main/apps/dashboards/analytics/addtask.component';
import { EditTaskOverviewDialog } from 'app/main/apps/dashboards/analytics/edittask.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { TaskEventsComponent } from './task-events/task-events.component';


/* import { MatSelectSearchModule } from '../../mat-select-search/mat-select-search.module'; */
const routes: Routes = [
    {
        path: '**',
        component: AnalyticsDashboardComponent,
        resolve: {

        }
    }
];

@NgModule({
    declarations: [
        AnalyticsDashboardComponent,
        AddTaskOverviewDialog,
        EditTaskOverviewDialog,
        ChangeStatusDialog,
        // TaskEventsComponent,


    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        MatInputModule,
        AngularEditorModule,
        MatDialogModule,

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
        NgbModule.forRoot(),
        MatToolbarModule,
        //MatSelectSearchModule,

    ],
    providers: [
        DatePipe
    ],
    entryComponents: [AddTaskOverviewDialog, EditTaskOverviewDialog, ChangeStatusDialog]
})
export class AnalyticsDashboardModule {
}

