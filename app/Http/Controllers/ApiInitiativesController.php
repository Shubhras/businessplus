<?php
 
namespace App\Http\Controllers;

use Carbon\Carbon;
use DB;
use Dwij\Laraadmin\Models\Module;
use Illuminate\Http\Request;
use Mail;

class ApiInitiativesController extends ResponseApiController
{ 
    /**
     * get initiatives acording to units to database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function get_initiatives(Request $request)
    // dump($role_data);die;
    {
        /*  if ($request['fyear'] == 'april-march') {
        $start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
        $end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
        } else {
        $start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
        $end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        } */

        $initiatives = DB::table('initiatives')->select('id', 'definition', 'start_date', 'end_date')
            ->where('deleted_at', null)
            ->where('unit_id', $request->unit_id)
            ->where('s_o_id', $request->s_o_id)
        /* ->where(function ($q) use ($start_date, $end_date) {
        $q->whereBetween('initiatives.start_date', [$start_date, $end_date])
        ->orwhereBetween('initiatives.end_date', [$start_date, $end_date]);
        }) */    ->get();

        $data['initiatives'] = $initiatives;
        $message = 'initiatives module dropdown list';
        return $this->respondCreated($message, $data);
    }
    /**
     * Store initiatives in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_add_initiatives(Request $request)
    {
        // dump($reques t);die;
        $date = date('Y-m-d h:i:s');
        try {
            DB::beginTransaction();
            $strategic_objectives_data = DB::table('strategic_objectives')->select('end_date')
                ->where('id', $request->s_o_id)->first();
            $strategic_objectives_s_no_data = DB::table('strategic_sno_cmpnies')->select('s_no')
                ->where('s_o_id', $request->s_o_id)->first();
            // ->leftjoin('strategic_sno_cmpnies', 'strategic_objectives.id', '=', 'strategic_sno_cmpnies.s_o_id')
            // dump($strategic_objectives_s_no_data);die;
            // start date check to strategic objectives

            $dateNewStartDate = str_replace('/', '-', $request['start_date']);
            $dateNewStartDate = date('Y-m-d', strtotime($dateNewStartDate));
            if ($dateNewStartDate >= $strategic_objectives_data->end_date) {
                $message = "Start date is grater then equals to strategic objectives end date !";
                $errors = "Start date is grater then to strategic objectives end date !";
                return $this->respondValidationError($message, $errors);
            }
            // end date check to strategic objectives
            $dateNewEndDate = str_replace('/', '-', $request->end_date);
            $dateNewEndDate = date('Y-m-d', strtotime($dateNewEndDate));
            if ($dateNewEndDate >= $strategic_objectives_data->end_date) {
                $message = "End date is less then to strategic objectives end date !";
                $errors = "End date is less then to strategic objectives end date !";
                return $this->respondValidationError($message, $errors);
            }
            $request->merge([
                'status' => 1,
                'percentage' => 0,
                'previous_status' => 1,
            ]);
            $initiatives_count = DB::table('initiatives')->where('s_o_id', $request->s_o_id)->count();
            $srno = $initiatives_count + 1;
 if ($request->so_sno == '') {
                $sr_no = $strategic_objectives_s_no_data->s_no . '.' . $srno;
                $request->merge([
                    "sr_no" => $sr_no,
                ]);
            } else {
                $sr_no = $request->so_sno . '.' . $srno;
                $request->merge([
                    "sr_no" => $sr_no,
                ]); 
            }

            $start_date = date("Y-m-d", strtotime($request->start_date));
            $end_date = date("Y-m-d", strtotime($request->end_date));
            $initiative_id = DB::table('initiatives')->insertGetId([
                'created_at' => $date,'updated_at' => $date, 's_o_id' => $request['s_o_id'], 'dept_id' => $request['dept_id'], 'section_id' => $request['section_id'], 'definition' => $request['definition'], 'user_id' => $request['user_id'], 'unit_id' => $request['unit_id'], 'status' => $request['status'], 'percentage' => $request['percentage'], 'start_date' => $start_date, 'end_date' => $end_date, 'sr_no' => $request['sr_no'], 'previous_status' => $request['previous_status']
            ]);
            // $section_Data = DB::table('initiatives')->select(
            //     'initiatives.user_id', 'employers.email as email','employers.name as nameAdmin')
            //     ->join('employers', 'initiatives.user_id', '=', 'employers.user_id')
            //     ->where('initiatives.section_id', $request->section_id)->get();
            // $section_Data = DB::table('initiatives')->select(
            //     'initiatives.user_id', 'users.email as email','users.name as nameAdmin')
            //     ->join('users', 'initiatives.user_id', '=', 'users.id')
            //     ->where('initiatives.section_id', $request->section_id)->groupBy('initiatives.user_id')->get();

            // $section_Data = DB::table('initiatives')->select(
            //     'initiatives.user_id', 'employers.email as email','employers.name as nameAdmin')
            //     ->join('employers', 'initiatives.user_id', '=', 'employers.id')
            //     ->where('initiatives.section_id', $request->section_id)->groupBy('initiatives.user_id')->get();
            //     foreach ($section_Data as $key => $Section_admin) {
            //         $user = $Section_admin->email;
            //         $user_name = $Section_admin->nameAdmin;
            //         $initiative_name = $request->definition;

            // send mail to Department head
            $DepartmentAdmin_Data = DB::table('department_masters')->select('department_masters.user_id', 'employers.email as deptAdmin', 'employers.name as nameAdmin')
                ->join('employers', 'department_masters.user_id', '=', 'employers.user_id')
                ->join('strategic_objectives', 'department_masters.id', '=', 'strategic_objectives.department_id')
                ->where('department_masters.id', $request->dept_id)
                ->groupBy('strategic_objectives.department_id')
                ->get();

            foreach ($DepartmentAdmin_Data as $key => $admin_email) {
                $user = $admin_email->deptAdmin;
                $user_name = $admin_email->nameAdmin;
                $initiative_name = $request->definition;

                if (env('MAIL_USERNAME') != null && env('MAIL_USERNAME') != "null" && env('MAIL_USERNAME') != "") {
                    Mail::send('emails.dept_manager_initiative', ['user_name' => $user_name, 'initiative_name' => $initiative_name], function ($m) use ($user) {
                        $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                        $m->to($user, 'Admin')->subject('Initiative added!');
                    });
                }
            }

            // send mail to Section head
            $section_Data = DB::table('sections')->select(
                'sections.user_id', 'employers.email as email', 'employers.name as nameAdmin')
                ->join('employers', 'sections.user_id', '=', 'employers.user_id')
                ->where('sections.id', $request->section_id)->groupBy('sections.user_id')->get();
            foreach ($section_Data as $key => $Section_admin) {
                $user = $Section_admin->email;
                $user_name = $Section_admin->nameAdmin;
                $initiative_name = $request->definition;
                //dump($user,$initiative_name,$user_name); die();
                // Mail::send('emails.dept_manager_strategic_objectives', ['email' => $user], function ($m) use ($user) {
                //     $m->from(env('MAIL_USERNAME'), 'BussinessPluse');
                //     $m->to($user, 'admin')->subject('Your Reminder!');
                // });

                if (env('MAIL_USERNAME') != null && env('MAIL_USERNAME') != "null" && env('MAIL_USERNAME') != "") {
                    Mail::send('emails.dept_manager_initiative', ['user_name' => $user_name, 'initiative_name' => $initiative_name], function ($m) use ($user) {
                        $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                        $m->to($user, 'Admin')->subject('Initiative added!');
                    });
                }
            }

            DB::commit();
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully save your initiatives data !';
            return $this->sendResponse();
        } catch (\Exception $e) {
            DB::rollback();
            // print_r('dsjkdksd');die;
            $this->apiResponse['message'] = $e->getMessage();
        }
    }
    /**
     * View strategic objectives to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_initiative(Request $request)
    {
        // $data['strategic_objectives'] = DB::table('strategic_objectives')->select('id', 'id as sr_no', 'description', 'unit_id', 'department_id', 'user_id')
        //     ->where('strategic_objectives.unit_id', $request->unit_id)
        //     ->where('strategic_objectives.deleted_at', null)
        //     ->get();

        // $data['strategic_objectives']->sr_no = '';
        // $so_count = 0;
        // foreach ($data['strategic_objectives'] as $so_key => $so_row) {
        //     $so_count = $so_count + 1;
        //     $so_row->sr_no = $so_count;

        //     $requested_dept_id = explode(',', $request->dept_id);
        //     if ($request['fyear'] == 'april-march') {
        //         $start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
        //         $end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
        //     } else {
        //         $start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
        //         $end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        //     }
        //     $initiatives = DB::table('initiatives')->select('initiatives.sr_no', 'initiatives.id as initiatives_id', 'initiatives.definition', 'initiatives.user_id', 'initiatives.s_o_id', 'strategic_objectives.description as strategic_objectives_description', 'initiatives.dept_id', 'department_masters.dept_name', 'initiatives.section_id', 'sections.section_name', 'initiatives.status as status_id', 'str_obj_statuses.status_name', 'initiatives.percentage', 'initiatives.start_date', 'initiatives.end_date')
        //         ->leftjoin('sections', 'initiatives.section_id', '=', 'sections.id')
        //         ->leftjoin('department_masters', 'initiatives.dept_id', '=', 'department_masters.id')
        //         ->leftjoin('strategic_objectives', 'initiatives.s_o_id', '=', 'strategic_objectives.id')
        //         ->leftjoin('users', 'initiatives.user_id', '=', 'users.id')
        //         ->leftjoin('str_obj_statuses', 'initiatives.status', '=', 'str_obj_statuses.id')
        //         ->where('department_masters.deleted_at', null)
        //         ->where('strategic_objectives.deleted_at', null)
        //         ->where('users.deleted_at', null)
        //         ->where('initiatives.deleted_at', null)
        //         ->where('initiatives.unit_id', $request->unit_id)
        //         ->where(function ($q) use ($start_date, $end_date) {
        //             $q->whereBetween('initiatives.start_date', [$start_date, $end_date])
        //                 ->orwhereBetween('initiatives.end_date', [$start_date, $end_date])
        //                 ->orwhere(function ($p) use ($start_date, $end_date) {
        //                     $p->where('initiatives.start_date', '<=', $start_date)
        //                         ->where('initiatives.end_date', '>=', $end_date);
        //                 });
        //         })
        //         ->get();

        //     $init_count = 0;
        //     foreach ($initiatives as $init_key => $init_row) {

        //         $init_count = $init_count + 1;
        //         if ($so_row->id == $init_row->s_o_id) {
        //             $init_row->sr_no = $init_count;
        //             dump('soid',$so_row->id);
        //             dump('initid',$init_row->s_o_id);
        //             $init_row->sr_no = $so_row->sr_no . '.' . $init_row->sr_no;
        //         }
        //     }
        //     dump($initiatives);
        // }
        $requested_dept_id = explode(',', $request->dept_id);
        if ($request['fyear'] == 'april-march') {
            $start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
        } else {
            $start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        }
        $initiatives = DB::table('initiatives')->select('initiatives.sr_no', 'initiatives.id as initiatives_id', 'initiatives.definition', 'initiatives.user_id', 'initiatives.s_o_id', 'strategic_objectives.description as strategic_objectives_description', 'initiatives.dept_id', 'department_masters.dept_name', 'initiatives.section_id', 'sections.section_name', 'initiatives.status as status_id', 'str_obj_statuses.status_name', 'initiatives.percentage', 'initiatives.start_date', 'initiatives.end_date')
            ->leftjoin('sections', 'initiatives.section_id', '=', 'sections.id')
            ->leftjoin('department_masters', 'initiatives.dept_id', '=', 'department_masters.id')
            ->leftjoin('strategic_objectives', 'initiatives.s_o_id', '=', 'strategic_objectives.id')
            ->leftjoin('users', 'initiatives.user_id', '=', 'users.id')
            ->leftjoin('str_obj_statuses', 'initiatives.status', '=', 'str_obj_statuses.id')
            ->where('department_masters.deleted_at', null)
            ->where('strategic_objectives.deleted_at', null)
            ->where('users.deleted_at', null)
            ->where('initiatives.deleted_at', null)
            // ->whereIn('initiatives.dept_id', $requested_dept_id)
            ->where('initiatives.unit_id', $request->unit_id)
            ->where(function ($q) use ($start_date, $end_date) {
                $q->whereBetween('initiatives.start_date', [$start_date, $end_date])
                    ->orwhereBetween('initiatives.end_date', [$start_date, $end_date])
                    ->orwhere(function ($p) use ($start_date, $end_date) {
                        $p->where('initiatives.start_date', '<=', $start_date)
                            ->where('initiatives.end_date', '>=', $end_date);
                    });
            })
            ->orderBy('initiatives.sr_no', 'DESC')
            ->get();

        if ($request->role_id == 5 || $request->role_id == 6 || $request->role_id == 7) {
            foreach ($initiatives as $key => $value) {
                if (!in_array($value->dept_id, $requested_dept_id)) {
                    unset($initiatives[$key]);
                }
            }
            unset($key, $value);
        }
        $initiatives = array_values($initiatives);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "initiatives list response";
        $this->apiResponse['data'] = array_reverse($initiatives);
        return $this->sendResponse();
    }
    /**
     * View initiatives update comment.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_initiatives_update_comment(Request $request)
    {
        $initiat_edit_comments = DB::table('initiat_edit_comments')->select('initiatives.definition', 'users.name', 'initiat_edit_comments.comment', 'initiat_edit_comments.created_at')
            ->leftjoin('initiatives', 'initiat_edit_comments.initiatives_id', '=', 'initiatives.id')
            ->leftjoin('users', 'initiat_edit_comments.user_id', '=', 'users.id')
            ->where('initiat_edit_comments.deleted_at', null)
            ->where('users.deleted_at', null)
            ->where('initiatives.deleted_at', null)
            ->where('initiat_edit_comments.initiatives_id', $request->initiatives_id)
            ->orderBy('initiat_edit_comments.created_at', 'ASC')
            ->get();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "initiat edit comments list response";
        $this->apiResponse['data'] = $initiat_edit_comments;
        return $this->sendResponse();
    }
    /**
     * Store edit initiatives in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_edit_initiatives(Request $request)
    {
        $str_obj_data = DB::table('strategic_objectives')->where('id', $request->s_o_id)->first();
        // start date check to strategic objectives
        $dateNewStartDate = str_replace('/', '-', $request->start_date);
        $dateNewStartDate = date('Y-m-d', strtotime($dateNewStartDate));
        if ($dateNewStartDate >= $str_obj_data->end_date) {
            $message = "Start date is grater then equals to to strategic objectives end date !";
            $errors = "Start date is grater then to strategic objectives end date !";
            return $this->respondValidationError($message, $errors);
        }
        // end date check to strategic objectives
        $dateNewEndDate = str_replace('/', '-', $request->end_date);
        $dateNewEndDate = date('Y-m-d', strtotime($dateNewEndDate));
        if ($dateNewEndDate >= $str_obj_data->end_date) {
            $message = "End date is grater then and equals to to strategic objectives end date !";
            $errors = "End date is grater then to strategic objectives end date !";
            return $this->respondValidationError($message, $errors);
        }
        if ($str_obj_data->status == 2) {
            $message = "Permission denied for edit This is a hold initiatives (strategic objectives) status !";
            $errors = 'Permission denied for edit This is a hold initiatives (strategic objectives) status !';
            return $this->respondValidationError($message, $errors);
        } else {
            $date = date('Y-m-d h:i:s');
            $status = $request->status;
            if ($request->status == 6) {
                $ini_status = DB::table('initiatives')->select('previous_status')->where('id', $request->initiatives_id)->first();
                $request->merge([
                    'status' => $ini_status->previous_status,
                ]);
            }
            $insert_id = Module::updateRow("initiatives", $request, $request->initiatives_id);
            $section_Data = DB::table('initiatives')->select('initiatives.user_id', 'employers.email')
                ->join('employers', 'initiatives.user_id', '=', 'employers.user_id')
                ->where('initiatives.section_id', $request->section_id)->get();
            foreach ($section_Data as $key => $Section_admin) {
                $user = $Section_admin->email;
                // Mail::send('emails.dept_manager_strategic_objectives', ['email' => $user], function ($m) use ($user) {
                //     $m->from(env('MAIL_USERNAME'), 'BussinessPluse');
                //     $m->to($user, 'admin')->subject('Your Reminder!');
                // });
                // if (env('MAIL_USERNAME') != null && env('MAIL_USERNAME') != "null" && env('MAIL_USERNAME') != "") {
                //     Mail::send('emails.dept_manager_strategic_objectives', ['email' => $user], function ($m) use ($user) {
                //         $m->from(env('MAIL_USERNAME'), 'BussinessPluse');
                //         $m->to($user, 'Admin')->subject('Initiative Edited!');
                //     });
                // }
            }
            unset($request->status);
            $request->merge([
                'initiatives_id' => $insert_id,
                'status' => $status,
            ]);
            $initiat_edit_comments_id = Module::insert("initiat_edit_comments", $request);
            if ($request->status == 6) {
                $ini_status = DB::table('action_plans')->select('id', 'previous_status')->where('deleted_at', null)->where('initiatives_id', $request->initiatives_id)->get();
                foreach ($ini_status as $ini_status_key => $ini_status_value) {
                    DB::table('action_plans')->where('id', $ini_status_value->id)->where('deleted_at', null)->update([
                        'status' => $ini_status_value->previous_status,
                        'updated_at' => $date,
                    ]);
                }
            } else {
                DB::table('action_plans')->where('initiatives_id', $insert_id)->where('deleted_at', null)->update([
                    'status' => $request->status,
                    'updated_at' => $date,
                ]);
            }
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully update your initiatives!';
            return $this->sendResponse();
        }
    }
    /**
     * delete initiatives in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_initiatives(Request $request)
    {
        $date = date('Y-m-d h:i:s');
        DB::table('initiatives')->where('id', $request->initiatives_id)->update(['deleted_at' => $date]);
        $action_plans_ids = DB::table('action_plans')->select('id')->where('initiatives_id', $request->initiatives_id)
            ->get();
        foreach ($action_plans_ids as $key => $action_plan_row_id) {
            DB::table('action_plan_assigns')->where('action_plan_id', $action_plan_row_id->id)->update(['deleted_at' => $date]);
        }
        DB::table('action_plans')->where('initiatives_id', $request->initiatives_id)->update(['deleted_at' => $date]);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully delete your initiatives!';
        return $this->sendResponse();
    }
}
