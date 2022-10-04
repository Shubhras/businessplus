import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatDividerModule, MatIconModule, MatTabsModule, MatMenuModule, MatSelectModule, MatInputModule, MatDatepickerModule, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatToolbarModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { ProfileService } from './profile.service';
import { ProfileComponent } from './profile.component';
import { ProfileTimelineComponent } from './tabs/timeline/timeline.component';
import { ProfileAboutComponent } from './tabs/about/about.component';
import { ProfilePhotosVideosComponent } from './tabs/photos-videos/photos-videos.component';
import { DatePipe } from '@angular/common';
import { AddparticipantComponent } from './tabs/about/addparticipant/addparticipant.component';
import { DeleteparticipantComponent } from './tabs/about/deleteparticipant/deleteparticipant.component';
import { CreategroupComponent } from './tabs/about/creategroup/creategroup.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditgroupComponent } from './tabs/about/editgroup/editgroup.component';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown/ng-multiselect-dropdown.module';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
//import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown-angular7';
const routes = [
    {
        path: '**',
        component: ProfileComponent,
        resolve: {
            profile: ProfileService
        }
    }
];

@NgModule({
    declarations: [
        ProfileComponent,
        ProfileTimelineComponent,
        ProfileAboutComponent,
        ProfilePhotosVideosComponent,
        AddparticipantComponent,
        DeleteparticipantComponent,
        CreategroupComponent,
        EditgroupComponent,
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatDividerModule,
        MatIconModule,
        MatTabsModule,
        MatMenuModule,
        MatSelectModule,
        MatInputModule,
        FuseSharedModule,
        MatDatepickerModule,
        MatDialogModule,
        MatToolbarModule,
        NgMultiSelectDropDownModule.forRoot()
    ],
    providers: [
        ProfileService,
        DatePipe
    ],
    entryComponents: [CreategroupComponent, AddparticipantComponent, EditgroupComponent]
})
export class ProfileModule {
}
