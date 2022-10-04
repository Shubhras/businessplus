import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatDatepickerModule,MatCheckboxModule,MatTooltipModule,MatToolbarModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { InitiativeDataComponent,UserCommentSheet} from 'app/main/apps/strategic-obj/initiative-data/initiativedata.component';
// import { EditInitiativeDialog } from './editinitiative.component';
// import { AddInitiativeDialog} from 'app/main/apps/strategic-obj/initiative-add/addinitiative.component';
// import { EditInitiativeDialog} from 'app/main/apps/strategic-obj/initiative-data/editinitiative.component';
import { DatePipe } from '@angular/common';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
const routes: Routes = [
    {
        path     : '**',
        component: InitiativeDataComponent,
        resolve  : {
        }
    }
];
@NgModule({
    declarations: [
        InitiativeDataComponent,
        // AddInitiativeDialog,
        // EditInitiativeDialog,
        UserCommentSheet
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
        MatTooltipModule,
        MatBottomSheetModule,
        MatToolbarModule
    ],
    providers   : [
        DatePipe
    ],
   entryComponents : [UserCommentSheet]
})
export class InitiativedataModule
{
}

