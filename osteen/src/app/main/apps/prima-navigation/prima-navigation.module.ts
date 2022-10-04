import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { PrimaNavigationComponent } from 'app/main/apps/prima-navigation/prima-navigation.component';
import { OrderModule } from 'ngx-order-pipe';
const routes = [
    {
        path     : '**',
        component: PrimaNavigationComponent
    }
];

@NgModule({
    declarations: [
        PrimaNavigationComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FuseSharedModule,
        OrderModule
    ]
})
export class PrimaNavigationModule
{
}
