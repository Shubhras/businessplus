<?php

namespace App\Http\Controllers;

use App\Models\Department;
use DB;
use Dwij\Laraadmin\Models\Module;
use Illuminate\Http\Request;

//use Illuminate\Support\Facades\Storage;

class ApiDepartmentController extends ResponseApiController
{
    /**
     * Get department signup in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_get_dept_signup(Request $request)
    {
        if ($request->profile == 'section') {
            $dept_data = DB::table('department_masters')->select('department_masters.id as multi_dept_id', 'department_masters.dept_name', 'department_masters.unit_id', 'units.unit_name')
                ->join('units', 'department_masters.unit_id', '=', 'units.id')
                ->where('department_masters.deleted_at', null)
                ->where('department_masters.unit_id', $request->unit_id)
                ->get();
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = "department data list response";
            $this->apiResponse['data'] = $dept_data;
            return $this->sendResponse();
        }
        if ($request->profile == 'profile') {
            $dept_data = DB::table('department_masters')->select('department_masters.id as multi_dept_id', 'department_masters.dept_name', 'department_masters.unit_id', 'units.unit_name')
                ->join('units', 'department_masters.unit_id', '=', 'units.id')
                ->where('department_masters.deleted_at', null)
                ->whereIn('department_masters.unit_id', $request->unit_id)
                ->get();
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = "department data list response";
            $this->apiResponse['data'] = $dept_data;
            return $this->sendResponse();
        } else {
            $array = $request->unit_id;
            $a = json_encode($array);
            $b = json_decode($a);
            $dept_data = DB::table('department_masters')->select('department_masters.id as multi_dept_id', 'department_masters.dept_name', 'department_masters.unit_id', 'units.unit_name')
                ->join('units', 'department_masters.unit_id', '=', 'units.id')
                ->where('department_masters.deleted_at', null)
                ->whereIn('department_masters.unit_id', $b)
                ->get();
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = "department data list response";
            $this->apiResponse['data'] = $dept_data;
            return $this->sendResponse();
        }
    }
    /**
     * get department acording to unit to database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function get_department(Request $request)
    {

        $multi_dept_id = explode(',', $request->dept_id);
        if (!empty($request->dept_id && $request->role_id == 5 || $request->role_id == 6 || $request->role_id == 7)) {
            $dept_data = DB::table('department_masters')->select('department_masters.id', 'department_masters.dept_name', 'department_masters.unit_id', 'units.unit_name')
                ->join('units', 'department_masters.unit_id', '=', 'units.id')
                ->where('department_masters.deleted_at', null)
                ->where('department_masters.unit_id', $request->unit_id)
                ->whereIn('department_masters.id', $multi_dept_id)
                ->orderBy('department_masters.dept_name', 'ASC')
                ->get();
        } else {
            $dept_data = DB::table('department_masters')->select('department_masters.id', 'department_masters.dept_name', 'department_masters.unit_id', 'units.unit_name')
                ->join('units', 'department_masters.unit_id', '=', 'units.id')
                ->where('department_masters.deleted_at', null)
                ->where('department_masters.unit_id', $request->unit_id)
                ->orderBy('department_masters.dept_name', 'ASC')
                ->get();
        }

        // dump($dept_data);die;

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "department data list response";
        $this->apiResponse['data'] = $dept_data;
        return $this->sendResponse();
    }
    public function get_all_department(Request $request)
    {
        $dept_data = [];
        $dept_data = DB::table('department_masters')->select('department_masters.id as dept_id', 'department_masters.dept_name as dept_name', DB::raw("'-' as name"), DB::raw("'-' as email"), 'units.unit_name', 'department_masters.unit_id')
            ->join('units', 'department_masters.unit_id', '=', 'units.id')
            ->where('department_masters.unit_id', $request->unit_id)
            ->get();

        // dump($dept_data);

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "department data list response";
        $this->apiResponse['data'] = $dept_data;
        return $this->sendResponse();
    }
    /**
     * Store department in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function api_department(Request $request)
    {

        $tempdeptname = trim($request->dept_name);
        $request['dept_name'] = $tempdeptname;
        // $request['user_id'] =  implode(",", $request->user_id);

        $department_data = DB::table('department_masters')->select('dept_name')
            ->where('unit_id', $request->unit_id)
            ->where('deleted_at', null)->get();

        foreach ($department_data as $key => $dept_row) {
            if ($request->dept_name == $dept_row->dept_name) {
                $this->apiResponse['status'] = false;
                $this->apiResponse['message'] = 'Department is already exist!';
                return $this->respond_dept_name_unique();
            }
        }

        try {
            $user_Email = DB::table('employers')->select('email', 'role_id')->where('user_id', $request->user_id)->first();
            $request['email'] = $user_Email->email;
            $user = $user_Email->email;
            // Mail::send('emails.dept_manager_strategic-objectives', ['email' => $user], function ($m) use ($user) {
            //     $m->from(env('MAIL_USERNAME'), 'BussinessPluse');
            //     $m->to($user, 'admin')->subject('Your Reminder!');
            // });
            if ($request->role_id < $user_Email->role_id) {
                DB::table('employers')->where('user_id', $request->user_id)->update(['role_id' => $request->role_id]);
                DB::table('role_user')->where('user_id', $request->user_id)->update(['role_id' => $request->role_id]);
            }
            $dept_id = Module::insert("department_masters", $request);
            $request['dept_id'] = $dept_id;
            DB::statement("UPDATE employers
            SET
            multi_dept_id =
              concat(multi_dept_id, ',' ,$dept_id) WHERE
              user_id = $request->SprUsr
            ");
            DB::statement("UPDATE employers
             SET
             multi_dept_id =
               concat(multi_dept_id, ',' ,$dept_id) WHERE
               user_id = $request->user_id
             ");
            $this->apiResponse['status'] = "success";
            $this->apiResponse['data'] = $request->all();
            $this->apiResponse['message'] = 'Successfully add new department!';
            return $this->sendResponse();
        } catch (\Exception $e) {
            $this->apiResponse['status'] = "False";
            $this->apiResponse['message'] = $e->getMessage();
            return $this->sendResponse();
        }
    }

    /**
     * View department in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_department(Request $request)
    {
        $unit_details = DB::table('units')->select('id')->where('company_id', $request->company_id)->get();
        foreach ($unit_details as $key => $row) {
            $units_ids[] = $row->id;
        }
        $department_data = DB::table('department_masters')->select('department_masters.id as dept_id', 'department_masters.dept_name', 'department_masters.user_id', 'employers.name', 'department_masters.unit_id', 'units.unit_name', 'employers.email')
            ->join('units', 'department_masters.unit_id', '=', 'units.id')
            ->join('employers', 'department_masters.user_id', '=', 'employers.user_id')
            ->where('department_masters.deleted_at', null)
            ->whereIn('department_masters.unit_id', $units_ids)
            ->where('units.deleted_at', null)
            ->get();

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "department response";
        $this->apiResponse['data'] = $department_data;
        return $this->sendResponse();
    }
    /**
     * Store edit department in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_edit_department(Request $request)
    {
        $tempdeptname = trim($request->dept_name);
        $request['dept_name'] = $tempdeptname;

        $department_data = DB::table('department_masters')->select('dept_name', 'id')
            ->where('unit_id', $request->unit_id)
            ->where('deleted_at', null)->get();

        foreach ($department_data as $key => $dept_row) {
            if (($request->dept_name == $dept_row->dept_name) && ($request->dept_id != $dept_row->id)) {
                $this->apiResponse['status'] = false;
                $this->apiResponse['message'] = 'Department is already exist!';
                return $this->respond_dept_name_unique();
            }
        }

        try {
            $user_Email = DB::table('employers')->select('email', 'role_id')->where('user_id', $request->user_id)->first();
            if ($request->role_id < $user_Email->role_id) {
                DB::table('employers')->where('user_id', $request->user_id)->update(['role_id' => $request->role_id]);
                DB::table('role_user')->where('user_id', $request->user_id)->update(['role_id' => $request->role_id]);
            }
            $request['email'] = $user_Email->email;
            $id = $request->dept_id;
            $insert_id = Module::updateRow("department_masters", $request, $id);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully update department!';
            return $this->sendResponse();
        } catch (\Exception $e) {

            $this->apiResponse['status'] = false;
            $this->apiResponse['message'] = $e->getMessage();
            return $this->sendResponse();
        }
    }
    /**
     * delete department in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_department(Request $request)
    {
        try {
            DB::beginTransaction();
            $date = date('Y-m-d h:i:s');
            DB::table('department_masters')->where('id', $request->dept_id)->update(['deleted_at' => $date]);
            $r = "'$request->dept_id'";
            DB::statement("UPDATE employers
            SET
            multi_dept_id =
                TRIM(BOTH ',' FROM REPLACE(CONCAT(',', multi_dept_id, ','), ',$request->dept_id,', ','))
            WHERE
              FIND_IN_SET($r, multi_dept_id)
            ");

            DB::table('sections')->where('sections.dept_id', $request->dept_id)->update(['deleted_at' => $date]);
            DB::table('strategic_objectives')->where('strategic_objectives.department_id', $request->dept_id)->update(['deleted_at' => $date]);
            DB::table('initiatives')->where('initiatives.dept_id', $request->dept_id)->update(['deleted_at' => $date]);
            DB::table('action_plans')->where('action_plans.dept_id', $request->dept_id)->update(['deleted_at' => $date]);
            DB::table('add_kpis')->where('department_id', $request->dept_id)->update(['deleted_at' => $date]);

            $get_action = DB::table('action_plans')->select('id as action_id')->whereNotNull('deleted_at')->where('dept_id', $request->dept_id)->get();

            foreach ($get_action as $key => $action_row) {
                DB::table('action_plan_assigns')->where('action_plan_id', $action_row->action_id)->update(['deleted_at' => $date]);
                DB::table('action_plan_schedules')->where('action_plan_id', $action_row->action_id)->update(['deleted_at' => $date]);
                DB::table('action_plan_statuses')->where('action_plan_id', $action_row->action_id)->update(['deleted_at' => $date]);
                DB::table('actionp_edit_comments')->where('action_plan_id', $action_row->action_id)->update(['deleted_at' => $date]);
            }
            DB::commit();
            $this->apiResponse['status'] = "success";

            $this->apiResponse['message'] = 'Successfully delete dapartment!';
            return $this->sendResponse();
        } catch (\Exception $e) {
            DB::rollback();
            $this->apiResponse['message'] = $e->getMessage();
            return $this->sendResponse();
        }
    }
    public function api_get_predefine_dept(Request $request)
    {
        $dept_data_predefine = Department::get()->toarray();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully Save Your Company Control Setting!';
        $this->apiResponse['data'] = $dept_data_predefine;
        return $this->sendResponse();
    }
}
