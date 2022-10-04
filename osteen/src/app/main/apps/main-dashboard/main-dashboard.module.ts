import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule,MatTooltipModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { MainDashboardComponent } from 'app/main/apps/main-dashboard/main-dashboard.component';
import { OrderModule } from 'ngx-order-pipe';
const routes = [
    {
        path     : '**',
        component: MainDashboardComponent
    }
];

@NgModule({
    declarations: [
        MainDashboardComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FuseSharedModule,
        OrderModule,
        MatTooltipModule
    ]
})
export class MainDashboardModule
{
}
