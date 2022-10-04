import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatInputModule, MatDialogModule, MatDatepickerModule, MatDividerModule, MatToolbarModule, MatCardModule, MatTooltipModule, MatStepperModule, MatRadioModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { ProjectEditComponent } from 'app/main/apps/project/project-edit/project-edit.component';
import { DatePipe } from '@angular/common';
import { AngularEditorModule } from '@kolkov/angular-editor';

const routes: Routes = [
    {
        path: '**',
        component: ProjectEditComponent,
        resolve: {

        }
    }
];

@NgModule({
    declarations: [
        ProjectEditComponent
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
        MatDividerModule,
        MatToolbarModule,
        MatCardModule,
        MatTooltipModule,
        MatStepperModule,
        AngularEditorModule,
        MatRadioModule
    ],
    providers: [
        DatePipe
    ],
})
export class ProjectEditModule {
}

