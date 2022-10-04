import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { MatExpansionModule, MatIconModule,MatButtonModule, MatFormFieldModule,MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatCheckboxModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { FaqBusinessComponent } from './business-faq.component';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
const routes: Routes = [
    {
        path     : '**',
        component: FaqBusinessComponent,
        resolve  : {
        }
    }
];
@NgModule({
    declarations: [
        FaqBusinessComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatExpansionModule,
        MatIconModule,
        FuseSharedModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        MatTableModule,
        MatPaginatorModule ,
        MatInputModule,
        MatDialogModule,
        MatCheckboxModule,
        FuseWidgetModule
    ],
    providers   : [
    ]
})
export class FaqBusinessModule
{
}
