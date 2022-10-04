<?php

namespace App\Http\Controllers;

use App\Models\Login_access_token;
use Carbon\Carbon;
use DateTime;
use DB;
use Dwij\Laraadmin\Models\Module;
use Illuminate\Http\Request;
use Mail;

class ApiStrategicObjectivesController extends ResponseApiController
{
    public function __construct()
    {
        $this->auth = new Login_access_token();
    }
    /**
     * get strategic objectives status acording to units to database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function get_str_obj_status(Request $request)
    {
        $str_obj_statuses = DB::table('str_obj_statuses')->select('id as status_id', 'status_name', 'accuracy_percentage')
            ->where('deleted_at', null)
            ->get();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "strategic objectives status dropdown list";
        $this->apiResponse['data'] = $str_obj_statuses;
        return $this->sendResponse();
    }
    /**
     * get strategic objectives acording to units to database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function get_strategic_objectives(Request $request)
    {
        if ($request['fyear'] == 'april-march') {
            $start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
        } else {
            $start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        }
        $strategic_objectives = DB::table('strategic_objectives')->select('id', 'description', 'start_date', 'end_date')
            ->where('deleted_at', null)
            ->where('unit_id', $request->unit_id)
            ->where('department_id', $request->dept_id)
        // ->where(function ($q) use ($start_date, $end_date) {
        //     $q->whereBetween('strategic_objectives.start_date', [$start_date, $end_date])
        //         ->orwhereBetween('strategic_objectives.end_date', [$start_date, $end_date])
        //         ->orwhere(function ($p) use ($start_date, $end_date) {
        //             $p->where('strategic_objectives.start_date', '<=', $start_date)
        //                 ->where('strategic_objectives.end_date', '>=', $end_date);
        //         });
        // })
            ->get();
        $data['strategic_objectives'] = $strategic_objectives;
        $message = 'strategic objectives module dropdown list';
        return $this->respondCreated($message, $data);
    }

    /*add strategic objectives*/
    /**
     * Store strategic objectives in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_strategic_objectives(Request $request)
    {
        // DB::beginTransaction();
        try {
            // $user_Data = DB::table('department_masters')->select('department_masters.user_id', 'employers.email as deptAdmin', 'dept_name')
            //     ->join('employers', 'department_masters.user_id', '=', 'employers.user_id')
            //     ->whereIn('department_masters.id', $request->department_id)
            //     ->get();
            $user_Data = DB::table('department_masters')->select('department_masters.user_id', 'employers.email as deptAdmin', 'employers.name as nameAdmin', 'dept_name', 'strategic_objectives.description as so_name')
                ->join('employers', 'department_masters.user_id', '=', 'employers.user_id')
                ->join('strategic_objectives', 'department_masters.id', '=', 'strategic_objectives.department_id')
                ->whereIn('department_masters.id', $request->department_id)
                ->groupBy('strategic_objectives.department_id')
                ->get();
            foreach ($user_Data as $key => $admin_email) {
                $user = $admin_email->deptAdmin;
                $user_name = $admin_email->nameAdmin;
                // $so_name = $admin_email->so_name;
                $so_name = $request->description;
                // Add SO
                // Working

                if (env('MAIL_USERNAME') != null && env('MAIL_USERNAME') != "null" && env('MAIL_USERNAME') != "") {
                    Mail::send('emails.dept_manager_strategic_objectives', ['so_name' => $so_name, 'user_name' => $user_name], function ($m) use ($user) {
                        $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                        $m->to($user, 'Admin')->subject('Strategic object added!');
                    });
                }
            }
            $request['start_date'] = date('Y-m-d', strtotime($request->start_date));
            $request['end_date'] = date('Y-m-d', strtotime($request->end_date));
            $request->merge([
                'status' => 1,
                'previous_status' => 1,
                'percentage' => 0,
            ]);
            // Insert data
            $date = date('Y-m-d h:i:s');

            foreach ($request->department_id as $key => $dept_id) {
                $request['department_id'] = $dept_id;
                $r = DB::table('strategic_objectives')->insert(['description' => $request['description'], 'target' => $request['target'], 'start_date' => $request['start_date'], 'end_date' => $request['end_date'], 'created_at' => $date, 'department_id' => $request['department_id'], 'unit_id' => $request['unit_id'], 'unit_of_measurement' => $request['unit_of_measurement'], 'user_id' => $request['user_id'], 'status' => $request['status'], 'percentage' => $request['percentage'], 'previous_status' => $request['previous_status']]);
            }
            // DB::commit();
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully save your strategic objectives !';
            return $this->sendResponse();
        } catch (\Exception $e) {
            print_r($e);
            die;
            DB::rollback();
            $this->apiResponse['message'] = $e->getMessage();
        }
    }
    // Create Serial number for SO
    /**
     * Store strategic objectives in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_so_sno(Request $request)
    {
        // DB::beginTransaction();
        $date = date('Y-m-d h:i:s');

        try {

            // need to insert code for Strategic group department

            // $temp_dept_id = json_decode($request->dept_id);
            // dump($request->dept_id);
            // $group_str[$key22]->so_id = array($temp_dept_id);
            // foreach ($request->dept_id as $deptkey => $r_dept_id) {
            //     $str_dept[] = DB::table('strategic_objectives')->select('id')
            //         ->where('strategic_objectives.department_id', $r_dept_id)
            //         ->where('strategic_objectives.unit_id', $request->unit_id)
            //         ->where('strategic_objectives.deleted_at', null)
            //         ->orderBy('strategic_objectives.id', 'ASC')
            //         ->get();
            // }
            // dump($str_dept);die;

            // $group_str = DB::table('strategic_group_depts')->select('id', 'so_id', 'dept_id', 'unit_id')
            //     ->where('strategic_group_depts.unit_id', $request->unit_id)
            //     ->get();

            // $so_id = [];
            // foreach ($group_str as $key22 => $g_str) {
            //     $temp_so_id = json_decode($g_str->so_id);
            //     // dump($temp_so_id);
            //     $group_str[$key22]->so_id = array($temp_so_id);
            //     foreach ($temp_so_id as $key11 => $r) {
            //         // dump('i', $key11);
            //         // dump('value', $r);
            //     }
            // }

            //end

            $strategic_objectives = DB::table('strategic_objectives')->select('id', 'description', 'start_date', 'end_date', 'unit_id', 'department_id', 'user_id')
                ->where('strategic_objectives.deleted_at', null)
                ->where('strategic_objectives.unit_id', $request->unit_id)
                ->orderBy('strategic_objectives.id', 'ASC')
                ->get();

            $total_so = 0;
            foreach ($strategic_objectives as $key => $so_row) {
                $total_so = $total_so + 1;
                $so_row->So_sno = $total_so;
            }

            $last_so_id = $strategic_objectives[$total_so - 1]->id;
            $str_ids = [];
            for ($i = ($total_so - $request->total_dept) + 1; $i <= $total_so; $i++) {
                if ($strategic_objectives[$i - 1]->id != null) {
                    $strategic_objectives1 = DB::table('strategic_objectives')->select('id', 'description', 'start_date', 'end_date', 'unit_id', 'department_id', 'user_id')
                        ->where('strategic_objectives.deleted_at', null)
                        ->where('strategic_objectives.id', $strategic_objectives[$i - 1]->id)
                        ->first();

                    if ($total_so > 0) {
                        $rrr = DB::table('strategic_sno_cmpnies')->insert(['s_o_id' => $strategic_objectives1->id, 'unit_id' => $strategic_objectives1->unit_id, 'created_at' => $date, 's_no' => $strategic_objectives[$i - 1]->So_sno]);
                        if ($request->total_dept > 1) {
                            $str_ids[] = $strategic_objectives1->id;
                        } else {
                            $str_ids[] = $last_so_id;
                        }
                    }
                }
            }

            $sgd_id = DB::table('strategic_group_depts')->insert(['so_id' => implode(',', $str_ids), 'dept_id' => implode(',', $request->dept_id), 'unit_id' => $request->unit_id, 'created_at' => $date]);

            // DB::commit();
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully serial number is generated!';
            return $this->sendResponse();
        } catch (\Exception $e) {
            $this->apiResponse['status'] = "False";
            $this->apiResponse['message'] = $e->getMessage();
            return $this->sendResponse();
        }
    }
    /*view strategic objectives */
    /**
     * View strategic objectives to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_strategic_objectives(Request $request)
    {
        $requested_dept_id = explode(',', $request->dept_id);

        if ($request['fyear'] == 'april-march') {
            $start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
        } else {
            $start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        }
        $strategic_objectives = DB::table('strategic_objectives')->select('strategic_objectives.id as strategic_objectives_id', 'strategic_sno_cmpnies.s_no as so_sno', 'strategic_objectives.target', 'strategic_objectives.start_date', 'strategic_objectives.end_date', 'units.id as unit_id', 'units.unit_name', 'strategic_objectives.department_id', 'department_masters.dept_name', 'users.id as user_id', 'users.name as user_name', 'strategic_objectives.description', 'strategic_objectives.status as status_id', 'str_obj_statuses.status_name', 'strategic_objectives.percentage', 'strategic_objectives.unit_of_measurement as uom_id', 'u_o_ms.name as uom_name')
            ->leftjoin('units', 'strategic_objectives.unit_id', '=', 'units.id')
            ->leftjoin('u_o_ms', 'strategic_objectives.unit_of_measurement', '=', 'u_o_ms.id')
            ->leftjoin('strategic_sno_cmpnies', 'strategic_objectives.id', '=', 'strategic_sno_cmpnies.s_o_id')
            ->leftjoin('str_obj_statuses', 'strategic_objectives.status', '=', 'str_obj_statuses.id')
            ->leftjoin('department_masters', 'strategic_objectives.department_id', '=', 'department_masters.id')
            ->leftjoin('users', 'strategic_objectives.user_id', '=', 'users.id')
            ->where('strategic_objectives.deleted_at', null)
            ->where(function ($q) use ($start_date, $end_date) {
                $q->whereBetween('strategic_objectives.start_date', [$start_date, $end_date])
                    ->orwhereBetween('strategic_objectives.end_date', [$start_date, $end_date])
                    ->orwhere(function ($p) use ($start_date, $end_date) {
                        $p->where('strategic_objectives.start_date', '<=', $start_date)
                            ->where('strategic_objectives.end_date', '>=', $end_date);
                    });
            })
        // ->whereIn('strategic_objectives.department_id', $requested_dept_id)
            ->where('strategic_objectives.unit_id', $request->unit_id)
            ->orderBy('strategic_objectives.id', 'ASC')
            ->get();

        if (!empty($strategic_objectives)) {
            foreach ($strategic_objectives as $key => $row) {
                if (($request->role_id == 5 || $request->role_id == 6 || $request->role_id == 7) && !in_array($row->department_id, $requested_dept_id)) {
                    unset($strategic_objectives[$key]);
                } else {
                    /*$f = explode('""', $row->department_id);*/
                    $v = str_replace('"', '', $row->department_id);
                    $z = str_replace('[', '', $v);
                    $a = str_replace(']', '', $z);
                    $f = explode(",", $a);
                    foreach ($f as $key => $value) {
                        $row->department_masters = DB::table('department_masters')->select('id as dept_id', 'dept_name')
                            ->where('department_masters.deleted_at', null)
                            ->where('department_masters.id', $row->department_id)
                            ->first();
                    }
                }
            }
        }
        // echo "<pre>"; print_r($strategic_objectives);exit;
        $strategic_objectives = array_values($strategic_objectives);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "strategic_objectives list response";
        $this->apiResponse['data'] = $strategic_objectives;
        return $this->sendResponse();
    }
    /*Edit strategic objectives */
    /**
     * Store edit strategic objectives in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_edit_strategic_objectives(Request $request)
    {
        $status = $request->status;
        if ($request->status == 6) {
            $str_obj_status = DB::table('strategic_objectives')->select('previous_status')->where('id', $request->strategic_objectives_id)->first();
            $request->merge([
                'status' => $str_obj_status->previous_status,
            ]);
        }
        $insert_id = Module::updateRow("strategic_objectives", (object) $request, $request['strategic_objectives_id']);
        unset($request->status);
        $request->merge([
            'str_obj_id' => $insert_id,
            'status' => $status,
        ]);
        Module::insert("str_obj_edit_comments", $request);
        $date = date('Y-m-d h:i:s');
        if ($request->status == 6) {
            $ini_status = DB::table('initiatives')->select('id', 'previous_status')->where('s_o_id', $insert_id)->get();
            foreach ($ini_status as $key_ini_status => $ini_status_row) {
                DB::table('initiatives')->where('id', $ini_status_row->id)->where('deleted_at', null)->update([
                    'status' => $ini_status_row->previous_status,
                    'updated_at' => $date,
                ]);
            }
        } else {
            DB::table('initiatives')->where('s_o_id', $insert_id)->where('deleted_at', null)->update([
                'status' => $request->status,
                'updated_at' => $date,
            ]);
        }
        $initiatives_ids = DB::table('initiatives')->select('id', 's_o_id')->where('deleted_at', null)->where('s_o_id', $insert_id)->get();
        if (!empty($initiatives_ids)) {
            foreach ($initiatives_ids as $key => $row) {
                if ($request->status == 6) {
                    $ac_pl_status = DB::table('action_plans')->select('id', 'previous_status')->where('initiatives_id', $row->id)->get();
                    foreach ($ac_pl_status as $ac_pl_status_key => $ac_pl_row) {
                        DB::table('action_plans')->where('id', $ac_pl_row->id)->where('deleted_at', null)->update([
                            'status' => $ac_pl_row->previous_status,
                            'updated_at' => $date,
                        ]);
                    }
                } else {
                    DB::table('action_plans')->where('initiatives_id', $row->id)->where('deleted_at', null)->update([
                        'status' => $request->status,
                        'updated_at' => $date,
                    ]);
                }
            }
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully update strategic objectives !';
        return $this->sendResponse();
    }
    /**
     * View strategic objectives update comment.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_str_obj_update_comment(Request $request)
    {
        $str_obj_edit_comments = DB::table('str_obj_edit_comments')->select('strategic_objectives.description', 'users.name', 'str_obj_edit_comments.comment', 'str_obj_edit_comments.created_at')
            ->leftjoin('strategic_objectives', 'str_obj_edit_comments.str_obj_id', '=', 'strategic_objectives.id')
            ->leftjoin('users', 'str_obj_edit_comments.user_id', '=', 'users.id')
            ->where('str_obj_edit_comments.deleted_at', null)
            ->where('users.deleted_at', null)
            ->where('strategic_objectives.deleted_at', null)
            ->where('str_obj_edit_comments.str_obj_id', $request->str_obj_id)
            ->orderBy('str_obj_edit_comments.created_at', 'ASC')
            ->get();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "str obj edit comments list response";
        $this->apiResponse['data'] = $str_obj_edit_comments;
        return $this->sendResponse();
    }
    /*delete strategic objectives */
    /**
     * delete strategic objectives in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_strategic_objectives(Request $request)
    {
        $date = date('Y-m-d h:i:s');

        $strategic_group_depts_temp = DB::table('strategic_group_depts')
            ->where('strategic_group_depts.so_id', like, '%' . $request->strategic_objectives_id . '%')
            ->where('strategic_group_depts.deleted_at', null)
            ->first();

        $x = explode(",", $strategic_group_depts_temp->so_id);

        if (count($x) > 1) {
            $r = "'$request->strategic_objectives_id'";
            DB::statement("UPDATE strategic_group_depts
            SET
            so_id =
                TRIM(BOTH ',' FROM REPLACE(CONCAT(',', so_id, ','), ',$request->strategic_objectives_id,', ','))
            WHERE
              FIND_IN_SET($r, so_id)
            ");

        } else {
            DB::table('strategic_group_depts')->where('strategic_group_depts.so_id', $request->strategic_objectives_id)->update(['deleted_at' => $date]);
        }

        DB::table('strategic_objectives')->where('strategic_objectives.id', $request->strategic_objectives_id)->update(['deleted_at' => $date]);
        $get_initiative = DB::table('initiatives')->select('id as init_id', 's_o_id')->where('deleted_at', null)->where('s_o_id', $request->strategic_objectives_id)->get();
        foreach ($get_initiative as $key => $init_row) {
            DB::table('initiatives')->where('id', $init_row->init_id)->update(['deleted_at' => $date]);
            $get_action_plan = DB::table('action_plans')->select('id as act_pln_id', 'initiatives_id')->where('deleted_at', null)->where('initiatives_id', $init_row->init_id)->get();
            foreach ($get_action_plan as $key_act => $act_row) {
                DB::table('action_plans')->where('id', $act_row->act_pln_id)->update(['deleted_at' => $date]);
                $get_act_pln_assign = DB::table('action_plan_assigns')->select('id as act_pln_ass_id', 'action_plan_id')->where('deleted_at', null)->where('action_plan_id', $act_row->act_pln_id)->get();
                foreach ($get_act_pln_assign as $key_act_pln_ass => $row_act_pln_ass) {
                    DB::table('action_plan_assigns')->where('id', $row_act_pln_ass->act_pln_ass_id)->update(['deleted_at' => $date]);
                }
            }
        }

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully delete your strategic objectives!';
        return $this->sendResponse();
    }

    /*view strategic objectives */
    /**
     * View strategic objectives to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_strategic_objectives_data(Request $request)
    {

        if ($request['fyear'] == 'april-march') {
            $start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
        } else {
            $start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        }
        $requested_dept_id = explode(',', $request->dept_id);
        $current_year = date("Y");
        $department_masters = DB::table('department_masters')->select('id', 'dept_name')
            ->where('deleted_at', null)
        // ->whereIn('id', $requested_dept_id)
            ->where('unit_id', $request->unit_id)
        // ->orderBy('department_masters.id', 'DSC')
            ->get();

        foreach ($department_masters as $key => $dept) {

            $strategic_objectives = DB::table('strategic_objectives')->select('strategic_objectives.id as strategic_objectives_id', 'strategic_sno_cmpnies.s_no as so_sno', 'strategic_objectives.target', 'strategic_objectives.start_date', 'strategic_objectives.end_date', 'units.id as unit_id', 'units.unit_name', 'strategic_objectives.department_id', 'department_masters.dept_name', 'users.id as user_id', 'users.name as user_name', 'strategic_objectives.tracking_frequency', 'strategic_objectives.description', 'u_o_ms.id as uom_id', 'u_o_ms.name as uom_name', 'str_obj_statuses.status_name', 'str_obj_statuses.id as status_id', 'strategic_objectives.percentage')
                ->leftjoin('units', 'strategic_objectives.unit_id', '=', 'units.id')
                ->leftjoin('u_o_ms', 'strategic_objectives.unit_of_measurement', '=', 'u_o_ms.id')
                ->leftjoin('strategic_sno_cmpnies', 'strategic_objectives.id', '=', 'strategic_sno_cmpnies.s_o_id')
                ->leftjoin('str_obj_statuses', 'strategic_objectives.status', '=', 'str_obj_statuses.id')
                ->leftjoin('users', 'strategic_objectives.user_id', '=', 'users.id')
                ->orderBy('so_sno', 'ASC')
                ->leftjoin('department_masters', 'strategic_objectives.department_id', '=', 'department_masters.id')
                ->where('strategic_objectives.deleted_at', null)
                ->where('strategic_objectives.unit_id', $request->unit_id)
                ->where('strategic_objectives.department_id', $dept->id)
            // ->orderBy('strategic_sno_cmpnies.s_no', 'DSC')
            // ->orderBy('department_masters.id', 'DSC')

            // ->orderBy('strategic_objectives.id', 'ASC')
                ->where(function ($q) use ($start_date, $end_date) {
                    $q->whereBetween('strategic_objectives.start_date', [$start_date, $end_date])
                        ->orwhereBetween('strategic_objectives.end_date', [$start_date, $end_date])
                        ->orwhere(function ($p) use ($start_date, $end_date) {
                            $p->where('strategic_objectives.start_date', '<=', $start_date)
                                ->where('strategic_objectives.end_date', '>=', $end_date);
                        });
                })->get();

            $department_masters[$key]->strategic_objectives = $strategic_objectives;
            foreach ($strategic_objectives as $key1 => $s_o_row) {
                if (($request->role_id == 5 || $request->role_id == 6 || $request->role_id == 7) && !in_array($s_o_row->department_id, $requested_dept_id)) {
                    unset($strategic_objectives[$key1], $department_masters[$key]);
                } else {
                    $initiatives = DB::table('initiatives')->select('initiatives.sr_no', 'initiatives.id as initiatives_id', 'initiatives.definition', 'initiatives.s_o_id', 'strategic_objectives.description', 'initiatives.dept_id', 'department_masters.dept_name', 'initiatives.section_id', 'sections.section_name', 'initiatives.user_id', 'initiatives.start_date', 'initiatives.end_date', 'initiatives.percentage', 'str_obj_statuses.id as status_id', 'str_obj_statuses.status_name')
                        ->leftjoin('strategic_objectives', 'initiatives.s_o_id', '=', 'strategic_objectives.id')
                        ->leftjoin('str_obj_statuses', 'initiatives.status', '=', 'str_obj_statuses.id')
                        ->leftjoin('department_masters', 'initiatives.dept_id', '=', 'department_masters.id')
                        ->leftjoin('sections', 'initiatives.section_id', '=', 'sections.id')
                        ->where('initiatives.deleted_at', null)
                        ->where('initiatives.s_o_id', $s_o_row->strategic_objectives_id)
                        ->orderBy('initiatives.id', 'ASC')
                        ->get();

                    $department_masters[$key]->strategic_objectives[$key1]->initiatives = $initiatives;
                    foreach ($initiatives as $key2 => $initiatives_row) {
                        $action_plans = DB::table('action_plans')->select('action_plans.sr_no', 'action_plans.id as action_plans_id', 'action_plans.definition', 'action_plans.target', 'action_plans.start_date', 'action_plans.end_date', 'action_plans.control_point', 'action_plans.co_owner', 'action_plans.status', 'action_plans.initiatives_id', 'department_masters.id as dept_id', 'kpi_actionplan_rels.kpi_id', 'department_masters.dept_name', 'initiatives.definition as initiatives_definition', 'action_plans.user_id', 'users.name as co_owner_name', 'action_plans.percentage', 'str_obj_statuses.status_name', 'action_plans.reminder_date')
                            ->leftjoin('users', 'action_plans.co_owner', '=', 'users.id')
                            ->leftjoin('initiatives', 'action_plans.initiatives_id', '=', 'initiatives.id')
                            ->leftjoin('department_masters', 'action_plans.dept_id', '=', 'department_masters.id')
                            ->leftjoin('str_obj_statuses', 'action_plans.status', '=', 'str_obj_statuses.id')
                            ->leftjoin('kpi_actionplan_rels', 'kpi_actionplan_rels.action_plan_id', '=', 'action_plans.id')
                            ->where('users.deleted_at', null)
                            ->where('action_plans.deleted_at', null)
                            ->where('action_plans.initiatives_id', $initiatives_row->initiatives_id)
                            ->orderBy('action_plans.id', 'ASC')
                            ->get();

                        $department_masters[$key]->strategic_objectives[$key1]->initiatives[$key2]->action_plans = $action_plans;
                        foreach ($action_plans as $key5 => $action_plan_value) {
                            $kpis = DB::table('kpi_actionplan_rels')->select('add_kpis.*', 'add_kpis.id as kpi_id', 'kpi_actionplan_rels.action_plan_id')
                                ->where('action_plan_id', $action_plan_value->action_plans_id)
                                ->leftjoin('add_kpis', 'kpi_actionplan_rels.kpi_id', '=', 'add_kpis.id')
                                ->where('add_kpis.deleted_at', null)
                                ->get();

                            // $kpi->kpistatus = null;
                            // $kpi->status_name = null;
                            foreach ($kpis as $key6 => $kpi) {
                                $kpi_target = DB::table('kpi_targets')->select('ytd', 'kpi_id')
                                    ->where('kpi_id', $kpi->kpi_id)
                                    ->where('deleted_at', null)
                                    ->first();
                                $kpi_actuals = DB::table('kpi_actuals')->select('ytd', 'kpi_id')
                                    ->where('kpi_id', $kpi->kpi_id)
                                    ->where('deleted_at', null)
                                    ->first();

                                $kpi_rels = DB::table('kpi_actionplan_rels')->select('action_plans.definition as def', 'action_plans.id as action_plan_id')
                                    ->leftjoin('action_plans', 'kpi_actionplan_rels.action_plan_id', '=', 'action_plans.id')
                                    ->where('kpi_id', $kpi->kpi_id)
                                    ->get();

                                if (!empty($kpi_rels)) {
                                    foreach ($kpi_rels as $rel_key => $kpi_rel) {
                                        $kpis[$key6]->action_plans[] = array("def" => $kpi_rel->def, "action_plan_id" => $kpi_rel->action_plan_id);
                                    }
                                } else {
                                    $kpis[$key6]->action_plans[] = array("def" => null, "action_plan_id" => null);
                                }

                                if ($kpi_target->ytd == 0.0) {
                                    $kpi->kpistatus = $kpi_target->ytd;
                                } else {
                                    $kpi->kpistatus = (($kpi_actuals->ytd) / ($kpi_target->ytd));
                                }
                                // status_name
                                if ($kpi->kpistatus == 0.0) {
                                    $kpi->status_name = 'Grey';
                                } else {
                                    if ($kpi->ideal_trend == "positive") {
                                        if ($kpi->kpistatus >= 1.0) {
                                            $kpi->status_name = 'Green';
                                        }
                                        if (($kpi->kpistatus < 1.0) && ($kpi->kpistatus >= 0.9)) {
                                            $kpi->status_name = 'Yellow';
                                        }if (($kpi->kpistatus < 0.9) && ($kpi->kpistatus != null) && ($kpi->kpistatus > 0.0)) {
                                            $kpi->status_name = 'Red';
                                        }

                                    } else {
                                        if ($kpi->kpistatus >= 1.1) {
                                            $kpi->status_name = 'Red';
                                        }
                                        if (($kpi->kpistatus < 1.1) && ($kpi->kpistatus > 1.0)) {
                                            $kpi->status_name = 'Yellow';
                                        }if (($kpi->kpistatus <= 1.0) && ($kpi->kpistatus != null) && ($kpi->kpistatus > 0.0)) {
                                            $kpi->status_name = 'Green';
                                        }
                                    }
                                }
                            }
                            $department_masters[$key]->strategic_objectives[$key1]->initiatives[$key2]->action_plans[$key5]->kpis = $kpis;
                            //$strategic_objectives[0]->initiatives[$key1]->action_plans[$key2]->kpis = $kpis;
                        }

                        foreach ($action_plans as $key4 => $action_plans_row_user) {
                            $action_plans_assign_user = DB::table('action_plan_assigns')->select('action_plan_assigns.action_plan_id', 'action_plan_assigns.co_owner_id', 'users.name as user_name')
                                ->leftjoin('users', 'action_plan_assigns.co_owner_id', '=', 'users.id')
                                ->where('action_plan_assigns.deleted_at', null)
                                ->where('users.deleted_at', null)
                                ->where('action_plan_assigns.action_plan_id', $action_plans_row_user->action_plans_id)
                                ->get();

                            foreach ($action_plans_assign_user as $acu_key => $acu_row) {
                                $action_plan_schedules = DB::table('action_plan_schedules')->select('action_plan_schedules.id as schedule_id', 'action_plan_schedules.month_date', 'action_plan_schedules.review_month_date', 'action_plan_schedules.comment', 'action_plan_schedules.recovery_plan', 'action_plan_schedules.implement_data', 'action_plan_schedules.owner_id as co_owner_id', 'action_plan_schedules.status', 'str_obj_statuses.status_name', 'action_plan_schedules.responsibility as responsibility_id', 'employers.name as responsibility_name', 'emp.name as co_owner_name')
                                    ->leftjoin('str_obj_statuses', 'action_plan_schedules.status', '=', 'str_obj_statuses.id')
                                    ->leftjoin('employers', 'action_plan_schedules.responsibility', '=', 'employers.id')
                                    ->leftjoin('employers as emp', 'action_plan_schedules.owner_id', '=', 'emp.id')
                                    ->where('str_obj_statuses.deleted_at', null)
                                    ->where('action_plan_schedules.deleted_at', null)
                                    ->whereYear('action_plan_schedules.created_at', '=', $current_year)
                                    ->where('action_plan_schedules.action_plan_id', $acu_row->action_plan_id)
                                    ->where('action_plan_schedules.owner_id', $acu_row->co_owner_id)
                                    ->get();
                                $action_plans_assign_user[$acu_key]->schedules = $action_plan_schedules;
                            }
                            $department_masters[$key]->strategic_objectives[$key1]->initiatives[$key2]->action_plans[$key4]->action_plans_assign_user = $action_plans_assign_user;
                        }
                    }
                }
            }
        }
        // SO ascending order
        // foreach ($department_masters as $d_key => $d_row) {
        //     foreach ($d_row->strategic_objectives as $s_key => $s_row) {
        //             if()
        //     }
        // }

        //   dump($department_masters);
        $department_masters = array_values($department_masters);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "strategic_objectives list response";
        $this->apiResponse['data'] = $department_masters;
        return $this->sendResponse();
    }

    /*view action plan to database */
    /**
     * View strategic objectives to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_strategic_objectives_initiative(Request $request)
    {
        $requested_dept_id = explode(',', $request->dept_id);
        if ($request['fyear'] == 'april-march') {
            $start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
        } else {
            $start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        }

        if (!empty($request->dept_id && $request->role_id == 5 || $request->role_id == 6 || $request->role_id == 7)) {
            $strategic_objectives = DB::table('strategic_objectives')->where('deleted_at', null)
                ->whereIn('department_id', $requested_dept_id)
                ->where('unit_id', $request->unit_id)
                ->where(function ($q) use ($start_date, $end_date) {
                    $q->whereBetween('strategic_objectives.start_date', [$start_date, $end_date])
                        ->orwhereBetween('strategic_objectives.end_date', [$start_date, $end_date])
                        ->orwhere(function ($p) use ($start_date, $end_date) {
                            $p->where('strategic_objectives.start_date', '<=', $start_date)
                                ->where('strategic_objectives.end_date', '>=', $end_date);
                        });
                })->get();
        } else {
            $strategic_objectives = DB::table('strategic_objectives')->where('deleted_at', null)
                ->where('unit_id', $request->unit_id)
                ->where(function ($q) use ($start_date, $end_date) {
                    $q->whereBetween('strategic_objectives.start_date', [$start_date, $end_date])
                        ->orwhereBetween('strategic_objectives.end_date', [$start_date, $end_date])
                        ->orwhere(function ($p) use ($start_date, $end_date) {
                            $p->where('strategic_objectives.start_date', '<=', $start_date)
                                ->where('strategic_objectives.end_date', '>=', $end_date);
                        });
                })->get();
        }

        $strategic_group_depts = DB::table('strategic_group_depts')
            ->where('unit_id', $request->unit_id)
            ->where('deleted_at', null)
            ->get();

        $str_matched_data = [];
        $strategic_group_depts_temp;
        $temp1;
        foreach ($strategic_objectives as $key1 => $str_row) {

            foreach ($strategic_group_depts as $key11 => $strg_row) {
                $conditions = $strg_row->so_id;
                $x = explode(",", $conditions);

                foreach ($x as $key111 => $temp_strg_row1) {
                    if ($temp_strg_row1 == $str_row->id) {
                        $strategic_group_depts_temp = DB::table('strategic_group_depts')->select('id', DB::raw('GROUP_CONCAT(DISTINCT strategic_group_depts.id) as id'))
                            ->where('strategic_group_depts.so_id', like, '%' . $str_row->id . '%')
                            ->where('strategic_group_depts.deleted_at', null)
                            ->first();
                        $str_matched_data[] = $strategic_group_depts_temp;
                    }
                }
            }
        }

        $a = [];
        foreach ($str_matched_data as $key => $value) {
            $a[] = $value->id;
        }
        $b = array_unique($a);

        $str_depts = DB::table('strategic_group_depts')
            ->whereIn('strategic_group_depts.id', $b)
            ->where('strategic_group_depts.deleted_at', null)
            ->groupBy('strategic_group_depts.id')
            ->get();

        // if (!empty($strategic_objectives)) {
        //     foreach ($strategic_objectives as $key => $strategic_value) {
        //         if (($request->role_id == 5 || $request->role_id == 6) && !in_array($strategic_value->department_id, $requested_dept_id)) {
        //             unset($strategic_objectives[$key]);
        //         }
        //     }
        // }

        // start group by total str and their status

        $str_obj_statuses = DB::table('str_obj_statuses')->where('deleted_at', null)->get();

        foreach ($str_obj_statuses as $key => $row) {
            if ($row->status_name == 'Green') {
                $status_green = $row->accuracy_percentage;
            } elseif ($row->status_name == 'Yellow') {
                $status_yellow = $row->accuracy_percentage;
            } elseif ($row->status_name == 'Red') {
                $status_red = ($row->accuracy_percentage) - 1;
            } elseif ($row->status_name == 'Gray (Started)') {
                $status_grey = $row->accuracy_percentage;
            }
        }

        $total_strategic_objectives_counter1 = count($str_depts);
        $total_strategic_objectives_counter_status_red1 = 0;
        $total_strategic_objectives_counter_status_yellow1 = 0;
        $total_strategic_objectives_counter_status_green1 = 0;
        $total_strategic_objectives_counter_status_blue1 = 0;
        $total_strategic_objectives_counter_status_gray1 = 0;

        foreach ($str_depts as $key => $str_depts_r) {
            $str_group_array = explode(",", $str_depts_r->so_id);
            $percentage_sum = 0;
            foreach ($str_group_array as $key1 => $so_id) {
                $temp_strategic_objectives = DB::table('strategic_objectives')->select('id', 'status', 'percentage')
                    ->where('id', $so_id)
                    ->where('deleted_at', null)
                    ->first();
                $percentage_sum += $temp_strategic_objectives->percentage;
            }
            $temp = $percentage_sum / count($str_group_array);
            $str_depts[$key]->percentage = $temp;
            if ($temp >= $status_green) {
                $str_depts[$key]->status = 3;
                $total_strategic_objectives_counter_status_green1++;
            } elseif ($temp >= $status_yellow) {
                $str_depts[$key]->status = 4;
                $total_strategic_objectives_counter_status_yellow1++;
            } elseif ($temp <= $status_red && $temp > 0) {
                $str_depts[$key]->status = 5;
                $total_strategic_objectives_counter_status_red1++;
            } elseif ($temp == $status_grey) {
                $str_depts[$key]->status = 1;
                $total_strategic_objectives_counter_status_gray1++;
            }
        }

        $data['strategic_objectives'] = array(
            'total' => $total_strategic_objectives_counter1,
            'red' => $total_strategic_objectives_counter_status_red1,
            'yellow' => $total_strategic_objectives_counter_status_yellow1,
            'green' => $total_strategic_objectives_counter_status_green1,
            'blue' => $total_strategic_objectives_counter_status_blue1,
            'gray' => $total_strategic_objectives_counter_status_gray1,
        );

        // // end group by total str and their status

        // $total_strategic_objectives_counter = count($str_depts);
        // $total_strategic_objectives_counter_status_red = 0;
        // $total_strategic_objectives_counter_status_yellow = 0;
        // $total_strategic_objectives_counter_status_green = 0;
        // $total_strategic_objectives_counter_status_blue = 0;
        // $total_strategic_objectives_counter_status_gray = 0;

        // foreach ($strategic_objectives as $key => $row) {
        //     $total_strategic_objectives_counter++;
        //     if ($row->status == 5) {
        //         $total_strategic_objectives_counter_status_red++;
        //     }
        //     if ($row->status == 4) {
        //         $total_strategic_objectives_counter_status_yellow++;
        //     }
        //     if ($row->status == 3) {
        //         $total_strategic_objectives_counter_status_green++;
        //     }
        //     if ($row->status == 2) {
        //         $total_strategic_objectives_counter_status_blue++;
        //     }
        //     if ($row->status == 1) {
        //         $total_strategic_objectives_counter_status_gray++;
        //     }
        // }
        // $data['strategic_objectives'] = array(
        //     'total' => $total_strategic_objectives_counter,
        //     'red' => $total_strategic_objectives_counter_status_red,
        //     'yellow' => $total_strategic_objectives_counter_status_yellow,
        //     'green' => $total_strategic_objectives_counter_status_green,
        //     'blue' => $total_strategic_objectives_counter_status_blue,
        //     'gray' => $total_strategic_objectives_counter_status_gray,
        // );
        //get initiative status data
        if (!empty($request->dept_id && $request->role_id == 5 || $request->role_id == 6 || $request->role_id == 7)) {
            $initiatives = DB::table('initiatives')
                ->where('deleted_at', null)
                ->whereIn('dept_id', $requested_dept_id)
                ->where('unit_id', $request->unit_id)
                ->where(function ($q) use ($start_date, $end_date) {
                    $q->whereBetween('initiatives.start_date', [$start_date, $end_date])
                        ->orwhereBetween('initiatives.end_date', [$start_date, $end_date])
                        ->orwhere(function ($p) use ($start_date, $end_date) {
                            $p->where('initiatives.start_date', '<=', $start_date)
                                ->where('initiatives.end_date', '>=', $end_date);
                        });
                })->get();
        } else {
            $initiatives = DB::table('initiatives')
                ->where('deleted_at', null)
                ->where('unit_id', $request->unit_id)
                ->where(function ($q) use ($start_date, $end_date) {
                    $q->whereBetween('initiatives.start_date', [$start_date, $end_date])
                        ->orwhereBetween('initiatives.end_date', [$start_date, $end_date])
                        ->orwhere(function ($p) use ($start_date, $end_date) {
                            $p->where('initiatives.start_date', '<=', $start_date)
                                ->where('initiatives.end_date', '>=', $end_date);
                        });
                })->get();
        }

        //counter
        // if (!empty($initiatives)) {
        //     foreach ($initiatives as $key => $inciative_value) {
        //         if (($request->role_id == 5 || $request->role_id == 6) && !in_array($inciative_value->dept_id, $requested_dept_id)) {
        //             unset($initiatives[$key]);
        //         }
        //     }
        // }
        $total_initiatives = 0;
        $total_initiatives_status_red = 0;
        $total_initiatives_status_yellow = 0;
        $total_initiatives_status_green = 0;
        $total_initiatives_status_blue = 0;
        $total_initiatives_status_gray = 0;
        foreach ($initiatives as $key1 => $row1) {
            $total_initiatives++;
            if ($row1->status == 5) {
                $total_initiatives_status_red++;
            }
            if ($row1->status == 4) {
                $total_initiatives_status_yellow++;
            }
            if ($row1->status == 3) {
                $total_initiatives_status_green++;
            }
            if ($row1->status == 2) {
                $total_initiatives_status_blue++;
            }
            if ($row1->status == 1) {
                $total_initiatives_status_gray++;
            }
        }
        $data['initiatives'] = array(
            'total' => $total_initiatives,
            'red' => $total_initiatives_status_red,
            'yellow' => $total_initiatives_status_yellow,
            'green' => $total_initiatives_status_green,
            'blue' => $total_initiatives_status_blue,
            'gray' => $total_initiatives_status_gray,
        );
        //get action plan status data
        if (!empty($request->dept_id && $request->role_id == 5 || $request->role_id == 6 || $request->role_id == 7)) {
            $get_action_plan = DB::table('action_plans')
                ->where('deleted_at', null)
                ->whereIn('dept_id', $requested_dept_id)
                ->where('unit_id', $request->unit_id)
                ->where(function ($q) use ($start_date, $end_date) {
                    $q->whereBetween('action_plans.start_date', [$start_date, $end_date])
                        ->orwhereBetween('action_plans.end_date', [$start_date, $end_date])
                        ->orwhere(function ($p) use ($start_date, $end_date) {
                            $p->where('action_plans.start_date', '<=', $start_date)
                                ->where('action_plans.end_date', '>=', $end_date);
                        });
                })->get();
        } else {
            $get_action_plan = DB::table('action_plans')
                ->where('deleted_at', null)
                ->where('unit_id', $request->unit_id)
                ->where(function ($q) use ($start_date, $end_date) {
                    $q->whereBetween('action_plans.start_date', [$start_date, $end_date])
                        ->orwhereBetween('action_plans.end_date', [$start_date, $end_date])
                        ->orwhere(function ($p) use ($start_date, $end_date) {
                            $p->where('action_plans.start_date', '<=', $start_date)
                                ->where('action_plans.end_date', '>=', $end_date);
                        });
                })->get();
        }

        // if (!empty($get_action_plan)) {
        //     foreach ($get_action_plan as $key => $action_plan_value) {
        //         if (($request->role_id == 5 || $request->role_id == 6) && !in_array($action_plan_value->dept_id, $requested_dept_id)) {
        //             unset($get_action_plan[$key]);
        //         }
        //     }
        // }

        //counter
        $total_action_plan = 0;
        $total_action_plan_status_red = 0;
        $total_action_plan_status_yellow = 0;
        $total_action_plan_status_green = 0;
        $total_action_plan_status_blue = 0;
        $total_action_plan_status_gray = 0;
        foreach ($get_action_plan as $key_acp => $row_acp) {
            $total_action_plan++;
            if ($row_acp->status == 5) {
                $total_action_plan_status_red++;
            }
            if ($row_acp->status == 4) {
                $total_action_plan_status_yellow++;
            }
            if ($row_acp->status == 3) {
                $total_action_plan_status_green++;
            }
            if ($row_acp->status == 2) {
                $total_action_plan_status_blue++;
            }
            if ($row_acp->status == 1) {
                $total_action_plan_status_gray++;
            }
        }

        $data['action_plans'] = array(
            'total' => $total_action_plan,
            'red' => $total_action_plan_status_red,
            'yellow' => $total_action_plan_status_yellow,
            'green' => $total_action_plan_status_green,
            'blue' => $total_action_plan_status_blue,
            'gray' => $total_action_plan_status_gray,
        );

        if (!empty($request->dept_id && $request->role_id == 5 || $request->role_id == 6 || $request->role_id == 7)) {
            $get_dept = DB::table('department_masters')->select('id as dept_id', 'dept_name')
                ->where('unit_id', $request->unit_id)
                ->whereIn('id', $requested_dept_id)
                ->where('deleted_at', null)
                ->get();
        } else {
            $get_dept = DB::table('department_masters')->select('id as dept_id', 'dept_name')
                ->where('unit_id', $request->unit_id)
                ->where('deleted_at', null)
                ->get();
        }

        //print_r($get_dept); die;
        foreach ($get_dept as $dept_key => $dept_row) {
            $get_strategic_objectives = DB::table('strategic_objectives')->select('id as s_o_id', 'description', 'target', 'start_date', 'end_date', 'department_id', 'tracking_frequency', 'user_id', 'status')->where('deleted_at', null)->where('department_id', $dept_row->dept_id)->where('unit_id', $request->unit_id)->where(function ($q) use ($start_date, $end_date) {
                $q->whereBetween('strategic_objectives.start_date', [$start_date, $end_date])
                    ->orwhereBetween('strategic_objectives.end_date', [$start_date, $end_date])
                    ->orwhere(function ($p) use ($start_date, $end_date) {
                        $p->where('strategic_objectives.start_date', '<=', $start_date)
                            ->where('strategic_objectives.end_date', '>=', $end_date);
                    });
            })->get();
            $get_dept[$dept_key]->strategic_objectives = (object) [];
            $get_dept[$dept_key]->strategic_objectives->total = 0;
            $get_dept[$dept_key]->strategic_objectives->red = 0;
            $get_dept[$dept_key]->strategic_objectives->green = 0;
            $get_dept[$dept_key]->strategic_objectives->yellow = 0;
            $get_dept[$dept_key]->strategic_objectives->blue = 0;
            $get_dept[$dept_key]->strategic_objectives->gray = 0;
            foreach ($get_strategic_objectives as $key_s_o => $row_s_o) {
                $get_dept[$dept_key]->strategic_objectives->total += 1;
                if ($row_s_o->status == 5) {
                    $get_dept[$dept_key]->strategic_objectives->red += 1;
                }
                if ($row_s_o->status == 4) {
                    $get_dept[$dept_key]->strategic_objectives->yellow += 1;
                }
                if ($row_s_o->status == 3) {
                    $get_dept[$dept_key]->strategic_objectives->green += 1;
                }
                if ($row_s_o->status == 2) {
                    $get_dept[$dept_key]->strategic_objectives->blue += 1;
                }
                if ($row_s_o->status == 1) {
                    $get_dept[$dept_key]->strategic_objectives->gray += 1;
                }
            }

            $get_initiatives = DB::table('initiatives')->where('deleted_at', null)->where('dept_id', $dept_row->dept_id)->where('unit_id', $request->unit_id)
                ->where(function ($q) use ($start_date, $end_date) {
                    $q->whereBetween('initiatives.start_date', [$start_date, $end_date])
                        ->orwhereBetween('initiatives.end_date', [$start_date, $end_date])
                        ->orwhere(function ($p) use ($start_date, $end_date) {
                            $p->where('initiatives.start_date', '<=', $start_date)
                                ->where('initiatives.end_date', '>=', $end_date);
                        });
                })->get();
            $get_dept[$dept_key]->initiatives = (object) [];
            $get_dept[$dept_key]->initiatives->total = 0;
            $get_dept[$dept_key]->initiatives->red = 0;
            $get_dept[$dept_key]->initiatives->green = 0;
            $get_dept[$dept_key]->initiatives->yellow = 0;
            $get_dept[$dept_key]->initiatives->blue = 0;
            $get_dept[$dept_key]->initiatives->gray = 0;
            foreach ($get_initiatives as $key_initiatives => $row_initiatives) {
                $get_dept[$dept_key]->initiatives->total += 1;
                if ($row_initiatives->status == 5) {
                    $get_dept[$dept_key]->initiatives->red += 1;
                }
                if ($row_initiatives->status == 4) {
                    $get_dept[$dept_key]->initiatives->yellow += 1;
                }
                if ($row_initiatives->status == 3) {
                    $get_dept[$dept_key]->initiatives->green += 1;
                }
                if ($row_initiatives->status == 2) {
                    $get_dept[$dept_key]->initiatives->blue += 1;
                }
                if ($row_initiatives->status == 1) {
                    $get_dept[$dept_key]->initiatives->gray += 1;
                }
            }

            $action_plans = DB::table('action_plans')->where('deleted_at', null)->where('dept_id', $dept_row->dept_id)->where('unit_id', $request->unit_id)->where(function ($q) use ($start_date, $end_date) {
                $q->whereBetween('action_plans.start_date', [$start_date, $end_date])
                    ->orwhereBetween('action_plans.end_date', [$start_date, $end_date])
                    ->orwhere(function ($p) use ($start_date, $end_date) {
                        $p->where('action_plans.start_date', '<=', $start_date)
                            ->where('action_plans.end_date', '>=', $end_date);
                    });
            })->get();

            $get_dept[$dept_key]->action_plans = (object) [];
            $get_dept[$dept_key]->action_plans->total = 0;
            $get_dept[$dept_key]->action_plans->red = 0;
            $get_dept[$dept_key]->action_plans->green = 0;
            $get_dept[$dept_key]->action_plans->yellow = 0;
            $get_dept[$dept_key]->action_plans->blue = 0;
            $get_dept[$dept_key]->action_plans->gray = 0;
            foreach ($action_plans as $key_action_plans => $row_action_plans) {
                $get_dept[$dept_key]->action_plans->total += 1;
                if ($row_action_plans->status == 5) {
                    $get_dept[$dept_key]->action_plans->red += 1;
                }
                if ($row_action_plans->status == 4) {
                    $get_dept[$dept_key]->action_plans->yellow += 1;
                }
                if ($row_action_plans->status == 3) {
                    $get_dept[$dept_key]->action_plans->green += 1;
                }
                if ($row_action_plans->status == 2) {
                    $get_dept[$dept_key]->action_plans->blue += 1;
                }
                if ($row_action_plans->status == 1) {
                    $get_dept[$dept_key]->action_plans->gray += 1;
                }
            }
        }
        if (!empty($get_dept)) {
            foreach ($get_dept as $key5 => $dept_value) {
                if (($request->role_id == 5 || $request->role_id == 6 || $request->role_id == 7) && !in_array($dept_value->dept_id, $requested_dept_id)) {
                    array_splice($get_dept, $key5, 1);
                }
            }
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "action plan list response";
        $this->apiResponse['data'] = $data;
        $this->apiResponse['data_acording_to_dept'] = $get_dept;
        return $this->sendResponse();
    }

    /*view strategic objectives overall performance group by to database */
    /**
     * view strategic objectives overall performance group by to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_strategic_objectives_status_bygroup(Request $request)
    {
        $str_data = $request->element;
        $str_obj_statuses = DB::table('str_obj_statuses')->where('deleted_at', null)->get();

        foreach ($str_obj_statuses as $key => $row) {
            if ($row->status_name == 'Green') {
                $status_green = $row->accuracy_percentage;
            } elseif ($row->status_name == 'Yellow') {
                $status_yellow = $row->accuracy_percentage;
            } elseif ($row->status_name == 'Red') {
                $status_red = ($row->accuracy_percentage) - 1;
            } elseif ($row->status_name == 'Gray (Started)') {
                $status_grey = $row->accuracy_percentage;
            }
        }
        $strategic_group_depts = DB::table('strategic_group_depts')->select('id as group_id', 'so_id', 'dept_id', 'unit_id')
            ->where('so_id', like, '%' . $str_data['strategic_objectives_id'] . '%')
            ->where('unit_id', $str_data['unit_id'])
            ->where('deleted_at', null)
            ->first();

        $conditions = $strategic_group_depts->so_id;
        $group_so_ids = explode(",", $conditions);
        $str_data1 = [];
        $percentage_sum = 0;
        foreach ($group_so_ids as $key => $group_so_id) {

            $str_data1[$key] = DB::table('strategic_objectives')
                ->select('strategic_sno_cmpnies.s_no', 'strategic_objectives.id', 'strategic_objectives.description', 'strategic_objectives.unit_id', 'strategic_objectives.department_id', 'strategic_objectives.user_id', 'str_obj_statuses.id as status', 'str_obj_statuses.status_name', 'strategic_objectives.percentage', 'department_masters.id', 'department_masters.dept_name', 'department_masters.company_id')
                ->leftjoin('strategic_sno_cmpnies', 'strategic_objectives.id', '=', 'strategic_sno_cmpnies.s_o_id')
                ->leftjoin('department_masters', 'strategic_objectives.department_id', '=', 'department_masters.id')
                ->leftjoin('str_obj_statuses', 'strategic_objectives.status', '=', 'str_obj_statuses.id')
                ->where('strategic_objectives.id', $group_so_id)
                ->where('strategic_objectives.deleted_at', null)
                ->first();
            $percentage_sum += $str_data1[$key]->percentage;
        }

        $temp = $percentage_sum / count($str_data1);

        if ($temp >= $status_green) {
            $all_strategic->overall_status = 'Green';
        } elseif ($temp >= $status_yellow) {
            $all_strategic->overall_status = 'Yellow';
        } elseif ($temp <= $status_red && $temp > 0) {
            $all_strategic->overall_status = 'Red';
        } elseif ($temp == $status_grey) {
            $all_strategic->overall_status = 'Gray (Started)';
        }

        $all_strategic->strategic_data = $str_data1;

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "Strategic list response";
        $this->apiResponse['data'] = $all_strategic;
        return $this->sendResponse();
    }
    /*view strategic objectives grand chart to database */
    /**
     * View grand chart to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_str_obj_grand_chart(Request $request)
    {
        $requested_dept_id = explode(',', $request->dept_id);
        // $str_obj_data = DB::table('strategic_objectives')->select('strategic_objectives.id', DB::raw('CONCAT(strategic_objectives.id, ".", description) AS text'), DB::raw("DATE_FORMAT(strategic_objectives.start_date, '%d-%m-%Y') as start_date"), DB::raw("DATE_FORMAT(end_date, '%d-%m-%Y') as end_date"), 'strategic_objectives.percentage as progress', 'str_obj_statuses.status_name', 'strategic_objectives.status')->leftjoin('str_obj_statuses', 'strategic_objectives.status', '=', 'str_obj_statuses.id')->where('strategic_objectives.deleted_at', NULL)->where('strategic_objectives.unit_id', $request->unit_id)->get();

        if ($request['fyear'] == 'april-march') {
            $start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
        } else {
            $start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        }
        // $strategic_objectives = DB::table('strategic_objectives')->where('deleted_at', null)->where('unit_id', $request->unit_id)->where(function ($q) use ($start_date, $end_date) {
        //     $q->whereBetween('strategic_objectives.start_date', [$start_date, $end_date])
        //         ->orwhereBetween('strategic_objectives.end_date', [$start_date, $end_date])
        //         ->orwhere(function ($p) use ($start_date, $end_date) {
        //             $p->where('strategic_objectives.start_date', '<=', $start_date)
        //                 ->where('strategic_objectives.end_date', '>=', $end_date);
        //         });
        // })->get();

        $str_obj_data = DB::table('strategic_objectives')->select('strategic_objectives.id', 'strategic_sno_cmpnies.s_no', 'strategic_objectives.id as so_id', DB::raw('CONCAT(strategic_sno_cmpnies.s_no, ". ", strategic_objectives.description) AS text'), DB::raw("DATE_FORMAT(strategic_objectives.start_date, '%d-%m-%Y') as start_date"), DB::raw("DATE_FORMAT(end_date, '%d-%m-%Y') as end_date"), 'strategic_objectives.percentage as progress', 'str_obj_statuses.status_name', 'strategic_objectives.status')
            ->leftjoin('strategic_sno_cmpnies', 'strategic_objectives.id', '=', 'strategic_sno_cmpnies.s_o_id')
            ->leftjoin('str_obj_statuses', 'strategic_objectives.status', '=', 'str_obj_statuses.id')
            ->where('strategic_objectives.deleted_at', null)
            ->whereIn('strategic_objectives.department_id', $requested_dept_id)
            ->where('strategic_objectives.unit_id', $request->unit_id)
            ->where(function ($q) use ($start_date, $end_date) {
                $q->whereBetween('strategic_objectives.start_date', [$start_date, $end_date])
                    ->orwhereBetween('strategic_objectives.end_date', [$start_date, $end_date])
                    ->orwhere(function ($p) use ($start_date, $end_date) {
                        $p->where('strategic_objectives.start_date', '<=', $start_date)
                            ->where('strategic_objectives.end_date', '>=', $end_date);
                    });
            })->get();

        // ->where('strategic_objectives.end_date' ,LIKE ,'%'. $request->year. '%')->get();

        // $scount = 0;
        //  $data[$str_obj_row->text] =[];
        foreach ($str_obj_data as $key => $str_obj_row) {
            // dump($str_obj_row);
            // $scount = $scount + 1;
            // $s_text = $str_obj_row->text;

            //    $data[$str_obj_row->text] = $scount .'.' .$s_text;
            // $str_obj_row->text = $str_obj_row->s_no . '. ' . $s_text;

            if ($str_obj_row->status == 1) {
                $str_obj_row->color = '#a9b7b6';
            } elseif ($str_obj_row->status == 2) {
                $str_obj_row->color = '#7dabf5';
            } elseif ($str_obj_row->status == 3) {
                $str_obj_row->color = '#4caf50';
            } elseif ($str_obj_row->status == 4) {
                $str_obj_row->color = '#FFD933';
            } elseif ($str_obj_row->status == 5) {
                $str_obj_row->color = '#f44336';
            }
        }
        // $str_data = array_merge($data, $str_obj_data);
        // dump('yuyhuyh', $str_obj_data);

        // $initiatives_data = DB::table('initiatives')->select('initiatives.sr_no as id', DB::raw('CONCAT(initiatives.sr_no, ".", initiatives.definition) AS text'), DB::raw("DATE_FORMAT(initiatives.start_date, '%d-%m-%Y') as start_date"), DB::raw("DATE_FORMAT(initiatives.end_date, '%d-%m-%Y') as end_date"), 'initiatives.s_o_id as parent', 'initiatives.percentage as progress', 'str_obj_statuses.status_name', 'initiatives.status')->leftjoin('str_obj_statuses', 'initiatives.status', '=', 'str_obj_statuses.id')->where('initiatives.deleted_at', NULL)->where('initiatives.unit_id', $request->unit_id)->get();

        $initiatives_data = DB::table('initiatives')->select('initiatives.sr_no as id', DB::raw('CONCAT(initiatives.sr_no, ". ", initiatives.definition) AS text'), DB::raw("DATE_FORMAT(initiatives.start_date, '%d-%m-%Y') as start_date"), DB::raw("DATE_FORMAT(initiatives.end_date, '%d-%m-%Y') as end_date"), 'initiatives.s_o_id as parent', 'initiatives.percentage as progress', 'str_obj_statuses.status_name', 'initiatives.status')->leftjoin('str_obj_statuses', 'initiatives.status', '=', 'str_obj_statuses.id')->where('initiatives.deleted_at', null)
            ->whereIn('initiatives.dept_id', $requested_dept_id)
            ->where('initiatives.unit_id', $request->unit_id)->get();
        // dump($initiatives_data);
        // $icount = 0;
        foreach ($initiatives_data as $key => $initiatives_row) {
            // $icount = $icount + 1;
            // $i_text = $initiatives_row->text;
            // $initiatives_row->text = $icount . '.' . $i_text;

            if ($initiatives_row->status == 1) {
                $initiatives_row->color = '#a9b7b6';
            } elseif ($initiatives_row->status == 2) {
                $initiatives_row->color = '#7dabf5';
            } elseif ($initiatives_row->status == 3) {
                $initiatives_row->color = '#4caf50';
            } elseif ($initiatives_row->status == 4) {
                $initiatives_row->color = '#FFD933';
            } elseif ($initiatives_row->status == 5) {
                $initiatives_row->color = '#f44336';
            }
        }
        // $action_plans_data = DB::table('action_plans')->select('action_plans.sr_no as id', DB::raw('CONCAT(action_plans.sr_no, ".", action_plans.definition) AS text'), DB::raw("DATE_FORMAT(action_plans.start_date, '%d-%m-%Y') as start_date"), DB::raw("DATE_FORMAT(action_plans.end_date, '%d-%m-%Y') as end_date"), 'initiatives.sr_no as parent', 'action_plans.percentage as progress', 'str_obj_statuses.status_name', 'action_plans.status')->leftjoin('initiatives', 'action_plans.initiatives_id', '=', 'initiatives.id')->leftjoin('str_obj_statuses', 'action_plans.status', '=', 'str_obj_statuses.id')->where('action_plans.deleted_at', null)->where('action_plans.unit_id', $request->unit_id)->get();

        $action_plans_data = DB::table('action_plans')->select('action_plans.sr_no as id', DB::raw('CONCAT(action_plans.sr_no, ". ", action_plans.definition) AS text'), DB::raw("DATE_FORMAT(action_plans.start_date, '%d-%m-%Y') as start_date"), DB::raw("DATE_FORMAT(action_plans.end_date, '%d-%m-%Y') as end_date"), 'initiatives.sr_no as parent', 'action_plans.percentage as progress', 'str_obj_statuses.status_name', 'action_plans.status')->leftjoin('initiatives', 'action_plans.initiatives_id', '=', 'initiatives.id')->leftjoin('str_obj_statuses', 'action_plans.status', '=', 'str_obj_statuses.id')->where('action_plans.deleted_at', null)->whereIn('action_plans.dept_id', $requested_dept_id)->where('action_plans.unit_id', $request->unit_id)->get();

        // dump($action_plans_data);
        // $acount = 0;
        foreach ($action_plans_data as $key => $action_plans_row) {

            // $acount = $acount + 1;
            // $a_text = $action_plans_row->text;
            // $action_plans_row->text = $acount . '.' . $a_text;

            if ($action_plans_row->status == 1) {
                $action_plans_row->color = '#a9b7b6';
            } elseif ($action_plans_row->status == 2) {
                $action_plans_row->color = '#7dabf5';
            } elseif ($action_plans_row->status == 3) {
                $action_plans_row->color = '#4caf50';
            } elseif ($action_plans_row->status == 4) {
                $action_plans_row->color = '#FFD933';
            } elseif ($action_plans_row->status == 5) {
                $action_plans_row->color = '#f44336';
            }
            // dump('kkkk',$action_plans_row);

        }

        $str_obj_gard_data = array_merge($str_obj_data, $initiatives_data, $action_plans_data);
        //grant chart link data
        $str_obj_link_data = DB::table('strategic_objectives')->select(DB::raw("CONVERT(id, CHAR) as 'id'"), DB::raw("CONVERT(id, CHAR) as 'source'"))->where('deleted_at', null)
            ->whereIn('strategic_objectives.department_id', $requested_dept_id)
            ->where('unit_id', $request->unit_id)->get();
        foreach ($str_obj_link_data as $key_str_obj_link_data => $str_obj_link_data_row) {
            $str_obj_link_data_row->type = '1';
            $str_obj_link_data_row->target = '';
        }
        $initiatives_link_data = DB::table('initiatives')->select('sr_no as id', DB::raw("CONVERT(s_o_id, CHAR) as 'source'"))
            ->where('deleted_at', null)
            ->whereIn('dept_id', $requested_dept_id)
            ->where('unit_id', $request->unit_id)->get();
        foreach ($initiatives_link_data as $initiatives_link_key => $initiatives_link_row) {
            $initiatives_link_row->type = '1';
            $initiatives_link_row->target = $initiatives_link_row->id;
        }
        $action_plans_link_data = DB::table('action_plans')->select('action_plans.sr_no as id', 'initiatives.sr_no as source')->leftjoin('initiatives', 'action_plans.initiatives_id', '=', 'initiatives.id')->where('action_plans.deleted_at', null)
            ->whereIn('action_plans.dept_id', $requested_dept_id)
            ->where('action_plans.unit_id', $request->unit_id)
            ->get();
        foreach ($action_plans_link_data as $action_plans_link_key => $action_plans_link_data_row) {
            $action_plans_link_data_row->type = '1';
            $action_plans_link_data_row->target = $action_plans_link_data_row->id;
        }
        $str_obj_gard_link_data = array_merge($str_obj_link_data, $initiatives_link_data, $action_plans_link_data);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "st obj gard data list response";
        $this->apiResponse['data'] = array("data" => $str_obj_gard_data, "links" => $str_obj_gard_link_data);
        return $this->sendResponse();
    }

    public function api_str_obj_review(Request $request)
    {
        $pending_review = [];
        $total_actions = DB::table('employers')->select('employers.name', 'employers.mobile', 'employers.email', 'employers.role_id', 'employers.user_id', 'employers.company_id', 'action_plans.id as action_plan_id', 'action_plans.definition', 'action_plans.target', 'action_plans.control_point', 'action_plans.owner', 'action_plans.co_owner', 'action_plans.status', 'action_plans.unit_id', 'action_plans.initiatives_id', 'action_plans.start_date', 'action_plans.end_date', 'action_plans.reminder_date', 'action_plans.reminder_frequency', 'action_plan_schedules.month_date', 'action_plan_schedules.review_month_date', 'action_plan_schedules.comment', 'action_plan_schedules.implement_data', 'action_plan_schedules.recovery_plan', 'action_plan_schedules.owner_id as schedule_owner_id ', 'action_plan_schedules.responsibility', 'action_plan_schedules.filled_status', 'action_plans.dept_id', 'department_masters.dept_name', 'emp.user_id as dept_head_id', 'emp.name as dept_head_name', 'emp.email as dept_head')
            ->join('action_plans', 'employers.user_id', '=', 'action_plans.user_id')
            ->join('department_masters', 'action_plans.dept_id', '=', 'department_masters.id')
            ->join('employers as emp', 'department_masters.user_id', '=', 'emp.user_id')
            ->join('action_plan_schedules', 'action_plans.id', '=', 'action_plan_schedules.action_plan_id')
            ->whereRaw("FIND_IN_SET(" . $request->unit_id . ",employers.multi_unit_id)")
            ->where('employers.company_id', $request->company_id)
            ->whereIn('action_plans.dept_id', $request->dept_alot)
            ->where('action_plans.deleted_at', null)
            ->where('action_plans.unit_id', $request->unit_id)
            ->where('action_plan_schedules.deleted_at', null)
            ->where('department_masters.deleted_at', null)
            ->where('action_plan_schedules.review_month_date', null)
            ->get();

        // echo "<pre>"; print_r($total_actions);
        /*         $total_actions = DB::table('employers')->select('employers.name', 'employers.mobile', 'employers.email', 'employers.role_id', 'employers.user_id', 'employers.company_id','employers.multi_dept_id',  'action_plans.id as action_plan_id', 'action_plans.definition', 'action_plans.target', 'action_plans.control_point', 'action_plans.owner', 'action_plans.co_owner', 'action_plans.status', 'action_plans.unit_id', 'action_plans.initiatives_id', 'action_plans.start_date', 'action_plans.end_date', 'action_plans.reminder_date', 'action_plans.reminder_frequency','action_plans.dept_id','action_plan_schedules.month_date', 'action_plan_schedules.review_month_date', 'action_plan_schedules.comment', 'action_plan_schedules.implement_data', 'action_plan_schedules.recovery_plan', 'action_plan_schedules.responsibility', 'action_plans.dept_id', 'department_masters.dept_name', 'emp.user_id as dept_head_id', 'emp.name as dept_head_name', 'emp.email as dept_head')
        ->leftjoin('action_plan_assigns', 'employers.user_id', '=', 'action_plan_assigns.co_owner_id')
        ->leftjoin('action_plans', 'action_plan_assigns.action_plan_id', '=', 'action_plans.id')
        ->join('department_masters', 'action_plans.dept_id', '=', 'department_masters.id')
        ->join('employers as emp', 'department_masters.user_id', '=', 'emp.user_id')
        ->join('action_plan_schedules', 'action_plans.id', '=', 'action_plan_schedules.action_plan_id')
        ->whereRaw("FIND_IN_SET(" . $request->unit_id . ",employers.multi_unit_id)")
        ->where('employers.company_id',$request->company_id)
        ->where('employers.user_id',$request->user_id)
        ->whereIn('action_plans.dept_id', $request->dept_alot)
        ->where('action_plans.deleted_at', NULL)
        ->where('action_plans.unit_id', $request->unit_id)
        ->where('action_plan_schedules.deleted_at', NULL)
        ->where('department_masters.deleted_at', NULL)
        ->where('action_plan_schedules.review_month_date', NULL)
        ->get(); */

        foreach ($total_actions as $key => $action_plan_value) {
            //  echo "<pre>";
            // print_r($action_plan_value);
            $company_data = DB::table('company_settings')->where('Company_id', $action_plan_value->company_id)->get();
            if (empty($action_plan_value->reminder_date)) {
                $company_reminder = $company_data[0]->reminder_date;
                $action_plan_value->reminder_date = date("d", strtotime($company_reminder));
            }
            if (empty($action_plan_value->reminder_frequency)) {
                $company_frequency = $company_data[0]->reminder_frequency;
                $action_plan_value->reminder_frequency = $company_frequency;
            }

            if ($action_plan_value->control_point == 'Monthly') {
                $current_date = date("Y-m-d");
                $start_date = $action_plan_value->start_date;
                $end_date = $action_plan_value->end_date;
                $formt_current_date = new DateTime($current_date);
                $formt_start_date = new DateTime($start_date);
                $formt_end_date = new DateTime($end_date);
                $current_new_date = new DateTime(date("Y-m-d", strtotime("-1 months")));

                if (($formt_current_date >= $formt_start_date) && ($current_new_date <= $formt_end_date)) {
                    $date = date_create(date('Y-m-d', strtotime("first day of")));
                    date_add($date, date_interval_create_from_date_string(($action_plan_value->reminder_date - 1) . ' days'));
                    $reminder_date = date_format($date, 'Y-m-d');
                    $current_date = date("Y-m-d");
                    $formt_reminder_date = new DateTime($reminder_date);
                    $formt_current_date = new DateTime($current_date);
                    //$diff = date_diff($formt_reminder_date, $formt_current_date);

                    if ($formt_current_date <= $formt_reminder_date) {
                        $start_reminder = date("Y-m-d", strtotime("$reminder_date -7 day"));
                        $formt_start_reminder = new DateTime($start_reminder);
                        if ($formt_start_reminder <= $formt_reminder_date) {
                            $frequency = $action_plan_value->reminder_frequency;
                            switch ($frequency) {
                                case '1':
                                    for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+1 day')) {
                                        $day_frequency[] = $i->format("Y-m-d");
                                    }
                                    array_push($day_frequency, $reminder_date);
                                    break;
                                case '2':
                                    for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+2 day')) {
                                        $day_frequency[] = $i->format("Y-m-d");
                                    }
                                    array_push($day_frequency, $reminder_date);
                                    break;
                                case '3':
                                    for ($i = $formt_start_reminder; $i <= $formt_reminder_date; $i->modify('+3 day')) {
                                        $day_frequency[] = $i->format("Y-m-d");
                                    }
                                    array_push($day_frequency, $reminder_date);
                                    break;

                                default:

                                    break;
                            }
                            // dump('in if', $action_plan_value->reminder_date);
                            $pending_review[] = array('action_plan_id' => $action_plan_value->action_plan_id, 'schedule_owner_id' => $action_plan_value->schedule_owner_id, 'definition' => $action_plan_value->definition, 'control_point' => $action_plan_value->control_point, 'name' => $action_plan_value->name, 'review_month_date' => $reminder_date, 'status' => 'Upcoming', 'color' => '#d68e0a', 'dept_id' => $action_plan_value->dept_id, 'filled_status' => $action_plan_value->filled_status);
                            // ffd933
                            if (array_intersect([$current_date], $day_frequency)) {
                                $user = $action_plan_value->email;
                                $name = $action_plan_value->name;
                                $definition = $action_plan_value->definition;
                                $review_date = $reminder_date;
                                $control_point = $action_plan_value->control_point;

                                Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                    $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                    $m->to($user, 'admin')->subject('Upcoming monthly action plan review!');
                                });
                            }
                        }
                    } else {
                        // dump('in else', $action_plan_value->filled_status);

                        $pending_review[] = array('action_plan_id' => $action_plan_value->action_plan_id, 'schedule_owner_id' => $action_plan_value->schedule_owner_id, 'definition' => $action_plan_value->definition, 'control_point' => $action_plan_value->control_point, 'name' => $action_plan_value->name, 'review_month_date' => $reminder_date, 'status' => 'Delayed', 'color' => '#ef5350', 'dept_id' => $action_plan_value->dept_id, 'filled_status' => $action_plan_value->filled_status);

                        $delay_date[] = date('Y-m-d', strtotime($reminder_date . ' + 5 days'));
                        if (array_intersect([$current_date], $delay_date)) {
                            $user = $action_plan_value->dept_head;
                            $name = $action_plan_value->dept_head_name;
                            $definition = $action_plan_value->definition;
                            $review_date = $reminder_date;
                            $control_point = $action_plan_value->control_point;

                            Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                $m->to($user, 'admin')->subject('Delay monthly action plan review!');
                            });
                        }
                    }
                }
                $day_frequency = [];
            } elseif ($action_plan_value->control_point == 'Quarterly') {
                $current_date = date("Y-m-d");
                $start_date = $action_plan_value->start_date;
                $end_date = $action_plan_value->end_date;
                $formt_current_date = new DateTime($current_date);
                $formt_start_date = new DateTime($start_date);
                $formt_end_date = new DateTime($end_date);
                $current_new_date = new DateTime(date("Y-m-d", strtotime("-1 months")));
                if (($formt_current_date >= $formt_start_date) && ($current_new_date <= $formt_end_date)) {
                    $start_month = date('m', strtotime($action_plan_value->start_date));
                    $end_month = date('m', strtotime($action_plan_value->end_date));
                    $current_month = date('m');
                    $add_mont = 3;
                    for ($i = 4; $i > 0; $i--) {
                        $quart_month = $start_month + $add_mont;
                        $start_month = $quart_month;
                        $end_month = date('m-Y', strtotime($action_plan_value->end_date));
                        $newdate = date('m-Y', strtotime("-1 months"));
                        if ($newdate == $end_month) {
                            $start_month = (int) $end_month + 1;
                        }
                        if ($start_month > 12) {
                            $diif = (int) $start_month - 12;
                            $start_month = $diif;
                        }
                        $total_quart_month[] = $start_month;
                    }
                    if (in_array($current_month, $total_quart_month)) {

                        $date = date_create(date('Y-m-d', strtotime("first day of")));
                        date_add($date, date_interval_create_from_date_string(($action_plan_value->reminder_date - 1) . ' days'));
                        $reminder_date = date_format($date, 'Y-m-d');
                        $current_date = date("Y-m-d");
                        $formt_reminder_date = new DateTime($reminder_date);
                        $formt_current_date = new DateTime($current_date);
                        //$diff = date_diff($formt_reminder_date, $formt_current_date);
                        if ($formt_current_date <= $formt_reminder_date) {
                            $start_reminder = date("Y-m-d", strtotime("$reminder_date -7 day"));
                            $formt_start_reminder = new DateTime($start_reminder);
                            if ($formt_start_reminder <= $formt_reminder_date) {
                                $frequency = $action_plan_value->reminder_frequency;
                                switch ($frequency) {
                                    case '1':
                                        for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+1 day')) {
                                            $day_frequency[] = $i->format("Y-m-d");
                                        }
                                        array_push($day_frequency, $reminder_date);
                                        break;
                                    case '2':
                                        for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+2 day')) {
                                            $day_frequency[] = $i->format("Y-m-d");
                                        }
                                        array_push($day_frequency, $reminder_date);
                                        break;
                                    case '3':
                                        for ($i = $formt_start_reminder; $i <= $formt_reminder_date; $i->modify('+3 day')) {
                                            $day_frequency[] = $i->format("Y-m-d");
                                        }
                                        array_push($day_frequency, $reminder_date);
                                        break;

                                    default:
                                        break;
                                }
                                $pending_review[] = array('action_plan_id' => $action_plan_value->action_plan_id, 'definition' => $action_plan_value->definition, 'control_point' => $action_plan_value->control_point, 'name' => $action_plan_value->name, 'review_month_date' => $reminder_date, 'status' => 'Upcoming', 'color' => '#d68e0a', 'dept_id' => $action_plan_value->dept_id, 'filled_status' => $action_plan_value->filled_status);
                                if (array_intersect([$current_date], $day_frequency)) {
                                    $user = $action_plan_value->email;
                                    $name = $action_plan_value->name;
                                    $definition = $action_plan_value->definition;
                                    $review_date = $reminder_date;
                                    $control_point = $action_plan_value->control_point;

                                    Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                        $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                        $m->to($user, 'admin')->subject('Upcoming quarterly action plan review!');
                                    });
                                }
                            }
                        } else {
                            $pending_review[] = array('action_plan_id' => $action_plan_value->action_plan_id, 'definition' => $action_plan_value->definition, 'control_point' => $action_plan_value->control_point, 'name' => $action_plan_value->name, 'review_month_date' => $reminder_date, 'status' => 'Delayed', 'color' => '#ef5350', 'dept_id' => $action_plan_value->dept_id, 'filled_status' => $action_plan_value->filled_status);

                            $delay_date[] = date('Y-m-d', strtotime($reminder_date . ' + 4 days'));
                            if (array_intersect([$current_date], $delay_date)) {
                                $user = $action_plan_value->dept_head;
                                $name = $action_plan_value->dept_head_name;
                                $definition = $action_plan_value->definition;
                                $review_date = $reminder_date;
                                $control_point = $action_plan_value->control_point;

                                Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                    $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                    $m->to($user, 'admin')->subject('Delay quaterly action plan review!');
                                });
                            }
                        }
                    }
                }
                $day_frequency = [];
                $total_quart_month = [];
            } elseif ($action_plan_value->control_point == 'Half Yearly') {
                $current_date = date("Y-m-d");
                $start_date = $action_plan_value->start_date;
                $end_date = $action_plan_value->end_date;
                $formt_current_date = new DateTime($current_date);
                $formt_start_date = new DateTime($start_date);
                $formt_end_date = new DateTime($end_date);
                $current_new_date = new DateTime(date("Y-m-d", strtotime("-1 months")));
                if (($formt_current_date >= $formt_start_date) && ($current_new_date <= $formt_end_date)) {
                    $start_month = date('m', strtotime($action_plan_value->start_date));
                    $current_month = date('m');
                    $add_mont = 6;
                    for ($i = 2; $i > 0; $i--) {
                        $quart_month = $start_month + $add_mont;
                        $start_month = $quart_month;
                        $end_month = date('m-Y', strtotime($action_plan_value->end_date));
                        $newdate = date("m-Y", strtotime("-1 months"));
                        if ($newdate == $end_month) {
                            $start_month = (int) $end_month + 1;
                        }
                        if ($start_month > 12) {
                            $diif = (int) $start_month - 12;
                            $start_month = $diif;
                        }
                        $total_half_month[] = $start_month;
                    }
                    if (in_array($current_month, $total_half_month)) {
                        $date = date_create(date('Y-m-d', strtotime("first day of")));
                        date_add($date, date_interval_create_from_date_string(($action_plan_value->reminder_date - 1) . ' days'));
                        $reminder_date = date_format($date, 'Y-m-d');
                        $current_date = date("Y-m-d");
                        $formt_reminder_date = new DateTime($reminder_date);
                        $formt_current_date = new DateTime($current_date);
                        // $diff = date_diff($formt_reminder_date, $formt_current_date);
                        if ($formt_current_date <= $formt_reminder_date) {
                            $start_reminder = date("Y-m-d", strtotime("$reminder_date -7 day"));
                            $formt_start_reminder = new DateTime($start_reminder);
                            if ($formt_start_reminder <= $formt_reminder_date) {
                                $frequency = $action_plan_value->reminder_frequency;
                                switch ($frequency) {
                                    case '1':
                                        for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+1 day')) {
                                            $day_frequency[] = $i->format("Y-m-d");
                                        }
                                        array_push($day_frequency, $reminder_date);
                                        break;
                                    case '2':
                                        for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+2 day')) {
                                            $day_frequency[] = $i->format("Y-m-d");
                                        }
                                        array_push($day_frequency, $reminder_date);
                                        break;
                                    case '3':
                                        for ($i = $formt_start_reminder; $i <= $formt_reminder_date; $i->modify('+3 day')) {
                                            $day_frequency[] = $i->format("Y-m-d");
                                        }
                                        array_push($day_frequency, $reminder_date);
                                        break;

                                    default:

                                        break;
                                }
                                $pending_review[] = array('action_plan_id' => $action_plan_value->action_plan_id, 'definition' => $action_plan_value->definition, 'control_point' => $action_plan_value->control_point, 'name' => $action_plan_value->name, 'review_month_date' => $reminder_date, 'status' => 'Upcoming', 'color' => '#d68e0a', 'dept_id' => $action_plan_value->dept_id, 'filled_status' => $action_plan_value->filled_status);

                                if (array_intersect([$current_date], $day_frequency)) {
                                    $user = $action_plan_value->email;
                                    $name = $action_plan_value->name;
                                    $definition = $action_plan_value->definition;
                                    $review_date = $reminder_date;
                                    $control_point = $action_plan_value->control_point;

                                    Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                        $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                        $m->to($user, 'admin')->subject('Upcoming half yearly action plan review!');
                                    });
                                }
                            }
                        } else {
                            $pending_review[] = array('action_plan_id' => $action_plan_value->action_plan_id, 'definition' => $action_plan_value->definition, 'control_point' => $action_plan_value->control_point, 'name' => $action_plan_value->name, 'review_month_date' => $reminder_date, 'status' => 'Delayed', 'color' => '#ef5350', 'dept_id' => $action_plan_value->dept_id, 'filled_status' => $action_plan_value->filled_status);

                            $delay_date[] = date('Y-m-d', strtotime($reminder_date . ' + 4 days'));
                            if (array_intersect([$current_date], $delay_date)) {
                                $user = $action_plan_value->dept_head;
                                $name = $action_plan_value->dept_head_name;
                                $definition = $action_plan_value->definition;
                                $review_date = $reminder_date;
                                $control_point = $action_plan_value->control_point;

                                Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                    $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                    $m->to($user, 'admin')->subject('Delay half yearly action plan review!');
                                });
                            }
                        }
                    }
                    $day_frequency = [];
                    $total_half_month = [];
                }
            } elseif ($action_plan_value->control_point == 'Yearly') {
                $current_date = date("Y-m-d");
                $start_date = $action_plan_value->start_date;
                $end_date = $action_plan_value->end_date;
                $formt_current_date = new DateTime($current_date);
                $formt_start_date = new DateTime($start_date);
                $formt_end_date = new DateTime($end_date);
                $current_new_date = new DateTime(date("Y-m-d", strtotime("-1 months")));
                if (($formt_current_date >= $formt_start_date) && ($current_new_date <= $formt_end_date)) {
                    $start_month = date('m', strtotime($action_plan_value->start_date));
                    $current_month = date('m');
                    $add_mont = 12;
                    for ($i = 1; $i > 0; $i--) {
                        $quart_month = $start_month + $add_mont;
                        $start_month = $quart_month;
                        $end_month = date('m-Y', strtotime($action_plan_value->end_date));
                        $newdate = date("m-Y", strtotime("-1 months"));
                        if ($newdate == $end_month) {
                            $start_month = (int) $end_month + 1;
                        }
                        if ($start_month > 12) {
                            $diif = (int) $start_month - 12;
                            $start_month = $diif;
                        }
                        $total_year_month[] = $start_month;
                    }
                    if (in_array($current_month, $total_year_month)) {
                        $date = date_create(date('Y-m-d', strtotime("first day of")));
                        date_add($date, date_interval_create_from_date_string(($action_plan_value->reminder_date - 1) . ' days'));
                        $reminder_date = date_format($date, 'Y-m-d');
                        $current_date = date("Y-m-d");
                        $formt_reminder_date = new DateTime($reminder_date);
                        $formt_current_date = new DateTime($current_date);
                        //$diff = date_diff($formt_reminder_date, $formt_current_date);
                        if ($formt_current_date <= $formt_reminder_date) {
                            $start_reminder = date("Y-m-d", strtotime("$reminder_date -7 day"));
                            $formt_start_reminder = new DateTime($start_reminder);
                            if ($formt_start_reminder <= $formt_reminder_date) {
                                $frequency = $action_plan_value->reminder_frequency;
                                switch ($frequency) {
                                    case '1':
                                        for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+1 day')) {
                                            $day_frequency[] = $i->format("Y-m-d");
                                        }
                                        array_push($day_frequency, $reminder_date);
                                        break;
                                    case '2':
                                        for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+2 day')) {
                                            $day_frequency[] = $i->format("Y-m-d");
                                        }
                                        array_push($day_frequency, $reminder_date);
                                        break;
                                    case '3':
                                        for ($i = $formt_start_reminder; $i <= $formt_reminder_date; $i->modify('+3 day')) {
                                            $day_frequency[] = $i->format("Y-m-d");
                                        }
                                        array_push($day_frequency, $reminder_date);
                                        break;

                                    default:

                                        break;
                                }
                                $pending_review[] = array('action_plan_id' => $action_plan_value->action_plan_id, 'definition' => $action_plan_value->definition, 'control_point' => $action_plan_value->control_point, 'name' => $action_plan_value->name, 'review_month_date' => $action_plan_value->review_month_date, 'status' => 'Upcoming', 'color' => '#d68e0a', 'dept_id' => $action_plan_value->dept_id, 'filled_status' => $action_plan_value->filled_status);

                                if (array_intersect([$current_date], $day_frequency)) {
                                    $user = $action_plan_value->email;
                                    $name = $action_plan_value->name;
                                    $definition = $action_plan_value->definition;
                                    $review_date = $reminder_date;
                                    $control_point = $action_plan_value->control_point;

                                    Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                        $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                        $m->to($user, 'admin')->subject('Upcoming yearly action plan review!');
                                    });
                                }
                            }
                        } else {
                            $pending_review[] = array('action_plan_id' => $action_plan_value->action_plan_id, 'definition' => $action_plan_value->definition, 'control_point' => $action_plan_value->control_point, 'name' => $action_plan_value->name, 'review_month_date' => $action_plan_value->review_month_date, 'status' => 'Delayed', 'color' => '#ef5350', 'dept_id' => $action_plan_value->dept_id, 'filled_status' => $action_plan_value->filled_status);

                            $delay_date[] = date('Y-m-d', strtotime($reminder_date . ' + 4 days'));
                            if (array_intersect([$current_date], $delay_date)) {
                                $user = $action_plan_value->dept_head;
                                $name = $action_plan_value->dept_head_name;
                                $definition = $action_plan_value->definition;
                                $review_date = $reminder_date;
                                $control_point = $action_plan_value->control_point;
                                Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                    $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                    $m->to($user, 'admin')->subject('Delay yearly action plan review!');
                                });
                            }
                        }
                    }
                    $total_year_month = [];
                }
            }
        }

        foreach ($pending_review as $keyp => $pending_review_value) {

            $filled_action = DB::table('action_plan_schedules')
                ->where('action_plan_id', $pending_review_value['action_plan_id'])
                ->where('deleted_at', null)
                ->get();

            $pending_review[$keyp]['review_data'] = array();
            $pending_review_month = date('m', strtotime($pending_review_value['review_month_date']));

            foreach ($filled_action as $key => $filled_action_row) {
                $review_month = date('m', strtotime($filled_action_row->month_date));

                if ($review_month == $pending_review_month) {
                    $pending_review[$keyp]['review_data'] = array($filled_action_row);
                }
            }
        }

        //$department_masters = array_values($department_masters);
        // $half_yearly_data=$half_yearly_data ? : 1;
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "your action plan is due";
        $this->apiResponse['data'] = $pending_review;
        // $this->apiResponse['quarterly_data'] = $quarterly_data;
        //$this->apiResponse['half_yearly_data'] = $half_yearly_data;
        //  $this->apiResponse['yearly_data'] = $yearly_data;

        return $this->sendResponse();
    }

    public function api_dash_board_strategic_objectives_data(Request $request)
    {
        //get financial year start date and end Date
        $cyear = date("Y");
        $getDate = $this->getFinancialDate($request['fyear'] ? $request['fyear'] : '', $cyear);
        $start_date = $getDate['start_date'];
        $end_date = $getDate['end_date'];

        $strategic_objectives = DB::table('strategic_objectives')->select('strategic_objectives.id as strategic_objectives_id', 'strategic_objectives.target', 'strategic_objectives.start_date', 'strategic_objectives.end_date', 'units.id as unit_id', 'units.unit_name', 'strategic_objectives.department_id', 'department_masters.dept_name', 'users.id as user_id', 'users.name as user_name', 'strategic_objectives.tracking_frequency', 'strategic_objectives.description', 'u_o_ms.name as uom_name', 'str_obj_statuses.status_name', 'strategic_objectives.percentage')
            ->leftjoin('units', 'strategic_objectives.unit_id', '=', 'units.id')
            ->leftjoin('u_o_ms', 'strategic_objectives.unit_of_measurement', '=', 'u_o_ms.id')
            ->leftjoin('str_obj_statuses', 'strategic_objectives.status', '=', 'str_obj_statuses.id')
            ->leftjoin('users', 'strategic_objectives.user_id', '=', 'users.id')
            ->leftjoin('department_masters', 'strategic_objectives.department_id', '=', 'department_masters.id')
            ->where('strategic_objectives.deleted_at', null)
            ->where('strategic_objectives.unit_id', $request->unit_id)
            ->where('strategic_objectives.id', $request['s_o_id'])
            ->where(function ($q) use ($start_date, $end_date) {
                $q->whereBetween('strategic_objectives.start_date', [$start_date, $end_date])
                    ->orwhereBetween('strategic_objectives.end_date', [$start_date, $end_date])
                    ->orwhere(function ($p) use ($start_date, $end_date) {
                        $p->where('strategic_objectives.start_date', '<=', $start_date)
                            ->where('strategic_objectives.end_date', '>=', $end_date);
                    });
            })->get();

        if (!empty($strategic_objectives)) {

            $initiatives = DB::table('initiatives')->select('initiatives.sr_no', 'initiatives.id as initiatives_id', 'initiatives.definition', 'initiatives.s_o_id', 'strategic_objectives.description', 'initiatives.dept_id', 'department_masters.dept_name', 'initiatives.section_id', 'sections.section_name', 'initiatives.user_id', 'initiatives.start_date', 'initiatives.end_date', 'initiatives.percentage', 'str_obj_statuses.status_name')
                ->leftjoin('strategic_objectives', 'initiatives.s_o_id', '=', 'strategic_objectives.id')
                ->leftjoin('str_obj_statuses', 'initiatives.status', '=', 'str_obj_statuses.id')
                ->leftjoin('department_masters', 'initiatives.dept_id', '=', 'department_masters.id')
                ->leftjoin('sections', 'initiatives.section_id', '=', 'sections.id')
                ->where('initiatives.deleted_at', null)
                ->where('initiatives.s_o_id', $strategic_objectives[0]->strategic_objectives_id)
                ->get();
            $strategic_objectives[0]->initiatives = $initiatives;

            foreach ($initiatives as $key1 => $initiatives_row) {

                $action_plans = DB::table('action_plans')->select('action_plans.sr_no', 'action_plans.dept_id', 'department_masters.dept_name', 'initiatives.s_o_id as s_o_id', 'initiatives.section_id', 'action_plans.id as action_plans_id', 'action_plans.definition', 'action_plans.target', 'action_plans.start_date', 'action_plans.end_date', 'action_plans.control_point', 'action_plans.co_owner', 'action_plans.status', 'action_plans.initiatives_id', 'action_plans.user_id', 'users.name as co_owner_name', 'action_plans.percentage', 'str_obj_statuses.status_name', 'action_plans.reminder_date')
                    ->leftjoin('initiatives', 'action_plans.initiatives_id', '=', 'initiatives.id')
                // ->leftjoin('sections', 'initiatives.section_id', '=', 'sections.dept_id')
                    ->leftjoin('users', 'action_plans.co_owner', '=', 'users.id')
                    ->leftjoin('department_masters', 'action_plans.dept_id', '=', 'department_masters.id')
                    ->leftjoin('str_obj_statuses', 'action_plans.status', '=', 'str_obj_statuses.id')
                    ->where('users.deleted_at', null)
                    ->where('action_plans.deleted_at', null)
                    ->where('action_plans.initiatives_id', $initiatives_row->initiatives_id)
                    ->get();
                $strategic_objectives[0]->initiatives[$key1]->action_plans = $action_plans;

                foreach ($action_plans as $key2 => $action_plan_value) {
                    $kpis = DB::table('kpi_actionplan_rels')->select('add_kpis.*')
                        ->where('action_plan_id', $action_plan_value->action_plans_id)
                        ->leftjoin('add_kpis', 'kpi_actionplan_rels.kpi_id', '=', 'add_kpis.id')
                        ->get();
                    $strategic_objectives[0]->initiatives[$key1]->action_plans[$key2]->kpis = $kpis;
                }
            }
        }

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "strategic_objectives list response";
        $this->apiResponse['data'] = $strategic_objectives;
        return $this->sendResponse();
    }

    public function api_flow_chart_strategic_objectives_data(Request $request)
    {
        //get financial year start date and end Date
        $cyear = date("Y");
        $getDate = $this->getFinancialDate($request['fyear'] ? $request['fyear'] : '', $cyear);
        $start_date = $getDate['start_date'];
        $end_date = $getDate['end_date'];

        $strategic_objectives = DB::table('strategic_objectives')->select('strategic_objectives.id as id', 'strategic_objectives.id as strategic_objectives_id', 'strategic_sno_cmpnies.s_no as sr_no', 'strategic_objectives.target', DB::raw("'s' as type"), 'strategic_objectives.start_date', 'strategic_objectives.end_date', 'units.id as unit_id', 'units.unit_name', 'strategic_objectives.department_id', 'department_masters.dept_name', 'users.id as user_id', 'users.name as user_name', 'strategic_objectives.tracking_frequency', 'strategic_objectives.description as definition', 'u_o_ms.id as uom_id', 'u_o_ms.name as uom_name', 'str_obj_statuses.id as status_id', 'str_obj_statuses.status_name', 'strategic_objectives.percentage')
            ->leftjoin('units', 'strategic_objectives.unit_id', '=', 'units.id')
            ->leftjoin('u_o_ms', 'strategic_objectives.unit_of_measurement', '=', 'u_o_ms.id')
            ->leftjoin('strategic_sno_cmpnies', 'strategic_objectives.id', '=', 'strategic_sno_cmpnies.s_o_id')
            ->leftjoin('str_obj_statuses', 'strategic_objectives.status', '=', 'str_obj_statuses.id')
            ->leftjoin('users', 'strategic_objectives.user_id', '=', 'users.id')
            ->leftjoin('department_masters', 'strategic_objectives.department_id', '=', 'department_masters.id')
            ->where('strategic_objectives.deleted_at', null)
            ->where('strategic_objectives.unit_id', $request->unit_id)
            ->where('strategic_objectives.id', $request['s_o_id'])
            ->where(function ($q) use ($start_date, $end_date) {
                $q->whereBetween('strategic_objectives.start_date', [$start_date, $end_date])
                    ->orwhereBetween('strategic_objectives.end_date', [$start_date, $end_date])
                    ->orwhere(function ($p) use ($start_date, $end_date) {
                        $p->where('strategic_objectives.start_date', '<=', $start_date)
                            ->where('strategic_objectives.end_date', '>=', $end_date);
                    });
            })->get();

        if (!empty($strategic_objectives)) {

            $initiatives = DB::table('initiatives')->select('initiatives.sr_no', 'initiatives.id as id', 'initiatives.id as initiatives_id', DB::raw("'i' as type"), 'initiatives.definition', 'initiatives.s_o_id', 'strategic_objectives.description', 'initiatives.dept_id', 'department_masters.dept_name', 'initiatives.section_id', 'sections.section_name', 'initiatives.user_id', 'initiatives.start_date', 'initiatives.end_date', 'initiatives.percentage', 'str_obj_statuses.id as status_id', 'str_obj_statuses.status_name')
                ->leftjoin('strategic_objectives', 'initiatives.s_o_id', '=', 'strategic_objectives.id')
                ->leftjoin('str_obj_statuses', 'initiatives.status', '=', 'str_obj_statuses.id')
                ->leftjoin('department_masters', 'initiatives.dept_id', '=', 'department_masters.id')
                ->leftjoin('sections', 'initiatives.section_id', '=', 'sections.id')
                ->where('initiatives.deleted_at', null)
                ->where('initiatives.s_o_id', $strategic_objectives[0]->id)
                ->get();
            $strategic_objectives[0]->children = $initiatives;

            $attta = array();
            foreach ($initiatives as $key1 => $initiatives_row) {

                $action_plans = DB::table('action_plans')->select('action_plans.sr_no', 'action_plans.dept_id', DB::raw("'a' as type"), 'department_masters.dept_name', 'initiatives.s_o_id as s_o_id', 'initiatives.definition as description', 'initiatives.section_id', 'action_plans.id as action_plans_id', 'action_plans.definition', 'action_plans.control_point', 'action_plans.target', 'action_plans.start_date', 'action_plans.end_date', 'action_plans.control_point', 'action_plans.co_owner', 'action_plans.status', 'action_plans.initiatives_id', 'action_plans.user_id', 'users.name as co_owner_name', 'action_plans.percentage', 'str_obj_statuses.status_name', 'action_plans.reminder_date')
                    ->leftjoin('initiatives', 'action_plans.initiatives_id', '=', 'initiatives.id')
                // ->leftjoin('sections', 'initiatives.section_id', '=', 'sections.dept_id')
                    ->leftjoin('users', 'action_plans.co_owner', '=', 'users.id')
                    ->leftjoin('department_masters', 'action_plans.dept_id', '=', 'department_masters.id')
                    ->leftjoin('str_obj_statuses', 'action_plans.status', '=', 'str_obj_statuses.id')
                    ->where('users.deleted_at', null)
                    ->where('action_plans.deleted_at', null)
                    ->where('action_plans.initiatives_id', $initiatives_row->initiatives_id)
                    ->get();

                foreach ($action_plans as $action_key => $action_plans_row) {
                    $assign_action_plan_user = DB::table('action_plan_assigns')->select('action_plan_assigns.co_owner_id as co_owner', 'users.name as user_name')
                        ->join('users', 'action_plan_assigns.co_owner_id', '=', 'users.id')
                        ->where('users.deleted_at', null)
                        ->where('action_plan_assigns.deleted_at', null)
                        ->where('action_plan_assigns.action_plan_id', $action_plans_row->action_plans_id)->get();
                    $action_plans[$action_key]->assign_action_plan_user = $assign_action_plan_user;
                }

                $strategic_objectives[0]->children[$key1]->children = $action_plans;

                foreach ($action_plans as $key2 => $action_plan_value) {
                    $kpis = DB::table('kpi_actionplan_rels')->select('add_kpis.kpi_name as definition', 'kpi_actionplan_rels.kpi_id as id', 'action_plans.id as action_plan_id', 'action_plans.definition as description', 'add_kpis.department_id as department_id', DB::raw("'k' as type"))
                        ->leftjoin('action_plans', 'kpi_actionplan_rels.action_plan_id', '=', 'action_plans.id')
                        ->leftjoin('add_kpis', 'kpi_actionplan_rels.kpi_id', '=', 'add_kpis.id')
                        ->where('action_plan_id', $action_plan_value->action_plans_id)
                        ->get();
                    $strategic_objectives[0]->children[$key1]->children[$key2]->children = $kpis;
                    $kpichild = $strategic_objectives[0]->children[$key1]->children[$key2]->children;
                    foreach ($kpichild as $kpichild_row) {
                        $kpichild_row->children = array();
                    }
                }
            }
        }
        $this->apiResponse['status'] = "success";
        // $this->apiResponse['name'] = "root";
        $this->apiResponse['message'] = "strategic_objectives list response";
        $this->apiResponse['children'] = $strategic_objectives;
        return $this->sendResponse();
    }
}
