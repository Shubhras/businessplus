import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FirstPlanSetupComponent } from './first-plan-setup.component';
import { MatStepperModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatDialogModule, MatDatepickerModule, MatCheckboxModule, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatTooltipModule, MatToolbarModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddSectionUnitDialog } from './addsectionunit.component';
// import { InviteUsersComponent } from './invite-users/invite-users.component';

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
    MatFormFieldModule,
    MatInputModule,
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
    
    // BrowserAnimationsModule

  ],
  declarations: [FirstPlanSetupComponent,AddSectionUnitDialog],
  entryComponents: [AddSectionUnitDialog]
  
})
export class FirstPlanSetupModule { }
