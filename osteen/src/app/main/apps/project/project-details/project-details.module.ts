import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatInputModule, MatDialogModule, MatDatepickerModule, MatDividerModule, MatToolbarModule, MatCardModule, MatTooltipModule, MatStepperModule, MatRadioModule, MatExpansionModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { ProjectDetailsComponent } from 'app/main/apps/project/project-details/project-details.component';
import { ProjectDetailPopupComponent } from 'app/main/apps/project/project-details/majar-activity/majar-activity-popup/project-detail-popup.component';
import { MajarActivityEdit } from 'app/main/apps/project/project-details/majar-activity/majar-activity-edit/majar-activity-edit';
import { SubActivityProjectComponent } from "app/main/apps/project/project-details/project-sub-activity/sub-activity-popup/sub-activity-popup";
import { ProjectKpiPopupComponent } from "app/main/apps/project/project-details/project-kpi/project-kpi-popup/project-kpi-popup-component";
import { ProjectKpiEditComponent } from "app/main/apps/project/project-details/project-kpi/project-kpi-edit/project-kpi-edit-component";
import { ProjectKpiTable } from "app/main/apps/project/project-details/project-kpi/project-kpi-table/project-kpi-table.component";
import { ProKpiMileViewComponent } from "app/main/apps/project/project-details/project-kpi/pro-kpi-mile-view/pro-kpi-mile-view.component";
import { ProKpiDashboardComponent } from './project-kpi/project-kpi-dashboard/project-kpi-dashboard.component';
import { ProjectIssueTrackerPopup } from "app/main/apps/project/project-details/issue-tracker/project-issue-tracker-popup/project-issue-tracker-popup.component";
import { KpiActualValueComponent } from "app/main/apps/project/project-details/project-kpi/kpi-actual-value-form/kpi-actual-value.component";
import { PIssueTrackerComponent } from "app/main/apps/project/project-details/issue-tracker/p-issue-tracker/p-issue-tracker.component";
import { SubActivityTable } from "app/main/apps/project/project-details/project-sub-activity/sub-activity-table/sub-activity-table";
import { SubActivityEdit } from "app/main/apps/project/project-details/project-sub-activity/sub-activity-edit/sub-activity-edit";
import { MajarActivityTable } from "app/main/apps/project/project-details/majar-activity/majar-activity-table/majar-activity-table";
import { DatePipe } from '@angular/common';
import { FuseSidebarModule } from '@fuse/components';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MatGridListModule } from '@angular/material/grid-list';
import { PIssueTrackerEditComponent } from './issue-tracker/p-issue-tracker-edit/p-issue-tracker-edit.component';
import { RiskAccessmentComponent } from "app/main/apps/project/project-details/risk-accessment/risk-accessment-table/risk-accessment-table.component";
import { RiskAccessmentAddComponent } from "app/main/apps/project/project-details/risk-accessment/risk-accessment-add/risk-accessment-add.component";
import { RiskAccessmentEditComponent } from "app/main/apps/project/project-details/risk-accessment/risk-accessment-edit/risk-accessment-edit.component";
import { ResourcePlanningComponent } from "app/main/apps/project/project-details/resource-planning/resource-planning-table/resource-planning-table.component";
import { ResourcePlanningAddComponent } from "app/main/apps/project/project-details/resource-planning/resource-planning-add/resource-planning-add.component";
import { PIssueTrackerRemarkComponent } from './issue-tracker/p-issue-tracker-remark/p-issue-tracker-remark.component';
import { AddIssueReamrkComponent } from './issue-tracker/p-issue-tracker-remark/add-issue-reamrk/add-issue-reamrk.component';
import { EditIssueReamrkComponent } from './issue-tracker/p-issue-tracker-remark/edit-issue-reamrk/edit-issue-reamrk.component';
import { IssueTrackerDashboardComponent } from './issue-tracker/issue-tracker-dashboard/issue-tracker-dashboard.component';
import { GovernanceTableComponent } from "app/main/apps/project/project-details/governance/governance-table/governance-table.component";
import { AddGovernanceComponent } from "app/main/apps/project/project-details/governance/add-governance/add-governance.component";
import { EditGovernanceComponent } from "app/main/apps/project/project-details/governance/edit-governance/edit-governance.component";
import { AgendaComponent } from './governance/governance-table/agenda.component';
import { ProjectDashboard } from "app/main/apps/project/project-details/project Dashboard/project-dashboard.component";
import { ProDeviationsTableComponent } from "./project-deviations/pro-deviations-table/pro-deviations-table.component";
import { AddDeviationsComponent } from './project-deviations/add-deviations/add-deviations.component';
import { EditDeviationsComponent } from './project-deviations/edit-deviations/edit-deviations.component';
import { CdkTableModule } from '@angular/cdk/table';
import { ProjectGanttChartComponent } from "./pro-gantt-chart/pro-gantt-chart.component"
import { ResourceDashboardComponent } from './resource-planning/resource-dashboard/resource-dashboard.component';
import { ProjectMilestoneComponent } from './project-milestone/project-milestone-table/project-milestone-table';
import { MilestoneStatusComponent } from './project-milestone/milestone-status/milestone-status.component';
import { DayPilotModule } from "daypilot-pro-angular";
import { MilestoneAddComponent } from './project-milestone/milestone-add/milestone-add.component';
import { FeedTimelineComponent } from 'app/main/apps/project/project-details//Feed/feed.component';
//import { ProfileTimelineComponent } from 'app/main/apps/profile/tabs/timeline/timeline.component';
//import { ProfileTimelineComponent } from './tabs/timeline/timeline.component';

//import { ProjectDetailsService } from './project-details.service';
import { ProfileService } from 'app/main/apps/profile/profile.service';
import { AddMomComponent } from './governance/add-mom/add-mom.component';
//import { MomComponent } from './governance/governance-table/abmom-view';
const routes: Routes = [
    {
        path: '**',
        component: ProjectDetailsComponent,
        resolve: {
            // profile: ProfileService
        }
    }
];

@NgModule({
    declarations: [
        ProjectDetailsComponent,
        ProjectDetailPopupComponent,
        MajarActivityEdit,
        SubActivityProjectComponent,
        ProjectKpiPopupComponent,
        ProjectKpiEditComponent,
        ProjectKpiTable,
        ProKpiMileViewComponent,
        ProKpiDashboardComponent,
        ProjectIssueTrackerPopup,
        KpiActualValueComponent,
        PIssueTrackerComponent,
        SubActivityTable,
        MajarActivityTable,
        SubActivityEdit,
        PIssueTrackerEditComponent,
        RiskAccessmentComponent,
        RiskAccessmentAddComponent,
        ResourcePlanningComponent,
        ResourcePlanningAddComponent,
        RiskAccessmentEditComponent,
        PIssueTrackerRemarkComponent,
        AddIssueReamrkComponent,
        EditIssueReamrkComponent,
        IssueTrackerDashboardComponent,
        GovernanceTableComponent,
        AddGovernanceComponent,
        AddMomComponent,
        EditGovernanceComponent,
        AgendaComponent,
        //MomComponent,
        ProjectDashboard,
        ProDeviationsTableComponent,
        AddDeviationsComponent,
        EditDeviationsComponent,
        ProjectGanttChartComponent,
        ResourceDashboardComponent,
        ProjectMilestoneComponent,
        MilestoneStatusComponent,
        MilestoneAddComponent,
        // ProfileTimelineComponent,
        FeedTimelineComponent
    ],
    entryComponents: [
        ProjectDetailPopupComponent,
        MajarActivityEdit,
        SubActivityProjectComponent,
        ProjectKpiPopupComponent,
        ProjectKpiEditComponent,
        ProjectKpiTable,
        ProjectIssueTrackerPopup,
        KpiActualValueComponent,
        PIssueTrackerComponent,
        SubActivityTable,
        MajarActivityTable,
        SubActivityEdit,
        PIssueTrackerEditComponent,
        RiskAccessmentAddComponent,
        ResourcePlanningAddComponent,
        RiskAccessmentEditComponent,
        PIssueTrackerRemarkComponent,
        AddIssueReamrkComponent,
        EditIssueReamrkComponent,
        AddGovernanceComponent,
        AddMomComponent,
        EditGovernanceComponent,
        AgendaComponent,
        //MomComponent,
        ProjectDashboard,
        AddDeviationsComponent,
        EditDeviationsComponent,
        MilestoneStatusComponent,
        MilestoneAddComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        MatInputModule,
        MatDialogModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),
        ChartsModule,
        NgxChartsModule,
        FuseSharedModule,
        FuseWidgetModule,
        MatTableModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatDividerModule,
        MatToolbarModule,
        MatCardModule,
        MatTooltipModule,
        MatStepperModule,
        MatRadioModule,
        MatExpansionModule,
        FuseSidebarModule,
        AngularEditorModule,
        AngularFontAwesomeModule,
        MatGridListModule,
        CdkTableModule,
        DayPilotModule
    ],
    providers: [
        //ProjectDetailsService,
        ProfileService,
        DatePipe
    ],
})
export class ProjectDetailsModule {
}

