import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatDatepickerModule,MatCheckboxModule,NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { FaqChangeComponent} from 'app/main/apps/module-roles/faq-change/faq-change.component';
import { AddFaqDialog} from 'app/main/apps/module-roles/faq-change/addfaq-change.component';
import { EditFaqDialog} from 'app/main/apps/module-roles/faq-change/editfaq-change.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
const routes: Routes = [
    {
        path     : '**',
        component: FaqChangeComponent,
        resolve  : {
        }
    }
];
@NgModule({
    declarations: [
        FaqChangeComponent,
        AddFaqDialog,
        EditFaqDialog
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
        AngularEditorModule,
        AngularFontAwesomeModule
    ],
    providers   : [
    ],
   entryComponents : [AddFaqDialog,EditFaqDialog]
})
export class FaqChangeModule
{
}

