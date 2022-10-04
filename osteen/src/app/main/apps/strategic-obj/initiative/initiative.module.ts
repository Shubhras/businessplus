import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatInputModule, MatDialogModule, MatDatepickerModule, MatCheckboxModule, MatButtonToggleModule, MatToolbarModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { InitiativeComponent, ChangeReview, UserCommentSheet } from 'app/main/apps/strategic-obj/initiative/initiative.component';
import { InitiativeService } from 'app/main/apps/strategic-obj/initiative/initiative.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { OrderModule } from  'ngx-order-pipe';

const routes: Routes = [
    {
        path: '**',
        component: InitiativeComponent,
        resolve: {
            data: InitiativeService
        }
    }
];
@NgModule({
    declarations: [
        InitiativeComponent,
        ChangeReview,
        UserCommentSheet
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
        OrderModule,
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
        MatExpansionModule,
        MatBottomSheetModule,
        MatButtonToggleModule,
        MatToolbarModule
    ],
    providers: [
        InitiativeService,
        DatePipe
    ],
    entryComponents: [ChangeReview, UserCommentSheet]
})
export class InitiativeModule {
}

