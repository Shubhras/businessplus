import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatDatepickerModule,MatToolbarModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { TaskremarkComponent} from 'app/main/apps/dashboards/analytics-remark/taskremark.component';
import { AddTaskRemarkDialog} from 'app/main/apps/dashboards/analytics-remark/addtask-remark.component';
import { EditTaskRemarkDialog} from 'app/main/apps/dashboards/analytics-remark/edittask-remark.component';

const routes: Routes = [
    {
        path     : '**',
        component: TaskremarkComponent,
        resolve  : {

        }
    }
];

@NgModule({
    declarations: [
        TaskremarkComponent,
        AddTaskRemarkDialog,
        EditTaskRemarkDialog
    ],
    imports     : [
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
        MatToolbarModule
    ],
    providers   : [

    ],
   entryComponents : [AddTaskRemarkDialog, EditTaskRemarkDialog]
})
export class TaskremarkModule
{
}

