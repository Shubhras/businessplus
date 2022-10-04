import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { EventHomeComponent } from 'app/main/apps/event-home/event-home.component';
const routes = [
    {
        path     : '**',
        component: EventHomeComponent
    }
];

@NgModule({
    declarations: [
        EventHomeComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        FuseSharedModule
    ]
})
export class EventHomeModule
{
}
