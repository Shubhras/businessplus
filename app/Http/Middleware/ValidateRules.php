<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Route;
use \Illuminate\Http\Response as Res;

use Validator;

use Closure;
use Illuminate\Http\Response;

class ValidateRules
{
  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure  $next
   * @return mixed
   */
  public function handle($request, Closure $next)
  {
    $explode_api_name = explode('/', Route::getCurrentRoute()->getPath());
    $api_name = $explode_api_name[1];
    $validator = Validator::make($request->all(), $this->validation_rules($api_name, $request));
    if ($validator->fails()) {
      $message = ["status" => "error", "status_code" => Res::HTTP_UNPROCESSABLE_ENTITY, "message" => $validator->errors()->first()];
      return Response($message);
    }
    return $next($request);
  }
  public function validation_rules($api_name, $request)
  {
    $validation_rules = [
      'api-view-profile'       => [
        'login_access_token' => 'required',
        'role_id'            => 'required',
        'user_id'            => 'required'
      ],
      'api-update-profile'     => [
        'login_access_token' => 'required',
        'user_id'            => 'required',
        'name'               => 'required',
        'gender'             => 'required',
        'mobile'             => 'required',
        'email'              => 'required',
        'city'               => 'required',
        'address'            => 'required',
        /*  'date_birth'         => 'required', */
        'multi_dept_id'      => 'required',
        'multi_unit_id'      => 'required',
        'multi_section_id'   => 'required',
      ],
      'api-update-profile-picture' => [
        'login_access_token' => 'required',
        'user_id' => 'required',
        'photo' => 'mimes:jpeg,jpg,png|required|max:10000' // max 10000kb
      ],
      // 'api-user-signup-file' => [
      //   'myfile'=> 'mimes:xlsx, csv, xls',
      //   // 'login_access_token' => '',
      // ],
      'api-get-single-user-details' => [
        'login_access_token' => 'required',
        'user_id' => 'required',
        'company_id' => 'required'
      ],
      'api-delete-user'        => [
        'login_access_token' => 'required',
        'user_id'            => 'required',
      ],
      'api-change-password'    =>  [
        'login_access_token' => 'required',
        'current_password'   => 'required',
        'new_password'       => 'required|min:6|same:confirm_password',
        'confirm_password'   => 'required',
        'user_id'            => 'required',
      ],
      'api-get-user-details'   => [
        'login_access_token' => 'required',
        'role_id'            => 'required',
        'company_id'         => 'required'
      ],
      'api-projects'           => $request->projectDetails == 'project' ? [
        'login_access_token' => 'required',
      ] : [
        'project_id' => 'required',
        'login_access_token' => 'required',
      ],
      'api-update-single-project' => $request['projectDetails'] == 'project' ? [
        'login_access_token' => 'required'
      ] : [
        'login_access_token' => 'required',
        'project_id' => 'required',
      ],
      'api-view-projects'      => [
        'login_access_token' => 'required',
        'fyear'              => 'required',
        'unit_id' => 'required',
        'year' => 'required',

      ],
      'api-view-single-project' => [
        'login_access_token' => 'required',
        'project_id' => 'required'
      ],
      'api-view-projects-details' => [
        'login_access_token' => 'required',
        'project_id' => 'required',
      ],
      'api-delete-single-project' =>  $request['projectDetails'] == 'project' ? [
        'login_access_token' => 'required'
      ] : [
        'login_access_token' => 'required',
        'project_id' => 'required'
      ],
      'api-edit-projects'      => [
        'login_access_token' => 'required',
        'project_remark_id'  => 'required',
        'user_id'            => 'required',
        'project_id'         => 'required',
      ],
      'api-delete-projects'    => [
        'login_access_token' => 'required',
        'project_id'  => 'required',
        'user_id'            => 'required',
      ],
      'api-remark-projects'    => [
        'login_access_token' => 'required',
        'project_id'         => 'required',
      ],
      'api-view-projects-remark' => [
        'login_access_token' => 'required',
        'project_id'         => 'required'
      ],
      'api-edit-projects-remark' => [
        'login_access_token' => 'required',
        'project_remark_id' => 'required',
        'user_id' => 'required',
        'project_id' => 'required',
        'project_user_id' => 'required',
      ],
      'api-view-projects-remark-file' => [
        'login_access_token' => 'required',
        'project_id'         => 'required',
      ],
      'api-delete-projects-remark' => [
        'login_access_token' => 'required',
        'project_remark_id' => 'required',
        'user_id' => 'required',
        'project_user_id' => 'required',
      ],
      'api-edit-projects-remark' => [
        'login_access_token' => 'required',
        'project_remark_id' => 'required',
        'user_id' => 'required',
        'project_id' => 'required',
      ],
      'api-delete-projects-remark-file' => [
        'login_access_token' => 'required',
        'project_files_id'   => 'required',
        'user_id'            => 'required',
      ],
      'api-issue-tracker-remark' => [
        'login_access_token' => 'required',
      ],
      'api-view-single-row-data' => [
        'login_access_token' => 'required',
        'issue_id' => 'required',
      ],
      'api-poject-view-graph' =>  [
        'login_access_token' => 'required',
        'project_id' => 'required',
      ],
      'api-view-poject-dashboard' => [
        'login_access_token' => 'required',
        'unit_id' => 'required'
      ],
      'api-view-poject-gantt-chart-data' => [
        'login_access_token' => 'required',
        'project_id' => 'required'
      ],
      'get-task-dashboard-data' => [
        'login_access_token' => 'required',
        'unit_id'            => 'required'
      ],
      'api-add-tasks'              => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        'task_name' => 'required',
        'task_owner_id' => 'required',
        //'project_id' => 'required',
        'unit_id' => 'required',
        'department_id' => 'required',
        'priority_id' => 'required',
        'start_date' => 'required',
        'end_date' => 'required',
        'assign_to' => 'required',
      ],
      'api-edit-tasks'         => [
        'login_access_token' => 'required',
        'user_id'            => 'required',
        'task_id'            => 'required',
        'unit_id'            => 'required',
      ],
      'api-view-tasks'         => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
      ],
      'api-delete-tasks'       => [
        'login_access_token' => 'required',
        'task_id'            => 'required',
        'user_id'            => 'required',
      ],
      'api-remark-tasks'       => [
        'login_access_token' => 'required',
        'task_id'            => 'required',
      ],
      'api-view-tasks-remark'  => [
        'login_access_token' => 'required',
        'tasks_id'           => 'required',
      ],
      'api-view-tasks-details' =>  [
        'login_access_token' => 'required',
        'tasks_id'           => 'required',
      ],
      'api-edit-tasks-remark'  => [
        'login_access_token' => 'required',
        'task_remark_id'     => 'required',
        'user_id'            => 'required',
        'tasks_id'           => 'required',
        'task_user_id'      => 'required',
      ],
      'api-delete-tasks-remark' => [
        'login_access_token' => 'required',
        'task_remark_id'     => 'required',
        'user_id'            => 'required',
      ],
      'api-view-tasks-remark-file' => [
        'login_access_token' => 'required',
        'tasks_id'           => 'required',
      ],
      'api-delete-tasks-remark-file' => [
        'login_access_token' => 'required',
        'tasks_files_id'     => 'required',
        'user_id'            => 'required',
      ],
      'api-view-task-dashboard' => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
      ],
      'api-update-events-task' => [
        'login_access_token' => 'required',
      ],
      'api-add-events-task' => [
        'login_access_token' => 'required',
      ],
      'api-view-events-task' => [
        'login_access_token' => 'required',
      ],
      'api-delete-events-task' => [
        'login_access_token' => 'required',
      ],
      'api-view-business-plans' => [
        'login_access_token' => 'required',
        'company_id'         => 'required',
      ],
      'api-business-plans' => [
        'login_access_token' => 'required',
        'company_id' => 'required'
      ],
      'api-edit-business-plans' => [
        'login_access_token' => 'required',
        'id'                 => 'required',
        'vision'             => 'required',
        'mission'            => 'required',
        'values'             => 'required',
        'message_of_ceo'     => 'required',
      ],
      'api-get-kpi'            => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        'dept_id'            => 'required'
      ],
      'api-get-kpi-actionplan' => [
        'login_access_token' => 'required',
        'kpi_id'             => 'required',
        'unit_id'            => 'required',
      ],
      'api-kpi-trackers'       => $request['kpi_id'] ? [
        'login_access_token' => 'required',
        'kpi_id' => 'required',
        'end_date' => 'required',
        'target_year' => 'required'
      ] : [
        'login_access_token' => 'required',
        'kpi_name'           => 'required',
        'unit_id'            => 'required',
        'department_id'      => 'required',
        'section_id'         => 'required',
        'ideal_trend'        => 'required',
        'unit_of_measurement' => 'required',
        'target_condition'   => 'required',
        'kpi_definition'     => 'required|max:10000',
        'lead_kpi'           => 'required',
        'frequency'          => 'required',
        'kpi_performance'    => 'required',
        'target_condition'   => 'required',
      ],
      'api-view-kpi-trackers'  => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        'dept_id'            => 'required',
        'role_id'            => 'required',
      ],
      'api-edit-kpi-trackers'  => [
        'login_access_token' => 'required',
        'user_id'            => 'required',
        'kpi_id'             => 'required',
        'kpi_name'           => 'required',
        'department_id'      => 'required',
        'section_id'         => 'required',
        'ideal_trend'        => 'required',
        'unit_of_measurement' => 'required',
        'kpi_definition'     => 'required|max:10000',
        'lead_kpi'           => 'required', //0 or 1
        'frequency'          => 'required',
        'kpi_performance'    => 'required', //0 or 1
        'target_condition'   => 'required',
      ],
      'api-delete-kpi-trackers' => [
        'login_access_token' => 'required',
        'kpi_id'             => 'required',
        'user_id'            => 'required',
      ],
      'api-view-kpi-trackers-track' => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
      ],
      'api-view-lead-kpi-trackers-track' => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
      ],
      'view-kpi-dashboard'     => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        'dept_id'            => 'required',
        'role_id'            => 'required',
      ],
      'view-lead-kpi-dashboard' => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        'role_id'            => 'required',
        'dept_id'            => 'required',
      ],
      'api-target-actual-update' => [
        'login_access_token' => 'required',
        'kpi_id'             => 'required',
      ],
      'api-new-kpi-trackers-track' => [
        'login_access_token' => 'required',
        'kpi_id'             => 'required',
      ],
      'api-dashboard-review-actual-data' => [
        'login_access_token' => 'required',
      ],
      'api-get-kpi-performance-dash' => [
        'login_access_token' => 'required',
      ],
      'api-view-kpi-performance' => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
      ],
      'api-update-performance-kpi' => [
        'login_access_token' => 'required',
        'kpi_id'             => 'required',
        'kpi_performance_dash_id' => 'required',
      ],
      'api-view-performance-kpi-dashboard' => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
      ],
      'api-view-performance-status-kpi-dashboard' => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
      ],
      'get-str-obj-status'     => [
        'login_access_token' => 'required',
      ],
      'api-strategic-objectives' => [
        'login_access_token' => 'required',
        'target'             => 'required',
        'start_date'         => 'required',
        'end_date'           => 'required',
        'unit_id'            => 'required',
        'department_id'      => 'required',
        'description'        => 'required',
      ],
      'api-view-strategic-objectives' => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        'dept_id'            => 'required',
        'role_id'            => 'required',
      ],
      'api-edit-strategic-objectives' => [
        'login_access_token' => 'required',
        'strategic_objectives_id' => 'required',
        'user_id'            => 'required',
        'target'             => 'required',
        'start_date'         => 'required',
        'end_date'           => 'required',
        'description'        => 'required',
        'status'             => 'required',
        'comment'            => 'required',
      ],
      'api-delete-strategic-objectives' => [
        'login_access_token' => 'required',
        'strategic_objectives_id' => 'required',
        'user_id'            => 'required',
      ],
      'strategic-objectives-data' => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        'dept_id'            => 'required',
        'role_id'            => 'required'
      ],
      'get-strategic-objectives' => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        'dept_id'            => 'required',
      ],
      'api-strobj-update-comment' => [
        'login_access_token' => 'required',
        'str_obj_id'         => 'required'
      ],
      'api-strobj-review'      => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
      ],
      'api-str-obj-grandchart' => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
      ],
      'api-dash-board-strategic-objectives-data' => [
        'login_access_token' => 'required',
      ],
      'api-flow-chart-strategic-objectives-data'=>[
        'login_access_token' => 'required',
      ],
      'view-strategic-objectives-dash' => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        'dept_id'            => 'required',
        'role_id'            => 'required',
      ],
      'get-initiatives'        => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        's_o_id'                 => 'required',
      ],
      'api-add-initiatives'    => [
        'login_access_token' => 'required',
        's_o_id'             => 'required',
        'dept_id'            => 'required',
        'section_id'         => 'required',
        'unit_id'            => 'required',
        'definition'         => 'required',
        'user_id'            => 'required',
        'start_date'         => 'required',
        'end_date'           => 'required',
      ],
      'api-view-initiative'    => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        'dept_id'            => 'required',
        'role_id'            => 'required'
      ],
      'edit-initiative'        => [
        'login_access_token' => 'required',
        'user_id'            => 'required',
        'initiatives_id'     => 'required',
        's_o_id'             => 'required',
        'dept_id'            => 'required',
        'section_id'         => 'required',
        'user_id'            => 'required',
        'status'             => 'required',
        'start_date'         => 'required',
        'end_date'           => 'required',
        'comment'            => 'required',
      ],
      'delete-initiative'      => [
        'login_access_token' => 'required',
        'initiatives_id'     => 'required',
        'user_id'            => 'required',
      ],
      'api-initiatives-update-comment' => [
        'login_access_token' => 'required',
        'initiatives_id'     => 'required',
      ],
      'api-get-actionplans'    => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        'initiatives_id'     => 'required',
      ],
      'api-get-user-list-dept-wise'=>[

      ],
      'api-add-action-plans' => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        'user_id'            => 'required',
        'company_id'         => 'required',
      ],
      'initiative-and-actionplan' => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        'dept_id'            => 'required',
        'role_id'            => 'required',
      ],
      'edit-action-plan'       => [
        'login_access_token' => 'required',
        'user_id'            => 'required',
        'action_plan_id'     => 'required',
        'unit_id'            => 'required',
        'action_plan_definition' => 'required',
        'initiatives_id'     => 'required',
        'target'             => 'required',
        'start_date'         => 'required',
        'end_date'           => 'required',
        'control_point'      => 'required',
       // 'status'             => 'required',
        'user_id'            => 'required',
        'co_owner'           => 'required',
        'comment'            => 'required',
      ],
      'delete-action-plan'     => [
        'login_access_token' => 'required',
        'action_plan_id'     => 'required',
        'user_id'            => 'required',
      ],
      'add-action-plan-schedules' => [
        'login_access_token' => 'required',
        'action_plan_id'     => 'required',
        'status'             => 'required',
        'month_date'         => 'required',
      ],
      'action-plan-schedules-user' => [
        'login_access_token' => 'required',
        'action_plan_id'     => 'required',
        'co_owner_id'        => 'required',
      ],
      'api-action-plan-schedule-data' => [
        'login_access_token' => 'required',
        'action_plan_id'     => 'required',
        'year'               => 'required',
      ],
      'api-action-plan-update-comment' => [
        'action_plan_id'     => 'required'
      ],
      'api-action-plan-update-comment' => [
        'action_plan_id' => 'required'
      ],
      'api-action-plan-comment' => [
        'login_access_token' => 'required',
        'action_plan_id'     => 'required',
      ],
      'api-get-module'         => [
        'login_access_token' => 'required',
        'role_id'            => 'required',
      ],
      'api-get-module-data' => [
        'login_access_token' => 'required',
        'id'                 => 'required', //module_id
      ],
      'api-update-role-module' => [
        'login_access_token' => 'required',
        'role_id'            => 'required',
        'module_permissions' => 'required',
      ],
      'api-get-menu'           => [
        'login_access_token' => 'required',
        'role_id'            => 'required', //module_id
      ],
      'api-view-priorities'    => [
        'login_access_token' => 'required',
        'role_id'            => 'required',
      ],
      'api-add-priorities'     => [
        'login_access_token' => 'required',
      ],
      'api-view-priorities'    => [
        'login_access_token' => 'required',
      ],
      'api-update-priorities'  => [
        'login_access_token' => 'required',
      ],
      'api-delete-priorities'  => [
        'login_access_token' => 'required',
      ],
      'api-get-unit'           => [
        'login_access_token' => 'required',
        'unit_id'            => 'required'
      ],
      'api-unit'               => [
        'login_access_token' => 'required',
        'unit_name'          => 'required',
        'unit_address'       => 'required',
        'company_id'         => 'required',
        'enable'             => 'required'
      ],
      'api-view-unit'          => [
        'login_access_token' => 'required',
      ],
      'api-edit-unit'          => [
        'login_access_token' => 'required',
        'unit_name'          => 'required',
        'unit_address'       => 'required',
        'company_id'         => 'required',
        'enable'             => 'required',
        'id'                 => 'required',
      ],
      'api-delete-unit'        => [
        'login_access_token'   => 'required',
        'unit_id'              => 'required',
        'user_id'              => 'required',
      ],
      'api-company-setting-update' => [
        'login_access_token'       => 'required',
        'company_id'               => 'required',
      ],
      'api-company-setting-view' => [
        'login_access_token'     => 'required',
        'company_id'             => 'required',
      ],
      'api-department'         => [
        'login_access_token'   => 'required',
        'unit_id'              => 'required',
        'dept_name'            => 'required',
        'user_id'              => 'required',
        'role_id'              => 'required',
      ],
      //  'required|exists:<your_table>,<your_field>
      'api-view-department'    => [
        'login_access_token'   => 'required',
        'company_id'           => 'required',
      ],
      'api-edit-department'    => [
        'login_access_token'   => 'required',
        'unit_id'              => 'required',
        'dept_name'            => 'required',
        'dept_id'              => 'required',
        'user_id'              => 'required',
        'role_id'              => 'required',
      ],
      'api-delete-department'  => [
        'login_access_token'   => 'required',
        'dept_id'                   => 'required',
        'user_id'              => 'required',
      ],
      'api-get-predefine-dept' => [
        'login_access_token'   => 'required',
      ],
      'api-section'            => [
        'login_access_token'   => 'required',
        'dept_id'              => 'required',
        'section_name'         => 'required',
        'enable'               => 'required',
        'role_id'              => 'required',
        'user_id'              => 'required',
      ],
      'api-view-section'       => [
        'login_access_token'   => 'required',
        'company_id'           => 'required',
      ],
      'api-section-update'     => [
        'login_access_token'   => 'required',
        'dept_id'              => 'required',
        'section_name'         => 'required',
        'enable'               => 'required',
        'section_id'           => 'required',
      ],
      'get-section'            => [
        'dept_id'              => 'required',
        'company_id'           => 'required',
      ],
      'api-delete-section'     => [
        'login_access_token'   => 'required',
        'section_id'           => 'required',
      ],
      'api-add-category'       => [
        'login_access_token'   => 'required',
        'category_name'        => 'required',
        'enable'               => 'required',
        'company_id'           => 'required'
      ],
      'api-view-category'      => [
        'login_access_token'   => 'required',
        'company_id'           => 'required',
      ],
      'api-update-category'    => [
        'login_access_token'   => 'required',
        'category_name'        => 'required',
        'category_id'          => 'required',
        'enable'               => 'required',
      ],
      'api-delete-category'    => [
        'login_access_token'   => 'required',
        'category_id'          => 'required',
      ],
      'api-add-business_initiatives' => [
        'login_access_token'         => 'required',
        'business_initiative'        => 'required',
        'enable'                     => 'required',
        'company_id'                 => 'required',
      ],
      'api-view-business_initiatives' => [
        'login_access_token' => 'required',
        'company_id'         => 'required'
      ],
      'api-update-business_initiatives' => [
        'login_access_token' => 'required',
        'business_initiative' => 'required',
        'business_initiatives_id' => 'required',
        'enable'             => 'required',
      ],
      'api-delete-business_initiatives' => [
        'login_access_token' => 'required',
        'business_initiatives_id' => 'required'
      ],
      'api-add-uom'            => [
        'login_access_token' => 'required',
        'name'               => 'required',
        'company_id'         => 'required',
      ],
      'api-view-uom'           => [
        'login_access_token' => 'required',
        'company_id'         => 'required',
      ],
      'api-update-uom'         => [
        'login_access_token' => 'required',
        'name'               => 'required',
        'uom_id'             => 'required',
      ],
      'api-delete-uom'         => [
        'login_access_token' => 'required',
        'uom_id'             => 'required',
      ],
      'api-add-faq'            => [
        'login_access_token' => 'required',
        'question'           => 'required',
        'answer'             => 'required',
        'company_id'         => 'required',
      ],
      'api-view-faq'           => [
        'login_access_token' => 'required',
        'company_id'         => 'required',
      ],
      'api-update-faq'         => [
        'login_access_token' => 'required',
        'question'           => 'required',
        'answer'             => 'required',
        'faq_id'             => 'required',
      ],
      'api-delete-faq'         => [
        'login_access_token' => 'required',
        'faq_id'             => 'required',
      ],
      'api-add-business-priority' => [
        'login_access_token' => 'required',
        'business_priority'  => 'required',
        'keywords'           => 'required',
      ],
      'api-view-business-priority' => [
        'login_access_token' => 'required',
      ],
      'api-update-business-priority' => [
        'login_access_token' => 'required',
        'business_priority'  => 'required',
        'keywords'           => 'required',
        'business_priority_id' => 'required',
      ],
      'api-delete-business-priority' => [
        'login_access_token' => 'required',
        'business_priority_id' => 'required',
      ],
      'api-add-business-objective' => [
        'login_access_token' => 'required',
        'business_objective' => 'required',
        'keywords'           => 'required',
      ],
      'api-view-business-objective' => [
        'login_access_token' => 'required',
      ],
      'api-update-business-objective' => [
        'login_access_token' => 'required',
        'business_objective' => 'required',
        'keywords'           => 'required',
        'business_objective_id' => 'required'
      ],
      'api-delete-business-objective' => [
        'login_access_token' => 'required',
        'business_objective_id' => 'required',
      ],
      'api-add-strength'       => [
        'login_access_token' => 'required',
        'strength'           => 'required',
        'keywords'           => 'required',
      ],
      'api-view-strength'      => [
        'login_access_token' => 'required',
      ],
      'api-update-strength'    => [
        'login_access_token' => 'required',
        'strength'           => 'required',
        'keywords'           => 'required',
        'strength_id'        => 'required',
      ],
      'api-delete-strength'    => [
        'login_access_token' => 'required',
        'strength_id'        => 'required',
      ],
      'api-add-weaknesses'     => [
        'login_access_token' => 'required',
        'weaknesses'         => 'required',
        'keywords'           => 'required',
      ],
      'api-view-weaknesses'    => [
        'login_access_token' => 'required',
      ],
      'api-update-weaknesses'  => [
        'login_access_token' => 'required',
        'weaknesses'         => 'required',
        'keywords'           => 'required',
        'weaknesses_id'      => 'required',
      ],
      'api-delete-weaknesses' => [
        'login_access_token' => 'required',
        'weaknesses_id'      => 'required',
      ],
      'api-add-opportunities' => [
        'login_access_token' => 'required',
        'opportunities'      => 'required',
        'keywords'           => 'required',
      ],
      'api-view-opportunities' => [
        'login_access_token' => 'required',
      ],
      'api-update-opportunities' => [
        'login_access_token'  => 'required',
        'opportunities'       => 'required',
        'keywords'            => 'required',
        'opportunities_id'    => 'required',
      ],
      'api-delete-opportunities' => [
        'login_access_token' => 'required',
        'opportunities_id'   => 'required',
      ],
      'api-add-threats'        => [
        'login_access_token' => 'required',
        'threats'            => 'required',
        'keywords'           => 'required',
      ],
      'api-view-threats'       => [
        'login_access_token' => 'required',
      ],
      'api-update-threats'    => [
        'login_access_token' => 'required',
        'threats'            => 'required',
        'keywords'           => 'required',
        'threats_id'         => 'required',
      ],
      'api-delete-threats'     => [
        'login_access_token' => 'required',
        'threats_id'         => 'required',
      ],
      'api-add-hoshinkanri'    => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        'dept_id'            => 'required',
        'str_obj_id'         => 'required',
        'initiatives_id'     => 'required',
        'action_plan_id'     => 'required',
        'kpi_id'             => 'required',
        'area_manager'       => 'required',
        'area_manager_value' => 'required',
        'area_manager_percent' => 'required',
      ],
      'api-view-hoshinkanri'   => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        'role_id'            => 'required',
      ],
      'quarterly-add-manufacturing' => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        'dept_id'            => 'required',
        'year'               => 'required',
        'quarterly'          => 'required',
      ],
      'quarterly-view-manufacturing' => [
        'login_access_token' => 'required',
        'unit_id'            => 'required',
        'dept_id'            => 'required',
        'role_id'            => 'required',
      ],
      'quarterly-delete-manufacturing' => [
        'login_access_token' => 'required',
        'quartupdatmanufacturs_id' => 'required',
      ],
      'quarterly-edit-manufacturing' => [
        'login_access_token' => 'required',
        'quartupdatmanufacturs_id' => 'required',
        'unit_id'            => 'required',
        'dept_id'            => 'required',
        'year'               => 'required',
        'quarterly'          => 'required',
      ],
      'quarterly-details-manufacturing' => [
        'login_access_token' => 'required',
        'quartupdatmanufacturs_id' => 'required',
      ],
      'api-new-company-setup'  => [
        'login_access_token' => 'required',
        'user_id' => 'required',
      ],
      'api-new-company-details' => [
        'login_access_token' => 'required',
        'company_id'         => 'required',
      ],
      'api-view-new-company-setup' => [
        'login_access_token' => 'required'
      ],
      'api-user-login'         => [
        'email'              => 'required|email',
        'password'           => 'required',
      ],
      'api-reset-password'     => [
        'email'              => 'required|email',
      ],
      'api-user-signup' => $request['role_id'] == 2 ?
        [
          'email' => 'unique:users,email|email|required',
          'name' => 'required',
          'password' => 'required|min:6',
          'role_id' => 'required',
        ] : [
          'email' => 'unique:users,email|email|required',
          'name' => 'required',
          'password' => 'required|min:6',
          'role_id' => 'required',
          'multi_dept_id' => '',
          'multi_unit_id' => 'required',
          'multi_section_id' => '',
        ],
      'api-resetpassword-update' => [
        'reset_password_token' => 'required',
        'new_password'         => 'required|min:6|same:confirm_password',
        'confirm_password'     => 'required',
      ],
      'api-get-dept-signup'      => [
        'unit_id'              => 'required',
      ],
      'api-get-department'           => [
        'unit_id'              => 'required',
        'dept_id'              => 'required',
      ],
      'api-get-all-department' =>[
        'login_access_token' => 'required',
        'unit_id'              => 'required',
      ],
      'api-get-section-signup'   => [
        'dept_id'              => 'required',
      ],

    ];
    return $validation_rules[$api_name];
  }
}
