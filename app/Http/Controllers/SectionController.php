<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Dwij\Laraadmin\Models\Module;
use Mail;

class SectionController extends ResponseApiController
{
    /**
     * Get Section signup in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_get_section_signup(Request $request)
    {

        if ($request->profile == 'profile') {
            $section_data = DB::table('sections')->select('sections.id as multi_section_id', 'sections.section_name', 'sections.dept_id', 'department_masters.dept_name')
                ->join('department_masters', 'sections.dept_id', '=', 'department_masters.id')
                ->where('sections.deleted_at', NULL)
                ->whereIn('sections.dept_id', $request->dept_id)
                ->get();
        } else {
            $section_data = DB::table('sections')->select('sections.id as multi_section_id', 'sections.section_name', 'sections.dept_id', 'department_masters.dept_name')
                ->join('department_masters', 'sections.dept_id', '=', 'department_masters.id')
                ->where('sections.deleted_at', NULL)
                ->whereIn('sections.dept_id', $request->dept_id)
                ->get();
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "section data list response";
        $this->apiResponse['data'] = $section_data;
        return $this->sendResponse();
    }
    /**
     * add section to database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_section(Request $request)
    {
        try {
            DB::beginTransaction();
            $user_Email = DB::table('employers')->select('email', 'role_id')->where('user_id', $request->user_id)->first();
            $request['email'] = $user_Email->email;
            $user = $user_Email->email;
            // Mail::send('emails.dept_manager_strategic_objectives', ['email' => $user], function ($m) use ($user) {
            //     $m->from(env('MAIL_USERNAME'), 'BussinessPluse');
            //     $m->to($user, 'admin')->subject('Your Reminder!');
            // });
            if ($request->role_id < $user_Email->role_id) {
                DB::table('employers')->where('user_id', $request->user_id)->update(['role_id' => $request->role_id]);
                DB::table('role_user')->where('user_id', $request->user_id)->update(['role_id' => $request->role_id]);
            }
            $section_id = Module::insert("sections", $request);
            $request['section_id'] =  $section_id;
            DB::statement("UPDATE employers
            SET
            multi_section_id =
              concat(multi_section_id,',',$section_id) WHERE
              user_id = $request->user_id
            ");
            DB::commit();
            $this->apiResponse['status'] = "success";
            $this->apiResponse['data'] = $request->all();
            $this->apiResponse['message'] = 'Successfully add new section!';
            return $this->sendResponse();
        } catch (\Exception $e) {
            DB::rollback();
            $this->apiResponse['status'] = false;
            $this->apiResponse['message'] = $e->getMessage();
            return $this->sendResponse();
        }
    }
    /**
     * View section in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_section(Request $request)
    {

        $unit_details = DB::table('units')->select('id')->where('company_id', $request->company_id)->get();
        if (!empty($unit_details)) {
            foreach ($unit_details as $key => $row) {
                $units_ids[] = $row->id;
            }
            foreach ($units_ids as $key => $row) {
                $temp_department_data[] = $row;
            }
            $department_data = DB::table('department_masters')->select('id')->whereIn('unit_id', $temp_department_data)->get();
            foreach ($department_data as $key => $row) {
                $all_dept_id[] = $row->id;
            }
            $section_data = DB::table('sections')->select('sections.id as section_id', 'sections.section_name', 'sections.dept_id', 'sections.user_id', 'employers.email', 'employers.name', 'department_masters.unit_id','units.unit_name','department_masters.dept_name')
                ->join('department_masters', 'sections.dept_id', '=', 'department_masters.id')
                ->leftjoin('employers', 'sections.user_id', '=', 'employers.user_id')
                ->leftjoin('units','department_masters.unit_id','=','units.id')
                ->where('department_masters.deleted_at', NULL)
                ->where('sections.deleted_at', NULL)
                ->whereIn('dept_id', $all_dept_id)
                //->where('department_masters.unit_id', $request->unit_id)
                ->get();
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = "section response";
            $this->apiResponse['data'] = $section_data;
            return $this->sendResponse();
        }
    }
    /**
     * Store edit section in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_section_update(Request $request)
    {
        try {
            $user_Email = DB::table('employers')->select('email', 'role_id')->where('user_id', $request->user_id)->first();
            $request['email'] = $user_Email->email;
            $user = $user_Email->email;
            // dump($user);die();
            // Mail::send('emails.dept_manager_strategic_objectives', ['user_name' => $user, 'so_name'=>''], function ($m) use ($user) {
            //     $m->from(env('MAIL_USERNAME'), 'BussinessPluse');
            //     $m->to($user, 'admin')->subject('Your Reminder!');
            // });
            if ($request->role_id < $user_Email->role_id) {
                DB::table('employers')->where('user_id', $request->user_id)->update(['role_id' => $request->role_id]);
                DB::table('role_user')->where('user_id', $request->user_id)->update(['role_id' => $request->role_id]);
            }
            $insert_id = Module::updateRow("sections", $request, $request->section_id);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully update section!';
            return $this->sendResponse();
            return $this->sendResponse();
        } catch (\Exception $e) {
            $this->apiResponse['status'] = false;
            $this->apiResponse['message'] = $e->getMessage();
            return false;
            return $this->sendResponse();
        }
    }
    /**
     * delete section in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_section(Request $request)
    {
        $date = date('Y-m-d h:i:s');
        $raje = 'ddd';
        DB::table('sections')->where('id', $request->section_id)->update(['deleted_at' => $date]);
        $r = "'$request->section_id'";
        DB::statement("UPDATE employers
            SET
            multi_section_id =
                TRIM(BOTH ',' FROM REPLACE(CONCAT(',', multi_section_id, ','), ',$request->section_id,', ','))
            WHERE
              FIND_IN_SET($r, multi_section_id) AND user_id = $request->user_id AND company_id = $request->company_id
            ");

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully delete section!';
        return $this->sendResponse();
    }
}
