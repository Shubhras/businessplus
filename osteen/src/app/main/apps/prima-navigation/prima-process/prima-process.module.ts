import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { PrimaProcessComponent } from './prima-process.component';
const routes = [
    {
        path     : '**',
        component: PrimaProcessComponent
    }
];

@NgModule({
    declarations: [
        PrimaProcessComponent
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
export class PrimaProcessModule
{
}
