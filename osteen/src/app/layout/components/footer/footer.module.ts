import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatToolbarModule, MatDialogModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
//import { ClarityModule } from '@clr/angular';
//import { DialogComponent } from 'app/layout/components/footer/newUser.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
//import { StepperOverviewExample } from 'app/layout/components/footer/userStepper.component';
import { MatMenuModule } from '@angular/material/menu';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatStepperModule } from '@angular/material';
import { StepperOverviewExample } from 'app/main/apps/welcome-screen/userStepper.component';
import { DialogComponent } from 'app/main/apps/welcome-screen/newUser.component';
import { FooterComponent } from 'app/layout/components/footer/footer.component';

@NgModule({
    declarations: [
        FooterComponent,
        // DialogComponent,
        StepperOverviewExample,
        DialogComponent
        //DialogOverviewExampleDialog,
        // StepperOverviewExample
    ],
    imports: [
        RouterModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatToolbarModule,
        BrowserModule,
        MatListModule,
        BrowserAnimationsModule,
        FormsModule,
        MatMenuModule,
        MatDialogModule,
      
        //DialogOverviewExampleDialog,
        //StepperOverviewExample,
        MatStepperModule,
        FuseSharedModule
    ],
    exports: [
        FooterComponent
    ],

     entryComponents: [DialogComponent, StepperOverviewExample]
})
export class FooterModule {
}
