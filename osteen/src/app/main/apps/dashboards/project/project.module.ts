import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatInputModule, MatDialogModule, MatDatepickerModule, MatToolbarModule, MatCardModule, MatTooltipModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { ProjectDashboardComponent, ChangeStatusDialog } from 'app/main/apps/dashboards/project/project.component';
import { DatePipe } from '@angular/common';
const routes: Routes = [
    {
        path: '**',
        component: ProjectDashboardComponent,
        resolve: {

        }
    }
];

@NgModule({
    declarations: [
        ProjectDashboardComponent,
        ChangeStatusDialog
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        NgxChartsModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseWidgetModule,
        MatPaginatorModule,
        MatInputModule,
        MatDialogModule,
        MatDatepickerModule,
        MatToolbarModule,
        MatCardModule,
        MatTooltipModule
    ],
    providers: [
        DatePipe
    ],
    entryComponents: [ChangeStatusDialog]
})
export class ProjectDashboardModule {
}

