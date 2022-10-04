import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatDatepickerModule,MatToolbarModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { ProjectremarkComponent} from 'app/main/apps/dashboards/project-remark/projectremark.component';
import { AddProjectRemarkDialog} from 'app/main/apps/dashboards/project-remark/addproject-remark.component';
import { EditProjectRemarkDialog} from 'app/main/apps/dashboards/project-remark/editproject-remark.component';

const routes: Routes = [
    {
        path     : '**',
        component: ProjectremarkComponent,
        resolve  : {
        }
    }
];

@NgModule({
    declarations: [
        ProjectremarkComponent,
        AddProjectRemarkDialog,
        EditProjectRemarkDialog
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
   entryComponents : [AddProjectRemarkDialog, EditProjectRemarkDialog]
})
export class ProjectremarkModule
{
}

