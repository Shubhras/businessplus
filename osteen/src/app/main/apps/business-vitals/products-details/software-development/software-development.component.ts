import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, AuthenticationService, UserService } from '../../../_services';
import { Lightbox } from 'ngx-lightbox';
import "dhtmlx-gantt";
import { TaskService } from "app/main/apps/_services/task.service";
import { LinkService } from "app/main/apps/_services/link.service";
@Component({
    selector: 'software-development',
    templateUrl: './software-development.component.html',
    styleUrls: ['./software-development.component.scss'],
    providers: [TaskService, LinkService],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class SoftwareDevelopmentComponent implements OnInit {
    @ViewChild("gantt_here_project") ganttContainer: ElementRef;
    currentUser: any;
    //private _albums: Array<any>;
    constructor(
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private _lightbox: Lightbox,
        public dialog: MatDialog,
        private taskService: TaskService,
        private linkService: LinkService
    ) {

    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        gantt.init(this.ganttContainer.nativeElement);
        Promise.all([this.taskService.get(), this.linkService.get()])
            .then(([data, links]) => {
                gantt.parse({ data, links });
            });
    }
}
