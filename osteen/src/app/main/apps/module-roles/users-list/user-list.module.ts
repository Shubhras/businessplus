import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatInputModule, MatDialogModule, MatDatepickerModule, MatCheckboxModule, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatStepperModule, MatToolbarModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { UserListComponent } from './user-list.component';
// import { AddUserDialog } from './add-user.component';
import { EditUserDialog } from './edit-user.component';
import { DatePipe } from '@angular/common';
const routes: Routes = [
    {
        path: '**',
        component: UserListComponent,
        resolve: {
        }
    }
];
@NgModule({
    declarations: [
        UserListComponent,
        //AddUserDialog,
        EditUserDialog
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
        MatStepperModule,
        MatToolbarModule
    ],
    providers: [
        DatePipe
    ],
    entryComponents: [EditUserDialog]
})
export class UserListModule {
}

