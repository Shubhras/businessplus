import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule,MatSelectModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { RegisterComponent } from 'app/main/apps/register/register.component';
const routes = [
    {
        path     : 'register',
        component: RegisterComponent
    }
];
@NgModule({
    declarations: [
        RegisterComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FuseSharedModule,
        MatSelectModule
    ]
})
export class RegisterModule
{
}
