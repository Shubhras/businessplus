import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FirstPlanSetupComponent } from './first-plan-setup.component';
import { MatStepperModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatDialogModule, MatDatepickerModule, MatCheckboxModule, MatListModule,NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatTooltipModule, MatToolbarModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { HttpClientModule } from '@angular/common/http';
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddSectionUnitDialog } from './addsectionunit.component';
import { AdddepartmentunitComponent } from './adddepartmentunit/adddepartmentunit.component';
// import { InviteUsersComponent } from './invite-users/invite-users.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { SwotDataComponent } from './swot-data/swot-data.component';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { SwotAnalysisComponent} from 'app/main/apps/strategic-obj/swot-analysis/swot-analysis.component';
import { AddStrengths} from 'app/main/apps/strategic-obj/swot-analysis/addstrengths.component';
import { EditStrengths} from 'app/main/apps/strategic-obj/swot-analysis/editstrengths.component';
import { AddWeakness} from 'app/main/apps/strategic-obj/swot-analysis/addweaknesses.component';
import { EditWeakness} from 'app/main/apps/strategic-obj/swot-analysis/editweaknesses.component';
import { AddOpportunities} from 'app/main/apps/strategic-obj/swot-analysis/addopportunities.component';
import { EditOpportunities} from 'app/main/apps/strategic-obj/swot-analysis/editopportunities.component';
import { AddThreats} from 'app/main/apps/strategic-obj/swot-analysis/addthreats.component';
import { EditThreats} from 'app/main/apps/strategic-obj/swot-analysis/editthreats.component';
const routes = [
  {
    path: '**',
    component: FirstPlanSetupComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    // BrowserModule,
    CommonModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    ChartsModule,
    MatInputModule,
    FuseSharedModule,
    AgmCoreModule,
    NgxChartsModule,
    FuseWidgetModule,
    FormsModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    FlexLayoutModule,
    HttpClientModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatToolbarModule,
    MatListModule
    // BrowserAnimationsModule

  ],
  declarations: [FirstPlanSetupComponent,AddSectionUnitDialog, AdddepartmentunitComponent, SwotDataComponent,
    // AddStrengths,
    // EditStrengths,
    // AddWeakness,
    // EditWeakness,
    // AddOpportunities,
    // EditOpportunities,
    // AddThreats,
    // EditThreats
  ],
  entryComponents: [AddSectionUnitDialog, AdddepartmentunitComponent,
    // AddWeakness,
    // EditWeakness,
    // AddStrengths,
    // EditStrengths,
    // AddOpportunities,
    // EditOpportunities,
    // AddThreats,
    // EditThreats
  ]
  
})
export class FirstPlanSetupModule { }
