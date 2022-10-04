import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule,MatTableModule ,MatDialogModule,MatButtonToggleModule} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { PrimaWelcomeComponent } from 'app/main/apps/prima-welcome/prima-welcome.component';
import { OrderModule } from 'ngx-order-pipe';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
const routes = [
    {
        path     : '**',
        component: PrimaWelcomeComponent
    }
];

@NgModule({
    declarations: [
        PrimaWelcomeComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FuseSharedModule,
        OrderModule,
        MatTableModule,
        FuseWidgetModule,
        MatDialogModule,
        MatButtonToggleModule
    ]
})
export class PrimaWelcomeModule
{
}
