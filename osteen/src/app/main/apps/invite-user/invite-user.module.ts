import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteUserComponent } from './invite-user.component';
import { RouterModule, Routes } from '@angular/router';
import { MatStepperModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatDialogModule, MatDatepickerModule, MatCheckboxModule, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatTooltipModule, MatToolbarModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const routes = [
  {
      path     : '**',
      component: InviteUserComponent,
      resolve  : {
      }
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatMenuModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    FlexLayoutModule,
    HttpClientModule,
    MatTooltipModule,
    MatToolbarModule,
  ],
  declarations: [InviteUserComponent]
})
export class InviteUserModule { }
