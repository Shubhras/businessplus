<?php
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */
if (version_compare(PHP_VERSION, '7.2.0', '>=')) {
    error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);
}
Route::options('{any}', function () {
    return response('OK', \Illuminate\Http\Response::HTTP_NO_CONTENT)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Content-Type, x-xsrf-token, text/html, x_csrftoken,X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding');
});

Route::get('/api-test', function () {
    return 'Hello World';
});

//Cron Apis
Route::get('/artisan-schedule-run', function () {
    $exitCode = Artisan::call('schedule:run');
    return 'succes';
});

Route::post('/api-review-actual-data', 'ApiKpiController@api_review_actual_data_cron');
Route::get('/api-get-select-modules', 'ModuleController@api_get_select_modules');
Route::get('/api-review-mail-action-plan', 'ApiMailFunAutoReminder@api_review_mail_action_plan');
//Apis  for Check Token and Validator
Route::group(['middleware' => ['Check_Token_And_Validator']], function () {

    Route::post('/api-view-profile', 'ApiProfileController@api_view_profile');
    Route::post('/api-update-profile', 'ApiProfileController@api_update_profile');
    Route::post('/api-delete-user', 'ApiProfileController@api_delete_user');
    Route::post('/api-update-profile-picture', 'ApiProfileController@api_update_profile_picture');
    Route::post('/api-get-single-user-details', 'ApiProfileController@api_get_single_user_details');

    //Api authentication route
    Route::post('/api-user-signup-file', 'ApiAuthController@api_user_signup_file');
    Route::post('/api-change-password', 'ApiAuthController@api_change_password');
    Route::post('/api-get-user-details', 'ApiAuthController@api_get_user_details');

    //Api project route
    Route::post('/api-projects', 'ApiProjectController@api_projects');
    Route::post('/api-update-single-project', 'ApiProjectController@api_update_single_project');
    Route::post('/api-view-projects', 'ApiProjectController@api_view_projects');
    Route::post('/api-view-single-project', 'ApiProjectController@api_view_single_projects');
    Route::post('/api-delete-single-project', 'ApiProjectController@api_delete_single_projects');
    Route::post('/api-view-projects-details', 'ApiProjectController@api_view_projects_details');
    Route::post('/api-delete-projects', 'ApiProjectController@api_delete_projects');
    Route::post('/api-remark-projects', 'ApiProjectController@api_remark_projects');
    Route::post('/api-view-projects-remark', 'ApiProjectController@api_view_projects_remark');
    Route::post('/api-edit-projects-remark', 'ApiProjectController@api_edit_projects_remark');
    Route::post('/api-delete-projects-remark', 'ApiProjectController@api_delete_projects_remark');
    Route::post('/api-view-projects-remark-file', 'ApiProjectController@api_view_projects_remark_file');
    Route::post('/api-delete-projects-remark-file', 'ApiProjectController@api_delete_projects_remark_file');
    Route::post('/api-issue-tracker-remark', 'ApiProjectController@api_issue_tracker_remark');
    Route::post('/api-view-single-row-data', 'ApiProjectController@api_view_single_remark_data');
    Route::post('/api-poject-view-graph', 'ApiProjectController@api_poject_view_graph');
    Route::post('/api-view-poject-dashboard', 'ApiProjectController@api_view_project_dashboard');
    Route::post('/api-view-poject-gantt-chart-data', 'ApiProjectController@api_view_poject_gantt_chart_data');
    //Api task route
    Route::post('/get-task-dashboard-data', 'ApiTaskController@get_task_dashboard_data');
    Route::post('/api-add-tasks', 'ApiTaskController@api_add_tasks');
    Route::post('/api-edit-tasks', 'ApiTaskController@api_edit_tasks');
    Route::post('/api-view-tasks', 'ApiTaskController@api_view_tasks');
    Route::post('/api-delete-tasks', 'ApiTaskController@api_delete_tasks');
    Route::post('/api-remark-tasks', 'ApiTaskController@api_remark_tasks');
    Route::post('/api-view-tasks-remark', 'ApiTaskController@api_view_tasks_remark');
    Route::post('/api-view-tasks-details', 'ApiTaskController@api_view_tasks_details');
    Route::post('/api-edit-tasks-remark', 'ApiTaskController@api_edit_tasks_remark');
    Route::post('/api-delete-tasks-remark', 'ApiTaskController@api_delete_tasks_remark');
    Route::post('/api-view-tasks-remark-file', 'ApiTaskController@api_view_tasks_remark_file');
    Route::post('/api-delete-tasks-remark-file', 'ApiTaskController@api_delete_tasks_remark_file');
    Route::post('/api-view-task-dashboard', 'ApiTaskController@api_view_task_dashboard');

    //Api Event Route
    Route::post('/api-add-events-task', 'ApiEventController@api_add_events');
    Route::post('/api-update-events-task', 'ApiEventController@api_update_events');
    Route::post('/api-view-events-task', 'ApiEventController@api_view_events');
    Route::post('/api-delete-events-task', 'ApiEventController@api_delete_events');

    //Api KPI Trackers route.
    Route::post('/api-business-plans', 'ApiBusinessPlanController@api_business_plans');
    Route::post('/api-view-business-plans', 'ApiBusinessPlanController@api_view_business_plans');
    Route::post('/api-edit-business-plans', 'ApiBusinessPlanController@api_edit_business_plans');
    //Api KPI Trackers route.
    Route::post('/api-get-kpi', 'ApiKpiController@api_get_kpi');
    Route::post('/api-get-kpi-actionplan', 'ApiKpiController@api_get_kpi_to_action_plan');
    Route::post('/api-kpi-trackers', 'ApiKpiController@api_kpi_trackers');
    Route::post('/api-view-kpi-trackers', 'ApiKpiController@api_view_kpi_trackers');
    Route::post('/api-edit-kpi-trackers', 'ApiKpiController@api_edit_kpi_trackers');
    Route::post('/api-delete-kpi-trackers', 'ApiKpiController@api_delete_kpi_trackers');
    Route::post('/api-view-kpi-trackers-track', 'ApiKpiController@api_view_kpi_trackers_track');
    Route::post('/api-view-lead-kpi-trackers-track', 'ApiKpiController@api_view_lead_kpi_trackers_track');
    Route::post('/view-kpi-dashboard', 'ApiKpiController@view_kpi_dashboard');
    Route::post('/view-lead-kpi-dashboard', 'ApiKpiController@view_lead_kpi_dashboard');
    Route::post('/api-target-actual-update', 'ApiKpiController@api_target_actual_update');
    Route::post('/api-new-kpi-trackers-track', 'ApiKpiController@api_new_kpi_trackers_track');
    Route::post('/api-dashboard-review-actual-data', 'ApiKpiController@api_dashboard_review_actual_data');

    //Api KPI Performance dashboard route.
    Route::post('/api-get-kpi-performance-dash', 'ApiKpiPerformanceDashboardController@api_get_kpi_performance_dash');
    Route::post('/api-view-kpi-performance', 'ApiKpiPerformanceDashboardController@api_view_kpi_performance');
    Route::post('/api-update-performance-kpi', 'ApiKpiPerformanceDashboardController@api_update_performance_kpi');
    Route::post('/api-view-performance-kpi-dashboard', 'ApiKpiPerformanceDashboardController@api_view_performance_kpi_dashboard');
    Route::post('/api-view-performance-status-kpi-dashboard', 'ApiKpiPerformanceDashboardController@api_view_performance_status_kpi_dashboard');
    //Api strategic objectives route.

    Route::post('/get-str-obj-status', 'ApiStrategicObjectivesController@get_str_obj_status');
    Route::post('/api-strategic-objectives', 'ApiStrategicObjectivesController@api_strategic_objectives');
    Route::post('/api-view-strategic-objectives', 'ApiStrategicObjectivesController@api_view_strategic_objectives');
    Route::post('/api-edit-strategic-objectives', 'ApiStrategicObjectivesController@api_edit_strategic_objectives');
    Route::post('/api-delete-strategic-objectives', 'ApiStrategicObjectivesController@api_delete_strategic_objectives');
    Route::post('/strategic-objectives-data', 'ApiStrategicObjectivesController@api_view_strategic_objectives_data');
    Route::post('/get-strategic-objectives', 'ApiStrategicObjectivesController@get_strategic_objectives');
    Route::post('/api-strobj-update-comment', 'ApiStrategicObjectivesController@api_str_obj_update_comment');
    Route::post('/api-strobj-review', 'ApiStrategicObjectivesController@api_str_obj_review');
    Route::post('/api-dash-board-strategic-objectives-data', 'ApiStrategicObjectivesController@api_dash_board_strategic_objectives_data');
    Route::post('/api-str-obj-grandchart', 'ApiStrategicObjectivesController@api_view_str_obj_grand_chart');
    Route::post('/view-strategic-objectives-dash', 'ApiStrategicObjectivesController@api_view_strategic_objectives_initiative');
    Route::post('/api-flow-chart-strategic-objectives-data', 'ApiStrategicObjectivesController@api_flow_chart_strategic_objectives_data');
    //Api Get Initiatives Route.

    Route::post('/get-initiatives', 'ApiInitiativesController@get_initiatives');
    Route::post('/api-add-initiatives', 'ApiInitiativesController@api_add_initiatives');
    Route::post('/api-view-initiative', 'ApiInitiativesController@api_view_initiative');
    Route::post('/edit-initiative', 'ApiInitiativesController@api_edit_initiatives');
    Route::post('/delete-initiative', 'ApiInitiativesController@api_delete_initiatives');
    Route::post('/api-initiatives-update-comment', 'ApiInitiativesController@api_initiatives_update_comment');

    //Api Get ActionPlan Route.
    Route::post('/api-get-actionplans', 'ApiActionPlansController@api_get_actionplan');
    Route::post('/api-add-action-plans', 'ApiActionPlansController@api_add_action_plans');
    Route::post('/initiative-and-actionplan', 'ApiActionPlansController@api_view_initiative_and_action_plan');
    Route::post('/edit-action-plan', 'ApiActionPlansController@api_edit_action_plan');
    Route::post('/delete-action-plan', 'ApiActionPlansController@api_delete_action_plan');
    Route::post('/add-action-plan-schedules', 'ApiActionPlansController@api_add_action_plan_schedules');
    Route::post('/action-plan-schedules-user', 'ApiActionPlansController@action_plan_schedules_user');
    Route::post('/api-action-plan-schedule-data', 'ApiActionPlansController@api_action_plan_schedule_data');
    Route::post('/api-action-plan-update-comment', 'ApiActionPlansController@api_action_plan_update_comment');
    Route::post('/api-action-plan-comment', 'ApiActionPlansController@api_action_plan_comment');
    Route::post('/api-get-user-list-dept-wise', 'ApiActionPlansController@api_get_user_list_dept_wise');

    //Api select master module route.

    Route::post('/api-get-module', 'ModuleController@get_module');
    Route::post('/api-get-module-data', 'ModuleController@get_module_data');
    Route::post('/api-update-role-module', 'ModuleController@api_update_role_module');
    Route::post('/api-get-menu', 'ModuleController@api_get_menu');
    Route::post('/api-view-priorities', 'ModuleController@get_module');

    //task priorities.
    Route::post('/api-add-priorities', 'ModuleController@api_add_priorities');
    Route::post('/api-view-priorities', 'ModuleController@api_view_priorities');
    Route::post('/api-update-priorities', 'ModuleController@api_update_priorities');
    Route::post('/api-delete-priorities', 'ModuleController@api_delete_priorities');

    // company profile route.
    Route::post('/api-company-setting-update', 'ApiCompanyProfileController@api_company_setting_update');
    Route::post('/api-company-setting-view', 'ApiCompanyProfileController@api_company_setting_view');

    // Unit route.
    Route::post('/api-get-unit', 'ApiUnitController@api_get_unit');
    Route::post('/api-unit', 'ApiUnitController@api_unit');
    Route::post('/api-view-unit', 'ApiUnitController@api_view_unit');
    Route::post('/api-edit-unit', 'ApiUnitController@api_edit_unit');
    Route::post('/api-delete-unit', 'ApiUnitController@api_delete_unit');

    //Section route.
    Route::post('/api-section', 'SectionController@api_section');
    Route::post('/api-view-section', 'SectionController@api_view_section');
    Route::post('/api-section-update', 'SectionController@api_section_update');
    Route::post('/api-delete-section', 'SectionController@api_delete_section');

    // Department route.
    Route::post('/api-department', 'ApiDepartmentController@api_department');
    Route::post('/api-view-department', 'ApiDepartmentController@api_view_department');
    Route::post('/api-edit-department', 'ApiDepartmentController@api_edit_department');
    Route::post('/api-delete-department', 'ApiDepartmentController@api_delete_department');
    Route::post('/api-get-predefine-dept', 'ApiDepartmentController@api_get_predefine_dept');
    // Get all departmentr
    Route::post('/api-get-all-', 'ApiDepartmentController@get_all_department');
    // Categories route.department
    Route::post('/api-add-category', 'CategoryController@api_add_category');
    Route::post('/api-view-category', 'CategoryController@api_view_category');
    Route::post('/api-update-category', 'CategoryController@api_update_category');
    Route::post('/api-delete-category', 'CategoryController@api_delete_category');

    // Business initiatives route.
    Route::post('/api-add-business_initiatives', 'BusinessInitiativesController@api_add_business_initiatives');
    Route::post('/api-view-business_initiatives', 'BusinessInitiativesController@api_view_business_initiatives');
    Route::post('/api-update-business_initiatives', 'BusinessInitiativesController@api_update_business_initiatives');
    Route::post('/api-delete-business_initiatives', 'BusinessInitiativesController@api_delete_business_initiatives');

    // UOM route.
    Route::post('/api-add-uom', 'ApiUOMController@api_add_uom');
    Route::post('/api-view-uom', 'ApiUOMController@api_view_uom');
    Route::post('/api-update-uom', 'ApiUOMController@api_update_uom');
    Route::post('/api-delete-uom', 'ApiUOMController@api_delete_uom');

    //FAQS route.
    Route::post('/api-add-faq', 'FAQSController@api_add_faq');
    Route::post('/api-view-faq', 'FAQSController@api_view_faq');
    Route::post('/api-update-faq', 'FAQSController@api_update_faq');
    Route::post('/api-delete-faq', 'FAQSController@api_delete_faq');

    //Business priority route.
    Route::post('/api-add-business-priority', 'ApiBusinessPriorityController@api_add_business_priority');
    Route::post('/api-view-business-priority', 'ApiBusinessPriorityController@api_view_business_priority');
    Route::post('/api-update-business-priority', 'ApiBusinessPriorityController@api_update_business_priority');
    Route::post('/api-delete-business-priority', 'ApiBusinessPriorityController@api_delete_business_priority');

    //Business objecctives route.
    Route::post('/api-add-business-objective', 'ApiBusinessObjectiveController@api_add_business_objective');
    Route::post('/api-view-business-objective', 'ApiBusinessObjectiveController@api_view_business_objective');
    Route::post('/api-update-business-objective', 'ApiBusinessObjectiveController@api_update_business_objective');
    Route::post('/api-delete-business-objective', 'ApiBusinessObjectiveController@api_delete_business_objective');

    //strengths route.
    Route::post('/api-add-strength', 'ApiStrengthsController@api_add_strength');
    Route::post('/api-view-strength', 'ApiStrengthsController@api_view_strength');
    Route::post('/api-update-strength', 'ApiStrengthsController@api_update_strength');
    Route::post('/api-delete-strength', 'ApiStrengthsController@api_delete_strength');

    //strengths route
    Route::post('/api-add-weaknesses', 'ApiWeaknessesController@api_add_weaknesses');
    Route::post('/api-view-weaknesses', 'ApiWeaknessesController@api_view_weaknesses');
    Route::post('/api-update-weaknesses', 'ApiWeaknessesController@api_update_weaknesses');
    Route::post('/api-delete-weaknesses', 'ApiWeaknessesController@api_delete_weaknesses');

    //opportunities route.
    Route::post('/api-add-opportunities', 'ApiOpportunitiesController@api_add_opportunities');
    Route::post('/api-view-opportunities', 'ApiOpportunitiesController@api_view_opportunities');
    Route::post('/api-update-opportunities', 'ApiOpportunitiesController@api_update_opportunities');
    Route::post('/api-delete-opportunities', 'ApiOpportunitiesController@api_delete_opportunities');

    //threats route.
    Route::post('/api-add-threats', 'ApiThreatsController@api_add_threats');
    Route::post('/api-view-threats', 'ApiThreatsController@api_view_threats');
    Route::post('/api-update-threats', 'ApiThreatsController@api_update_threats');
    Route::post('/api-delete-threats', 'ApiThreatsController@api_delete_threats');

    //Hoshin Kanri route.
    Route::post('/api-add-hoshinkanri', 'ApiHoshinKanriController@api_add_hoshin_kanri');
    Route::post('/api-view-hoshinkanri', 'ApiHoshinKanriController@api_view_hoshin_kanri');

    //Quarterly Update Manufacturing.
    Route::post('/quarterly-add-manufacturing', 'QuarterlyUpdateManufacturingController@Quarterly_add_Manufacturing');
    Route::post('/quarterly-view-manufacturing', 'QuarterlyUpdateManufacturingController@api_quarterly_view_manufacturing');
    Route::post('/quarterly-delete-manufacturing', 'QuarterlyUpdateManufacturingController@api_quarterly_delete_manufacturing');
    Route::post('/quarterly-edit-manufacturing', 'QuarterlyUpdateManufacturingController@api_quarterly_edit_manufacturing');
    Route::post('/quarterly-details-manufacturing', 'QuarterlyUpdateManufacturingController@api_quarterly_filter_manufacturing');

    //New Company SetUp.
    Route::post('/api-new-company-setup', 'ApiNewCompanySetup@api_new_company_setup');
    Route::post('/api-view-new-company-setup', 'ApiNewCompanySetup@api_view_new_company_setup');
});
// Handle Groups for user profile
Route::post('/api-create-group', 'ApiProfileController@api_create_group');
Route::post('/api-view-profile-joined-group', 'ApiProfileController@api_view_profile_joined_group');
Route::post('/api-add-participant-to-group', 'ApiProfileController@api_add_participant_to_group');
Route::post('/api-get-profile-user-by-group-id', 'ApiProfileController@api_get_profile_user_by_group_id');
Route::post('/api-profile-delete-group', 'ApiProfileController@api_profile_delete_group');
Route::post('/api-get-profile-group-details', 'ApiProfileController@api_get_profile_group_details');
Route::post('/api-edit-profile-group-update', 'ApiProfileController@api_edit_profile_group_update');
// Post route
Route::post('/api-get_post', 'ApiProfileController@get_post');
Route::post('/api-create_post', 'ApiProfileController@create_post');

// Get actual monnths late entry by KPI id
Route::post('/api-view-kpi-actuals-lateentry', 'ApiKpiController@api_view_actual_lateentry_data');
//New Objective Step Setup.
Route::post('/api-add-objectives-steps', 'ApiObjectivesStepsController@add_objectives__steps');
Route::post('/api-get-objectives-steps', 'ApiObjectivesStepsController@get_objectives_steps');
//create so serial number
Route::post('/api-so-sno', 'ApiStrategicObjectivesController@api_so_sno');
//Api get strategic-objectives-status-bygroup
Route::post('/api-view-strategic-objectives-status-bygroup', 'ApiStrategicObjectivesController@api_view_strategic_objectives_status_bygroup');

//Apis  for Check only Vlidators.
Route::group(['middleware' => ['Check_Validator']], function () {
    // get section without accessToken.
    Route::post('/get-section', 'ApiController@get_section');
    //Api Authentication Route without accessToken.
    Route::post('/api-user-login', 'ApiAuthController@api_user_login');
    Route::post('/api-user-signup', 'ApiAuthController@api_user_signup');
    Route::post('/api-reset-password', 'ApiAuthController@api_reset_password');
    Route::post('/api-resetpassword-update', 'ApiAuthController@api_resetpassword_update');
    //Api Get Dept without accessToken.
    Route::post('/api-get-dept-signup', 'ApiDepartmentController@api_get_dept_signup');
    Route::post('/api-get-department', 'ApiDepartmentController@get_department');
    //Api get Section without accessToken.
    Route::post('/api-get-section-signup', 'SectionController@api_get_section_signup');

});
