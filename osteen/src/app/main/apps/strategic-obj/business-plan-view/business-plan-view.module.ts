import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { BusinessPlanViewComponent,ConfirmationDialog,InitiativeDetail,ActionPlanDetail } from "./business-plan-view.component";
import { TreepaneComponent } from './treepane/treepane.component';
import { NodeComponent} from './node/node.component';

import {MatDialogModule, MatSidenav, MatSnackBarModule, MatToolbarModule} from '@angular/material';
// import { NgxOrgChartModule } from 'ngx-org-chart';

import { MatSlideToggleModule,
  MatMenuModule, MatButtonModule, MatIconModule,
  MatCardModule, MatSidenavModule, MatSliderModule, MatCheckboxModule, MatTabsModule, } from '@angular/material';

//import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidenavcontentComponent } from './sidenavcontent/sidenavcontent.component';
import { KpidetailsComponent } from './kpidetails/kpidetails.component';
// import { ConfirmationDialog } from './business-plan-view.component';
const routes: Routes = [
  {
      path: '**',
      component: BusinessPlanViewComponent,
     
  }
];
@NgModule({
  // ,TreepaneComponent,   NodeComponent,
    //SidenavcontentComponent,
   
  declarations: [BusinessPlanViewComponent,TreepaneComponent,   NodeComponent, ConfirmationDialog,InitiativeDetail,ActionPlanDetail,
    SidenavcontentComponent,
    KpidetailsComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    // NgxOrgChartModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatMenuModule,
    FuseWidgetModule,
    MatIconModule,
    MatButtonModule,
    // BrowserAnimationsModule,
    MatTabsModule,
    MatCardModule,
    MatSidenavModule,
    FormsModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSliderModule,
    ReactiveFormsModule,
 
    RouterModule.forChild(routes),
  ],
  entryComponents:[ConfirmationDialog,InitiativeDetail,ActionPlanDetail,KpidetailsComponent],
  bootstrap: [BusinessPlanViewComponent]

})
export class BusinessPlanViewModule{ }
