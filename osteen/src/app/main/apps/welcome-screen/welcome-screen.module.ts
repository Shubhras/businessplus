import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatInputModule, MatDialogModule, MatDatepickerModule, MatCheckboxModule, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatTooltipModule, MatToolbarModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { CdkTableModule} from '@angular/cdk/table';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
// import { StepperOverviewExample } from 'app/main/apps/welcome-screen/userStepper.component';
// import { DialogComponent } from 'app/main/apps/welcome-screen/newUser.component';
import { MatStepperModule } from '@angular/material';
//import { DialogOverviewExampleDialog } from './welcome-screen.component'
import { DialogOverviewExampleDialog, WelcomeScreenComponent } from 'app/main/apps/welcome-screen/welcome-screen.component';
// import { AddDeptUserDialog } from '../module-roles/users-list/add-user.component';
// import { AddUserDialog } from 'app/main/apps/module-roles/users-list/add-user.component';
// import { ComboChartComponent } from './Charts/combochart.component'
// import { LineChartComponent } from './Charts/linechart.component'
// import { GoogleComboChartService } from './google-combo-chart.service';
// import { GoogleLineChartService } from './google-line-chart.service';
const routes: Routes = [
    {
        path: '**',
        component: WelcomeScreenComponent,
        resolve: {
        }
    }
];
@NgModule({
    declarations: [
        WelcomeScreenComponent,
        // AddDeptUserDialog,
        // AddUserDialog,
        // DialogComponent,
        // StepperOverviewExample,
        DialogOverviewExampleDialog
        //DialogOverviewExampleDialog
        //StrategicHelpComponent,
        // ComboChartComponent,
        // LineChartComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatButtonModule,
        CdkTableModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        MatInputModule,
        MatDialogModule,
        MatListModule,
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
        MatToolbarModule
    ],
    // providers   : [
    //     GoogleComboChartService,
    //     GoogleLineChartService
    // ],
    entryComponents: [DialogOverviewExampleDialog], 
    // entryComponents: [AddUserDialog]
    // DialogComponent, StepperOverviewExample,
})
export class WelcomeScreenModule {
}

