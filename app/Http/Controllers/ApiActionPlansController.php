<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiKpiTraits;
use Carbon\Carbon;
use DB;
use Dwij\Laraadmin\Models\Module;
use Exception;
use Illuminate\Http\Request;
use Mail;

class ApiActionPlansController extends ResponseApiController
{
    use ApiKpiTraits;
    /**
     * Get action plan acording to iniative id in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_get_actionplan(Request $request)
    {
        $action_plans = DB::table('action_plans')->select('action_plans.id as action_plan_id', 'action_plans.definition')
            ->where('action_plans.deleted_at', null)
            ->where('action_plans.unit_id', $request->unit_id)
            ->where('action_plans.initiatives_id', $request->initiatives_id)
            ->get();
        $kpi_id_data = [];
        $kpi_id = [];
        foreach ($action_plans as $key => $row) {
            $temp[] = $row->action_plan_id;
            $kpi_id_data = DB::table('kpi_actionplan_rels')->select('kpi_actionplan_rels.kpi_id')
                ->where('kpi_actionplan_rels.action_plan_id', $row->action_plan_id)
                ->get();

            $kpi_id_length = count($kpi_id_data);
            if ($kpi_id_length > 0) {
                for ($i = 0; $i < $kpi_id_length; $i++) {
                    $kpi_id[] = $kpi_id_data[$i]->kpi_id;
                }
                $action_plans[$key]->kpi_data = json_encode($kpi_id);
                unset($kpi_id_length, $i, $kpi_id);
            }

        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "action plans list according to initiatives response";
        $this->apiResponse['data'] = $action_plans;
        return $this->sendResponse();
    }
    /**
     * Store action_plans in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_add_action_plans(Request $request)
    {

        if (!empty($request->kpData)) {
            $temp = $request->kpData;
            $target = $this->KpiTargetCondition((object) $request['kpData']);
            $temp['target_range_min'] = $target;
            $temp['ytd'] = $target;
            $start_date = date("Y-m-d", strtotime($request->kpData['start_date']));
            $end_date = date("Y-m-d", strtotime($request->kpData['end_date']));
            $date = date('Y-m-d h:i:s');
            $kpi_id = DB::table('add_kpis')->insertGetId([
                'kpi_name' => $request->kpData['kpi_name'], 'unit_id' => $request->kpData['unit_id'], 'department_id' => $request->kpData['department_id'], 'section_id' => $request->kpData['section_id'], 'ideal_trend' => $request->kpData['ideal_trend'], 'unit_of_measurement' => $request->kpData['unit_of_measurement'], 'target_range_min' => $target, 'kpi_definition' => $request->kpData['kpi_definition'], 'lead_kpi' => $request->kpData['lead_kpi'], 'frequency' => $request->kpData['frequency'], 'kpi_performance' => $request->kpData['kpi_performance'], 'target_condition' => $request->kpData['target_condition'], 'created_at' => $date, 'updated_at' => $date, 'start_date' => $start_date, 'end_date' => $end_date,
            ]);
            $inser_kpi_id[] = $kpi_id;
            $temp['kpi_id'] = $kpi_id;
            $request->kpData = $temp;
            Module::insert("kpi_targets", (object) $request->kpData);
            $temp_month = $this->defaultActuals($request->kpData['target_year']);
            $actual_data = array_merge($request->kpData, $temp_month);
            Module::insert("kpi_actuals", (object) $actual_data);
            $pri_kpi_id = $request->actionData['kpi_id'];
            $kpi_ids = array_merge($pri_kpi_id, $inser_kpi_id);

        } else {
            $kpi_ids = $request->actionData['kpi_id'];

        }

        //add action plan

        $get_initiative_dept = DB::table('initiatives')->select('initiatives.dept_id', 'initiatives.end_date', 'initiatives.s_o_id')
            ->where('initiatives.deleted_at', null)
            ->where('initiatives.id', $request->actionData['initiatives_id'])->first();

        $temp_status = ['status' => 1, 'percentage' => 0, 'previous_status' => 1, 'dept_id' => $get_initiative_dept->dept_id];
        $temp_action_data = $request->actionData;
        $request->actionData = array_merge($temp_action_data, $temp_status);
        $dateNewStartDate = str_replace('/', '-', $request->actionData['start_date']);
        $dateNewStartDate = date('Y-m-d', strtotime($dateNewStartDate));
        if ($dateNewStartDate >= $get_initiative_dept->end_date) {
            $message = "Start date should be greater than and  equals to initiative's end date !";
            $errors = "Start date should be greater than and  equals to initiative's end date !";
            return $this->respondValidationError($message, $errors);
        }

        $dateNewEndDate = str_replace('/', '-', $request->actionData['end_date']);
        if (empty($request->actionData['reminder_date'])) {
            $review_date = DB::table('company_settings')->select('reminder_date')->where('company_id', $request->actionData['company_id'])->get();
            $reminder_date = str_replace('/', '-', $review_date[0]->review_date);
            $reminder_date = date('d', strtotime($reminder_date));
        } else {
            $reminder_date = str_replace('/', '-', $request->actionData['reminder_date']);
            $reminder_date = date('d', strtotime($reminder_date));
        }
        $dateNewEndDate = date('Y-m-d', strtotime($dateNewEndDate));
        if ($dateNewEndDate >= $get_initiative_dept->end_date) {
            $message = "End date should be greater than and equals to initiative's end date !";
            $errors = "End date should be greater than and equals to initiative's end date !";
            return $this->respondValidationError($message, $errors);
        }

        //Assign Sr.No acording to strategic objectives
        $initiatives = DB::table('initiatives')->select('sr_no')->where('id', $request->actionData['initiatives_id'])->first();
        $action_plan_count = DB::table('action_plans')->where('initiatives_id', $request->actionData['initiatives_id'])->count();
        $srno = $action_plan_count + 1;
        //    if($request->init_sno == '')
        //    {

        //    }
        //    else {

        //    }
        $sr_no = $initiatives->sr_no . '.' . $srno;
        $temp_sr_no = ["sr_no" => $sr_no];
        $temp_action_plan = $request->actionData;
        // $temp_percenta = [ 'percentage' => 0 ];
        $request->actionData = array_merge($temp_sr_no, $temp_action_plan);
 
        $insert_id = DB::table('action_plans')->insertGetId([
            'sr_no' => $request->actionData['sr_no'],
            'user_id' => $request->actionData['user_id'], 'unit_id' => $request->actionData['unit_id'], 'dept_id' => $request->actionData['dept_id'], 'initiatives_id' => $request->actionData['initiatives_id'], 'definition' => $request->actionData['definition'], 'start_date' => $dateNewStartDate, 'end_date' => $dateNewEndDate, 'reminder_date' => $reminder_date, 'control_point' => $request->actionData['control_point'], 'target' => $request->actionData['target'], 'status' => $request->actionData['status'], 'percentage' => $request->actionData['percentage'], 'previous_status' => $request->actionData['previous_status'], 'co_owner' => json_encode($request->actionData['co_owner']),
        ]);
        foreach ($request->actionData['co_owner'] as $key => $cowner_value) {
            $date = date('Y-m-d h:i:s');
            DB::table('action_plan_schedules')->insertGetId([
                'action_plan_id' => $insert_id,
                'owner_id' => $cowner_value, 'status' => $request->actionData['status'], 'created_at' => $date, 'updated_at' => $date, 'filled_status' => 'NULL',
            ]);
            DB::table('action_plan_assigns')->insertGetId([
                'action_plan_id' => $insert_id,
                'co_owner_id' => $cowner_value, 'created_at' => $date, 'updated_at' => $date,
            ]);
        }
        $get_s_o_id = DB::table('initiatives')->where('id', $request->actionData['initiatives_id'])->first();
        $action_plan_data = [];
        // $action_plan_data1 =[];

        foreach ($kpi_ids as $key => $kpi_Id) {

            $action_plan_data[] = array(
                "kpi_id" => $kpi_Id,
                "action_plan_id" => $insert_id,
            );
            // $action_plan_data[] =$kpi_Id;
            // $action_plan_data1[] = $insert_id;
            DB::table('add_kpis')->where('id', $kpi_Id)->update(['s_o_id' => $get_s_o_id->s_o_id, 'initiatives_id' => $request->actionData['initiatives_id']]);
        }
        // print_r($request->actionData['co_owner']);die;
        try {
            foreach ($request->actionData['co_owner'] as $key => $co_owner_id) {
                $user_Data = DB::table('employers')->select(
                    'employers.email as email', 'employers.name as name')
                    ->where('employers.user_id', '=', $co_owner_id)->first();
                $user = $user_Data->email;
                $name = $user_Data->name;
                $actionplan_Name = $request->actionData['definition'];
                // print_r($actionplan_Name);die();
                // send mail
                if (env('MAIL_USERNAME') != null && env('MAIL_USERNAME') != "null" && env('MAIL_USERNAME') != "") {
                    Mail::send('emails.create_action_plan', ['name' => $name, 'actionplan_Name' => $actionplan_Name], function ($m) use ($user) {
                        $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                        $m->to($user, 'Admin')->subject('Action plan Added!');
                    });
                }
                // $actionplan_Name = $request->definition;
            }

            // $temp = $request->actionData;
            // foreach($temp as $key => $user_id)
            // {
            // }
            // $user_id = $temp->user_id;
            $insert_id = DB::table('kpi_actionplan_rels')->insert($action_plan_data);
        }
        //catch exception
         catch (Exception $e) {
            //$this->apiResponse['status']="Error";
            $this->apiResponse['message2'] = '';
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully save your action plans data !';
        return $this->sendResponse();
    }
    /*view action plan to database */
    /**
     * View strategic objectives to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_initiative_and_action_plan(Request $request)
    {
        $requested_dept_id = explode(',', $request->dept_id);
        if ($request['fyear'] == 'april-march') {
            $start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
        } else {
            $start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        }

        $action_plans = DB::table('action_plans')->select('action_plans.sr_no', 'action_plans.id as action_plan_id', 'action_plans.user_id', 'action_plans.unit_id', 'action_plans.start_date', 'action_plans.end_date', 'initiatives.definition as initiatives_definition', 'action_plans.definition as action_plan_definition', 'action_plans.target', 'action_plans.start_date', 'action_plans.reminder_date', 'action_plans.control_point', 'action_plans.status as status_id', 'action_plans.initiatives_id', 'str_obj_statuses.status_name', 'action_plans.percentage', 'action_plans.start_date', 'action_plans.end_date', 'strategic_objectives.id as s_o_id', 'department_masters.id as dept_id', 'department_masters.dept_name', 'add_kpis.kpi_name', 'add_kpis.id as kpi_id')
            ->leftjoin('initiatives', 'action_plans.initiatives_id', '=', 'initiatives.id')
        //->leftjoin('action_plan_assigns', 'action_plans.id', '=', 'action_plan_assigns.action_plan_id')
        //->leftjoin('users', 'action_plan_assigns.co_owner_id', '=', 'users.id')
            ->leftjoin('str_obj_statuses', 'action_plans.status', '=', 'str_obj_statuses.id')
            ->leftjoin('strategic_objectives', 'initiatives.s_o_id', '=', 'strategic_objectives.id')
            ->leftjoin('department_masters', 'strategic_objectives.department_id', '=', 'department_masters.id')
            ->leftjoin('kpi_actionplan_rels', 'kpi_actionplan_rels.action_plan_id', '=', 'action_plans.id')
            ->leftjoin('add_kpis', 'add_kpis.id', '=', 'kpi_actionplan_rels.kpi_id')
        //->where('users.deleted_at',NULL)
            ->where('initiatives.deleted_at', null)
            ->where('action_plans.deleted_at', null)
            // ->whereIn('action_plans.dept_id', $requested_dept_id)
            ->where('action_plans.unit_id', $request->unit_id)
            ->where(function ($q) use ($start_date, $end_date) {
                $q->whereBetween('action_plans.start_date', [$start_date, $end_date])
                    ->orwhereBetween('action_plans.end_date', [$start_date, $end_date])
                    ->orwhere(function ($p) use ($start_date, $end_date) {
                        $p->where('action_plans.start_date', '<=', $start_date)
                            ->where('action_plans.end_date', '>=', $end_date);
                    });
            })
        //->groupBy('action_plans.id')
            ->orderBy('action_plans.sr_no', 'DESC')
            ->get();

        foreach ($action_plans as $key => $action_plans_row) {
            if (($request->role_id == 5 || $request->role_id == 6 || $request->role_id == 7) && !in_array($action_plans_row->dept_id, $requested_dept_id)) {
                unset($action_plans[$key]);
            } else {
                $assign_action_plan_user = DB::table('action_plan_assigns')->select('action_plan_assigns.co_owner_id as co_owner', 'users.name as user_name')
                    ->join('users', 'action_plan_assigns.co_owner_id', '=', 'users.id')
                    ->where('users.deleted_at', null)
                    ->where('action_plan_assigns.deleted_at', null)
                    ->where('action_plan_assigns.action_plan_id', $action_plans_row->action_plan_id)->get();
                $action_plans[$key]->assign_action_plan_user = $assign_action_plan_user;
            }
        }
        $action_plans = array_values($action_plans);
        $action_plans_ids = [];
        $result = [];
        foreach ($action_plans as $action_plan_row) {

            $kpi_data = array('kpi_name' => $action_plan_row->kpi_name, 'kpi_id' => $action_plan_row->kpi_id);
            unset($action_plan_row->kpi_name, $action_plan_row->kpi_id);
            if (in_array($action_plan_row->action_plan_id, $action_plans_ids)) {
                foreach ($result as $k => $val) {
                    if ($val->action_plan_id == $action_plan_row->action_plan_id) {
                        array_push($result[$k]->kpi_data, $kpi_data);
                    }
                }
            } else {
                $action_plan_row->kpi_data = array();
                array_push($action_plan_row->kpi_data, $kpi_data);
                array_push($result, $action_plan_row);
            }
            array_push($action_plans_ids, $action_plan_row->action_plan_id);
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "action plan list response";
        $this->apiResponse['data'] = array_reverse($result);
        return $this->sendResponse();
    }
    /**
     * View action plan update comment.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_action_plan_update_comment(Request $request)
    {
        $actionp_edit_comments = DB::table('actionp_edit_comments')->select('action_plans.definition', 'users.name', 'actionp_edit_comments.comment', 'actionp_edit_comments.created_at')
            ->leftjoin('action_plans', 'actionp_edit_comments.action_plan_id', '=', 'action_plans.id')
            ->leftjoin('users', 'actionp_edit_comments.user_id', '=', 'users.id')
            ->where('actionp_edit_comments.deleted_at', null)
            ->where('users.deleted_at', null)
            ->where('action_plans.deleted_at', null)
            ->where('actionp_edit_comments.action_plan_id', $request->action_plan_id)
            ->orderBy('actionp_edit_comments.created_at', 'ASC')
            ->get();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "action plan edit comments list response";
        $this->apiResponse['data'] = $actionp_edit_comments;
        return $this->sendResponse();
    }
    /**
     * Store edit task in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_edit_action_plan(Request $request)
    {
        $request->definition = $request->action_plan_definition;
        if (empty($request->reminder_date)) {
            $review_date = DB::table('company_settings')->select('reminder_date')->where('company_id', $request->company_id)->get();
            $reminder_date = str_replace('/', '-', $review_date[0]->reminder_date);
            $reminder_date = date('d', strtotime($reminder_date));
        } else {
            $reminder_date = str_replace('/', '-', $request->reminder_date);
            $reminder_date = date('d', strtotime($reminder_date));
        }
        $request['reminder_date'] = $reminder_date;
        $get_initiative_dept = DB::table('initiatives')->select('dept_id', 'status', 'end_date')->where('deleted_at', null)->where('id', $request->initiatives_id)->first();
        // start date check to initiatives
        $dateNewStartDate = str_replace('/', '-', $request->start_date);
        $dateNewStartDate = date('Y-m-d', strtotime($dateNewStartDate));
        if ($dateNewStartDate >= $get_initiative_dept->end_date) {
            $message = "Start date should be greather than and equals to to initiative's end date !";
            $errors = "Start date should be greather than and equals to to initiative's end date !";
            return $this->respondValidationError($message, $errors);
        }
        // end date check to initiatives
        $dateNewEndDate = str_replace('/', '-', $request->end_date);
        $dateNewEndDate = date('Y-m-d', strtotime($dateNewEndDate));
        if ($dateNewEndDate >= $get_initiative_dept->end_date) {
            $message = "End date is grater then and equals to to initiatives end date !";
            $errors = "End date is grater then to initiatives end date !";
            return $this->respondValidationError($message, $errors);
        }
        $initiatives_data = DB::table('initiatives')->select('status')->where('id', $request->initiatives_id)->first();
        $request->dept_id = $get_initiative_dept->dept_id;
        $date = date('Y-m-d h:i:s');
        if ($initiatives_data->status == 2) {
            $message = "Permission denied for edit action plan On Hold initiative !";
            $errors = 'Permission denied for edit action plan On Hold initiative !';
            return $this->respondValidationError($message, $errors);
        } else {
            if ($request->status == 6) {
                $ac_pl_status = DB::table('action_plans')->select('previous_status')->where('id', $request->action_plan_id)->first();
                $request->merge([
                    'status' => $ac_pl_status->previous_status,
                ]);
            }
            $insert_id = Module::updateRow("action_plans", $request, $request->action_plan_id);
            //delete kpi and action plan relation
            DB::table('kpi_actionplan_rels')->where('action_plan_id', $insert_id)->delete();
            //action plan and kpi relation data
            $get_s_o_id = DB::table('initiatives')->where('id', $request->initiatives_id)->first();
            if (!empty($request->kpi_id)) {
                $action_plan_data = [];
                for ($i = 0; $i < count($request->kpi_id); $i++) {
                    $action_plan_data[] = array(
                        "kpi_id" => $request->kpi_id[$i],
                        "action_plan_id" => $insert_id,
                    );
                    DB::table('add_kpis')->where('id', $request->kpi_id[$i])->update(['s_o_id' => $get_s_o_id->s_o_id, 'initiatives_id' => $request->initiatives_id]);
                }
                try {
                    $insertid = DB::table('kpi_actionplan_rels')->insert($action_plan_data);
                }
                //catch exception
                 catch (Exception $e) {
                    //$this->apiResponse['status']="Error";
                    $this->apiResponse['message2'] = 'Duplicate entry!';
                }
            }
            $request->merge([
                'action_plan_id' => $insert_id,
            ]);
            $actionp_edit_comments_id = Module::insert("actionp_edit_comments", $request);
            DB::table('action_plan_assigns')->where('action_plan_assigns.action_plan_id', $request->action_plan_id)->update(['deleted_at' => $date]);
            if (isset($request->co_owner)) {
                foreach ($request->co_owner as $key => $co_owner_row) {
                    DB::insert('insert into action_plan_assigns (action_plan_id,co_owner_id,created_at,updated_at) values(?,?,?,?)', [$insert_id, $co_owner_row, $date, $date]);
                }
            }
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully update your action plan!';
            return $this->sendResponse();
        }
    }
    /**
     * delete and task remark data in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_action_plan(Request $request)
    {
        $date = date('Y-m-d h:i:s');
        DB::table('action_plans')->where('id', $request->action_plan_id)->update(['deleted_at' => $date]);
        DB::table('action_plan_assigns')->where('action_plan_id', $request->action_plan_id)->update(['deleted_at' => $date]);
        //    $user = 'ahujamohit327@gmail.com';
        // if (env('MAIL_USERNAME') != null && env('MAIL_USERNAME') != "null" && env('MAIL_USERNAME') != "") {
        //     Mail::send('emails.action_plan_review', ['name' => $user], function ($m) use ($user) {
        //         $m->from(env('MAIL_USERNAME'), 'BussinessPluse');
        //         $m->to($user, 'Admin')->subject('Action plan deleted!');
        //     });
        // }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully delete your action plan!';
        return $this->sendResponse();
    }
    /**
     * Store action_plans in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function api_add_action_plan_schedules(Request $request)
    {
        // return response()->json($request);die;
        $request->owner_id = $request->co_owner_id;
        $action_plan_data = DB::table('action_plans')->where('id', $request->action_plan_id)->first();
        $date = date('Y-m-d h:i:s');
        if ($action_plan_data->status != 2) {
            $insert_id = Module::insert("action_plan_schedules", $request);
            $ttttt = DB::table('action_plan_schedules')->where('id', $insert_id)->get();
            $str_obj_statuses = DB::table('str_obj_statuses')->where('deleted_at', null)->get();

            $str_obj_statuses = DB::table('str_obj_statuses')->where('deleted_at', null)->get();

            foreach ($str_obj_statuses as $key => $row) {
                if ($row->status_name == 'Green') {
                    $status_green = $row->accuracy_percentage;
                } elseif ($row->status_name == 'Yellow') {
                    $status_yellow = $row->accuracy_percentage;
                } elseif ($row->status_name == 'Red') {
                    $status_red = $row->accuracy_percentage;
                }
            }

            $get_action_plan_data = DB::table('action_plans')->where('deleted_at', null)->where('initiatives_id', $action_plan_data->initiatives_id)->get();

            $status_action_plan = 0;
            $updateStatusInitiatives = 0;
            $updateStatusStrategicObjectives = 0;
            foreach ($get_action_plan_data as $key_a11 => $row_a11) {

                /* $action_plan_schedules = DB::table('action_plan_schedules')->where('deleted_at', NULL)->where('action_plan_id', $row_a11->id)->groupBy('owner_id')->get(); */
                $action_plan_schedules = DB::table('action_plan_schedules')->where('deleted_at', null)->where('action_plan_id', $row_a11->id)->get();

                if (!empty($action_plan_schedules)) {
                    $count_action_plan = 0;
                    $total_action_plan_schedule_status = count($action_plan_schedules);
                    if ($total_action_plan_schedule_status < 1) {
                        $total_action_plan_schedule_status = 1;
                    }
                    $total_action_plan_schedule_status_div = (round(100 / $total_action_plan_schedule_status, 1));
                    static $action_plan_object_size = 0;
                    foreach ($action_plan_schedules as $key_a12 => $row_a12) {
                        $lastUpdatedRow = DB::table('action_plan_schedules')->where('deleted_at', null)->where('action_plan_id', $row_a11->id)->where('owner_id', $row_a12->owner_id)->orderBy('id', 'DESC')->first();

                        $action_plan_object_size = $action_plan_object_size + 1;
                        if ($lastUpdatedRow->status == 3) {
                            $count_action_plan += ($total_action_plan_schedule_status_div * $status_green) / 100;
                        } elseif ($lastUpdatedRow->status == 4) {
                            $count_action_plan += ($total_action_plan_schedule_status_div * $status_yellow) / 100;
                        } else {
                            $count_action_plan += ($total_action_plan_schedule_status_div * ($status_red - 1)) / 100;
                        }
                    }

                    $total_per_action_plan = $count_action_plan;
                    $count_action_plan = round($total_per_action_plan, 0, PHP_ROUND_HALF_UP);
                    if ($count_action_plan >= $status_green) {
                        $status_action_plan = 3;
                    } elseif ($count_action_plan >= $status_yellow) {
                        $status_action_plan = 4;
                    } else {
                        $status_action_plan = 5;
                    }
                    DB::table('action_plans')->where('id', $row_a11->id)->update([
                        'status' => $status_action_plan,
                        'previous_status' => $status_action_plan,
                        'percentage' => $count_action_plan,
                        'updated_at' => $date,
                    ]);
                    DB::insert('insert into action_plan_statuses (action_plan_id,status_id,percentage,created_at,updated_at) values(?,?,?,?,?)', [$row_a11->id, $status_action_plan, $count_action_plan, $date, $date]);
                }
            }
            $get_action_plan_data = DB::table('action_plans')->where('deleted_at', null)->where('initiatives_id', $action_plan_data->initiatives_id)->get();

            $count_initiatives = 0;
            $total_action_plan_ini_count = count($get_action_plan_data);
            if ($total_action_plan_ini_count < 1) {
                $total_action_plan_ini_count = 1;
            }
            $total_action_plan_ini_div = (round(100 / $total_action_plan_ini_count, 1));
            static $inciative_object_size = 0;
            foreach ($get_action_plan_data as $key_bb11 => $row_bb11) {
                $inciative_object_size = $inciative_object_size + 1;
                if ($row_bb11->status == 3) {
                    $count_initiatives += ($total_action_plan_ini_div * $status_green) / 100;
                } elseif ($row_bb11->status == 4) {
                    $count_initiatives += ($total_action_plan_ini_div * $status_yellow) / 100;
                } else {
                    $count_initiatives += ($total_action_plan_ini_div * ($status_red - 1)) / 100;
                }
            }
            $count_initiatives_percent = $count_initiatives/* /$inciative_object_size */;
            $count_initiatives = round($count_initiatives_percent, 0, PHP_ROUND_HALF_UP);
            if ($count_initiatives >= $status_green) {
                $updateStatusInitiatives = 3;
                // print_r( $updateStatusInitiatives);
            } elseif ($count_initiatives >= $status_yellow) {
                $updateStatusInitiatives = 4;
                // print_r( $updateStatusInitiatives);
            } else {
                $updateStatusInitiatives = 5;
                // print_r( $updateStatusInitiatives);
            }
            DB::table('initiatives')->where('id', $action_plan_data->initiatives_id)->update([
                'status' => $updateStatusInitiatives,
                'previous_status' => $updateStatusInitiatives,
                'percentage' => $count_initiatives,
                'updated_at' => $date,
            ]);
            DB::insert('insert into initiatives_statuses (initiative_id,status_id,percentage,created_at,updated_at) values(?,?,?,?,?)', [$action_plan_data->initiatives_id, $updateStatusInitiatives, $count_initiatives, $date, $date]);
            //update status strategic objectives
            $initiatives_id = DB::table('initiatives')->where('deleted_at', null)->where('id', $action_plan_data->initiatives_id)->first();
            $initiatives_data = DB::table('initiatives')
                ->where('deleted_at', null)
                ->where('s_o_id', $initiatives_id->s_o_id)
                ->get();
            $total_initiatives = count($initiatives_data);
            $total_initiatives_div = (round(100 / $total_initiatives, 1));
            $counter = 0;
            static $inciative_Object_Size = 0;
            foreach ($initiatives_data as $key_aaa11 => $row_aaa11) {
                $inciative_Object_Size = $inciative_Object_Size + 1;
                if ($row_aaa11->status == 3) {
                    $counter += ($total_initiatives_div * $status_green) / 100;
                } elseif ($row_aaa11->status == 4) {
                    $counter += ($total_initiatives_div * $status_yellow) / 100;
                } else {
                    $counter += ($total_initiatives_div * ($status_red - 1)) / 100;
                }
            }
            $count_initiatives_percent = $counter/* /$inciative_Object_Size */;
            $counter = round($count_initiatives_percent, 0, PHP_ROUND_HALF_UP);
            if ($counter >= $status_green) {
                $updateStatusStrategicObjectives = 3;
                // print_r( $updateStatusStrategicObjectives);
            } elseif ($counter >= $status_yellow) {
                $updateStatusStrategicObjectives = 4;
                // print_r( $updateStatusStrategicObjectives);
            } else {
                $updateStatusStrategicObjectives = 5;
                // print_r( $updateStatusStrategicObjectives);
            }
            DB::table('strategic_objectives')->where('id', $initiatives_id->s_o_id)->update([
                'status' => $updateStatusStrategicObjectives,
                'previous_status' => $updateStatusStrategicObjectives,
                'percentage' => $counter,
                'updated_at' => $date,
            ]);
            DB::insert('insert into strategic_obj_statuses (s_o_id,status_id,percentage,created_at,updated_at) values(?,?,?,?,?)', [$initiatives_id->s_o_id, $updateStatusStrategicObjectives, $counter, $date, $date]);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully update your action plan schedules!';
            return $this->sendResponse();
        } else {
            $message = "Permission denied for this action plan schedules this action paln is hold !";
            $errors = 'Permission denied for this action plan schedules this action paln is hold !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /**
     * View strategic objectives to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function action_plan_schedules_user(Request $request)
    {
        $action_plan_schedules = DB::table('action_plan_schedules')->select('action_plan_schedules.month_date', 'action_plan_schedules.comment', 'action_plan_schedules.recovery_plan', 'action_plan_schedules.implement_data', 'action_plan_schedules.owner_id as co_owner_id', 'action_plan_schedules.status', 'str_obj_statuses.status_name', 'action_plan_schedules.responsibility as responsibility_id', 'employers.name as responsibility_name', 'emp.name as co_owner_name', 'action_plans.definition', 'initiatives.definition')
            ->leftjoin('str_obj_statuses', 'action_plan_schedules.status', '=', 'str_obj_statuses.id')
            ->leftjoin('employers', 'action_plan_schedules.responsibility', '=', 'employers.id')
            ->leftjoin('employers as emp', 'action_plan_schedules.owner_id', '=', 'emp.id')
            ->leftjoin('action_plans', 'action_plan_schedules.action_plan_id', '=', 'action_plans.id')
            ->leftjoin('initiatives', 'action_plans.initiatives_id', '=', 'initiatives.id')
            ->where('str_obj_statuses.deleted_at', null)
            ->where('action_plan_schedules.deleted_at', null)
            ->where('action_plan_schedules.owner_id', $request->co_owner_id)
            ->where('action_plan_schedules.action_plan_id', $request->action_plan_id)
            ->get();

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "action plan user schedule list response";
        $this->apiResponse['data'] = array_reverse($action_plan_schedules);
        return $this->sendResponse();
    }
    /**
     * View strategic objectives to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_action_plan_schedule_data(Request $request)
    {
        $getDate = $this->getFinancialDate($request['fyear'] ? $request['fyear'] : '', $request['year']);
        $start_date = $getDate['start_date'];
        $end_date = $getDate['end_date'];

        $action_plans = DB::table('action_plans')->select('action_plans.id as action_plans_id','action_plans.sr_no as action_plans_sr_no', 'action_plans.definition', 'action_plans.target', 'action_plans.start_date', 'action_plans.end_date', 'action_plans.reminder_date', 'action_plans.control_point', 'action_plans.co_owner', 'action_plans.status', 'action_plans.initiatives_id', 'action_plans.user_id', 'users.name as co_owner_name')
            ->leftjoin('users', 'action_plans.co_owner', '=', 'users.id')
            ->where('users.deleted_at', null)
            ->where('action_plans.deleted_at', null)
            ->where('action_plans.id', $request->action_plan_id)
            ->get();
        foreach ($action_plans as $key_a11 => $row_a11) {
            $action_plans_assign_user = DB::table('action_plan_assigns')->select('action_plan_assigns.action_plan_id', 'action_plan_assigns.co_owner_id', 'users.name as user_name')
                ->leftjoin('users', 'action_plan_assigns.co_owner_id', '=', 'users.id')
                ->where('action_plan_assigns.deleted_at', null)
                ->where('users.deleted_at', null)
                ->where('action_plan_assigns.action_plan_id', $row_a11->action_plans_id)
                ->get();

            foreach ($action_plans_assign_user as $key_b11 => $row_b11) {
                $action_plan_schedules = DB::table('action_plan_schedules')->select('action_plan_schedules.id as schedule_id', 'action_plan_schedules.month_date', 'action_plan_schedules.comment', 'action_plan_schedules.review_month_date', 'action_plan_schedules.recovery_plan', 'action_plan_schedules.implement_data', 'action_plan_schedules.owner_id as co_owner_id', 'action_plan_schedules.status', 'str_obj_statuses.status_name', 'action_plan_schedules.responsibility as responsibility_id', 'employers.name as responsibility_name', 'emp.name as co_owner_name')
                    ->leftjoin('str_obj_statuses', 'action_plan_schedules.status', '=', 'str_obj_statuses.id')
                    ->leftjoin('employers', 'action_plan_schedules.responsibility', '=', 'employers.id')
                    ->leftjoin('employers as emp', 'action_plan_schedules.owner_id', '=', 'emp.id')
                    ->where('str_obj_statuses.deleted_at', null)
                    ->where('action_plan_schedules.deleted_at', null)
                //->whereYear('action_plan_schedules.month_date', '=', $request->year)
                    ->where('action_plan_schedules.action_plan_id', $row_b11->action_plan_id)
                    ->where('action_plan_schedules.owner_id', $row_b11->co_owner_id)
                    ->where(function ($q) use ($start_date, $end_date) {
                        $q->whereBetween('action_plan_schedules.month_date', [$start_date, $end_date])
                            ->orwhereBetween('action_plan_schedules.month_date', [$start_date, $end_date])
                            ->orwhere(function ($p) use ($start_date, $end_date) {
                                $p->where('action_plan_schedules.month_date', '<=', $start_date)
                                    ->where('action_plan_schedules.month_date', '>=', $end_date);
                            });
                    })
                    ->get();

                $action_plans_assign_user[$key_b11]->schedules = $action_plan_schedules;
            }
            $action_plans[$key_a11]->action_plans_assign_user = $action_plans_assign_user;
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "action plan list response";
        $this->apiResponse['data'] = $action_plans;
        return $this->sendResponse();
    }
    /**
     * View strategic objectives to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */ 
    public function api_action_plan_comment(Request $request)
    {
        $current_year = date("Y");
        $action_plan_data = DB::table('action_plans')->select(
            'action_plans.sr_no as action_plans_sr_no',
            'action_plans.id as action_plan_id',
            'action_plans.definition as definition',
            'action_plans.target',
            'action_plans.initiatives_id',
            'action_plans.start_date',
            'str_obj_statuses.status_name',
            'action_plans.percentage',
            'action_plans.end_date',
            'action_plans.reminder_date',
            'action_plans.control_point',
            'initiatives.definition as initiatives_definition',
            'initiatives.sr_no as initiatives_sr_no',
            'department_masters.id as dept_id',
            'department_masters.dept_name',
            'strategic_objectives.id as so_id',
            'strategic_objectives.description as strategic_objectives_description',
            'strategic_sno_cmpnies.s_no as strategic_objectives_sr_no'
        )
            ->leftjoin('initiatives', 'action_plans.initiatives_id', '=', 'initiatives.id')
            ->leftjoin('str_obj_statuses', 'action_plans.status', '=', 'str_obj_statuses.id')
            ->leftjoin('strategic_sno_cmpnies', 'initiatives.s_o_id', '=', 'strategic_sno_cmpnies.s_o_id')
            ->leftjoin('strategic_objectives', 'initiatives.s_o_id', '=', 'strategic_objectives.id')
            ->leftjoin('department_masters', 'strategic_objectives.department_id', '=', 'department_masters.id')
            ->where('action_plans.id', $request->action_plan_id)
            ->first();

        if (!empty($action_plan_data)) {
            $action_plans_assign_user = DB::table('action_plan_assigns')->select('action_plan_assigns.action_plan_id', 'action_plan_assigns.co_owner_id', 'users.name as user_name')
                ->leftjoin('users', 'action_plan_assigns.co_owner_id', '=', 'users.id')
                ->where('action_plan_assigns.deleted_at', null)
                ->where('users.deleted_at', null)
                ->where('action_plan_assigns.action_plan_id', $action_plan_data->action_plan_id)
                ->get();
            foreach ($action_plans_assign_user as $acu_key => $acu_row) {
                $action_plan_schedules = DB::table('action_plan_schedules')->select(
                    'action_plan_schedules.id as schedule_id',
                    'action_plan_schedules.month_date',
                    'action_plan_schedules.comment',
                    'action_plan_schedules.recovery_plan',
                    'action_plan_schedules.implement_data',
                    'action_plan_schedules.review_month_date',
                    'action_plan_schedules.owner_id as co_owner_id',
                    'action_plan_schedules.status',
                    'str_obj_statuses.status_name',
                    'action_plan_schedules.responsibility as responsibility_id',
                    'employers.name as responsibility_name',
                    'emp.name as co_owner_name'
                )
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
            $action_plan_data->action_plans_assign_user = $action_plans_assign_user;
            $action_plan_comment = DB::table('actionp_edit_comments')->select(
                'users.name as comment_user_name',
                'actionp_edit_comments.user_id',
                'actionp_edit_comments.comment',
                'actionp_edit_comments.action_plan_id',
                'actionp_edit_comments.created_at as review_date',
                'action_plans.sr_no as action_plans_sr_no'
            )
                ->leftjoin('action_plans', 'actionp_edit_comments.action_plan_id', '=', 'action_plans.id')
                ->leftjoin('users', 'actionp_edit_comments.user_id', '=', 'users.id')
                ->where('actionp_edit_comments.action_plan_id', $action_plan_data->action_plan_id)
                ->get();
            $action_plan_data->action_plan_comment = $action_plan_comment;
            $action_plan_kpi = DB::table('kpi_actionplan_rels')->select('kpi_actionplan_rels.kpi_id', 'kpi_actionplan_rels.action_plan_id')
                ->where('kpi_actionplan_rels.action_plan_id', $action_plan_data->action_plan_id)->get();
            if (!empty($action_plan_kpi)) {
                foreach ($action_plan_kpi as $key => $kpi_row) {
                    $action_plan_kpi_data = DB::table('add_kpis')->select('add_kpis.id as kpi_id', 'add_kpis.kpi_name', 'add_kpis.ideal_trend')
                        ->where('id', $kpi_row->kpi_id)
                        ->where('deleted_at', null)
                        ->get();
                    $date = date('Y');
                    $year_range = [$date];
                    for ($i = 1; $i <= 4; $i++) {
                        array_push($year_range, $date - $i);
                    }
                    foreach ($action_plan_kpi_data as $key4 => $row_bf_ty) {
                        $kpi_targets_yr = DB::table('kpi_targets')->select('id as target_id', 'ytd', 'target_year', 'kpi_id', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec')
                            ->where('kpi_targets.kpi_id', $row_bf_ty->kpi_id)
                            ->where('kpi_targets.target_year', '<=', $date)
                            ->where('kpi_targets.target_year', '>=', ($date - 4))
                            ->get();
                        if (count($kpi_targets_yr) > 0) {
                            foreach ($kpi_targets_yr as $key_a => $kpi_a) {
                                $total_avg = 0;
                                foreach ($kpi_targets_yr as $key_b => $kpi_b) {
                                    if ($kpi_a->target_year == ($kpi_b->target_year - 1)) {
                                        $total_avg = round(($kpi_a->apr + $kpi_a->may + $kpi_a->jun + $kpi_a->jul + $kpi_a->aug + $kpi_a->sep + $kpi_a->oct + $kpi_a->nov + $kpi_a->dec + $kpi_b->jan + $kpi_b->feb + $kpi_b->mar) / 12);
                                        $action_plan_kpi_data[$key4]->kpi_targets[] = array("kpi_id" => $kpi_a->kpi_id, "target_year" => $kpi_a->target_year, "avg" => $total_avg);
                                    }
                                    $index = array_search($kpi_b->target_year, $year_range);
                                    if ($index >= 0) {
                                        unset($year_range[$index]);
                                    }
                                }
                                if ($kpi_a->target_year == $date) {
                                    $action_plan_kpi_data[$key4]->kpi_targets[] = $kpi_a;
                                    $action_plan_kpi_data[$key4]->has_kpi_target = true;
                                } else {
                                    $action_plan_kpi_data[$key4]->has_kpi_target = false;
                                }
                                if (count($year_range) > 0 && $key_a == 0) {
                                    foreach ($year_range as $year) {
                                        $action_plan_kpi_data[$key4]->kpi_targets[] = array("kpi_id" => $kpi_a->kpi_id, "target_year" => $year, "avg" => 0);
                                    }
                                }
                            }
                        } else {
                            $action_plan_kpi_data[$key4]->kpi_targets = array();
                            if (count($year_range) > 0) {
                                foreach ($year_range as $year) {
                                    array_push($action_plan_kpi_data[$key4]->kpi_targets, array("kpi_id" => $row_bf_ty->kpi_id, "target_year" => $year, "avg" => 0));
                                }
                            }
                        }
                    }
                    // $action_plan_data->kpi_targets_yr = $kpi_targets_yr;
                    $year_ranges = [$date];

                    for ($j = 1; $j <= 4; $j++) {
                        array_push($year_ranges, $date - $j);
                    }
                    foreach ($action_plan_kpi_data as $key6 => $row_bf_ay) {
                        $kpi_actuals_yr = DB::table('kpi_actuals')->select('id as actual_id', 'actual_year', 'kpi_id', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'ytd')
                            ->where('kpi_actuals.kpi_id', $row_bf_ay->kpi_id)
                            ->where('kpi_actuals.actual_year', '<=', $date)
                            ->where('kpi_actuals.actual_year', '>=', ($date - 4))
                            ->get();

                        if (count($kpi_actuals_yr) > 0) {
                            foreach ($kpi_actuals_yr as $key_act_a => $kpi_act_a) {
                                $kpi_actual_review_data1 = DB::table('kpi_actual_latentries')->select('id', 'months', 'kpi_id', 'status')->where('kpi_id', $kpi_act_a->kpi_id)->where('deleted_at', null)->get();

                                $total_avg = 0;
                                foreach ($kpi_actuals_yr as $key_act_b => $kpi_act_b) {
                                    if ($kpi_act_a->actual_year == ($kpi_act_b->actual_year - 1)) {
                                        $total_avg = round(($kpi_act_a->apr + $kpi_act_a->may + $kpi_act_a->jun + $kpi_act_a->jul + $kpi_act_a->aug + $kpi_act_a->sep + $kpi_act_a->oct + $kpi_act_a->nov + $kpi_act_a->dec + $kpi_act_b->jan + $kpi_act_b->feb + $kpi_act_b->mar) / 12);
                                        $action_plan_kpi_data[$key6]->kpi_actuals[] = array("kpi_id" => $kpi_act_a->kpi_id, "actual_year" => $kpi_act_a->actual_year, "avg" => $total_avg);
                                    }
                                    $index = array_search($kpi_act_b->actual_year, $year_ranges);
                                    if ($index >= 0) {
                                        unset($year_ranges[$index]);
                                    }
                                }
                                if ($kpi_act_a->actual_year == $date) {
                                    $action_plan_kpi_data[$key6]->kpi_actuals[] = $kpi_act_a;
                                    $action_plan_kpi_data[$key6]->has_kpi_actual = true;
                                } else {
                                    $action_plan_kpi_data[$key6]->has_kpi_actual = false;
                                }
                                if (count($year_ranges) > 0 && $key_act_a == 0) {
                                    foreach ($year_ranges as $years) {
                                        $action_plan_kpi_data[$key6]->kpi_actuals[] = array("kpi_id" => $kpi_act_a->kpi_id, "actual_year" => $years, "avg" => 0);
                                    }
                                }
                            }
                            $kpi_actuals_yr[0]->late_review = $kpi_actual_review_data1;
                            $row_bf_ay->late_review2 = $kpi_actual_review_data1;
                        } else {
                            $action_plan_kpi_data[$key6]->kpi_actuals = array();
                            if (count($year_ranges) > 0) {
                                foreach ($year_ranges as $years) {
                                    array_push($action_plan_kpi_data[$key6]->kpi_actuals, array("kpi_id" => $row_bf_ay->kpi_id, "actual_year" => $years, "avg" => 0));
                                }
                            }
                        }
                    }
                    $action_plan_data->action_plan_kpi_data[] = $action_plan_kpi_data[0];
                }
            } else {
                $action_plan_data->action_plan_kpi_data = [];
            }
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "action plan list response";
        $this->apiResponse['data'] = $action_plan_data;
        return $this->sendResponse();
    }
    /**
     * Get User List Acc Dept
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_get_user_list_dept_wise(Request $request)
    {

        $userList = DB::table('employers')->select('name', 'user_id', 'multi_dept_id')
            ->whereRaw("FIND_IN_SET(" . $request->dept_id . ",employers.multi_dept_id)")
            ->whereRaw("FIND_IN_SET(" . $request->unit_id . ",employers.multi_unit_id)")
            ->where('company_id', $request->company_id)
            ->get();

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "user list acc. dept wise";
        $this->apiResponse['data'] = $userList;
        return $this->sendResponse();
    }
}

