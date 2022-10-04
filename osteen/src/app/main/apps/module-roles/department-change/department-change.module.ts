import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatDatepickerModule,MatCheckboxModule,NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS,MatToolbarModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
// import { AddDepartmentDialog} from 'app/main/apps/module-roles/department-change/adddepartment.component';
import { EditDepartmentDialog} from 'app/main/apps/module-roles/department-change/editdepartment.component';
import { DepartmentChangeComponent} from 'app/main/apps/module-roles/department-change/department-change.component';
//import { MatSelectSearchModule } from '../../mat-select-search/mat-select-search.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
const routes: Routes = [
    {
        path     : '**',
        component: DepartmentChangeComponent,
        resolve  : {
        }
    }
];
@NgModule({
    declarations: [
        DepartmentChangeComponent,
        //AddDepartmentDialog,
        EditDepartmentDialog
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
        MatToolbarModule,
        //MatSelectSearchModule
        NgMultiSelectDropDownModule.forRoot()
    ],
    providers   : [
    ],
   entryComponents : [EditDepartmentDialog]
})
export class DepartmentChangeModule
{
}
