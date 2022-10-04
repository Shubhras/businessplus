import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatStepperModule,MatSelectModule,MatListModule,MatRadioModule} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips'
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { CompanySetupComponent } from 'app/main/apps/company-setup/company-setup.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatExpansionModule} from '@angular/material/expansion';

// import { IvyCarouselModule } from "angular-responsive-carousel";
/* import { ChipsAutocompleteExample } from 'app/main/apps/company-setup/autocomplete/chips-autocomplete.component'; */
const routes = [
    {
        path     : '**',
        component: CompanySetupComponent
    }
];
@NgModule({
    declarations: [
        CompanySetupComponent,
        //ChipsAutocompleteExample
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatButtonModule,
        CdkAccordionModule,
        MatButtonToggleModule,
        // IvyCarouselModule,
        MatExpansionModule,
        NgbModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FuseSharedModule,
        MatStepperModule,
        MatSelectModule,
        MatListModule,
        MatRadioModule,
        MatCheckboxModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatTooltipModule
    ]
})
export class CompanySetupModule
{
}
