import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatInputModule, MatDialogModule, MatDatepickerModule, MatCheckboxModule, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatToolbarModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TaskEventsComponent } from 'app/main/apps/dashboards/analytics/task-events/task-events.component';
import { AddTaskEventDialog } from 'app/main/apps/dashboards/analytics/task-events/addtaskevents.component';
import { EditTaskEventDialog } from 'app/main/apps/dashboards/analytics/task-events/edittaskevents.component';

// import { UnitChangeService } from 'app/main/apps/module-roles/unit-change/unit-change.service';
const routes: Routes = [
    {
        path: '**',
        component: TaskEventsComponent,
        // resolve  : {
        //     data: UnitChangeService
        // }
    }
];
@NgModule({
    declarations: [
        TaskEventsComponent,
        AddTaskEventDialog,
        EditTaskEventDialog,

    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        MatInputModule,
        MatDialogModule,
        AngularEditorModule,
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
        MatToolbarModule
    ],
    // providers   : [
    //     UnitChangeService
    // ],
    entryComponents: [AddTaskEventDialog, EditTaskEventDialog]
})
export class TaskEventsModule {
}

