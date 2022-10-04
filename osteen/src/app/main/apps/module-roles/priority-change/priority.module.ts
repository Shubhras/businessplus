import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatDatepickerModule,MatCheckboxModule,NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS,MatToolbarModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { PriorityChangeComponent} from 'app/main/apps/module-roles/priority-change/priority.component';
import { AddPriorityDialog} from 'app/main/apps/module-roles/priority-change/add-priority.component';
import { EditPriorityDialog} from 'app/main/apps/module-roles/priority-change/edit-priority.component';

const routes: Routes = [
    {
        path     : '**',
        component: PriorityChangeComponent,
        resolve  : {

        }
    }
];
@NgModule({
    declarations: [
        PriorityChangeComponent,
        AddPriorityDialog,
        EditPriorityDialog
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
        MatToolbarModule
    ],
    providers   : [
    ],
   entryComponents : [AddPriorityDialog,EditPriorityDialog]
})
export class PriorityChangeModule
{
}

