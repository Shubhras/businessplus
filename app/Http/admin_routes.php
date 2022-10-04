<?php

Route::options('{any}', function () {
    return response('OK', \Illuminate\Http\Response::HTTP_NO_CONTENT)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Content-Type, x-xsrf-token, text/html, x_csrftoken,X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding');
});
Route::auth();

/* ================== Access Uploaded Files ================== */
Route::get('files/{hash}/{name}', 'LA\UploadsController@get_file');

/*
|--------------------------------------------------------------------------
| Admin Application Routes
|--------------------------------------------------------------------------
*/

$as = "";
if (\Dwij\Laraadmin\Helpers\LAHelper::laravel_ver() == 5.3) {
	$as = config('laraadmin.adminRoute') . '.';

	// Routes for Laravel 5.3
	Route::get('/logout', 'Auth\LoginController@logout');
}

Route::group(['as' => $as, 'middleware' => ['auth', 'permission:ADMIN_PANEL']], function () {

	/* ================== Dashboard ================== */

	Route::get(config('laraadmin.adminRoute'), 'LA\DashboardController@index');
	Route::get(config('laraadmin.adminRoute') . '/dashboard', 'LA\DashboardController@index');

	/* ================== Users ================== */
	Route::resource(config('laraadmin.adminRoute') . '/users', 'LA\UsersController');
	Route::get(config('laraadmin.adminRoute') . '/user_dt_ajax', 'LA\UsersController@dtajax');

	/* ================== Uploads ================== */
	Route::resource(config('laraadmin.adminRoute') . '/uploads', 'LA\UploadsController');
	Route::post(config('laraadmin.adminRoute') . '/upload_files', 'LA\UploadsController@upload_files');
	Route::get(config('laraadmin.adminRoute') . '/uploaded_files', 'LA\UploadsController@uploaded_files');
	Route::post(config('laraadmin.adminRoute') . '/uploads_update_caption', 'LA\UploadsController@update_caption');
	Route::post(config('laraadmin.adminRoute') . '/uploads_update_filename', 'LA\UploadsController@update_filename');
	Route::post(config('laraadmin.adminRoute') . '/uploads_update_public', 'LA\UploadsController@update_public');
	Route::post(config('laraadmin.adminRoute') . '/uploads_delete_file', 'LA\UploadsController@delete_file');

	/* ================== Roles ================== */
	Route::resource(config('laraadmin.adminRoute') . '/roles', 'LA\RolesController');
	Route::get(config('laraadmin.adminRoute') . '/role_dt_ajax', 'LA\RolesController@dtajax');
	Route::post(config('laraadmin.adminRoute') . '/save_module_role_permissions/{id}', 'LA\RolesController@save_module_role_permissions');

	/* ================== Permissions ================== */
	Route::resource(config('laraadmin.adminRoute') . '/permissions', 'LA\PermissionsController');
	Route::get(config('laraadmin.adminRoute') . '/permission_dt_ajax', 'LA\PermissionsController@dtajax');
	Route::post(config('laraadmin.adminRoute') . '/save_permissions/{id}', 'LA\PermissionsController@save_permissions');

	/* ================== Departments ================== */
	Route::resource(config('laraadmin.adminRoute') . '/departments', 'LA\DepartmentsController');
	Route::get(config('laraadmin.adminRoute') . '/department_dt_ajax', 'LA\DepartmentsController@dtajax');

	/* ================== Employees ================== */
	Route::resource(config('laraadmin.adminRoute') . '/employees', 'LA\EmployeesController');
	Route::get(config('laraadmin.adminRoute') . '/employee_dt_ajax', 'LA\EmployeesController@dtajax');
	Route::post(config('laraadmin.adminRoute') . '/change_password/{id}', 'LA\EmployeesController@change_password');

	/* ================== Organizations ================== */
	Route::resource(config('laraadmin.adminRoute') . '/organizations', 'LA\OrganizationsController');
	Route::get(config('laraadmin.adminRoute') . '/organization_dt_ajax', 'LA\OrganizationsController@dtajax');

	/* ================== Backups ================== */
	Route::resource(config('laraadmin.adminRoute') . '/backups', 'LA\BackupsController');
	Route::get(config('laraadmin.adminRoute') . '/backup_dt_ajax', 'LA\BackupsController@dtajax');
	Route::post(config('laraadmin.adminRoute') . '/create_backup_ajax', 'LA\BackupsController@create_backup_ajax');
	Route::get(config('laraadmin.adminRoute') . '/downloadBackup/{id}', 'LA\BackupsController@downloadBackup');

	/* ================== Tests ================== */
	Route::resource(config('laraadmin.adminRoute') . '/tests', 'LA\TestsController');
	Route::get(config('laraadmin.adminRoute') . '/test_dt_ajax', 'LA\TestsController@dtajax');
	Route::any(config('laraadmin.adminRoute') . '/import_loan_company', 'LA\TestsController@import_loan_company');

	/* ================== Company_profiles ================== */
	Route::resource(config('laraadmin.adminRoute') . '/company_profiles', 'LA\Company_profilesController');
	Route::get(config('laraadmin.adminRoute') . '/company_profile_dt_ajax', 'LA\Company_profilesController@dtajax');

	/* ================== Units ================== */
	Route::resource(config('laraadmin.adminRoute') . '/units', 'LA\UnitsController');
	Route::get(config('laraadmin.adminRoute') . '/unit_dt_ajax', 'LA\UnitsController@dtajax');

	/* ================== Department_masters ================== */
	Route::resource(config('laraadmin.adminRoute') . '/department_masters', 'LA\Department_mastersController');
	Route::get(config('laraadmin.adminRoute') . '/department_master_dt_ajax', 'LA\Department_mastersController@dtajax');

	/* ================== Sections ================== */
	Route::resource(config('laraadmin.adminRoute') . '/sections', 'LA\SectionsController');
	Route::get(config('laraadmin.adminRoute') . '/section_dt_ajax', 'LA\SectionsController@dtajax');

	/* ================== Categories ================== */
	Route::resource(config('laraadmin.adminRoute') . '/categories', 'LA\CategoriesController');
	Route::get(config('laraadmin.adminRoute') . '/category_dt_ajax', 'LA\CategoriesController@dtajax');

	/* ================== Statuses ================== */
	Route::resource(config('laraadmin.adminRoute') . '/statuses', 'LA\StatusesController');
	Route::get(config('laraadmin.adminRoute') . '/status_dt_ajax', 'LA\StatusesController@dtajax');


	/* ================== Business_initiatives ================== */
	Route::resource(config('laraadmin.adminRoute') . '/business_initiatives', 'LA\Business_initiativesController');
	Route::get(config('laraadmin.adminRoute') . '/business_initiative_dt_ajax', 'LA\Business_initiativesController@dtajax');

	/* ================== Events ================== */
	Route::resource(config('laraadmin.adminRoute') . '/events', 'LA\EventsController');
	Route::get(config('laraadmin.adminRoute') . '/event_dt_ajax', 'LA\EventsController@dtajax');

	/* ================== Projects ================== */
	Route::resource(config('laraadmin.adminRoute') . '/projects', 'LA\ProjectsController');
	Route::get(config('laraadmin.adminRoute') . '/project_dt_ajax', 'LA\ProjectsController@dtajax');

	/* ================== Tasks ================== */
	Route::resource(config('laraadmin.adminRoute') . '/tasks', 'LA\TasksController');
	Route::get(config('laraadmin.adminRoute') . '/task_dt_ajax', 'LA\TasksController@dtajax');


	/* ================== Functions ================== */
	Route::resource(config('laraadmin.adminRoute') . '/functions', 'LA\FunctionsController');
	Route::get(config('laraadmin.adminRoute') . '/function_dt_ajax', 'LA\FunctionsController@dtajax');

	/* ================== Function_Modules ================== */
	Route::resource(config('laraadmin.adminRoute') . '/function_modules', 'LA\Function_ModulesController');
	Route::get(config('laraadmin.adminRoute') . '/function_module_dt_ajax', 'LA\Function_ModulesController@dtajax');


	/* ================== Add_kpis ================== */
	Route::resource(config('laraadmin.adminRoute') . '/add_kpis', 'LA\Add_kpisController');
	Route::get(config('laraadmin.adminRoute') . '/add_kpi_dt_ajax', 'LA\Add_kpisController@dtajax');

	/* ================== Strategic_objectives ================== */
	Route::resource(config('laraadmin.adminRoute') . '/strategic_objectives', 'LA\Strategic_objectivesController');
	Route::get(config('laraadmin.adminRoute') . '/strategic_objective_dt_ajax', 'LA\Strategic_objectivesController@dtajax');

	/* ================== Login_access_tokens ================== */
	Route::resource(config('laraadmin.adminRoute') . '/login_access_tokens', 'LA\Login_access_tokensController');
	Route::get(config('laraadmin.adminRoute') . '/login_access_token_dt_ajax', 'LA\Login_access_tokensController@dtajax');

	/* ================== Employers ================== */
	Route::resource(config('laraadmin.adminRoute') . '/employers', 'LA\EmployersController');
	Route::get(config('laraadmin.adminRoute') . '/employer_dt_ajax', 'LA\EmployersController@dtajax');


	/* ================== Project_histories ================== */
	Route::resource(config('laraadmin.adminRoute') . '/project_histories', 'LA\Project_historiesController');
	Route::get(config('laraadmin.adminRoute') . '/project_history_dt_ajax', 'LA\Project_historiesController@dtajax');

	/* ================== Project_files ================== */
	Route::resource(config('laraadmin.adminRoute') . '/project_files', 'LA\Project_filesController');
	Route::get(config('laraadmin.adminRoute') . '/project_file_dt_ajax', 'LA\Project_filesController@dtajax');

	/* ================== Task_assigns ================== */
	Route::resource(config('laraadmin.adminRoute') . '/task_assigns', 'LA\Task_assignsController');
	Route::get(config('laraadmin.adminRoute') . '/task_assign_dt_ajax', 'LA\Task_assignsController@dtajax');

	/* ================== Task_histories ================== */
	Route::resource(config('laraadmin.adminRoute') . '/task_histories', 'LA\Task_historiesController');
	Route::get(config('laraadmin.adminRoute') . '/task_history_dt_ajax', 'LA\Task_historiesController@dtajax');

	/* ================== Tasks_files ================== */
	Route::resource(config('laraadmin.adminRoute') . '/tasks_files', 'LA\Tasks_filesController');
	Route::get(config('laraadmin.adminRoute') . '/tasks_file_dt_ajax', 'LA\Tasks_filesController@dtajax');

	/* ================== Business_plans ================== */
	Route::resource(config('laraadmin.adminRoute') . '/business_plans', 'LA\Business_plansController');
	Route::get(config('laraadmin.adminRoute') . '/business_plan_dt_ajax', 'LA\Business_plansController@dtajax');

	/* ================== Kpi_targets ================== */
	Route::resource(config('laraadmin.adminRoute') . '/kpi_targets', 'LA\Kpi_targetsController');
	Route::get(config('laraadmin.adminRoute') . '/kpi_target_dt_ajax', 'LA\Kpi_targetsController@dtajax');

	/* ================== Kpi_actuals ================== */
	Route::resource(config('laraadmin.adminRoute') . '/kpi_actuals', 'LA\Kpi_actualsController');
	Route::get(config('laraadmin.adminRoute') . '/kpi_actual_dt_ajax', 'LA\Kpi_actualsController@dtajax');

	/* ================== Initiatives ================== */
	Route::resource(config('laraadmin.adminRoute') . '/initiatives', 'LA\InitiativesController');
	Route::get(config('laraadmin.adminRoute') . '/initiative_dt_ajax', 'LA\InitiativesController@dtajax');

	/* ================== Action_plans ================== */
	Route::resource(config('laraadmin.adminRoute') . '/action_plans', 'LA\Action_plansController');
	Route::get(config('laraadmin.adminRoute') . '/action_plan_dt_ajax', 'LA\Action_plansController@dtajax');

	/* ================== Action_plan_schedules ================== */
	Route::resource(config('laraadmin.adminRoute') . '/action_plan_schedules', 'LA\Action_plan_schedulesController');
	Route::get(config('laraadmin.adminRoute') . '/action_plan_schedule_dt_ajax', 'LA\Action_plan_schedulesController@dtajax');

	/* ================== Action_plan_assigns ================== */
	Route::resource(config('laraadmin.adminRoute') . '/action_plan_assigns', 'LA\Action_plan_assignsController');
	Route::get(config('laraadmin.adminRoute') . '/action_plan_assign_dt_ajax', 'LA\Action_plan_assignsController@dtajax');

	/* ================== Business_plan_dashes ================== */
	Route::resource(config('laraadmin.adminRoute') . '/business_plan_dashes', 'LA\Business_plan_dashesController');
	Route::get(config('laraadmin.adminRoute') . '/business_plan_dash_dt_ajax', 'LA\Business_plan_dashesController@dtajax');

	/* ================== Initiative_datas ================== */
	Route::resource(config('laraadmin.adminRoute') . '/initiative_datas', 'LA\Initiative_datasController');
	Route::get(config('laraadmin.adminRoute') . '/initiative_data_dt_ajax', 'LA\Initiative_datasController@dtajax');

	/* ================== Kpi_dashes ================== */
	Route::resource(config('laraadmin.adminRoute') . '/kpi_dashes', 'LA\Kpi_dashesController');
	Route::get(config('laraadmin.adminRoute') . '/kpi_dash_dt_ajax', 'LA\Kpi_dashesController@dtajax');

	/* ================== Kpi_datas ================== */
	Route::resource(config('laraadmin.adminRoute') . '/kpi_datas', 'LA\Kpi_datasController');
	Route::get(config('laraadmin.adminRoute') . '/kpi_data_dt_ajax', 'LA\Kpi_datasController@dtajax');

	/* ================== Task_dashes ================== */
	Route::resource(config('laraadmin.adminRoute') . '/task_dashes', 'LA\Task_dashesController');
	Route::get(config('laraadmin.adminRoute') . '/task_dash_dt_ajax', 'LA\Task_dashesController@dtajax');

	/* ================== Business_menuses ================== */
	Route::resource(config('laraadmin.adminRoute') . '/business_menuses', 'LA\Business_menusesController');
	Route::get(config('laraadmin.adminRoute') . '/business_menus_dt_ajax', 'LA\Business_menusesController@dtajax');

	/* ================== Task_trackers ================== */
	Route::resource(config('laraadmin.adminRoute') . '/task_trackers', 'LA\Task_trackersController');
	Route::get(config('laraadmin.adminRoute') . '/task_tracker_dt_ajax', 'LA\Task_trackersController@dtajax');

	/* ================== Kpi_trackers ================== */
	Route::resource(config('laraadmin.adminRoute') . '/kpi_trackers', 'LA\Kpi_trackersController');
	Route::get(config('laraadmin.adminRoute') . '/kpi_tracker_dt_ajax', 'LA\Kpi_trackersController@dtajax');

	/* ================== Str_obj_statuses ================== */
	Route::resource(config('laraadmin.adminRoute') . '/str_obj_statuses', 'LA\Str_obj_statusesController');
	Route::get(config('laraadmin.adminRoute') . '/str_obj_status_dt_ajax', 'LA\Str_obj_statusesController@dtajax');

	/* ================== U_o_ms ================== */
	Route::resource(config('laraadmin.adminRoute') . '/u_o_ms', 'LA\U_o_msController');
	Route::get(config('laraadmin.adminRoute') . '/u_o_m_dt_ajax', 'LA\U_o_msController@dtajax');

	/* ================== Strategic_obj_statuses ================== */
	Route::resource(config('laraadmin.adminRoute') . '/strategic_obj_statuses', 'LA\Strategic_obj_statusesController');
	Route::get(config('laraadmin.adminRoute') . '/strategic_obj_status_dt_ajax', 'LA\Strategic_obj_statusesController@dtajax');

	/* ================== Initiatives_statuses ================== */
	Route::resource(config('laraadmin.adminRoute') . '/initiatives_statuses', 'LA\Initiatives_statusesController');
	Route::get(config('laraadmin.adminRoute') . '/initiatives_status_dt_ajax', 'LA\Initiatives_statusesController@dtajax');

	/* ================== Action_plan_statuses ================== */
	Route::resource(config('laraadmin.adminRoute') . '/action_plan_statuses', 'LA\Action_plan_statusesController');
	Route::get(config('laraadmin.adminRoute') . '/action_plan_status_dt_ajax', 'LA\Action_plan_statusesController@dtajax');


	/* ================== Str_obj_edit_comments ================== */
	Route::resource(config('laraadmin.adminRoute') . '/str_obj_edit_comments', 'LA\Str_obj_edit_commentsController');
	Route::get(config('laraadmin.adminRoute') . '/str_obj_edit_comment_dt_ajax', 'LA\Str_obj_edit_commentsController@dtajax');

	/* ================== Initiat_edit_comments ================== */
	Route::resource(config('laraadmin.adminRoute') . '/initiat_edit_comments', 'LA\Initiat_edit_commentsController');
	Route::get(config('laraadmin.adminRoute') . '/initiat_edit_comment_dt_ajax', 'LA\Initiat_edit_commentsController@dtajax');

	/* ================== Actionp_edit_comments ================== */
	Route::resource(config('laraadmin.adminRoute') . '/actionp_edit_comments', 'LA\Actionp_edit_commentsController');
	Route::get(config('laraadmin.adminRoute') . '/actionp_edit_comment_dt_ajax', 'LA\Actionp_edit_commentsController@dtajax');

	/* ================== Str_object_gards ================== */
	Route::resource(config('laraadmin.adminRoute') . '/str_object_gards', 'LA\Str_object_gardsController');
	Route::get(config('laraadmin.adminRoute') . '/str_object_gard_dt_ajax', 'LA\Str_object_gardsController@dtajax');

	/* ================== Faqs ================== */
	Route::resource(config('laraadmin.adminRoute') . '/faqs', 'LA\FaqsController');
	Route::get(config('laraadmin.adminRoute') . '/faq_dt_ajax', 'LA\FaqsController@dtajax');

	/* ================== Lead_kpis ================== */
	Route::resource(config('laraadmin.adminRoute') . '/lead_kpis', 'LA\Lead_kpisController');
	Route::get(config('laraadmin.adminRoute') . '/lead_kpi_dt_ajax', 'LA\Lead_kpisController@dtajax');

	/* ================== Business_priorities ================== */
	Route::resource(config('laraadmin.adminRoute') . '/business_priorities', 'LA\Business_prioritiesController');
	Route::get(config('laraadmin.adminRoute') . '/business_priority_dt_ajax', 'LA\Business_prioritiesController@dtajax');

	/* ================== Swot_analyses ================== */
	Route::resource(config('laraadmin.adminRoute') . '/swot_analyses', 'LA\Swot_analysesController');
	Route::get(config('laraadmin.adminRoute') . '/swot_analysis_dt_ajax', 'LA\Swot_analysesController@dtajax');

	/* ================== Business_objectives ================== */
	Route::resource(config('laraadmin.adminRoute') . '/business_objectives', 'LA\Business_objectivesController');
	Route::get(config('laraadmin.adminRoute') . '/business_objective_dt_ajax', 'LA\Business_objectivesController@dtajax');

	/* ================== Strengths ================== */
	Route::resource(config('laraadmin.adminRoute') . '/strengths', 'LA\StrengthsController');
	Route::get(config('laraadmin.adminRoute') . '/strength_dt_ajax', 'LA\StrengthsController@dtajax');

	/* ================== Weaknesses ================== */
	Route::resource(config('laraadmin.adminRoute') . '/weaknesses', 'LA\WeaknessesController');
	Route::get(config('laraadmin.adminRoute') . '/weakness_dt_ajax', 'LA\WeaknessesController@dtajax');

	/* ================== Opportunities ================== */
	Route::resource(config('laraadmin.adminRoute') . '/opportunities', 'LA\OpportunitiesController');
	Route::get(config('laraadmin.adminRoute') . '/opportunity_dt_ajax', 'LA\OpportunitiesController@dtajax');

	/* ================== Threats ================== */
	Route::resource(config('laraadmin.adminRoute') . '/threats', 'LA\ThreatsController');
	Route::get(config('laraadmin.adminRoute') . '/threat_dt_ajax', 'LA\ThreatsController@dtajax');

	/* ================== Reflection_past_years ================== */
	Route::resource(config('laraadmin.adminRoute') . '/reflection_past_years', 'LA\Reflection_past_yearsController');
	Route::get(config('laraadmin.adminRoute') . '/reflection_past_year_dt_ajax', 'LA\Reflection_past_yearsController@dtajax');

	/* ================== Company_performances ================== */
	Route::resource(config('laraadmin.adminRoute') . '/company_performances', 'LA\Company_performancesController');
	Route::get(config('laraadmin.adminRoute') . '/company_performance_dt_ajax', 'LA\Company_performancesController@dtajax');

	/* ================== Set_business_plans ================== */
	Route::resource(config('laraadmin.adminRoute') . '/set_business_plans', 'LA\Set_business_plansController');
	Route::get(config('laraadmin.adminRoute') . '/set_business_plan_dt_ajax', 'LA\Set_business_plansController@dtajax');

	/* ================== Performance_reports ================== */
	Route::resource(config('laraadmin.adminRoute') . '/performance_reports', 'LA\Performance_reportsController');
	Route::get(config('laraadmin.adminRoute') . '/performance_report_dt_ajax', 'LA\Performance_reportsController@dtajax');

	/* ================== Hoshin_kanris ================== */
	Route::resource(config('laraadmin.adminRoute') . '/hoshin_kanris', 'LA\Hoshin_kanrisController');
	Route::get(config('laraadmin.adminRoute') . '/hoshin_kanri_dt_ajax', 'LA\Hoshin_kanrisController@dtajax');

	/* ================== Hk_dept_heads ================== */
	Route::resource(config('laraadmin.adminRoute') . '/hk_dept_heads', 'LA\Hk_dept_headsController');
	Route::get(config('laraadmin.adminRoute') . '/hk_dept_head_dt_ajax', 'LA\Hk_dept_headsController@dtajax');

	/* ================== Hk_section_heads ================== */
	Route::resource(config('laraadmin.adminRoute') . '/hk_section_heads', 'LA\Hk_section_headsController');
	Route::get(config('laraadmin.adminRoute') . '/hk_section_head_dt_ajax', 'LA\Hk_section_headsController@dtajax');

	/* ================== Hk_supervisor_heads ================== */
	Route::resource(config('laraadmin.adminRoute') . '/hk_supervisor_heads', 'LA\Hk_supervisor_headsController');
	Route::get(config('laraadmin.adminRoute') . '/hk_supervisor_head_dt_ajax', 'LA\Hk_supervisor_headsController@dtajax');

	/* ================== Settings ================== */
	Route::resource(config('laraadmin.adminRoute') . '/settings', 'LA\SettingsController');
	Route::get(config('laraadmin.adminRoute') . '/setting_dt_ajax', 'LA\SettingsController@dtajax');

	/* ================== Kpi_performance_dashes ================== */
	Route::resource(config('laraadmin.adminRoute') . '/kpi_performance_dashes', 'LA\Kpi_performance_dashesController');
	Route::get(config('laraadmin.adminRoute') . '/kpi_performance_dash_dt_ajax', 'LA\Kpi_performance_dashesController@dtajax');

	/* ================== Status_strategic_objs ================== */
	Route::resource(config('laraadmin.adminRoute') . '/status_strategic_objs', 'LA\Status_strategic_objsController');
	Route::get(config('laraadmin.adminRoute') . '/status_strategic_obj_dt_ajax', 'LA\Status_strategic_objsController@dtajax');

	/* ================== Photos ================== */
	Route::resource(config('laraadmin.adminRoute') . '/photos', 'LA\PhotosController');
	Route::get(config('laraadmin.adminRoute') . '/photo_dt_ajax', 'LA\PhotosController@dtajax');

	/* ================== ManagementReports ================== */
	Route::resource(config('laraadmin.adminRoute') . '/managementreports', 'LA\ManagementReportsController');
	Route::get(config('laraadmin.adminRoute') . '/managementreport_dt_ajax', 'LA\ManagementReportsController@dtajax');

	/* ================== Priorities ================== */
	Route::resource(config('laraadmin.adminRoute') . '/priorities', 'LA\PrioritiesController');
	Route::get(config('laraadmin.adminRoute') . '/priority_dt_ajax', 'LA\PrioritiesController@dtajax');


	/* ================== Dashboard_projects ================== */
	Route::resource(config('laraadmin.adminRoute') . '/dashboard_projects', 'LA\Dashboard_projectsController');
	Route::get(config('laraadmin.adminRoute') . '/dashboard_project_dt_ajax', 'LA\Dashboard_projectsController@dtajax');

	/* ================== Administrations ================== */
	Route::resource(config('laraadmin.adminRoute') . '/administrations', 'LA\AdministrationsController');
	Route::get(config('laraadmin.adminRoute') . '/administration_dt_ajax', 'LA\AdministrationsController@dtajax');

	/* ================== Project_Trackers ================== */
	Route::resource(config('laraadmin.adminRoute') . '/project_trackers', 'LA\Project_TrackersController');
	Route::get(config('laraadmin.adminRoute') . '/project_tracker_dt_ajax', 'LA\Project_TrackersController@dtajax');

	/* ================== Governances ================== */
	Route::resource(config('laraadmin.adminRoute') . '/governances', 'LA\GovernancesController');
	Route::get(config('laraadmin.adminRoute') . '/governance_dt_ajax', 'LA\GovernancesController@dtajax');

	/* ================== Presentations ================== */
	Route::resource(config('laraadmin.adminRoute') . '/presentations', 'LA\PresentationsController');
	Route::get(config('laraadmin.adminRoute') . '/presentation_dt_ajax', 'LA\PresentationsController@dtajax');

	/* ================== Facility_details ================== */
	Route::resource(config('laraadmin.adminRoute') . '/facility_details', 'LA\Facility_detailsController');
	Route::get(config('laraadmin.adminRoute') . '/facility_detail_dt_ajax', 'LA\Facility_detailsController@dtajax');

	/* ================== Photographs ================== */
	Route::resource(config('laraadmin.adminRoute') . '/photographs', 'LA\PhotographsController');
	Route::get(config('laraadmin.adminRoute') . '/photograph_dt_ajax', 'LA\PhotographsController@dtajax');

	/* ================== Procedure_temps ================== */
	Route::resource(config('laraadmin.adminRoute') . '/procedure_temps', 'LA\Procedure_tempsController');
	Route::get(config('laraadmin.adminRoute') . '/procedure_temp_dt_ajax', 'LA\Procedure_tempsController@dtajax');

	/* ================== Products_services ================== */
	Route::resource(config('laraadmin.adminRoute') . '/products_services', 'LA\Products_servicesController');
	Route::get(config('laraadmin.adminRoute') . '/products_service_dt_ajax', 'LA\Products_servicesController@dtajax');

	/* ================== Kpi_comments ================== */
	Route::resource(config('laraadmin.adminRoute') . '/kpi_comments', 'LA\Kpi_commentsController');
	Route::get(config('laraadmin.adminRoute') . '/kpi_comment_dt_ajax', 'LA\Kpi_commentsController@dtajax');

	/* ================== Kpi_actionplan_rels ================== */
	Route::resource(config('laraadmin.adminRoute') . '/kpi_actionplan_rels', 'LA\Kpi_actionplan_relsController');
	Route::get(config('laraadmin.adminRoute') . '/kpi_actionplan_rel_dt_ajax', 'LA\Kpi_actionplan_relsController@dtajax');

	/* ================== Prima_pluse_navs ================== */
	Route::resource(config('laraadmin.adminRoute') . '/prima_pluse_navs', 'LA\Prima_pluse_navsController');
	Route::get(config('laraadmin.adminRoute') . '/prima_pluse_nav_dt_ajax', 'LA\Prima_pluse_navsController@dtajax');

	/* ================== Helps ================== */
	Route::resource(config('laraadmin.adminRoute') . '/helps', 'LA\HelpsController');
	Route::get(config('laraadmin.adminRoute') . '/help_dt_ajax', 'LA\HelpsController@dtajax');

	/* ================== Demos ================== */
	Route::resource(config('laraadmin.adminRoute') . '/demos', 'LA\DemosController');
	Route::get(config('laraadmin.adminRoute') . '/demo_dt_ajax', 'LA\DemosController@dtajax');

	/* ================== Prima_processes ================== */
	Route::resource(config('laraadmin.adminRoute') . '/prima_processes', 'LA\Prima_processesController');
	Route::get(config('laraadmin.adminRoute') . '/prima_process_dt_ajax', 'LA\Prima_processesController@dtajax');

	/* ================== Locations ================== */
	Route::resource(config('laraadmin.adminRoute') . '/locations', 'LA\LocationsController');
	Route::get(config('laraadmin.adminRoute') . '/location_dt_ajax', 'LA\LocationsController@dtajax');

	/* ================== Layouts ================== */
	Route::resource(config('laraadmin.adminRoute') . '/layouts', 'LA\LayoutsController');
	Route::get(config('laraadmin.adminRoute') . '/layout_dt_ajax', 'LA\LayoutsController@dtajax');

	/* ================== Machine_equipments ================== */
	Route::resource(config('laraadmin.adminRoute') . '/machine_equipments', 'LA\Machine_equipmentsController');
	Route::get(config('laraadmin.adminRoute') . '/machine_equipment_dt_ajax', 'LA\Machine_equipmentsController@dtajax');

	/* ================== Infrastructures ================== */
	Route::resource(config('laraadmin.adminRoute') . '/infrastructures', 'LA\InfrastructuresController');
	Route::get(config('laraadmin.adminRoute') . '/infrastructure_dt_ajax', 'LA\InfrastructuresController@dtajax');

	/* ================== Media_photographies ================== */
	Route::resource(config('laraadmin.adminRoute') . '/media_photographies', 'LA\Media_photographiesController');
	Route::get(config('laraadmin.adminRoute') . '/media_photography_dt_ajax', 'LA\Media_photographiesController@dtajax');

	/* ================== Events_photographies ================== */
	Route::resource(config('laraadmin.adminRoute') . '/events_photographies', 'LA\Events_photographiesController');
	Route::get(config('laraadmin.adminRoute') . '/events_photography_dt_ajax', 'LA\Events_photographiesController@dtajax');

	/* ================== Celebrations ================== */
	Route::resource(config('laraadmin.adminRoute') . '/celebrations', 'LA\CelebrationsController');
	Route::get(config('laraadmin.adminRoute') . '/celebration_dt_ajax', 'LA\CelebrationsController@dtajax');

	/* ================== Procedure_hrs ================== */
	Route::resource(config('laraadmin.adminRoute') . '/procedure_hrs', 'LA\Procedure_hrsController');
	Route::get(config('laraadmin.adminRoute') . '/procedure_hr_dt_ajax', 'LA\Procedure_hrsController@dtajax');

	/* ================== Procedure_operations ================== */
	Route::resource(config('laraadmin.adminRoute') . '/procedure_operations', 'LA\Procedure_operationsController');
	Route::get(config('laraadmin.adminRoute') . '/procedure_operation_dt_ajax', 'LA\Procedure_operationsController@dtajax');

	/* ================== Procedure_rds ================== */
	Route::resource(config('laraadmin.adminRoute') . '/procedure_rds', 'LA\Procedure_rdsController');
	Route::get(config('laraadmin.adminRoute') . '/procedure_rd_dt_ajax', 'LA\Procedure_rdsController@dtajax');

	/* ================== Software_developments ================== */
	Route::resource(config('laraadmin.adminRoute') . '/software_developments', 'LA\Software_developmentsController');
	Route::get(config('laraadmin.adminRoute') . '/software_development_dt_ajax', 'LA\Software_developmentsController@dtajax');

	/* ================== Product_developments ================== */
	Route::resource(config('laraadmin.adminRoute') . '/product_developments', 'LA\Product_developmentsController');
	Route::get(config('laraadmin.adminRoute') . '/product_development_dt_ajax', 'LA\Product_developmentsController@dtajax');

	/* ================== Big_data_services ================== */
	Route::resource(config('laraadmin.adminRoute') . '/big_data_services', 'LA\Big_data_servicesController');
	Route::get(config('laraadmin.adminRoute') . '/big_data_service_dt_ajax', 'LA\Big_data_servicesController@dtajax');

	/* ================== Project_milestones ================== */
	Route::resource(config('laraadmin.adminRoute') . '/project_milestones', 'LA\Project_milestonesController');
	Route::get(config('laraadmin.adminRoute') . '/project_milestone_dt_ajax', 'LA\Project_milestonesController@dtajax');

	/* ================== Project_members ================== */
	Route::resource(config('laraadmin.adminRoute') . '/project_members', 'LA\Project_membersController');
	Route::get(config('laraadmin.adminRoute') . '/project_member_dt_ajax', 'LA\Project_membersController@dtajax');

	/* ================== Projct_extrnal_membrs ================== */
	Route::resource(config('laraadmin.adminRoute') . '/projct_extrnal_membrs', 'LA\Projct_extrnal_membrsController');
	Route::get(config('laraadmin.adminRoute') . '/projct_extrnal_membr_dt_ajax', 'LA\Projct_extrnal_membrsController@dtajax');

	/* ================== Project_majr_actvities ================== */
	Route::resource(config('laraadmin.adminRoute') . '/project_majr_actvities', 'LA\Project_majr_actvitiesController');
	Route::get(config('laraadmin.adminRoute') . '/project_majr_actvity_dt_ajax', 'LA\Project_majr_actvitiesController@dtajax');

	/* ================== Project_sub_actvities ================== */
	Route::resource(config('laraadmin.adminRoute') . '/project_sub_actvities', 'LA\Project_sub_actvitiesController');
	Route::get(config('laraadmin.adminRoute') . '/project_sub_actvity_dt_ajax', 'LA\Project_sub_actvitiesController@dtajax');

	/* ================== Project_kpis ================== */
	Route::resource(config('laraadmin.adminRoute') . '/project_kpis', 'LA\Project_kpisController');
	Route::get(config('laraadmin.adminRoute') . '/project_kpi_dt_ajax', 'LA\Project_kpisController@dtajax');

	/* ================== Project_kpi_milestons ================== */
	Route::resource(config('laraadmin.adminRoute') . '/project_kpi_milestons', 'LA\Project_kpi_milestonsController');
	Route::get(config('laraadmin.adminRoute') . '/project_kpi_mileston_dt_ajax', 'LA\Project_kpi_milestonsController@dtajax');

	/* ================== Project_governances ================== */
	Route::resource(config('laraadmin.adminRoute') . '/project_governances', 'LA\Project_governancesController');
	Route::get(config('laraadmin.adminRoute') . '/project_governance_dt_ajax', 'LA\Project_governancesController@dtajax');

	/* ================== Project_bdget_trakigs ================== */
	Route::resource(config('laraadmin.adminRoute') . '/project_bdget_trakigs', 'LA\Project_bdget_trakigsController');
	Route::get(config('laraadmin.adminRoute') . '/project_bdget_trakig_dt_ajax', 'LA\Project_bdget_trakigsController@dtajax');

	/* ================== Project_gov_memebers ================== */
	Route::resource(config('laraadmin.adminRoute') . '/project_gov_memebers', 'LA\Project_gov_memebersController');
	Route::get(config('laraadmin.adminRoute') . '/project_gov_memeber_dt_ajax', 'LA\Project_gov_memebersController@dtajax');

	/* ================== Project_isue_trackers ================== */
	Route::resource(config('laraadmin.adminRoute') . '/project_isue_trackers', 'LA\Project_isue_trackersController');
	Route::get(config('laraadmin.adminRoute') . '/project_isue_tracker_dt_ajax', 'LA\Project_isue_trackersController@dtajax');

	/* ================== Project_risk_as_logs ================== */
	Route::resource(config('laraadmin.adminRoute') . '/project_risk_as_logs', 'LA\Project_risk_as_logsController');
	Route::get(config('laraadmin.adminRoute') . '/project_risk_as_log_dt_ajax', 'LA\Project_risk_as_logsController@dtajax');

	/* ================== Project_issue_remarks ================== */
	Route::resource(config('laraadmin.adminRoute') . '/project_issue_remarks', 'LA\Project_issue_remarksController');
	Route::get(config('laraadmin.adminRoute') . '/project_issue_remark_dt_ajax', 'LA\Project_issue_remarksController@dtajax');

	/* ================== Project_deviations ================== */
	Route::resource(config('laraadmin.adminRoute') . '/project_deviations', 'LA\Project_deviationsController');
	Route::get(config('laraadmin.adminRoute') . '/project_deviation_dt_ajax', 'LA\Project_deviationsController@dtajax');

	/* ================== Project_resources ================== */
	Route::resource(config('laraadmin.adminRoute') . '/project_resources', 'LA\Project_resourcesController');
	Route::get(config('laraadmin.adminRoute') . '/project_resource_dt_ajax', 'LA\Project_resourcesController@dtajax');

	/* ================== New_projects ================== */
	Route::resource(config('laraadmin.adminRoute') . '/new_projects', 'LA\New_projectsController');
	Route::get(config('laraadmin.adminRoute') . '/new_project_dt_ajax', 'LA\New_projectsController@dtajax');

	/* ================== Company_setups ================== */
	Route::resource(config('laraadmin.adminRoute') . '/company_setups', 'LA\Company_setupsController');
	Route::get(config('laraadmin.adminRoute') . '/company_setup_dt_ajax', 'LA\Company_setupsController@dtajax');




	/* ================== User_setups ================== */
	Route::resource(config('laraadmin.adminRoute') . '/user_setups', 'LA\User_setupsController');
	Route::get(config('laraadmin.adminRoute') . '/user_setup_dt_ajax', 'LA\User_setupsController@dtajax');

	/* ================== Lessons_learnts ================== */
	Route::resource(config('laraadmin.adminRoute') . '/lessons_learnts', 'LA\Lessons_learntsController');
	Route::get(config('laraadmin.adminRoute') . '/lessons_learnt_dt_ajax', 'LA\Lessons_learntsController@dtajax');

	/* ================== Company_steps ================== */
	Route::resource(config('laraadmin.adminRoute') . '/company_steps', 'LA\Company_stepsController');
	Route::get(config('laraadmin.adminRoute') . '/company_step_dt_ajax', 'LA\Company_stepsController@dtajax');

	/* ================== Company_settings ================== */
	Route::resource(config('laraadmin.adminRoute') . '/company_settings', 'LA\Company_settingsController');
	Route::get(config('laraadmin.adminRoute') . '/company_setting_dt_ajax', 'LA\Company_settingsController@dtajax');

	/* ================== Current_business_plns ================== */
	Route::resource(config('laraadmin.adminRoute') . '/current_business_plns', 'LA\Current_business_plnsController');
	Route::get(config('laraadmin.adminRoute') . '/current_business_pln_dt_ajax', 'LA\Current_business_plnsController@dtajax');

	/* ================== Status_business_plans ================== */
	Route::resource(config('laraadmin.adminRoute') . '/status_business_plans', 'LA\Status_business_plansController');
	Route::get(config('laraadmin.adminRoute') . '/status_business_plan_dt_ajax', 'LA\Status_business_plansController@dtajax');

	/* ================== Additional_setups ================== */
	Route::resource(config('laraadmin.adminRoute') . '/additional_setups', 'LA\Additional_setupsController');
	Route::get(config('laraadmin.adminRoute') . '/additional_setup_dt_ajax', 'LA\Additional_setupsController@dtajax');

	/* ================== Dashboard_and_reports ================== */
	Route::resource(config('laraadmin.adminRoute') . '/dashboard_and_reports', 'LA\Dashboard_and_reportsController');
	Route::get(config('laraadmin.adminRoute') . '/dashboard_and_report_dt_ajax', 'LA\Dashboard_and_reportsController@dtajax');

	/* ================== Kpi_actual_rview_logs ================== */
	Route::resource(config('laraadmin.adminRoute') . '/kpi_actual_rview_logs', 'LA\Kpi_actual_rview_logsController');
	Route::get(config('laraadmin.adminRoute') . '/kpi_actual_rview_log_dt_ajax', 'LA\Kpi_actual_rview_logsController@dtajax');

	/* ================== Kpi_actual_rview_logs ================== */
	Route::resource(config('laraadmin.adminRoute') . '/kpi_actual_rview_logs', 'LA\Kpi_actual_rview_logsController');
	Route::get(config('laraadmin.adminRoute') . '/kpi_actual_rview_log_dt_ajax', 'LA\Kpi_actual_rview_logsController@dtajax');

	/* ================== Management_reports ================== */
	Route::resource(config('laraadmin.adminRoute') . '/management_reports', 'LA\Management_reportsController');
	Route::get(config('laraadmin.adminRoute') . '/management_report_dt_ajax', 'LA\Management_reportsController@dtajax');

	/* ================== Master_plans ================== */
	Route::resource(config('laraadmin.adminRoute') . '/master_plans', 'LA\Master_plansController');
	Route::get(config('laraadmin.adminRoute') . '/master_plan_dt_ajax', 'LA\Master_plansController@dtajax');
	
	/* ================== Objectives_Steps ================== */
	Route::resource(config('laraadmin.adminRoute') . '/objectives_steps', 'LA\Objectives_StepsController');
	Route::get(config('laraadmin.adminRoute') . '/objectives_step_dt_ajax', 'LA\Objectives_StepsController@dtajax');

	/* ================== Kpi_actual_latentries ================== */
	Route::resource(config('laraadmin.adminRoute') . '/kpi_actual_latentries', 'LA\Kpi_actual_latentriesController');
	Route::get(config('laraadmin.adminRoute') . '/kpi_actual_latentry_dt_ajax', 'LA\Kpi_actual_latentriesController@dtajax');

	/* ================== Strategic_sno_cmpnies ================== */
	Route::resource(config('laraadmin.adminRoute') . '/strategic_sno_cmpnies', 'LA\Strategic_sno_cmpniesController');
	Route::get(config('laraadmin.adminRoute') . '/strategic_sno_cmpny_dt_ajax', 'LA\Strategic_sno_cmpniesController@dtajax');

	/* ================== Strategic_Group_Depts ================== */
	Route::resource(config('laraadmin.adminRoute') . '/strategic_group_depts', 'LA\Strategic_Group_DeptsController');
	Route::get(config('laraadmin.adminRoute') . '/strategic_group_dept_dt_ajax', 'LA\Strategic_Group_DeptsController@dtajax');


	/* ================== Profile_create_groups ================== */
	Route::resource(config('laraadmin.adminRoute') . '/profile_create_groups', 'LA\Profile_create_groupsController');
	Route::get(config('laraadmin.adminRoute') . '/profile_create_group_dt_ajax', 'LA\Profile_create_groupsController@dtajax');

	/* ================== Profile_group_members ================== */
	Route::resource(config('laraadmin.adminRoute') . '/profile_group_members', 'LA\Profile_group_membersController');
	Route::get(config('laraadmin.adminRoute') . '/profile_group_member_dt_ajax', 'LA\Profile_group_membersController@dtajax');

	/* ================== Posts ================== */
	Route::resource(config('laraadmin.adminRoute') . '/posts', 'LA\PostsController');
	Route::get(config('laraadmin.adminRoute') . '/post_dt_ajax', 'LA\PostsController@dtajax');

	/* ================== Post_images ================== */
	Route::resource(config('laraadmin.adminRoute') . '/post_images', 'LA\Post_imagesController');
	Route::get(config('laraadmin.adminRoute') . '/post_image_dt_ajax', 'LA\Post_imagesController@dtajax');

	/* ================== Post_comments ================== */
	Route::resource(config('laraadmin.adminRoute') . '/post_comments', 'LA\Post_commentsController');
	Route::get(config('laraadmin.adminRoute') . '/post_comment_dt_ajax', 'LA\Post_commentsController@dtajax');
});
