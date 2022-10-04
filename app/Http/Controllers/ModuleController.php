<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use DB;
use Dwij\Laraadmin\Models\Module;


class ModuleController extends ResponseApiController
{
    /**
     * get module acording to units to database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function get_module(Request $request)
    {
        $module = DB::table('modules')->select('modules.id', 'modules.name', 'la_menus.display_name')
            ->join('la_menus', 'modules.name', '=', 'la_menus.name')
            ->where('la_menus.view_permission', 1)
            ->groupBy('id')
            ->orderBy('display_name', 'ASC')
            ->get();

        $data['module'] = $module;
        $message = 'Module data list';
        return $this->respondCreated($message, $data);
    }
    /**
     * get module acording to units to database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function get_module_data(Request $request)
    {
        $module_permissions_data = DB::table('role_module')->select('role_module.*', 'roles.name', 'roles.display_name', 'modules.display_name as Modules_Name')
            ->leftjoin('roles', 'role_module.role_id', '=', 'roles.id')
            ->leftjoin('modules', 'role_module.module_id', '=', 'modules.id')
            ->where('module_id', $request->id)->where('roles.id', '>', 1)->get();

        $this->apiResponse['status'] = "success";
        $this->apiResponse['data'] = $module_permissions_data;
        $this->apiResponse['message'] = 'module permision data !';
        return $this->sendResponse();
    }
    /**
     * update profile in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_update_role_module(request $request)
    {
        foreach ($request->module_permissions as $key => $row) {
            // print_r($row['acc_edit']);die;
            DB::table('role_module')->where('id', $row['id'])->update([
                'acc_view' => $row['acc_view'],
                'acc_create' => $row['acc_create'],
                'acc_edit' => $row['acc_edit'],
                'acc_delete' => $row['acc_delete'],
                'updated_at' => $row['module_id']
            ]);
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "successfully update role module";
        return $this->sendResponse();
    }
    /**
     * get la_menu to database. 
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_get_menu(Request $request)
    {
        $la_menu = DB::table('la_menus')->select('la_menus.*', 'modules.id as module_id', 'modules.name as module_name', 'role_module.id as role_module_id', 'role_module.module_id as role_module_role_id', 'role_module.acc_view', 'role_module.acc_create', 'role_module.acc_edit', 'role_module.acc_delete')
            ->leftjoin('modules', 'la_menus.name', '=', 'modules.name')
            ->leftjoin('role_module', 'modules.id', '=', 'role_module.module_id')
            ->where('role_module.acc_view', 1)
            ->where('role_module.role_id', $request->role_id)
            ->get();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['la_menu'] = $la_menu;
        $this->apiResponse['message'] = 'la menu data !';
        return $this->sendResponse();
    }
    /**
     * get user role to database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_get_select_modules()
    {

        $data['user_role'] = DB::table('roles')->select('roles.id', 'roles.display_name')->where('deleted_at', null)
            ->skip(1)->take(6)
            ->get();

        $data['units'] = DB::table('units')->select('units.id', 'units.unit_name', 'units.unit_address')
            ->where('deleted_at', null)
            ->where('enable', 'yes')
            ->get();

        $data['department_masters'] = DB::table('department_masters')->select('department_masters.id', 'department_masters.dept_name')
            ->where('deleted_at', null)
            ->where('enable', 'yes')
            ->orderBy('dept_name', 'ASC')
            ->get();

        $data['categories'] = DB::table('categories')->select('categories.id', 'categories.category_name')
            ->where('deleted_at', null)
            ->get();

        $data['events'] = DB::table('events')->select('events.id', 'events.event_name')
            ->where('deleted_at', null)
            ->get();

        $data['sections'] = DB::table('sections')->select('sections.id', 'sections.section_name')
            ->where('deleted_at', null)
            ->where('enable', 'yes')
            ->get();

        $data['status'] = DB::table('statuses')->select('statuses.id', 'statuses.status_name')
            ->where('deleted_at', null)
            ->get();

        $data['priorities'] = DB::table('priorities')->select('priorities.id', 'priorities.name')
            ->where('deleted_at', NULL)
            ->get();

        $data['business_initiatives'] = DB::table('business_initiatives')->select('business_initiatives.id', 'business_initiatives.business_initiative')
            ->where('deleted_at', null)
            ->get();


        $data['projects'] = DB::table('projects')->select('projects.id', 'projects.project_name')
            ->where('deleted_at', null)
            ->get();

        $data['users'] = DB::table('users')->select('users.id', 'users.name')
            ->where('deleted_at', null)->where('id', '!=', 1)
            ->get();

        $data['projects'] = DB::table('projects')->select('projects.id', 'projects.project_name')
            ->where('deleted_at', null)
            ->get();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "Project remark data list response";
        $this->apiResponse['data'] = $data;
        return $this->sendResponse();
    }

    public function api_add_priorities(Request $request)
    {
        Module::insert("Priorities", $request);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully save your task!';
        return $this->sendResponse();
    }
    public function api_view_priorities(Request $request)
    {
        $priorities = DB::table('priorities')->select('priorities.id', 'priorities.name')
            ->where('deleted_at', NULL)
            ->get();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['data'] = $priorities;
        $this->apiResponse['message'] = 'Task priorities';
        return $this->sendResponse();
    }

    public function api_update_priorities(Request $request)
    {
        Module::updateRow("Priorities", $request, $request->id);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Task priorities Update';
        return $this->sendResponse();
    }
    public function api_delete_priorities(Request $request)
    {
        $date = date('Y-m-d h:i:s');
        DB::table('priorities')->where('priorities.id', $request->id)->update(['deleted_at' => $date]);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Task Priorities Deleted ';
        return $this->sendResponse();
    }
}
