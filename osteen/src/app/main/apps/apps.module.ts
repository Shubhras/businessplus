import { NgModule } from '@angular/core';
import { RouterModule, Router, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { LoginModule } from 'app/main/apps/login/login.module';
import { RegisterModule } from './register/register.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { AuthGuard } from './_guards';
import { AuthenticationService } from './_services';
//import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
//import { ActionPlanHelpComponent } from './strategic-obj/action-plan-help/action-plan-help.component';
//import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';
// import { ToolbarModule } from 'app/layout/components/toolbar/toolbar.module';
const routes = [
    {
        path: 'home',
        loadChildren: './home/home.module#HomeModule'
    },
    {
        path: 'register',
        loadChildren: './register/register.module#RegisterModule'
    },
    {
        path: 'invite-user',
        loadChildren: './invite-user/invite-user.module#InviteUserModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'login',
        loadChildren: './login/login.module#LoginModule'
    },
    {
        path: 'profile',
        loadChildren: './profile/profile.module#ProfileModule'
        , canActivate: [AuthGuard]
    },

    //start
    {
        path: 'about',
        loadChildren: './profile/profile.module#ProfileModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'password',
        loadChildren: './change-password/password.module#PasswordModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'company-setup',
        loadChildren: './company-setup/company-setup.module#CompanySetupModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'prima-welcome',
        loadChildren: './prima-welcome/prima-welcome.module#PrimaWelcomeModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'event-home',
        loadChildren: './event-home/event-home.module#EventHomeModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'modules',
        loadChildren: './modules-permission/modules-permission.module#ModulesPermissionModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'setting',
        loadChildren: './module-roles/business-setting/business-setting.module#BusinessSettingModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'module-roles/:id',
        loadChildren: './module-roles/module-roles/module-roles.module#ModuleAccessRolesModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'user-list',
        loadChildren: './module-roles/users-list/user-list.module#UserListModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'unitchange',
        loadChildren: './module-roles/unit-change/unit-change.module#UnitChangeModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'department',
        loadChildren: './module-roles/department-change/department-change.module#DepartmentChangeModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'section',
        loadChildren: './module-roles/section-change/section-change.module#SectionChangeModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'category',
        loadChildren: './module-roles/category-change/category-change.module#CategoryChangeModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'business',
        loadChildren: './module-roles/business-change/business-change.module#BusinessChangeModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'uom',
        loadChildren: './module-roles/uom-change/uom-change.module#UomChangeModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'priority',
        loadChildren: './module-roles/priority-change/priority.module#PriorityChangeModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'faq-change',
        loadChildren: './module-roles/faq-change/faq-change.module#FaqChangeModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'main-dashboard',
        loadChildren: './main-dashboard/main-dashboard.module#MainDashboardModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'dashboards/dashboard',
        loadChildren: './dashboards/dashboard/dashboard.module#TasktrackerDashboardModule'
        , canActivate: [AuthGuard]
    },

    {
        path: 'dashboards/analytics/task/:start',
        loadChildren: './dashboards/analytics/analytics.module#AnalyticsDashboardModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'dashboards/analytics/:statusColorId',
        loadChildren: './dashboards/analytics/analytics.module#AnalyticsDashboardModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'dashboards/analytics-dept-name/:deptName',
        loadChildren: './dashboards/analytics/analytics.module#AnalyticsDashboardModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'dashboards/analytics-status-dept/:statusColorId/:deptName',
        loadChildren: './dashboards/analytics/analytics.module#AnalyticsDashboardModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'dashboards/analytics',
        loadChildren: './dashboards/analytics/analytics.module#AnalyticsDashboardModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'task-events',
        loadChildren: './dashboards/analytics/task-events/task-events.module#TaskEventsModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'dashboards/taskremark/:id',
        loadChildren: './dashboards/analytics-remark/taskremark.module#TaskremarkModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'dashboards/taskfiles/:id',
        loadChildren: './dashboards/analytics-files/taskfiles.module#TaskfilesModule'
        , canActivate: [AuthGuard]
    },

    {
        path: 'dashboards/dashboard-project',
        loadChildren: './dashboards/dashboard-project/dashboard-project.module#DashboardProjectModule'
        , canActivate: [AuthGuard]
    },
    /* {
        path: 'dashboards/project/:deptId',
        loadChildren: './dashboards/project/project.module#ProjectDashboardModule'
        , canActivate: [AuthGuard]
    }, */
    {
        path: 'dashboards/project-dept-name/:deptName',
        loadChildren: './dashboards/project/project.module#ProjectDashboardModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'dashboards/project-status-dept/:statusColorId/:deptName',
        loadChildren: './dashboards/project/project.module#ProjectDashboardModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'dashboards/project-status/:statusColorId',
        loadChildren: './dashboards/project/project.module#ProjectDashboardModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'dashboards/project',
        loadChildren: './dashboards/project/project.module#ProjectDashboardModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'project/project-add',
        loadChildren: './project/project-add/project-add.module#ProjectAddModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'project/project-edit/:id/:stepId',
        loadChildren: './project/project-edit/project-edit.module#ProjectEditModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'project/project-details/:id/:governance',
        loadChildren: './project/project-details/project-details.module#ProjectDetailsModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'project/project-details/:id',
        loadChildren: './project/project-details/project-details.module#ProjectDetailsModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'dashboards/projectremark/:id',
        loadChildren: './dashboards/project-remark/projectremark.module#ProjectremarkModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'dashboards/projectfiles/:id',
        loadChildren: './dashboards/project-files/projectfiles.module#ProjectfilesModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'project/lessons-learnt',
        loadChildren: './project/pro-lessons-learnt/pro-lessons-learnt.module#ProLessonsLearntModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'kpitrackers/dashboard',
        loadChildren: './kpitrackers/dashboard/kpidashboard.module#KpitrackerDashboardModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'kpitrackers/keyperformance/:deptName',
        loadChildren: './kpitrackers/keyperformance/keyperformance.module#KeyperformanceModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'kpitrackers/keyperformance',
        loadChildren: './kpitrackers/keyperformance/keyperformance.module#KeyperformanceModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'kpitrackers/addkpidata',
        loadChildren: './kpitrackers/addkpidata/addkpidata.module#AddkpidataModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'kpitrackers/kpigraph/:id/:kpiid/:comparekpi',
        loadChildren: './kpitrackers/kpidata-graph/kpidatagraph.module#KpidatagraphModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'kpitrackers/kpigraph/:id',
        loadChildren: './kpitrackers/kpidata-graph/kpidatagraph.module#KpidatagraphModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/dashboard',
        loadChildren: './strategic-obj/dashboard/strategicdashboard.module#StrategicDashboardModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/visionmission',
        loadChildren: './strategic-obj/visionmission/visionmission.module#VisionmissionModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/strategic/:statusColorId',
        loadChildren: './strategic-obj/strategic/strategic.module#StrategicModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/strategic-status-dept/:statusColorId/:deptName',
        loadChildren: './strategic-obj/strategic/strategic.module#StrategicModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/started/:getStarted',
        loadChildren: './strategic-obj/strategic/strategic.module#StrategicModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/strategic',
        loadChildren: './strategic-obj/strategic/strategic.module#StrategicModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/str-initi-action-kpi/:strObjId',
        loadChildren: './strategic-obj/str-initi-action-kpi/str-initi-action-kpi.module#StrInitiActionKpiModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/initiative-data/:statusColorId',
        loadChildren: './strategic-obj/initiative-data/initiativedata.module#InitiativedataModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/initiative-data-status-dept/:statusColorId/:deptName',
        loadChildren: './strategic-obj/initiative-data/initiativedata.module#InitiativedataModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/initiative-data',
        loadChildren: './strategic-obj/initiative-data/initiativedata.module#InitiativedataModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/action-plan/:statusColorId',
        loadChildren: './strategic-obj/action-plan/actionplan.module#ActionPlanModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/action-plan',
        loadChildren: './strategic-obj/action-plan/actionplan.module#ActionPlanModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/action-plan-comment/:id',
        loadChildren: './strategic-obj/action-plan-comment/action-comment.module#ActionCommentModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/initiative',
        loadChildren: './strategic-obj/initiative/initiative.module#InitiativeModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/master-action',
        loadChildren: './strategic-obj/master-action/master-action.module#MasterActionModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/hoshin',
        loadChildren: './strategic-obj/hoshin-kanri/hoshin-kanri.module#HoshinKanriModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/graph',
        loadChildren: './strategic-obj/strategic-graph/strategic-graph.module#StrategicGraphModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/leadkpi',
        loadChildren: './strategic-obj/lead-kpi/lead-kpi.module#LeadKpiModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/performance-report',
        loadChildren: './strategic-obj/performance-report/performance-report.module#PerformReportModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/priority',
        loadChildren: './strategic-obj/business-priority/priority.module#BusinessPriorityModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/objective',
        loadChildren: './strategic-obj/business-objective/objective.module#BusinessObjectiveModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/swot',
        loadChildren: './strategic-obj/swot-analysis/swot-analysis.module#SwotAnalysisModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'company-performances',
        loadChildren: './strategic-obj/company-performances/performances.module#PerformancesModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/qtly-summary',
        loadChildren: './strategic-obj/quarterly-summary/qtly-summary.module#QtlySummaryModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-obj/view-qtly-summary/:id/:deptId',
        loadChildren: './strategic-obj/view-qtly-summary/view-qtly-summary.module#ViewQtlySummaryModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'finance-operations',
        loadChildren: './finance-operations/finance-operations.module#FinanceOperationsModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'prima-navigation',
        loadChildren: './prima-navigation/prima-navigation.module#PrimaNavigationModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'governance',
        loadChildren: './business-vitals/governance/governance.module#GovernanceModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'view-governance',
        loadChildren: './business-vitals/governance-view/governance-view.module#GovernanceViewModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'presentation',
        loadChildren: './business-vitals/presentation/presentation.module#PresentationModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'view-presentation',
        loadChildren: './business-vitals/presentation-view/presentation-view.module#PresentationViewModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'facility',
        loadChildren: './business-vitals/facility/facility.module#FacilityModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'photograph',
        loadChildren: './business-vitals/photograph/photograph.module#PhotographModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'procedure',
        loadChildren: './business-vitals/procedure-template/procedure.module#ProcedureModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'products-services',
        loadChildren: './business-vitals/products-services/products-services.module#ProductsServicesModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'location-facility',
        loadChildren: './business-vitals/facility-details/location/location.module#LocationModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'layout-facility',
        loadChildren: './business-vitals/facility-details/layout-facility/layout-facility.module#LayoutFacilityModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'machine-facility',
        loadChildren: './business-vitals/facility-details/machine-facility/machine-facility.module#MachineFacilityModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'infrastructure',
        loadChildren: './business-vitals/facility-details/infrastructure/infrastructure.module#InfrastructureModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'media-photography',
        loadChildren: './business-vitals/photography/photography-media/photography-media.module#PhotographyMediaModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'events-photography',
        loadChildren: './business-vitals/photography/photography-events/photography-events.module#PhotographyEventsModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'celebration',
        loadChildren: './business-vitals/photography/celebration/celebration.module#CelebrationModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'hr-procedure',
        loadChildren: './business-vitals/procedure-details/procedure-hr/procedure-hr.module#ProcedureHrModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'rd-procedure',
        loadChildren: './business-vitals/procedure-details/procedure-rd/procedure-rd.module#ProcedureRdModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'operations',
        loadChildren: './business-vitals/procedure-details/procedure-operations/procedure-operations.module#ProcedureOperationsModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'software-development',
        loadChildren: './business-vitals/products-details/software-development/software-development.module#SoftwareDevelopmentModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'product-development',
        loadChildren: './business-vitals/products-details/product-development/product-development.module#ProductDevelopmentModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'big-data-services',
        loadChildren: './business-vitals/products-details/big-data-services/big-data.module#BigDataModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'faq',
        loadChildren: './prima-navigation/business-faq/business-faq.module#FaqBusinessModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'knowledge-base',
        loadChildren: './prima-navigation/knowledge-base/knowledge-base.module#KnowledgeBaseModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'prima-process',
        loadChildren: './prima-navigation/prima-process/prima-process.module#PrimaProcessModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'prima-demo',
        loadChildren: './prima-navigation/prima-demo/prima-demo.module#PrimaDemoModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'mail',
        loadChildren: './mail/mail.module#MailModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'mail-ngrx',
        loadChildren: './mail-ngrx/mail.module#MailNgrxModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'chat',
        loadChildren: './chat/chat.module#ChatModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'calendar',
        loadChildren: './calendar/calendar.module#CalendarModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'todo',
        loadChildren: './todo/todo.module#TodoModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'action-help',
        loadChildren: './strategic-obj/action-plan-help/action-plan-help.module#ActionPlanHelpModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'master-action-plan',
        loadChildren: './strategic-obj/master-action-plan/master-action-plan.module#MasterActionPlanModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-help',
        loadChildren: './strategic-obj/strategic-help/strategic-help.module#StrategicHelpModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'strategic-initiative-help',
        loadChildren: './strategic-obj/strategic-initiative-help/strategic-initiative-help.module#StrategicInitiativeHelpModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'action-plan-help',
        loadChildren: './strategic-obj/action-help/action-help.module#ActionHelpModule'
        , canActivate: [AuthGuard]
    },
      {
        path: 'action-plan-help',
        loadChildren: './strategic-obj/action-help/action-help.module#ActionHelpModule'
        , canActivate: [AuthGuard]
    },  
    {
        path: 'business-plan-view/:strObjId',
        loadChildren: './strategic-obj/business-plan-view/business-plan-view.module#BusinessPlanViewModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'business-plan-list-view',
        loadChildren: './strategic-obj/plan-tree-view/plan-tree-view.module#PlanTreeViewModule'
        , canActivate: [AuthGuard]
    },
    {
        path: 'welcome-screen',
        loadChildren: './welcome-screen/welcome-screen.module#WelcomeScreenModule'
        , canActivate: [AuthGuard]
    },

    {
        path: 'contacts',
        loadChildren: './contacts/contacts.module#ContactsModule'
        , canActivate: [AuthGuard]
    },

    {
        path: 'Onboard',
        loadChildren: './first-plan-setup/first-plan-setup.module#FirstPlanSetupModule'
        , canActivate: [AuthGuard]
    },
    // {
    //     path: 'toolbar',
    //     loadChildren: 'app/layout/components/toolbar/toolbar.module#ToolbarModule'
    //     , canActivate: [AuthGuard]
    // }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule,
        LoginModule,
        RegisterModule,
        ForgotPasswordModule,
        ResetPasswordModule,
        
        //KnowledgeBaseModule
    ],
    providers: [AuthenticationService, AuthGuard],
    declarations: []
})
export class AppsModule {
}
