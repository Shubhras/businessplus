<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiKpiTraits;
use App\Models\Action_plan;
use App\Models\Kpi_target;
use App\Models\Login_access_token;
use Carbon\Carbon;
use DateTime;
use DB;
use Dwij\Laraadmin\Models\Module;
use Exception;
use Illuminate\Http\Request;
use Mail;

class ApiKpiController extends ResponseApiController
{
    use ApiKpiTraits;

    public function __construct()
    {
        $this->auth = new Login_access_token();
    }
    /**
     * Get kpi in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function api_get_kpi(Request $request)
    {
        $kpi_data = DB::table('add_kpis')->select('id as kpi_id', 'kpi_name')
            ->where('deleted_at', null)
            ->where('unit_id', $request->unit_id)
            ->where('department_id', $request->dept_id)
            ->get();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "kpi list response";
        $this->apiResponse['data'] = $kpi_data;
        return $this->sendResponse();
    }
    /**
     * Get kpi to action plan in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_get_kpi_to_action_plan(Request $request)
    {
        $kpi_id = json_decode($request->kpi_id);
        $kpi_data = DB::table('add_kpis')->select('id as kpi_id', 'kpi_name', 'target_range_min as target as year_and_target')
            ->where('deleted_at', null)
            ->where('unit_id', $request->unit_id)
            ->whereIn('id', $kpi_id)
            ->get();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "kpi list response";
        $this->apiResponse['data'] = $kpi_data;
        return $this->sendResponse();
    }
    /*add KPI Trackers*/
    /**
     * Store KPI Trackers in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_kpi_trackers(Request $request)
    {
        DB::beginTransaction();
        if (!empty($request)) {
            $target = $this->KpiTargetCondition($request);
            $request->merge(['target_range_min' => $target, 'ytd' => $target, 'year_end' => $target]);
            if (!empty($request['kpi_id'])) {
                try {
                    $Target_data = Kpi_target::where('id', $request['kpi_id'])->where('target_year', $request['target_year'])->get()->toArray();
                    if (empty($Target_data)) {
                        DB::table('add_kpis')->where('id', $request['kpi_id'])->update(['end_date' => $request['end_date']]);
                        $request['kpi_id'] = $request['kpi_id'];
                        Module::insert("kpi_targets", $request);
                        //$request['target_year'] Target Year Take As Actual Year.
                        $request->merge($this->defaultActuals($request['target_year']));
                        Module::insert("kpi_actuals", $request);
                        if (!empty($request->action_plan_id)) {
                            $kpi_data = [];
                            for ($i = 0; $i < count($request->action_plan_id); $i++) {
                                $kpi_data[] = array(
                                    "action_plan_id" => $request->action_plan_id[$i],
                                    "kpi_id" => $request['kpi_id'],
                                );
                            }
                            DB::table('kpi_actionplan_rels')->insert($kpi_data);
                        }
                    }
                    DB::commit();
                    $this->apiResponse['status'] = "success";
                    $this->apiResponse['message'] = 'Successfully save your kpi!';
                    return $this->sendResponse();
                } catch (\Exception $e) {
                    $this->apiResponse['message'] = $e->getMessage();
                }
            } else {
                try {
                    // dump('in else',$target);die;
                    $kpi_id = Module::insert("add_kpis", $request);
                    $request['kpi_id'] = $kpi_id;
                    Module::insert("kpi_targets", $request);
                    //$request['target_year'] Target Year Take As Actual Year.
                    $request->merge($this->defaultActuals($request['target_year']));
                    Module::insert("kpi_actuals", $request);
                    if (!empty($request->action_plan_id)) {
                        $kpi_data = [];
                        for ($i = 0; $i < count($request->action_plan_id); $i++) {
                            $kpi_data[] = array(
                                "action_plan_id" => $request->action_plan_id[$i],
                                "kpi_id" => $kpi_id,
                            );
                        }
                        DB::table('kpi_actionplan_rels')->insert($kpi_data);
                    }
                    DB::commit();
                    $this->apiResponse['status'] = "success";
                    $this->apiResponse['message'] = 'Successfully save your kpi!';
                    return $this->sendResponse();
                } catch (\Exception $e) {
                    DB::rollback();
                    $this->apiResponse['message'] = $e->getMessage();
                }
            }
        }
    }
    /**
     * View KPI Trackers to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_kpi_trackers(Request $request)
    {
        // dump($request);
        if ($request['fyear'] == 'april-march') {
            $start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
        } else {
            $start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        }

        $requested_dept_id = explode(',', $request->dept_id);

        $add_kpis_data = DB::table('add_kpis')->select('add_kpis.id as kpi_id', 'add_kpis.start_date', 'add_kpis.end_date', 'add_kpis.kpi_name', 'units.id as unit_id', 'units.unit_name', 'add_kpis.department_id', 'department_masters.dept_name', 'add_kpis.section_id', 'sections.section_name', 'add_kpis.ideal_trend', 'add_kpis.unit_of_measurement', 'u_o_ms.name as u_o_m_name', 'add_kpis.target_range_min', 'add_kpis.target_range_max', 'add_kpis.kpi_definition', 'users.id as user_id', 'users.name as user_name', 'add_kpis.lead_kpi', 'action_plans.definition as action_plan_def', 'action_plans.id as action_plan_id', 'add_kpis.frequency', 'add_kpis.kpi_performance', 'add_kpis.s_o_id', 'add_kpis.initiatives_id', 'add_kpis.performance_dash', 'add_kpis.target_condition')
            ->join('units', 'add_kpis.unit_id', '=', 'units.id')
            ->join('department_masters', 'add_kpis.department_id', '=', 'department_masters.id')
            ->join('sections', 'add_kpis.section_id', '=', 'sections.id')
            ->leftjoin('kpi_actionplan_rels', 'kpi_actionplan_rels.kpi_id', '=', 'add_kpis.id')
            ->leftjoin('action_plans', 'action_plans.id', '=', 'kpi_actionplan_rels.action_plan_id')
            ->join('users', 'add_kpis.user_id', '=', 'users.id')
            ->leftjoin('u_o_ms', 'add_kpis.unit_of_measurement', '=', 'u_o_ms.id')
            ->where('add_kpis.deleted_at', null)
        // ->where(function ($r) {
        //     $r->where('action_plans.deleted_at', '=', null);
        //         // ->where('add_kpis.end_date', '>=', $end_date);
        // })

            ->where('add_kpis.unit_id', $request->unit_id)
            // ->whereIn('add_kpis.department_id', $requested_dept_id)
            ->orderBy('add_kpis.id', 'desc')
            ->where(function ($q) use ($start_date, $end_date) {
                $q->whereBetween('add_kpis.start_date', [$start_date, $end_date])
                    ->orwhereBetween('add_kpis.end_date', [$start_date, $end_date])
                    ->orwhere(function ($p) use ($start_date, $end_date) {
                        $p->where('add_kpis.start_date', '<=', $start_date)
                            ->where('add_kpis.end_date', '>=', $end_date);
                    });
            })->get();

        $kpi_ids = [];
        $result = [];

        foreach ($add_kpis_data as $key => $kpi) {
            if (($request->role_id == 5 || $request->role_id == 6 || $request->role_id == 7 ) && !in_array($kpi->department_id, $requested_dept_id)) {
                unset($add_kpis_data[$key]);
            } else {
            $action_plan = array('def' => $kpi->action_plan_def, 'action_plan_id' => $kpi->action_plan_id);
            unset($kpi->action_plan_def, $kpi->action_plan_id);
            if (in_array($kpi->kpi_id, $kpi_ids)) {
                foreach ($result as $k => $val) {
                    if ($val->kpi_id == $kpi->kpi_id) {
                        array_push($result[$k]->action_plans, $action_plan);
                    }
                }
            } else {
                $kpi->action_plans = array();
                array_push($kpi->action_plans, $action_plan);
                array_push($result, $kpi);
            }
            array_push($kpi_ids, $kpi->kpi_id);
            }
        }
        unset($key, $kpi);
        $result = array_values($result);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "KPI Trackers data list response";
        $this->apiResponse['data'] = $result;
        return $this->sendResponse();
    }
    /**
     * Store edit api_target_actual_update in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_target_actual_update(Request $request)
    {
        // dump($request);die;
        $kpi_comment_value = DB::table('kpi_comments')->where('kpi_id', $request->kpi_id)->where('year', $request->year)
            ->where('deleted_at', null)
            ->get();

        if (empty($kpi_comment_value)) {
            foreach ($request['data'] as $key => $comment_data) {
                DB::table('kpi_comments')->insert(['kpi_id' => $comment_data['kpi_id'], 'year' => $comment_data['year'], 'month' => $comment_data['month'], 'comment' => $comment_data['comment'], 'recovery_plan' => $comment_data['recovery_plan'], 'responsibility' => $comment_data['responsibility'], 'target_date' => $comment_data['target_date'], 'status' => $comment_data['status']]);
                // insert late entry
                if ($comment_data['late_entry'] == 'true') {
                    DB::table('kpi_actual_latentries')->insert(['kpi_id' => $comment_data['kpi_id'], 'months' => $comment_data['month'], 'created_at' => $comment_data['entrydate'], 'status' => $comment_data['late_entry']]);
                }
            }

        } else {
            foreach ($request['data'] as $ckey => $comment_data) {
                DB::table('kpi_comments')
                    ->where('id', $comment_data['comment_id'])
                    ->where('year', $comment_data['year'])
                    ->where('month', $comment_data['month'])
                    ->update(['kpi_id' => $comment_data['kpi_id'], 'year' => $comment_data['year'], 'month' => $comment_data['month'], 'comment' => $comment_data['comment'], 'recovery_plan' => $comment_data['recovery_plan'], 'responsibility' => $comment_data['responsibility'], 'target_date' => $comment_data['target_date'], 'status' => $comment_data['status']]);

                if ($comment_data['late_entry'] == 'true') {
                    $lateentry_actual_data = DB::table('kpi_actual_latentries')->select('id', 'months', 'kpi_id', 'status')->where('id', $request['data'][$ckey]['lateentry_id'])->first();

                    if ($request['data'][$ckey]['lateentry_id'] != null) {
                        DB::table('kpi_actual_latentries')
                            ->where('id', $request['data'][$ckey]['lateentry_id'])
                            ->update(['kpi_id' => $comment_data['kpi_id'], 'months' => $comment_data['month'], 'updated_at' => $comment_data['entrydate'], 'status' => $comment_data['late_entry']]);
                    } else {
                        DB::table('kpi_actual_latentries')->insert(['kpi_id' => $comment_data['kpi_id'], 'months' => $comment_data['month'], 'created_at' => $comment_data['entrydate'], 'status' => $comment_data['late_entry']]);
                    }
                }
            }
        }
        $kpi_data = DB::table('add_kpis')->select('target_condition')->where('id', $request->kpi_id)->first();
        $kpi_actual_data = DB::table('kpi_actuals')->select('jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec')
            ->where('kpi_id', $request->kpi_id)
            ->first();
        // dump($kpi_data->target_condition);
        if ($request['action'] == 'Target') {
            $today = Carbon::now();
            $date_month = $today->format('M');

            $year_end11 = $this->KpiTargetYearEndCondition($request);

            DB::table('kpi_targets')->where('kpi_id', $request->kpi_id)->where('target_year', $request['targetData']['target_year'])->update(['year_end' => $year_end]);

            if (!empty($request['targetData']['target_id']) && !empty($request['targetData']['target_year'])) {
                $count1 = 0;
                $sum1 = 0;
                $lastmonth;
                $temptarget = $kpi_actual_data;
                $temptarget1 = [];

                $temptarget1 = $request;
                $temptarget2 = $temptarget1->except(['targetData.target_id', 'targetData.target_year']);
                // fetch actual filled months
                $targetmonths = DB::table('kpi_actuals')
                    ->select('jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec')
                    ->where('kpi_id', $request['targetData']['target_id'])
                    ->first();
                $data23 = [];
                foreach ($targetmonths as $k1 => $avalue) {
                    if ($avalue != null) {
                        $data23[$k1] = $k1;
                    }
                }
                // When we hit target but all actuals are null
                if (empty($data23)) {
                    // dump()
                    $target = $this->UpdateTargetActuallNull($request);

                } else {
                    // dump('else', $data23);die;

                    foreach ($temptarget2['targetData'] as $k2 => $tvalue) {

                        if ($tvalue != null) {
                            $temptarget2[$k2]->val = $k2;
                            //   dump('tvalue', $tvalue);
                            foreach ($data23 as $k3 => $tempmonth) {
                                if ($temptarget2[$k2]->val == $tempmonth) {
                                    $count1 = $count1 + 1;
                                    $sum1 = $sum1 + $tvalue;
                                    $lastmonth = $tvalue;
                                }
                            }
                        }
                    }

                    // if (empty($request['actualData']['actual_id']) && empty($request['actualData']['actual_year'])) {
                    //     dump('hhhh');
                    //     foreach ($temptarget2['targetData'] as $k22 => $ttvalue) {
                    //         if ($ttvalue != null) {
                    //             $count1 = $count1 + 1;
                    //
                    //             $sum1 = $sum1 + $ttvalue;
                    //             $lastmonth = $ttvalue;
                    //             //  dump ($temptarget2[$k2]->value);
                    //         }
                    //     }
                    //     // dump($sum);
                    // }

                    if ($kpi_data->target_condition == "sum_up_all") {
                        $target = $sum1;
                        $target = round($target, 1);
                    } elseif ($kpi_data->target_condition == "average") {

                        $target = $sum1 / $count1;
                        $target = round($target, 1);
                    } else {
                        $target = $lastmonth;
                        $target = round($target, 1);
                    }
                }
                $temp_data = $request['targetData'];
                $temp_data['target_range_min'] = $target;
                $temp_data['ytd'] = $target;
                $request['targetData'] = $temp_data;

                DB::table('kpi_targets')
                    ->where('id', $request['targetData']['target_id'])
                    ->update(['kpi_id' => $request['kpi_id'], 'target_year' => $request['targetData']['target_year'], 'jan' => $request['targetData']['jan'], 'feb' => $request['targetData']['feb'], 'mar' => $request['targetData']['mar'], 'apr' => $request['targetData']['apr'], 'may' => $request['targetData']['may'], 'jun' => $request['targetData']['jun'], 'jul' => $request['targetData']['jul'], 'aug' => $request['targetData']['aug'], 'sep' => $request['targetData']['sep'], 'oct' => $request['targetData']['oct'], 'nov' => $request['targetData']['nov'], 'dec' => $request['targetData']['dec'], 'ytd' => $request['targetData']['ytd'], 'target_condition' => $kpi_data->target_condition, 'user_id' => $request['targetData']['user_id'], 'year_end' => $year_end11]);

                DB::table('add_kpis')
                    ->where('id', $request['kpi_id'])
                    ->update(['target_range_min' => $target]);

            }
        } else {
            //update actual
            if (!empty($request['actualData']['actual_id']) && !empty($request['actualData']['actual_year'])) {
                // dump('update', $request);
                $count = 0;
                $sum = 0;
                $lastvalue;
                $tactual = $request;
                $tactual1 = $tactual->except(['actualData.actual_id', 'actualData.actual_year']);

                foreach ($tactual1['actualData'] as $k1 => $avalue) {
                    if ($avalue != null) {
                        $count = $count + 1;
                        $sum = $sum + $avalue;
                        $lastvalue = $avalue;
                    }
                }
                if ($kpi_data->target_condition == "sum_up_all") {

                    $target = $sum;
                    $target = round($target, 1);
                } elseif ($kpi_data->target_condition == "average") {
                    $target = $sum / $count;
                    $target = round($target, 1);
                } else {
                    // $target = $request['actualData']['dec'];
                    $target = $lastvalue;
                    $target = round($target, 1);
                }
                $temp_data = $request['actualData'];
                // $temp_data['target_range_min'] = $target;
                $temp_data['ytd'] = $target;
                $request['actualData'] = $temp_data;

                DB::table('kpi_actuals')
                    ->where('id', $request['actualData']['actual_id'])
                    ->update(['kpi_id' => $request['kpi_id'], 'actual_year' => $request['actualData']['actual_year'], 'jan' => $request['actualData']['jan'], 'feb' => $request['actualData']['feb'], 'mar' => $request['actualData']['mar'], 'apr' => $request['actualData']['apr'], 'may' => $request['actualData']['may'], 'jun' => $request['actualData']['jun'], 'jul' => $request['actualData']['jul'], 'aug' => $request['actualData']['aug'], 'sep' => $request['actualData']['sep'], 'oct' => $request['actualData']['oct'], 'nov' => $request['actualData']['nov'], 'dec' => $request['actualData']['dec'], 'ytd' => $request['actualData']['ytd'], 'user_id' => $request['actualData']['user_id']]);
                $target2 = $this->KpiTargetActualbasedCondition($request);
                $temp_data2 = $request['targetData'];
                $temp_data2['target_range_min'] = $target2;
                $temp_data2['ytd'] = $target2;
                $request['targetData'] = $temp_data2;

                DB::table('kpi_targets')
                    ->where('id', $request['targetData']['target_id'])
                    ->update(['kpi_id' => $request['kpi_id'], 'target_year' => $request['targetData']['target_year'], 'jan' => $request['targetData']['jan'], 'feb' => $request['targetData']['feb'], 'mar' => $request['targetData']['mar'], 'apr' => $request['targetData']['apr'], 'may' => $request['targetData']['may'], 'jun' => $request['targetData']['jun'], 'jul' => $request['targetData']['jul'], 'aug' => $request['targetData']['aug'], 'sep' => $request['targetData']['sep'], 'oct' => $request['targetData']['oct'], 'nov' => $request['targetData']['nov'], 'dec' => $request['targetData']['dec'], 'ytd' => $request['targetData']['ytd'], 'target_condition' => $kpi_data->target_condition, 'user_id' => $request['targetData']['user_id']]);

                DB::table('add_kpis')
                    ->where('id', $request['kpi_id'])
                    ->update(['target_range_min' => $target2]);
            } else {
                //add actual
                // dump('add actual', $request);
                $kpi_targets = DB::table('kpi_actuals')
                    ->where('actual_year', $request['actualData']['actual_year'])
                    ->where('kpi_id', $request->kpi_id)
                    ->first();
                if (empty($kpi_targets)) {
                    if ($kpi_data->target_condition == "sum_up_all") {
                        $target = $request['actualData']['jan'] + $request['actualData']['feb'] + $request['actualData']['mar'] + $request['actualData']['apr'] + $request['actualData']['may'] + $request['actualData']['jun'] + $request['actualData']['jul'] + $request['actualData']['aug'] + $request['actualData']['sep'] + $request['actualData']['oct'] + $request['actualData']['nov'] + $request['actualData']['dec'];
                        $target = round($target, 1);
                    } elseif ($kpi_data->target_condition == "average") {
                        $target = ($request['actualData']['jan'] + $request['actualData']['feb'] + $request['actualData']['mar'] + $request['actualData']['apr'] + $request['actualData']['may'] + $request['actualData']['jun'] + $request['actualData']['jul'] + $request['actualData']['aug'] + $request['actualData']['sep'] + $request['actualData']['oct'] + $request['actualData']['nov'] + $request['actualData']['dec']) / 12;
                        $target = round($target, 1);
                    } else {
                        $target = $request->dec;
                        $target = round($target, 1);
                    }
                    $temp_data = $request['actualData'];
                    $temp_data['target_range_min'] = $target;
                    $temp_data['ytd'] = $target;
                    $request['actualData'] = $temp_data;
                    //  $temp_calculation = $request['actualData']['ytd'] / $request['targetData']['ytd'];

                    DB::table('kpi_actuals')
                        ->insert(['kpi_id' => $request['kpi_id'], 'actual_year' => $request['actualData']['actual_year'], 'jan' => $request['actualData']['jan'], 'feb' => $request['actualData']['feb'], 'mar' => $request['actualData']['mar'], 'apr' => $request['actualData']['apr'], 'may' => $request['actualData']['may'], 'jun' => $request['actualData']['jun'], 'jul' => $request['actualData']['jul'], 'aug' => $request['actualData']['aug'], 'sep' => $request['actualData']['sep'], 'oct' => $request['actualData']['oct'], 'nov' => $request['actualData']['nov'], 'dec' => $request['actualData']['dec'], 'ytd' => $request['actualData']['ytd'], 'user_id' => $request['actualData']['user_id']]);
                    $request->merge(['target_range_min' => $target, 'ytd' => $target]);
                } else {
                    $message = "Already insert this actual year data !";
                    $errors = 'Already insert this actual year data !';
                    return $this->respondValidationError($message, $errors);
                }
            }
        }

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully update KPI  target and actual!';
        return $this->sendResponse();
    }

// start
    public function api_view_actual_lateentry_data(Request $request)
    {
        $lateentrydata = DB::table('kpi_actual_latentries')->select('id', 'months', 'kpi_id', 'status')->where('kpi_id', $request->kpi_id)->where('deleted_at', null)->get();

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "late entry list response";
        $this->apiResponse['data'] = $lateentrydata;
        return $this->sendResponse();
    }
//end

    /**
     * View KPI Trackers to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_kpi_trackers_track(Request $request)
    {

        if ($request['fyear'] == 'april-march') {
            $start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
        } else {
            $start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        }
        if (!empty($request->dept_id)) {
            $request->dept_id = explode(',', $request->dept_id);
        }
        // if (!empty($request->dept_id)) {
        //     $department_masters = DB::table('department_masters')->select('id', 'dept_name')
        //         ->where('deleted_at', null)
        //         ->where('unit_id', $request->unit_id)
        //         ->whereIn('id', $request->dept_id)
        //         ->get();
        // } else {
            $department_masters = DB::table('department_masters')->select('id', 'dept_name')
                ->where('deleted_at', null)
                ->where('unit_id', $request->unit_id)
                ->get();
        // }
        if (isset($request->dept_graph_id)) {
            $department_masters = DB::table('department_masters')->select('id', 'dept_name')
                ->where('deleted_at', null)
                ->where('unit_id', $request->unit_id)
                ->where('id', $request->dept_graph_id)
                ->get();
        }
        if (is_array($request->dept_id)) {
            foreach ($department_masters as $key => $row) {
                if (($request->role_id == 5 || $request->role_id == 6 || $request->role_id == 7) && !in_array($row->id, $request->dept_id)) {
                    unset($department_masters[$key]);
                }
            }
            unset($key, $row);
            $department_masters = array_values($department_masters);
        }
        if (isset($request->kpi_id)) {

            $add_kpis_data = DB::table('add_kpis')->select('add_kpis.id as kpi_id', 'add_kpis.lead_kpi', 'add_kpis.kpi_name', 'units.id as unit_id', 'units.unit_name', 'add_kpis.department_id', 'department_masters.dept_name', 'add_kpis.section_id', 'sections.section_name', 'add_kpis.ideal_trend', 'u_o_ms.name as unit_of_measurement', 'add_kpis.target_range_min', 'add_kpis.target_range_max', 'add_kpis.kpi_definition', 'users.id as user_id', 'users.name as user_name', 'add_kpis.s_o_id', 'add_kpis.initiatives_id')
                ->leftjoin('units', 'add_kpis.unit_id', '=', 'units.id')
                ->leftjoin('department_masters', 'add_kpis.department_id', '=', 'department_masters.id')
                ->leftjoin('sections', 'add_kpis.section_id', '=', 'sections.id')
                ->leftjoin('users', 'add_kpis.user_id', '=', 'users.id')
                ->leftjoin('u_o_ms', 'add_kpis.unit_of_measurement', '=', 'u_o_ms.id')
                ->where('add_kpis.deleted_at', null)
                ->where('add_kpis.unit_id', $request->unit_id)
                ->whereIn('add_kpis.id', $request->kpi_id)
                ->orderBy('add_kpis.id', 'desc')
                ->get();
            //  dump("add_kpis_data111", $add_kpis_data);

            $date = $request['year'];
            $year_range = [$date];
            for ($i = 1; $i <= 4; $i++) {
                array_push($year_range, $date - $i);
            }
            foreach ($add_kpis_data as $key4 => $row_bf_ty) {
                $kpi_targets_yr = DB::table('kpi_targets')->select('id as target_id', 'ytd', 'year_end', 'target_year', 'kpi_id', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec')
                    ->where('kpi_targets.kpi_id', $row_bf_ty->kpi_id)
                    ->where('kpi_targets.target_year', '<=', $date)
                    ->where('kpi_targets.target_year', '>=', ($date - 4))
                    ->get();
                // dump("kpi_targets_yr", $kpi_targets_yr);

                if (count($kpi_targets_yr) > 0) {
                    foreach ($kpi_targets_yr as $key_a => $kpi_a) {
                        $total_avg = 0;
                        foreach ($kpi_targets_yr as $key_b => $kpi_b) {
                            if ($kpi_a->target_year == ($kpi_b->target_year - 1)) {
                                $total_avg = round(($kpi_a->apr + $kpi_a->may + $kpi_a->jun + $kpi_a->jul + $kpi_a->aug + $kpi_a->sep + $kpi_a->oct + $kpi_a->nov + $kpi_a->dec + $kpi_b->jan + $kpi_b->feb + $kpi_b->mar) / 12);
                                $add_kpis_data[$key4]->kpi_targets[] = array("kpi_id" => $kpi_a->kpi_id, "target_year" => $kpi_a->target_year, "avg" => $total_avg);
                            }
                            $index = array_search($kpi_b->target_year, $year_range);
                            if ($index >= 0) {
                                unset($year_range[$index]);
                            }
                        }

                        if ($kpi_a->target_year == $date) {
                            $add_kpis_data[$key4]->kpi_targets[] = $kpi_a;
                            $add_kpis_data[$key4]->has_kpi_target = true;
                        } else {
                            $add_kpis_data[$key4]->has_kpi_target = false;
                        }
                        if (count($year_range) > 0 && $key_a == 0) {
                            foreach ($year_range as $year) {
                                $add_kpis_data[$key4]->kpi_targets[] = array("kpi_id" => $kpi_a->kpi_id, "target_year" => $year, "avg" => 0);
                            }
                        }
                    }
                } else {
                    $add_kpis_data[$key4]->kpi_targets = array();
                    if (count($year_range) > 0) {
                        foreach ($year_range as $year) {
                            array_push($add_kpis_data[$key4]->kpi_targets, array("kpi_id" => $row_bf_ty->kpi_id, "target_year" => $year, "avg" => 0));
                        }
                    }
                }
            }
            $year_ranges = [$date];
            for ($j = 1; $j <= 4; $j++) {
                array_push($year_ranges, $date - $j);
            }
            foreach ($add_kpis_data as $key6 => $row_bf_ay) {
                $kpi_actuals_yr = DB::table('kpi_actuals')->select('id as actual_id', 'actual_year', 'kpi_id', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'ytd')
                    ->where('kpi_actuals.kpi_id', $row_bf_ay->kpi_id)
                    ->where('kpi_actuals.actual_year', '<=', $date)
                    ->where('kpi_actuals.actual_year', '>=', ($date - 4))
                    ->get();
                // dump("kpi_actuals_yr", $kpi_actuals_yr);

                if (count($kpi_actuals_yr) > 0) {
                    foreach ($kpi_actuals_yr as $key_act_a => $kpi_act_a) {
                        $total_avg = 0;
                        foreach ($kpi_actuals_yr as $key_act_b => $kpi_act_b) {
                            if ($kpi_act_a->actual_year == ($kpi_act_b->actual_year - 1)) {
                                $total_avg = round(($kpi_act_a->apr + $kpi_act_a->may + $kpi_act_a->jun + $kpi_act_a->jul + $kpi_act_a->aug + $kpi_act_a->sep + $kpi_act_a->oct + $kpi_act_a->nov + $kpi_act_a->dec + $kpi_act_b->jan + $kpi_act_b->feb + $kpi_act_b->mar) / 12);
                                $add_kpis_data[$key6]->kpi_actuals[] = array("kpi_id" => $kpi_act_a->kpi_id, "actual_year" => $kpi_act_a->actual_year, "avg" => $total_avg);
                            }
                            $index = array_search($kpi_act_b->actual_year, $year_ranges);
                            if ($index >= 0) {
                                unset($year_ranges[$index]);
                            }
                        }
                        if ($kpi_act_a->actual_year == $date) {
                            $add_kpis_data[$key6]->kpi_actuals[] = $kpi_act_a;
                            $add_kpis_data[$key6]->has_kpi_actual = true;
                        } else {
                            $add_kpis_data[$key6]->has_kpi_actual = false;
                        }
                        if (count($year_ranges) > 0 && $key_act_a == 0) {
                            foreach ($year_ranges as $years) {
                                $add_kpis_data[$key6]->kpi_actuals[] = array("kpi_id" => $kpi_act_a->kpi_id, "actual_year" => $years, "avg" => 0);
                            }
                        }
                    }
                    // dump("2", $add_kpis_data);
                } else {
                    $add_kpis_data[$key6]->kpi_actuals = array();
                    if (count($year_ranges) > 0) {
                        foreach ($year_ranges as $years) {
                            array_push($add_kpis_data[$key6]->kpi_actuals, array("kpi_id" => $row_bf_ay->kpi_id, "actual_year" => $years, "avg" => 0));
                        }
                        // dump($add_kpis_data);
                    }
                }

            }
            $department_masters = [];
            $department_masters['add_kpis_data'] = $add_kpis_data;
            // dump($department_masters['add_kpis_data']);die;
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = "KPI Trackers data list response";
            $this->apiResponse['data'] = $department_masters;
            return $this->sendResponse();
        }
        // $targetstatus = 1;
        // $actualstatus;
        foreach ($department_masters as $key1 => $row) {
            $add_kpis_data = DB::table('add_kpis')->select('add_kpis.id as kpi_id', 'add_kpis.lead_kpi', 'add_kpis.start_date', 'add_kpis.end_date', 'add_kpis.kpi_name', 'units.id as unit_id', 'units.unit_name', 'add_kpis.department_id', 'department_masters.dept_name', 'add_kpis.section_id', 'sections.section_name', 'add_kpis.ideal_trend', 'u_o_ms.name as unit_of_measurement', 'add_kpis.target_range_min', 'add_kpis.target_range_max', 'add_kpis.kpi_definition', 'users.id as user_id', 'users.name as user_name', 'add_kpis.s_o_id', 'add_kpis.initiatives_id')
                ->leftjoin('units', 'add_kpis.unit_id', '=', 'units.id')
                ->leftjoin('department_masters', 'add_kpis.department_id', '=', 'department_masters.id')
                ->leftjoin('sections', 'add_kpis.section_id', '=', 'sections.id')
                ->leftjoin('users', 'add_kpis.user_id', '=', 'users.id')
                ->leftjoin('u_o_ms', 'add_kpis.unit_of_measurement', '=', 'u_o_ms.id')
                ->where('add_kpis.deleted_at', null)
                ->where('add_kpis.unit_id', $request->unit_id)
                ->where('add_kpis.department_id', $row->id)
                ->where(function ($q) use ($start_date, $end_date) {
                    $q->whereBetween('add_kpis.start_date', [$start_date, $end_date])
                        ->orwhereBetween('add_kpis.end_date', [$start_date, $end_date])
                        ->orwhere(function ($p) use ($start_date, $end_date) {
                            $p->where('add_kpis.start_date', '<=', $start_date)
                                ->where('add_kpis.end_date', '>=', $end_date);
                        });
                })
                ->orderBy('add_kpis.id', 'desc')
                ->get();
            $department_masters[$key1]->add_kpis_data = $add_kpis_data;
            // dump("add_kpis_data2222", $add_kpis_data);
            $date = $request['year'];
            $year_range_master = [$date];
            for ($i = 1; $i <= 4; $i++) {
                array_push($year_range_master, $date - $i);
            }
            foreach ($add_kpis_data as $key4 => $row_bf_ty) {

                $year_range = $year_range_master;
                $kpi_targets_yr = DB::table('kpi_targets')->select('id as target_id', 'ytd', 'year_end', 'target_year', 'kpi_id', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec')
                    ->where('kpi_targets.kpi_id', $row_bf_ty->kpi_id)
                    ->where('kpi_targets.target_year', '<=', $date)
                    ->where('kpi_targets.target_year', '>=', ($date - 4))
                    ->get();
                // dump("kpi_targets_yr22", $kpi_targets_yr);
                if (!empty($kpi_targets_yr)) {
                    // $targetstatus = $kpi_targets_yr[0]->ytd;
                    // dump('targetstatus',$targetstatus);
                    foreach ($kpi_targets_yr as $key_a => $kpi_a) {
                        // dump("kpi_targets", $kpi_a);

                        $total_avg = round(($kpi_a->jan + $kpi_a->feb + $kpi_a->mar + $kpi_a->apr + $kpi_a->may + $kpi_a->jun + $kpi_a->jul + $kpi_a->aug + $kpi_a->sep + $kpi_a->oct + $kpi_a->nov + $kpi_a->dec) / 12);

                        $department_masters[$key1]->add_kpis_data[$key4]->kpi_targets[] = $kpi_a;
                        $kpi_targets_yr[$key_a]->avg = $total_avg;

                        $index = array_search($kpi_a->target_year, $year_range);
                        if ($index >= 0) {
                            $kpi_targets_yr[$key_a]->has_kpi_target = true;
                            unset($year_range[$index]);
                        }
                    }

                }
                // $targetstatus = $kpi_targets_yr[0]->ytd;
                // dump('targetstatus',$targetstatus);
                if (count($year_range) > 0) {
                    foreach ($year_range as $year) {
                        $Target_data = array("kpi_id" => $row_bf_ty->kpi_id, "ytd" => "0", "target_year" => $year, "avg" => "0", "jan" => "0", "feb" => "0", "mar" => "0", "apr" => "0", "may" => "0", "jun" => "0", "jul" => "0", "aug" => "0", "sep" => "0", "oct" => "0", "nov" => "0", "dec" => "0", "has_kpi_target" => false);
                        $department_masters[$key1]->add_kpis_data[$key4]->kpi_targets[] = $Target_data;
                    }
                }
                // $targetstatus = $row_bf_ty->kpi_targets[0]->ytd;
                // dump('targetstatus',$row_bf_ty->kpi_targets[0]->ytd);
            }
            $date = $request['year'];
            $year_range_master = [$date];
            for ($i = 1; $i <= 4; $i++) {
                array_push($year_range_master, $date - $i);
            }

            foreach ($add_kpis_data as $key4 => $row_bf_ay) {

                $year_range = $year_range_master;
                // dump("row_bf_ay", $row_bf_ay);
                $kpi_actuals_yr = DB::table('kpi_actuals')->select('id as actual_id', 'ytd', 'actual_year', 'kpi_id', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec')
                    ->where('kpi_actuals.kpi_id', $row_bf_ay->kpi_id)
                    ->where('kpi_actuals.actual_year', '<=', $date)
                    ->where('kpi_actuals.actual_year', '>=', ($date - 4))
                    ->get();

                if (!empty($kpi_actuals_yr)) {
                    foreach ($kpi_actuals_yr as $key9 => $entryrow) {
                        $kpi_actual_review_data1 = DB::table('kpi_actual_latentries')->select('id', 'months', 'kpi_id', 'status')->where('kpi_id', $entryrow->kpi_id)->where('deleted_at', null)->get();
                    }
                    // $kpi_actual_review_data = DB::table('kpi_actual_rview_logs')->select('kpi_id', 'month', 'actual_year')->where('kpi_id', $row_bf_ay->kpi_id)->where('actual_year', $kpi_actuals_yr[0]->actual_year)->get();
                    $kpi_actuals_yr[0]->late_review = $kpi_actual_review_data1;
                    $row_bf_ay->late_review2 = $kpi_actual_review_data1;
                    //  $department_masters[$key1]->add_kpis_data[$key4]->kpi_actuals[] = $Actual_data;
                }

                if (!empty($kpi_actuals_yr)) {

                    foreach ($kpi_actuals_yr as $key_a => $kpi_a) {

                        $total_avg = round(($kpi_a->jan + $kpi_a->feb + $kpi_a->mar + $kpi_a->apr + $kpi_a->may + $kpi_a->jun + $kpi_a->jul + $kpi_a->aug + $kpi_a->sep + $kpi_a->oct + $kpi_a->nov + $kpi_a->dec) / 12);

                        $department_masters[$key1]->add_kpis_data[$key4]->kpi_actuals[] = $kpi_a;
                        $kpi_actuals_yr[$key_a]->avg = $total_avg;

                        $index = array_search($kpi_a->actual_year, $year_range);
                        if ($index >= 0) {
                            $kpi_actuals_yr[$key_a]->has_kpi_actual = true;
                            unset($year_range[$index]);
                        }
                    }
                    if (count($year_range) > 0) {
                        foreach ($year_range as $year) {
                            $Actual_data = array("kpi_id" => $row_bf_ay->kpi_id, "ytd" => "0", "actual_year" => $year, "avg" => "0", "jan" => null, "feb" => null, "mar" => null, "apr" => null, "may" => null, "jun" => null, "jul" => null, "aug" => null, "sep" => null, "oct" => null, "nov" => null, "dec" => null, "has_kpi_actual" => false);
                            $department_masters[$key1]->add_kpis_data[$key4]->kpi_actuals[] = $Actual_data;
                        }
                    }
                }
            }
            foreach ($add_kpis_data as $addkpikey => $addkpivalue) {
                if ($addkpivalue->kpi_targets[0]->ytd == "0.0") {
                    $addkpivalue->kpistatus = 0;
                } else {
                    $addkpivalue->kpistatus = (($addkpivalue->kpi_actuals[0]->ytd) / ($addkpivalue->kpi_targets[0]->ytd));
                }

            }
        }
        // unset($key1, $key2, $key6, $key4, $row, $row_kpi);
        // dump('department_masters',$department_masters);die;
        $this->apiResponse['status'] = "Success";
        $this->apiResponse['message'] = "KPI Trackers data list response";
        $this->apiResponse['data'] = $department_masters;
        return $this->sendResponse();
    }
    /**
     * View Lead KPI Trackers to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_lead_kpi_trackers_track(Request $request)
    {
        if ($request['fyear'] == 'april-march') {
            $start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
        } else {
            $start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        }

        $requested_dept_id = explode(',', $request->dept_id);

        // if (!empty($request->dept_id && $request->role_id == 5 || $request->role_id == 6)) {
        if (!empty($request->dept_id && $request->role_id == 5 || $request->role_id == 6 || $request->role_id == 7)) {
            $department_masters = DB::table('department_masters')->select('id', 'dept_name')
                ->where('deleted_at', null)
                ->where('unit_id', $request->unit_id)
                ->whereIn('id', $requested_dept_id)
                ->get();
        } else {
            $department_masters = DB::table('department_masters')->select('id', 'dept_name')
                ->where('deleted_at', null)
                ->where('unit_id', $request->unit_id)
                ->get();
        }

        // $department_masters = DB::table('department_masters')->select('id', 'dept_name')
        //     ->whereIn('id', $requested_dept_id)
        //     ->where('unit_id', $request->unit_id)
        //     ->where('deleted_at', null)
        //     ->get();

        //end... above code commented for user access data and writiing below mentioned code
        foreach ($department_masters as $key1 => $row) {
            $add_kpis_data = DB::table('add_kpis')->select('lead_kpi', 'add_kpis.id as kpi_id', 'add_kpis.kpi_name', 'units.id as unit_id', 'units.unit_name', 'add_kpis.department_id', 'department_masters.dept_name', 'add_kpis.section_id', 'sections.section_name', 'add_kpis.ideal_trend', 'u_o_ms.name as unit_of_measurement', 'add_kpis.target_range_min', 'add_kpis.target_range_max', 'add_kpis.kpi_definition', 'users.id as user_id', 'users.name as user_name')
                ->leftjoin('units', 'add_kpis.unit_id', '=', 'units.id')
                ->leftjoin('department_masters', 'add_kpis.department_id', '=', 'department_masters.id')
                ->leftjoin('sections', 'add_kpis.section_id', '=', 'sections.id')
                ->leftjoin('u_o_ms', 'add_kpis.unit_of_measurement', '=', 'u_o_ms.id')
                ->leftjoin('users', 'add_kpis.user_id', '=', 'users.id')
                ->where('add_kpis.deleted_at', null)
                ->where('add_kpis.unit_id', $request->unit_id)
                ->where('add_kpis.department_id', $row->id)
                ->orderBy('add_kpis.id', 'desc')
                ->where('add_kpis.lead_kpi', 1)
                ->where(function ($q) use ($start_date, $end_date) {
                    $q->whereBetween('add_kpis.start_date', [$start_date, $end_date])
                        ->orwhereBetween('add_kpis.end_date', [$start_date, $end_date])
                        ->orwhere(function ($p) use ($start_date, $end_date) {
                            $p->where('add_kpis.start_date', '<=', $start_date)
                                ->where('add_kpis.end_date', '>=', $end_date);
                        });
                })
                ->get();
            $department_masters[$key1]->add_kpis_data = $add_kpis_data;

            $date = $request['year'];
            $year_range = [$date];
            for ($i = 1; $i <= 4; $i++) {
                array_push($year_range, $date - $i);
            }
            foreach ($add_kpis_data as $key4 => $row_bf_ty) {
                $kpi_targets_yr = DB::table('kpi_targets')->select('id as target_id', 'ytd', 'year_end', 'target_year', 'kpi_id', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec')
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
                                $department_masters[$key1]->add_kpis_data[$key4]->kpi_targets[] = array("kpi_id" => $kpi_a->kpi_id, "target_year" => $kpi_a->target_year, "avg" => $total_avg);
                            }
                            $index = array_search($kpi_b->target_year, $year_range);
                            if ($index >= 0) {
                                unset($year_range[$index]);
                            }
                        }
                        if ($kpi_a->target_year == $date) {
                            $department_masters[$key1]->add_kpis_data[$key4]->kpi_targets[] = $kpi_a;
                            $department_masters[$key1]->add_kpis_data[$key4]->has_kpi_target = true;
                        } else {
                            $department_masters[$key1]->add_kpis_data[$key4]->has_kpi_target = false;
                        }
                        if (count($year_range) > 0 && $key_a == 0) {
                            foreach ($year_range as $year) {
                                $department_masters[$key1]->add_kpis_data[$key4]->kpi_targets[] = array("kpi_id" => $kpi_a->kpi_id, "target_year" => $year, "avg" => 0);
                            }
                        }
                    }
                } else {
                    /* $count = 0;
                    print_r($count++); */
                    // print_r($key4);
                    $department_masters[$key1]->add_kpis_data[$key4]->kpi_targets = array();
                    if (count($year_range) > 0) {
                        foreach ($year_range as $year) {
                            array_push($department_masters[$key1]->add_kpis_data[$key4]->kpi_targets, array("kpi_id" => $row_bf_ty->kpi_id, "target_year" => $year, "avg" => 0));
                        }
                    }
                }
            }
            $year_ranges = [$date];
            for ($j = 1; $j <= 4; $j++) {
                array_push($year_ranges, $date - $j);
            }
            foreach ($add_kpis_data as $key6 => $row_bf_ay) {
                $kpi_actuals_yr = DB::table('kpi_actuals')->select('id as actual_id', 'ytd', 'actual_year', 'kpi_id', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec')
                    ->where('kpi_actuals.kpi_id', $row_bf_ay->kpi_id)
                    ->where('kpi_actuals.actual_year', '<=', $date)
                    ->where('kpi_actuals.actual_year', '>=', ($date - 4))
                    ->get();
                // if (!empty($kpi_actuals_yr[0])) {
                //     $kpi_actual_review_data = DB::table('kpi_actual_rview_logs')->select('kpi_id', 'month', 'actual_year')->where('kpi_id', $row_bf_ay->kpi_id)->where('actual_year', $kpi_actuals_yr[0]->actual_year)->get();
                //     $kpi_actuals_yr[0]->late_review = $kpi_actual_review_data;
                // }
                if (!empty($kpi_actuals_yr)) {
                    foreach ($kpi_actuals_yr as $key9 => $entryrow) {

                        $kpi_actual_review_data1 = DB::table('kpi_actual_latentries')->select('id', 'months', 'kpi_id', 'status')->where('kpi_id', $entryrow->kpi_id)->where('deleted_at', null)->get();

                    }
                    // $kpi_actual_review_data = DB::table('kpi_actual_rview_logs')->select('kpi_id', 'month', 'actual_year')->where('kpi_id', $row_bf_ay->kpi_id)->where('actual_year', $kpi_actuals_yr[0]->actual_year)->get();
                    $kpi_actuals_yr[0]->late_review = $kpi_actual_review_data1;
                    $row_bf_ay->late_review2 = $kpi_actual_review_data1;
                    //  $department_masters[$key1]->add_kpis_data[$key4]->kpi_actuals[] = $Actual_data;
                }

                if (count($kpi_actuals_yr) > 0) {

                    foreach ($kpi_actuals_yr as $key_act_a => $kpi_act_a) {
                        $total_avg = 0;
                        foreach ($kpi_actuals_yr as $key_act_b => $kpi_act_b) {

                            if ($kpi_act_a->actual_year == ($kpi_act_b->actual_year - 1)) {

                                $total_avg = round(($kpi_act_a->apr + $kpi_act_a->may + $kpi_act_a->jun + $kpi_act_a->jul + $kpi_act_a->aug + $kpi_act_a->sep + $kpi_act_a->oct + $kpi_act_a->nov + $kpi_act_a->dec + $kpi_act_b->jan + $kpi_act_b->feb + $kpi_act_b->mar) / 12);
                                $department_masters[$key1]->add_kpis_data[$key6]->kpi_actuals[] = array("kpi_id" => $kpi_act_a->kpi_id, "actual_year" => $kpi_act_a->actual_year, "avg" => $total_avg, "late_revie" => $kpi_actual_review_data);
                            }
                            $index = array_search($kpi_act_b->actual_year, $year_ranges);
                            if ($index >= 0) {
                                unset($year_ranges[$index]);
                            }
                        }
                        if ($kpi_act_a->actual_year == $date) {
                            $department_masters[$key1]->add_kpis_data[$key6]->kpi_actuals[] = $kpi_act_a;
                            $department_masters[$key1]->add_kpis_data[$key6]->has_kpi_actual = true;
                        } else {
                            $department_masters[$key1]->add_kpis_data[$key6]->has_kpi_actual = false;
                        }
                        if (count($year_ranges) > 0 && $key_act_a == 0) {
                            foreach ($year_ranges as $years) {
                                $department_masters[$key1]->add_kpis_data[$key6]->kpi_actuals[] = array("kpi_id" => $kpi_act_a->kpi_id, "actual_year" => $years, "avg" => 0);
                            }
                        }
                    }
                } else {
                    $department_masters[$key1]->add_kpis_data[$key6]->kpi_actuals = array();
                    if (count($year_ranges) > 0) {
                        foreach ($year_ranges as $years) {
                            array_push($department_masters[$key1]->add_kpis_data[$key6]->kpi_actuals, array("kpi_id" => $row_bf_ay->kpi_id, "actual_year" => $years, "avg" => 0));
                        }
                    }
                }
            }
            foreach ($add_kpis_data as $addkpikey => $addkpivalue) {
                if ($addkpivalue->kpi_targets[0]->ytd == "0.0") {
                    $addkpivalue->kpistatus = 0;
                } else {
                    $addkpivalue->kpistatus = (($addkpivalue->kpi_actuals[0]->ytd) / ($addkpivalue->kpi_targets[0]->ytd));
                }

            }
        }
        unset($key1, $key2, $key6, $key4, $row, $row_kpi);

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "Lead KPI Trackers data list response";
        $this->apiResponse['data'] = $department_masters;
        return $this->sendResponse();
    }
    /**
     * Store edit KPI Trackerss in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_edit_kpi_trackers(Request $request)
    {
        // ,,,,
        $date = date('Y-m-d h:i:s');
        $get_target_condition = DB::table('add_kpis')->select('target_condition')->where('id', $request->kpi_id)->first();
        $current_year = date("Y/m/d");
        if ($get_target_condition->target_condition != $request->target_condition) {
            // $kpi_targets = DB::table('kpi_targets')->where('kpi_id', $request->kpi_id)->where('target_year', $current_year)->first();
            $kpi_targets = DB::table('kpi_targets')->select('jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec')
                ->where('kpi_id', $request->kpi_id)
                ->where('target_year', $current_year)
                ->first();

            $targetmonths = DB::table('kpi_actuals')
                ->select('jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec')
                ->where('kpi_id', $request->kpi_id)
                ->first();
            if (!empty($kpi_targets)) {
                $count1 = 0;
                $sum1 = 0;
                $lastmonth;
                $temptarget1 = [];

                $temptarget1 = $kpi_targets;
                $temptarget2 = $temptarget1;

                // fetch actual filled months
                $data23 = [];
                foreach ($targetmonths as $k1 => $avalue) {
                    if ($avalue != null) {
                        $data23[$k1] = $k1;
                    }
                }
                // When edit kpi hit but all actualls are null
                if (empty($data23)) {
                    $target = $this->EditKPIActuallNull($request);
                } else {

                    foreach ($temptarget2 as $k2 => $tvalue) {

                        if ($tvalue != null) {
                            $temptarget2 = $k2;
                            foreach ($data23 as $k3 => $tempmonth) {
                                if ($temptarget2 == $tempmonth) {
                                    $count1 = $count1 + 1;
                                    $sum1 = $sum1 + $tvalue;
                                    $lastmonth = $tvalue;
                                }
                            }
                        }
                    }

                    if ($request->target_condition == "sum_up_all") {
                        // $target = $kpi_targets->jan + $kpi_targets->feb + $kpi_targets->mar + $kpi_targets->apr + $kpi_targets->may + $kpi_targets->jun + $kpi_targets->jul + $kpi_targets->aug + $kpi_targets->sep + $kpi_targets->oct + $kpi_targets->nov + $kpi_targets->dec;
                        $target = $sum1;
                        $target = round($target, 1);
                    } else if ($request->target_condition == "average") {
                        // $target = ($kpi_targets->jan + $kpi_targets->feb + $kpi_targets->mar + $kpi_targets->apr + $kpi_targets->may + $kpi_targets->jun + $kpi_targets->jul + $kpi_targets->aug + $kpi_targets->sep + $kpi_targets->oct + $kpi_targets->nov + $kpi_targets->dec) / 12;
                        $target = $sum1 / $count1;
                        $target = round($target, 1);
                    } else {
                        // $target = $kpi_targets->dec;
                        $target = $lastmonth;
                        $target = round($target, 1);
                    }
                }
                //die($target);
                $request->merge(['target_range_min' => $target, 'ytd' => $target]);
                DB::table('kpi_targets')->where('kpi_id', $request->kpi_id)->where('target_year', $current_year)->update(['ytd' => $request->ytd]);
            }
            $kpi_actuals = DB::table('kpi_actuals')->select('jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec')
                ->where('kpi_id', $request->kpi_id)->where('actual_year', $current_year)->first();
            if (!empty($kpi_actuals)) {
                $count = 0;
                $sum = 0;
                $lastvalue;
                $tactual1 = $kpi_actuals;

                foreach ($tactual1 as $k1 => $avalue) {
                    if ($avalue != null) {
                        $count = $count + 1;
                        $sum = $sum + $avalue;
                        $lastvalue = $avalue;
                    }
                    // dump($avalue);
                }
                if ($request->target_condition == "sum_up_all") {
                    // $target = $kpi_actuals->jan + $kpi_actuals->feb + $kpi_actuals->mar + $kpi_actuals->apr + $kpi_actuals->may + $kpi_actuals->jun + $kpi_actuals->jul + $kpi_actuals->aug + $kpi_actuals->sep + $kpi_actuals->oct + $kpi_actuals->nov + $kpi_actuals->dec;
                    $target = $sum;
                    $target = round($target, 1);
                } else if ($request->target_condition == "average") {
                    // $target = ($kpi_actuals->jan + $kpi_actuals->feb + $kpi_actuals->mar + $kpi_actuals->apr + $kpi_actuals->may + $kpi_actuals->jun + $kpi_actuals->jul + $kpi_actuals->aug + $kpi_actuals->sep + $kpi_actuals->oct + $kpi_actuals->nov + $kpi_actuals->dec) / 12;
                    $target = $sum / $count;
                    $target = round($target, 1);
                } else {
                    // $target = $kpi_actuals->dec;
                    $target = $lastvalue;
                    $target = round($target, 1);
                }
                DB::table('kpi_actuals')->where('kpi_id', $request->kpi_id)->where('actual_year', $current_year)->update(['ytd' => $target, 'user_id' => $request->user_id, 'updated_at' => $date]);
            }
        }
        // echo "<pre>"; dump('request',$request);

        $year_end = $this->KpiTargetYearEndCondition($request);
        // echo "<pre>"; dump('year_end',$year_end);exit;
        // DB::table('kpi_targets')->where('kpi_id', $request->kpi_id)->where('target_year', $current_year)->update(['year_end' => $year_end]);
        DB::table('kpi_targets')->where('kpi_id', $request->kpi_id)->where('target_year', $current_year)->update(['year_end' => $year_end, 'target_condition' => $request->target_condition]);

        DB::table('add_kpis')->where('id', $request->kpi_id)->update([
            'updated_at' => $date,
            'kpi_name' => $request->kpi_name,
            'department_id' => $request->department_id,
            'section_id' => $request->section_id,
            'ideal_trend' => $request->ideal_trend,
            'unit_of_measurement' => $request->unit_of_measurement,
            'target_range_min' => $request->target_range_min,
            'kpi_definition' => $request->kpi_definition,
            'lead_kpi' => $request->lead_kpi,
            'frequency' => $request->frequency,
            's_o_id' => $request->s_o_id,
            'initiatives_id' => $request->initiatives_id,
            'target_condition' => $request->target_condition,
            'kpi_performance' => $request->kpi_performance,
        ]);
        //delete action plan
        DB::table('kpi_actionplan_rels')->where('kpi_id', $request->kpi_id)->delete();
        //add action plan
        if (!empty($request->action_plan_id)) {
            $kpi_data = [];
            for ($i = 0; $i < count($request->action_plan_id); $i++) {
                $kpi_data[] = array(
                    "action_plan_id" => $request->action_plan_id[$i],
                    "kpi_id" => $request->kpi_id,
                );
            }
            try {
                $insert_id = DB::table('kpi_actionplan_rels')->insert($kpi_data);
            }
            //catch exception
             catch (Exception $e) {
                //$this->apiResponse['status']="Error";
                $this->apiResponse['message'] = 'Duplicate entry!';
            }
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully update KPI Trackers!';
        return $this->sendResponse();
    }
    /**
     * Store and select delete project in database.
     *
     * @param  \Illuminate\Http\Request  $requestotal_targett
     * @return \Illuminate\Http\Response
     */
    public function api_delete_kpi_trackers(Request $request)
    {
        $date = date('Y-m-d h:i:s');
        DB::table('add_kpis')->where('add_kpis.id', $request->kpi_id)->update(['deleted_at' => $date]);
        // DB::table('kpi_actionplan_rels')->where('kpi_actionplan_rels.kpi_id', $request->kpi_id)->delete();

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully delete your KPI Trackers !';
        return $this->sendResponse();
    }
    /**
     * View view kpi dashboard to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function view_kpi_dashboard(Request $request)
    {
        if ($request['fyear'] == 'april-march') {
            $start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
        } else {
            $start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        }
        $requested_dept_id = explode(',', $request->dept_id);
        if($request->role_id == 5 || $request->role_id == 6 || $request->role_id == 7 ){
            $department_data = DB::table('department_masters')->select('id as dept_id', 'dept_name')
            ->where('unit_id', $request->unit_id)
            ->whereIn('id', $requested_dept_id)
            ->where('deleted_at', null)
            ->get();
        }
        else{
            $department_data = DB::table('department_masters')->select('id as dept_id', 'dept_name')
            ->where('unit_id', $request->unit_id)
            ->where('deleted_at', null)
            ->get();
        }
        // $department_data = DB::table('department_masters')->select('id as dept_id', 'dept_name')
        //     ->where('unit_id', $request->unit_id)
        //     ->whereIn('id', $requested_dept_id)
        //     ->where('deleted_at', null)
        //     ->get();

        foreach ($department_data as $key => $dept_row) {
            $total_kpi = DB::table('add_kpis')->where('deleted_at', null)
                ->where('department_id', $dept_row->dept_id)
                ->where(function ($q) use ($start_date, $end_date) {
                    $q->whereBetween('add_kpis.start_date', [$start_date, $end_date])
                        ->orwhereBetween('add_kpis.end_date', [$start_date, $end_date])
                        ->orwhere(function ($p) use ($start_date, $end_date) {
                            $p->where('add_kpis.start_date', '<=', $start_date)
                                ->where('add_kpis.end_date', '>=', $end_date);
                        });
                })
                ->count();
            $all_total_kpi = 0;
            $all_total_kpi = $all_total_kpi + $total_kpi;
            $department_data[$key]->all_total_kpi = $all_total_kpi;
            $department_data[$key]->total_kpi = $total_kpi;
            $department_data[$key]->green = 0;
            $department_data[$key]->red = 0;
            $department_data[$key]->yellow = 0;
            $department_data[$key]->gray = 0; //gray status count add to actual and target NULL both
            $kpi_data = DB::table('add_kpis')->select('id as kpi_id', 'kpi_name', 'ideal_trend', 'department_id')->where('deleted_at', null)
                ->where('department_id', $dept_row->dept_id)
                ->where(function ($q) use ($start_date, $end_date) {
                    $q->whereBetween('add_kpis.start_date', [$start_date, $end_date])
                        ->orwhereBetween('add_kpis.end_date', [$start_date, $end_date])
                        ->orwhere(function ($p) use ($start_date, $end_date) {
                            $p->where('add_kpis.start_date', '<=', $start_date)
                                ->where('add_kpis.end_date', '>=', $end_date);
                        });
                })
                ->get();
            $department_data[$key]->kpi_data = $kpi_data;
            foreach ($kpi_data as $key1 => $kpi_data_row) {
                $date = date('Y');
                $date_month = date('M');
                // dump($date_month);
                $kpi_targets_yr = DB::table('kpi_targets')
                    ->where('kpi_id', $kpi_data_row->kpi_id)
                    ->where('target_year', $date)
                    ->first();
                // dump($kpi_targets_yr);die;
                if (!empty($kpi_targets_yr)) {
                    // $total_target = ($kpi_targets_yr->jan + $kpi_targets_yr->feb + $kpi_targets_yr->mar + $kpi_targets_yr->apr + $kpi_targets_yr->may + $kpi_targets_yr->jun + $kpi_targets_yr->jul + $kpi_targets_yr->aug + $kpi_targets_yr->sep + $kpi_targets_yr->oct + $kpi_targets_yr->nov + $kpi_targets_yr->dec);
                    //print_r($total_target); die;
                    $total_target = $kpi_targets_yr->ytd;
                    // dump('Hello', $total_target);
                    $department_data[$key]->kpi_data[$key1]->total_target = $total_target;
                    // dump($department_data);die;

                } else {

                    $total_target = null;
                    $department_data[$key]->kpi_data[$key1]->total_target = $total_target;
                }
                $kpi_actuals_yr = DB::table('kpi_actuals')
                    ->where('kpi_actuals.kpi_id', $kpi_data_row->kpi_id)
                    ->where('kpi_actuals.actual_year', $date)
                    ->first();
                // dump($kpi_actuals_yr);die;
                if (!empty($kpi_actuals_yr)) {
                    // $total_actual = ($kpi_actuals_yr->jan + $kpi_actuals_yr->feb + $kpi_actuals_yr->mar + $kpi_actuals_yr->apr + $kpi_actuals_yr->may + $kpi_actuals_yr->jun + $kpi_actuals_yr->jul + $kpi_actuals_yr->aug + $kpi_actuals_yr->sep + $kpi_actuals_yr->oct + $kpi_actuals_yr->nov + $kpi_actuals_yr->dec);
                    $total_actual = $kpi_actuals_yr->ytd;
                    $department_data[$key]->kpi_data[$key1]->total_actual = $total_actual;
                    // dump($department_data);die;
                } else {
                    $department_data[$key]->kpi_data[$key1]->total_actual = null;
                    $total_actual = 0;
                }
                if ($kpi_data_row->ideal_trend == 'negative') {
                    if ($total_target != 0 && $total_target != null && $total_actual != 0 && $total_actual != null) {
                        $avg = $total_actual / $total_target;
                        if ($avg >= 1.1) {
                            $department_data[$key]->red += 1;
                        }if ($avg < 1.1 && $avg > 1.0) {
                            $department_data[$key]->yellow += 1;
                        }
                        if ($avg <= 1.0 && $avg > 0) {
                            // if ($avg <= 1.0) {
                            $department_data[$key]->green += 1;
                        }
                    } else {
                        $avg = 'NULL';
                        $department_data[$key]->gray += 1;
                    }
                } else {
                    if ($total_target != 0 && $total_target != null && $total_actual != 0 && $total_actual != null) {
                        $avg = $total_actual / $total_target;

                        if ($avg >= 1.0) {
                            $department_data[$key]->green += 1;
                        }
                        if ($avg < 1.0 && $avg >= 0.9) {
                            $department_data[$key]->yellow += 1;
                        }
                        if ($avg < 0.9 && $avg > 0) {
                            $department_data[$key]->red += 1;
                        }
                    } else {
                        $avg = 'NULL';
                        $department_data[$key]->gray += 1;
                    }
                }

            }
            unset($department_data[$key]->kpi_data);
        }

        //$requested_dept_id = json_decode($request->dept_id, true);

        // if (!empty($department_data)) {
        //     foreach ($department_data as $key5 => $total_dept_data) {
        //         // if (($request->role_id == 5 || $request->role_id == 6) && !in_array($total_dept_data->dept_id, $requested_dept_id)) {

        //         if (($request->role_id == 4 || $request->role_id == 5 || $request->role_id == 6 || $request->role_id == 7) && !in_array($total_dept_data->dept_id, $requested_dept_id)) {
        //             unset($department_data[$key5]);
        //         }
        //     }
        // }
        // dump($department_data);
        $department_data = array_values($department_data);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "action plan list response";
        $this->apiResponse['data'] = $department_data;
        return $this->sendResponse();
    }
    /**
     * View view kpi dashboard to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function view_lead_kpi_dashboard(Request $request)
    {
        if ($request['fyear'] == 'april-march') {
            $start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
        } else {
            $start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        }
        $requested_dept_id = explode(',', $request->dept_id);
        // if (!empty($request->dept_id && $request->role_id == 5 || $request->role_id == 6)) {
        if ($request->role_id == 5 || $request->role_id == 6 || $request->role_id == 7) {
        $department_data = DB::table('department_masters')->select('id as dept_id', 'dept_name')->where('deleted_at', null)->where('unit_id', $request->unit_id)
            ->whereIn('id', $requested_dept_id)
            ->get();
        // dump("deptt", $department_data);
        } else {
            $department_data = DB::table('department_masters')->select('id as dept_id', 'dept_name')->where('deleted_at', null)->where('unit_id', $request->unit_id)->get();
            // dump("deptt", $department_data);
        }
        foreach ($department_data as $key => $dept_row) {
            $total_kpi = DB::table('add_kpis')->where('deleted_at', null)
                ->where('department_id', $dept_row->dept_id)
                ->where('lead_kpi', 1)
                ->where(function ($q) use ($start_date, $end_date) {
                    $q->whereBetween('add_kpis.start_date', [$start_date, $end_date])
                        ->orwhereBetween('add_kpis.end_date', [$start_date, $end_date])
                        ->orwhere(function ($p) use ($start_date, $end_date) {
                            $p->where('add_kpis.start_date', '<=', $start_date)
                                ->where('add_kpis.end_date', '>=', $end_date);
                        });
                })
                ->count();
            $all_total_kpi = 0;
            $all_total_kpi = $all_total_kpi + $total_kpi;
            $department_data[$key]->all_total_kpi = $all_total_kpi;
            $department_data[$key]->total_kpi = $total_kpi;
            $department_data[$key]->green = 0;
            $department_data[$key]->red = 0;
            $department_data[$key]->yellow = 0;
            $department_data[$key]->gray = 0; //gray status count add to actual and target NULL both
            $kpi_data = DB::table('add_kpis')->select('id as kpi_id', 'kpi_name', 'ideal_trend', 'department_id', 'add_kpis.start_date', 'add_kpis.end_date')->where('deleted_at', null)
                ->where('department_id', $dept_row->dept_id)
                ->where('lead_kpi', 1)
                ->where(function ($q) use ($start_date, $end_date) {
                    $q->whereBetween('add_kpis.start_date', [$start_date, $end_date])
                        ->orwhereBetween('add_kpis.end_date', [$start_date, $end_date])
                        ->orwhere(function ($p) use ($start_date, $end_date) {
                            $p->where('add_kpis.start_date', '<=', $start_date)
                                ->where('add_kpis.end_date', '>=', $end_date);
                        });
                })
                ->get();
            $department_data[$key]->kpi_data = $kpi_data;
            // dump("deptt",$kpi_data);

            foreach ($kpi_data as $key1 => $kpi_data_row) {
                $date = date('Y');
                $kpi_targets_yr = DB::table('kpi_targets')
                    ->where('kpi_id', $kpi_data_row->kpi_id)
                    ->where('target_year', $date)
                    ->first();
                // dump("deptt",  $kpi_targets_yr);
                if (!empty($kpi_targets_yr)) {
                    // $total_target = ($kpi_targets_yr->jan + $kpi_targets_yr->feb + $kpi_targets_yr->mar + $kpi_targets_yr->apr + $kpi_targets_yr->may + $kpi_targets_yr->jun + $kpi_targets_yr->jul + $kpi_targets_yr->aug + $kpi_targets_yr->sep + $kpi_targets_yr->oct + $kpi_targets_yr->nov + $kpi_targets_yr->dec);
                    $total_target = $kpi_targets_yr->ytd;
                    // dump("target",$total_target);
                    $department_data[$key]->kpi_data[$key1]->total_target = $total_target;
                } else {

                    $total_target = null;
                    $department_data[$key]->kpi_data[$key1]->total_target = $total_target;
                }
                $kpi_actuals_yr = DB::table('kpi_actuals')
                    ->where('kpi_actuals.kpi_id', $kpi_data_row->kpi_id)
                    ->where('kpi_actuals.actual_year', $date)
                    ->first();
                if (!empty($kpi_actuals_yr)) {
                    // $total_actual = ($kpi_actuals_yr->jan + $kpi_actuals_yr->feb + $kpi_actuals_yr->mar + $kpi_actuals_yr->apr + $kpi_actuals_yr->may + $kpi_actuals_yr->jun + $kpi_actuals_yr->jul + $kpi_actuals_yr->aug + $kpi_actuals_yr->sep + $kpi_actuals_yr->oct + $kpi_actuals_yr->nov + $kpi_actuals_yr->dec);
                    $total_actual = $kpi_actuals_yr->ytd;
                    // dump("actual", $total_actual);
                    $department_data[$key]->kpi_data[$key1]->total_actual = $total_actual;
                } else {
                    $department_data[$key]->kpi_data[$key1]->total_actual = null;
                    $total_actual = 0;
                }
                // if ($total_target != 0 && $total_target != null && $total_actual != 0 && $total_actual != null) {
                //     $avg = $total_actual / $total_target;

                //     if ($avg >= 1.0) {
                //         $department_data[$key]->green += 1;
                //     } else if ($avg < 1.0 && $avg >= 0.9) {
                //         $department_data[$key]->yellow += 1;
                //     } else {
                //         $department_data[$key]->red += 1;
                //     }
                // } else {
                //     $avg = 'NULL';
                //     $department_data[$key]->gray += 1;
                // }
                if ($kpi_data_row->ideal_trend == 'negative') {
                    if ($total_target != 0 && $total_target != null && $total_actual != 0 && $total_actual != null) {
                        $avg = $total_actual / $total_target;

                        if ($avg >= 1.1) {
                            $department_data[$key]->red += 1;
                        }if ($avg < 1.1 && $avg > 1.0) {
                            $department_data[$key]->yellow += 1;
                        }
                        if ($avg <= 1.0 && $avg > 0) {
                            // if ($avg <= 1.0) {
                            $department_data[$key]->green += 1;
                        }
                    } else {
                        $avg = 'NULL';
                        $department_data[$key]->gray += 1;
                    }
                } else {
                    if ($total_target != 0 && $total_target != null && $total_actual != 0 && $total_actual != null) {
                        $avg = $total_actual / $total_target;

                        if ($avg >= 1.0) {
                            $department_data[$key]->green += 1;
                        }
                        if ($avg < 1.0 && $avg >= 0.9) {
                            $department_data[$key]->yellow += 1;
                        }
                        if ($avg < 0.9 && $avg > 0) {
                            $department_data[$key]->red += 1;
                        }
                    } else {
                        $avg = 'NULL';
                        $department_data[$key]->gray += 1;
                    }
                }

            }
            unset($department_data[$key]->kpi_data);
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "action plan list response";
        $this->apiResponse['data'] = $department_data;
        return $this->sendResponse();
    }

    public function api_new_kpi_trackers_track(Request $request)
    {
        $cyear = date('Y');
        $kpi_test = DB::table('add_kpis')->where('id', $request['kpi_id'])->get();

        $kpi_target_data = DB::table('add_kpis')->select('add_kpis.id as kpi_id', 'add_kpis.kpi_name', 'add_kpis.ideal_trend', 'ytd', 'target_year', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'kpi_targets.id as target_id')
            ->leftjoin('kpi_targets', 'add_kpis.id', '=', 'kpi_targets.kpi_id')
            ->where('add_kpis.id', $request->kpi_id)
        //->where('kpi_targets.target_year', $cyear)
            ->where('kpi_targets.target_year', $request['select_year'])
            ->where('add_kpis.deleted_at', null)
            ->where('kpi_targets.deleted_at', null)->get();

        if (empty($kpi_target_data)) {

            $kpi_target_data[0] = (object) ['kpi_id' => $kpi_test[0]->id, 'kpi_name' => $kpi_test[0]->kpi_name, "ideal_trend" => $kpi_test[0]->ideal_trend, 'ytd' => 0, 'target_year' => $request['select_year'], 'jan' => null, 'feb' => null, 'mar' => null, 'apr' => null, 'may' => null, 'jun' => null, 'jul' => null, 'aug' => null, 'sep' => null, 'oct' => null, 'nov' => null, 'dec' => null, 'target_id' => null];
        }

        $kpi_actual_data = DB::table('add_kpis')->select('add_kpis.id', 'add_kpis.kpi_name', 'add_kpis.ideal_trend', 'ytd', 'actual_year', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'kpi_actuals.id as actuals_id')
            ->leftjoin('kpi_actuals', 'add_kpis.id', '=', 'kpi_actuals.kpi_id')
            ->where('add_kpis.id', $request->kpi_id)
            ->where('kpi_actuals.actual_year', $request['select_year'])
            ->where('kpi_actuals.deleted_at', null)
            ->where('add_kpis.deleted_at', null)->get();

        if (empty($kpi_actual_data)) {
            $kpi_actual_data[0] = (object) ['kpi_id' => $kpi_test[0]->id, 'kpi_name' => $kpi_test[0]->kpi_name, "ideal_trend" => $kpi_test[0]->ideal_trend, 'ytd' => 0, 'actual_year' => $request['select_year'], 'jan' => null, 'feb' => null, 'mar' => null, 'apr' => null, 'may' => null, 'jun' => null, 'jul' => null, 'aug' => null, 'sep' => null, 'oct' => null, 'nov' => null, 'dec' => null, 'actuals_id' => null];
            // echo ('HEEEELLL' . $kpi_actual_data[0]);
        }

        $kpi_comment_data = json_decode(json_encode(DB::table('add_kpis')->select('add_kpis.id as kpi_id', 'add_kpis.kpi_name', 'add_kpis.ideal_trend', 'month', 'year', 'comment', 'recovery_plan', 'responsibility', 'target_date', 'status', 'kpi_comments.id as comment_id', 'employers.name as user_name')
                ->leftjoin('kpi_comments', 'add_kpis.id', '=', 'kpi_comments.kpi_id')
                ->leftjoin('employers', 'kpi_comments.responsibility', '=', 'employers.user_id')
                ->where('add_kpis.id', $request->kpi_id)
                ->where('kpi_comments.year', $request['select_year'])
                ->where('kpi_comments.deleted_at', null)
                ->where('add_kpis.deleted_at', null)->get()), true);

        $month = ['jan' => 0, 'feb' => 1, 'mar' => 2, 'apr' => 3, 'may' => 4, 'jun' => 5, 'jul' => 6, 'aug' => 7, 'sep' => 8, 'oct' => 9, 'nov' => 10, 'dec' => 11];
        $month1 = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        $lateentrydata = DB::table('kpi_actual_latentries')->select('id', 'months', 'kpi_id', 'status')->where('kpi_id', $request->kpi_id)->where('deleted_at', null)->get();
        // dump($lateentrydata);

        if (empty($kpi_comment_data)) {
            foreach ($month as $fkey => $fvalu) {
                $kpi_comment_data[] = ['kpi_id' => $kpi_test[0]->id, 'kpi_name' => $kpi_test[0]->kpi_name, "ideal_trend" => $kpi_test[0]->ideal_trend, 'month' => $fkey, 'year' => $request['select_year'], 'comment' => "", 'recovery_plan' => "", 'responsibility' => null, 'target_date' => null, 'status' => 0, 'comment_id' => 0, 'user_name' => 0];
            }
        }

        if (isset($kpi_target_data)) {
            foreach ($kpi_target_data[0] as $tkey => $tval) {
                if (in_array($tkey, array_keys($month))) {
                    $ckey = array_search($tkey, array_column($kpi_comment_data, 'month'));

                    if ($ckey > -1) {
                        $kpi_comment_data[$ckey]['kpi_target'] = $tval;
                        $kpi_comment_data[$ckey]['kpi_actual'] = $kpi_actual_data[0]->$tkey;
                        $kpi_comment_data[$ckey]['target_id'] = $kpi_target_data[0]->target_id;
                        $kpi_comment_data[$ckey]['actual_id'] = $kpi_actual_data[0]->actuals_id;
                        $kpi_comment_data[$ckey]['target_year'] = $kpi_target_data[0]->target_year;
                        $kpi_comment_data[$ckey]['actual_year'] = $kpi_actual_data[0]->actual_year;
                    } else {
                        if (in_array($tkey, array_keys($month))) {
                            $temp = array(
                                'kpi_name' => $kpi_target_data[0]->kpi_name,
                                'kpi_id' => $kpi_target_data[0]->kpi_id,
                                'month' => $tkey,
                                'year' => $kpi_target_data[0]->target_year,
                                'comment' => '',
                                'recovery_plan' => '',
                                'responsibility' => '',
                                'target_date' => '',
                                'status' => '',
                                'kpi_target' => $tval,
                                'kpi_actual' => $kpi_actual_data[0]->{$tkey},
                                'target_id' => $kpi_target_data[0]->target_id,
                                'actual_id' => $kpi_actual_data[0]->actuals_id,
                                'target_year' => $kpi_target_data[0]->target_year,
                                'actual_year' => $kpi_actual_data[0]->actual_year,
                                'comment_id' => '',
                                'user_name' => '',
                                'ideal_trend' => $kpi_target_data[0]->ideal_trend,
                            );
                            array_push($kpi_comment_data, $temp);
                        }
                    }
                }
            }
        }

        foreach ($kpi_comment_data as $fkey => $fvalu) {
            $month1;
            if (!empty($lateentrydata)) {
                if ($fvalu['month'] == $lateentrydata[$fkey]->months) {
                    $month1 = $fvalu;
                    $kpi_comment_data[$fkey]['lateentry_id'] = $lateentrydata[$fkey]->id;
                } else {
                    $kpi_comment_data[$fkey]['lateentry_id'] = "";
                }
            }
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "action plan list response";
        $this->apiResponse['data'] = $kpi_comment_data;
        return $this->sendResponse();
    }

    /**
     * Review kpi Actaual  shoe data on data on dashbard
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function api_dashboard_review_actual_data(Request $request)
    {
        $requested_dept_id = explode(',', $request->dept_id);

        //get current mont and current year
        $cmonth = strtolower(date("m"));
        // $cmonth = 11;
        $cyear = date("Y");
        //get financial year start date and end Date
        $cyear = date("Y");
        $getDate = $this->getFinancialDate($request['fyear'] ? $request['fyear'] : '', $cyear);
        $start_date = $getDate['start_date'];
        $end_date = $getDate['end_date'];

        //get remindr frequency and reminder value

        $frequency = $request['reminder_frequency'];
        $reminder_date = $request['reminder_date'];

        //get current date.

        $current_date = date("Y-m-d");
        //$current_date = '2020-10-01';
        $formt_current_date = new DateTime($current_date);

        //make reminder date.

        $date = date_create(date('Y-m-d', strtotime("first day of")));
        date_add($date, date_interval_create_from_date_string(($reminder_date - 1) . ' days'));

        // formate reminder date.

        $reminder_date = date_format($date, 'Y-m-d');
        $formt_reminder_date = new DateTime($reminder_date);

        //date before 5 days of reminder date  for showing comming soon list of actuals.

        $upcoming_event_date = date('Y-m-d', strtotime('-5 days', strtotime($reminder_date)));
        $formt_upcoming_event_date = new DateTime($upcoming_event_date);

        //make day frequency for set reminder.

        $day_frequency = $this->getDayFrequecy($frequency, $formt_current_date, $formt_reminder_date, $reminder_date);

        //get dept data
        $dept_data = $this->GetDeptData($requested_dept_id, $request['unit_id'], $request['company_id']);

        if (!empty($dept_data)) {
            foreach ($dept_data as $dkey => $ddata) {

                $kpi_data = $this->getKpiData($ddata['id'], $start_date, $end_date);

                foreach ($kpi_data as $kkey => $kvalue) {
                    //Get Actual Data
                    $Actual_data[] = $this->getActualData($kvalue, $cyear, $cmonth, $ddata, $reminder_date, $current_date, $upcoming_event_date);
                }
            }
        }
        if (empty($Actual_data)) {
            $Actual_data = [];
        }
        // dump($Actual_data);die;
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "action plan list response";
        $this->apiResponse['data'] = $Actual_data;
        return $this->sendResponse();
    }

    /**
     * Review kpi Actual  set cron
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function api_review_actual_data_cron()
    {
        $Company_data = $this->getCompanyData();

        //Get Current Mont and  Current Year.

        $cmonth = strtolower(date("m"));
        $cyear = date("Y");

        //Get Company Data.

        $Company_data = $this->getCompanyData();

        if (!empty($Company_data)) {
            foreach ($Company_data as $ckey => $cdata) {
                $day_frequency = [];

                //$cdata['id ] is CompanyId.

                $Company_setting = $this->getCompanySetting($cdata['id']);

                if (!empty($Company_setting)) {

                    //get financial year start date and end Date.
                    $cyear = date("Y");
                    $getDate = $this->getFinancialDate($Company_setting[0]['financial_year'] ?: '', $cyear);

                    $start_date = $getDate['start_date'];
                    $end_date = $getDate['end_date'];

                    //get remindr frequency and reminder value.

                    $frequency = $Company_setting[0]['reminder_frequency'];
                    // print_r('company:'.$frequency);
                    $reminder_date = $Company_setting[0]['reminder_date'];

                    //make reminder date.
                    $date = date_create(date('Y-m-d', strtotime("first day of")));
                    date_add($date, date_interval_create_from_date_string(($reminder_date - 1) . ' days'));

                    // $upcoming_event_date = date('Y-m-d', strtotime('-5 days', strtotime($reminder_date)));
                    // $formt_upcoming_event_date = new DateTime($upcoming_event_date);

                    //get current date.

                    $current_date = date("Y-m-d");
                    $formt_current_date = new DateTime($current_date);

                    // formate reminder date.

                    $reminder_date = date_format($date, 'Y-m-d');
                    $formt_reminder_date = new DateTime($reminder_date);

                    //make day frequency for set reminder.
                    $day_frequency = $this->getDayFrequecy($frequency, $formt_current_date, $formt_reminder_date, $reminder_date);

                }

                /*
                get unit data
                cdata['id'] is company id
                 */

                $unit_data = $this->getUnitData($cdata['id']);

                if (!empty($unit_data)) {

                    $Company_data[$ckey]['units'] = $unit_data;

                    foreach ($unit_data as $ukey => $udata) {

                        //get dept data
                        $dept_data = $this->GetDeptData($udata['id'], $udata['company_id']);

                        $Company_data[$ckey]['units'][$ukey]['dept'] = $dept_data;

                        foreach ($dept_data as $dkey => $ddata) {

                            $kpi_data = $this->getKpiData($ddata['id'], $start_date, $end_date);

                            $Company_data[$ckey]['units'][$ukey]['dept'][$dkey]['kpis'] = $kpi_data;

                            foreach ($kpi_data as $kkey => $kvalue) {

                                //Get Actual Data
                                $Actual_data = $this->getActualData($kvalue, $cyear, $cmonth, $ddata, $reminder_date, $current_date);

                                // print_r($Actual_data);die;

                                if (!empty($Actual_data)) {

                                    //   $Company_data[$ckey]['units'][$ukey]['dept'][$dkey]['kpis'][$kkey]['actuals'] =  $Actual_data['actual_data'][0];

                                    if (array_intersect([$current_date], $day_frequency)) {
                                        if (!empty($Actual_data['actual_array'])) {

                                            $data = ['months' => implode(',', $Actual_data['actual_array'][0]['month']), 'kpi_name' => $Actual_data['actual_array'][0]['kpi_name'], 'actual_year' => $Actual_data['actual_array'][0]['actual_year'], 'dept_name' => $Actual_data['actual_array'][0]['dept_name']];

                                            if ($current_date <= $reminder_date) {

                                                $userEmail[] = $Actual_data['actual_array'][0]['actual_user_email'];
                                                $file_path = 'emails.send_kpi_reviews';
                                                $subject = 'Review your kpi actual';
                                                $this->sendMail($data, $userEmail, $file_path, $cc = null, $bcc = null, $subject);

                                                unset($userEmail);
                                            } else {

                                                //store late review month .
                                                $kpi_id = $Actual_data['actual_array'][0]['kpi_id'];
                                                $actual_yaer = $Actual_data['actual_array'][0]['actual_year'];
                                                foreach ($Actual_data['actual_array'][0]['month'] as $akey => $actual_mont) {
                                                    $actual_log_value = DB::table('kpi_actual_rview_logs')->where('kpi_id', $kpi_id)
                                                        ->where('month', $actual_mont)->where('actual_year', $actual_yaer)
                                                        ->get();
                                                    if (empty($actual_log_value)) {
                                                        DB::table('kpi_actual_rview_logs')->insert(
                                                            ['kpi_id' => $kpi_id, 'month' => $actual_mont, 'actual_year' => $actual_yaer]
                                                        );
                                                    }
                                                }

                                                //send mail to user and dept admin

                                                $userEmail[] = $Actual_data['actual_array'][0]['actual_user_email'];
                                                $file_path = 'emails.send_kpi_reviews';
                                                $cc = $Actual_data['actual_array'][0]['dept_admin'];
                                                $subject = 'Review your kpi actual';
                                                $this->sendMail($data, $userEmail, $file_path, $cc, $bcc = null, $subject);

                                                unset($userEmail);
                                            }
                                        }
                                    }
                                } else {
                                    $Company_data[$ckey]['units'][$ukey]['dept'][$dkey]['kpis'][$kkey]['actuals'] = [];
                                }
                            }
                        }
                    }
                }
            }
            return ('sucees');
        }
    }
    // action plan mails
    public function api_str_obj_review_cron(Request $request)
    {
        // $result = (new ApiActionPlansController)->api_add_action_plan_schedules();
        // $temp = app('App\Http\Controllers\ApiActionPlansController')->getPrintReport();
        //Get Company Data
        $Company_data = $this->getCompanyData();

        if (!empty($Company_data)) {
            foreach ($Company_data as $ckey => $cdata) {
                //Get Unit Data
                $unit_data = $this->getUnitData($cdata['id']);

                if (!empty($unit_data)) {
                    // $Company_data[$ckey]['units'] = $unit_data;
                    foreach ($unit_data as $ukey => $udata) {
                        //Get Action Plan data
                        $Action_data = Action_plan::where('unit_id', $udata['id'])->where('deleted_at', null)->get()->toarray();

                        foreach ($Action_data as $ukey => $action_value) {
                            // $co_owner = json_decode($action_value['co_owner']);
                            $date = date_create(date('Y-m-d', strtotime("first day of")));
                            $current_date = date("Y-m-d");
                            $date_month = date('m');
                            $current_month_year = date("m-Y");
                            $formt_current_date = new DateTime($current_date);
                            $current_new_date = new DateTime(date("Y-m-d", strtotime("-1 months")));

                            // Start Monthly
                            if ($action_value['control_point'] == 'Monthly') {

                                $Dept_head_data = DB::table('employers')->select('employers.name as dept_head_name', 'employers.email as dept_head_mail')
                                    ->join('department_masters', 'employers.user_id', '=', 'department_masters.user_id')
                                    ->where('department_masters.id', '=', $action_value['dept_id'])
                                    ->get();

                                $schedule_month_date = DB::table('action_plan_schedules')->select('month_date')->where('deleted_at', null)->where('action_plan_id', $action_value['id'])->orderBy('id', 'DESC')->first();

                                $t = json_encode($schedule_month_date);
                                $tt = json_decode($t, true);
                                $ttt = implode($tt);

                                $schedule_month_year = date('m-Y', strtotime($ttt));

                                $start_date = $action_value['start_date'];
                                $formt_start_date = new DateTime($start_date);
                                $end_date = $action_value['end_date'];
                                $formt_end_date = new DateTime($end_date);
                                $definition = $action_value['definition'];
                                $control_point = $action_value['control_point'];

                                if (($formt_current_date >= $formt_start_date) && ($current_new_date <= $formt_end_date)) {

                                    date_add($date, date_interval_create_from_date_string(($action_value['reminder_date'] - 1) . ' days'));
                                    $reminder_date = date_format($date, 'Y-m-d');
                                    $formt_reminder_date = new DateTime($reminder_date);
                                    $formt_current_date = new DateTime($current_date);

                                    if (($current_month_year != $schedule_month_year)) {

                                        $frequency = $action_value['reminder_frequency'];

                                        if ($formt_current_date <= $formt_reminder_date) {
                                            $start_reminder = date("Y-m-d", strtotime("$reminder_date -7 day"));
                                            $formt_start_reminder = new DateTime($start_reminder);

                                            if ($formt_start_reminder <= $formt_reminder_date) {

                                                switch ($frequency) {
                                                    case '0':
                                                        for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+1 day')) {
                                                            $day_frequency[] = $i->format("Y-m-d");
                                                        }
                                                        array_push($day_frequency, $reminder_date);
                                                        break;
                                                    case '1':
                                                        for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+2 day')) {
                                                            $day_frequency[] = $i->format("Y-m-d");
                                                        }
                                                        array_push($day_frequency, $reminder_date);
                                                        break;
                                                    case '2':
                                                        for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+3 day')) {
                                                            $day_frequency[] = $i->format("Y-m-d");
                                                        }
                                                        array_push($day_frequency, $reminder_date);
                                                        break;
                                                    case '3':
                                                        for ($i = $formt_start_reminder; $i <= $formt_reminder_date; $i->modify('+4 day')) {
                                                            $day_frequency[] = $i->format("Y-m-d");
                                                        }
                                                        array_push($day_frequency, $reminder_date);
                                                        break;
                                                    default:
                                                        break;
                                                }

                                                if (array_intersect([$current_date], $day_frequency)) {

                                                    foreach ($Dept_head_data as $dkey => $dep_value) {

                                                        if ($dep_value) {
                                                            $user = $dep_value->dept_head_mail;

                                                            $name = $dep_value->dept_head_name;
                                                            $review_date = $reminder_date;

                                                            Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                                                $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                                                $m->to($user, 'admin')->subject('Upcoming monthly action plan review!');
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        } else {

                                            // delay frequency
                                            $add_reminder = date("Y-m-d", strtotime("$reminder_date +1 day"));
                                            $formt_reminder_date = new DateTime($add_reminder);
                                            $formt_current_date = new DateTime($current_date);
                                            $start_reminder2 = date("Y-m-d", strtotime("$reminder_date +3 day"));
                                            $formt_start_reminder2 = new DateTime($start_reminder2);

                                            switch ($frequency) {
                                                case '0':
                                                    for ($i = $formt_reminder_date; $i <= $formt_start_reminder2; $i->modify('+1 day')) {
                                                        $delay_frequency[] = $i->format("Y-m-d");
                                                    }
                                                    array_push($delay_frequency, $reminder_date);
                                                    break;
                                                default:
                                                    break;
                                            }

                                            $removed = array_pop($delay_frequency);

                                            if (array_intersect([$current_date], $delay_frequency)) {

                                                foreach ($Dept_head_data as $dkey => $dep_value) {
                                                    if ($dep_value) {
                                                        $user = $dep_value->dept_head_mail;
                                                        $name = $dep_value->dept_head_name;
                                                        $review_date = $reminder_date;

                                                        Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                                            $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                                            $m->to($user, 'admin')->subject('Delay monthly action plan review!');
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                $day_frequency = [];
                                $delay_frequency = [];
                            }

                            //  Start Quarterly
                            if ($action_value['control_point'] == 'Quarterly') {

                                $Dept_head_data = DB::table('employers')->select('employers.name as dept_head_name', 'employers.email as dept_head_mail')
                                    ->join('department_masters', 'employers.user_id', '=', 'department_masters.user_id')
                                    ->where('department_masters.id', '=', $action_value['dept_id'])
                                    ->get();

                                $schedule_month_date = DB::table('action_plan_schedules')->select('month_date')->where('deleted_at', null)->where('action_plan_id', $action_value['id'])->orderBy('id', 'DESC')->first();

                                $t = json_encode($schedule_month_date);
                                $tt = json_decode($t, true);
                                $ttt = implode($tt);

                                $schedule_month_year = date('m-Y', strtotime($ttt));

                                $start_date = $action_value['start_date'];
                                $formt_start_date = new DateTime($start_date);
                                $end_date = $action_value['end_date'];
                                $formt_end_date = new DateTime($end_date);
                                $definition = $action_value['definition'];
                                $control_point = $action_value['control_point'];

                                if (($formt_current_date >= $formt_start_date) && ($current_new_date <= $formt_end_date)) {
                                    $start_month = date('m', strtotime($start_date));
                                    $end_month = date('m', strtotime($end_date));
                                    $add_mont = 3;
                                    for ($i = 4; $i > 0; $i--) {
                                        $quart_month = $start_month + $add_mont;
                                        $start_month = $quart_month;
                                        $end_month = date('m-Y', strtotime($end_date));
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
                                    if (in_array($date_month, $total_quart_month)) {

                                        date_add($date, date_interval_create_from_date_string(($action_value['reminder_date'] - 1) . ' days'));
                                        $reminder_date = date_format($date, 'Y-m-d');
                                        $formt_reminder_date = new DateTime($reminder_date);

                                        if (($current_month_year != $schedule_month_year)) {
                                            if ($formt_current_date <= $formt_reminder_date) {
                                                $start_reminder = date("Y-m-d", strtotime("$reminder_date -7 day"));
                                                $formt_start_reminder = new DateTime($start_reminder);
                                                if ($formt_start_reminder <= $formt_reminder_date) {

                                                    $frequency = $action_value['reminder_frequency'];
                                                    switch ($frequency) {
                                                        case '0':
                                                            for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+1 day')) {
                                                                $day_frequency[] = $i->format("Y-m-d");

                                                            }
                                                            array_push($day_frequency, $reminder_date);
                                                            break;
                                                        case '1':
                                                            for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+2 day')) {
                                                                $day_frequency[] = $i->format("Y-m-d");
                                                            }
                                                            array_push($day_frequency, $reminder_date);
                                                            break;
                                                        case '2':
                                                            for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+3 day')) {
                                                                $day_frequency[] = $i->format("Y-m-d");
                                                            }
                                                            array_push($day_frequency, $reminder_date);
                                                            break;
                                                        case '3':
                                                            for ($i = $formt_start_reminder; $i <= $formt_reminder_date; $i->modify('+4 day')) {
                                                                $day_frequency[] = $i->format("Y-m-d");
                                                            }
                                                            array_push($day_frequency, $reminder_date);
                                                            break;
                                                        default:
                                                            break;
                                                    }

                                                    if (array_intersect([$current_date], $day_frequency)) {

                                                        foreach ($Dept_head_data as $dkey => $dep_value) {
                                                            if ($dep_value) {
                                                                $user = $dep_value->dept_head_mail;
                                                                $name = $dep_value->dept_head_name;
                                                                $review_date = $reminder_date;

                                                                Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                                                    $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                                                    $m->to($user, 'admin')->subject('Upcoming quarterly action plan review!');
                                                                });
                                                            }
                                                        }
                                                    }
                                                }
                                            } else {

                                                foreach ($Dept_head_data as $dkey => $dep_value) {
                                                    // delay frequency
                                                    $add_reminder = date("Y-m-d", strtotime("$reminder_date +1 day"));
                                                    $formt_reminder_date = new DateTime($add_reminder);
                                                    $formt_current_date = new DateTime($current_date);
                                                    $start_reminder2 = date("Y-m-d", strtotime("$reminder_date +3 day"));
                                                    $formt_start_reminder2 = new DateTime($start_reminder2);

                                                    switch ($frequency) {
                                                        case '0':
                                                            for ($i = $formt_reminder_date; $i <= $formt_start_reminder2; $i->modify('+1 day')) {
                                                                $delay_frequency[] = $i->format("Y-m-d");
                                                            }
                                                            array_push($delay_frequency, $reminder_date);
                                                            break;
                                                        default:
                                                            break;
                                                    }

                                                    $removed = array_pop($delay_frequency);

                                                    if (array_intersect([$current_date], $delay_frequency)) {

                                                        $user = $dep_value->dept_head_mail;
                                                        $name = $dep_value->dept_head_name;
                                                        $review_date = $reminder_date;

                                                        Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                                            $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                                            $m->to($user, 'admin')->subject('Delay quaterly action plan review!');
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                $day_frequency = [];
                                $delay_frequency = [];
                                $total_quart_month = [];
                            }
                            // Start Half Yearly
                            if ($action_value['control_point'] == 'Half Yearly') {

                                $Dept_head_data = DB::table('employers')->select('employers.name as dept_head_name', 'employers.email as dept_head_mail')
                                    ->join('department_masters', 'employers.user_id', '=', 'department_masters.user_id')
                                    ->where('department_masters.id', '=', $action_value['dept_id'])
                                    ->get();

                                $schedule_month_date = DB::table('action_plan_schedules')->select('month_date')->where('deleted_at', null)->where('action_plan_id', $action_value['id'])->orderBy('id', 'DESC')->first();

                                $t = json_encode($schedule_month_date);
                                $tt = json_decode($t, true);
                                $ttt = implode($tt);

                                $schedule_month_year = date('m-Y', strtotime($ttt));

                                date_add($date, date_interval_create_from_date_string(($action_value['reminder_date'] - 1) . ' days'));
                                $reminder_date = date_format($date, 'Y-m-d');
                                $formt_reminder_date = new DateTime($reminder_date);
                                $start_date = $action_value['start_date'];
                                $formt_start_date = new DateTime($start_date);
                                $end_date = $action_value['end_date'];
                                $formt_end_date = new DateTime($end_date);
                                $definition = $action_value['definition'];
                                $control_point = $action_value['control_point'];

                                if (($formt_current_date >= $formt_start_date) && ($current_new_date <= $formt_end_date)) {

                                    $start_month = date('m', strtotime($start_date));
                                    $add_mont = 6;
                                    for ($i = 2; $i > 0; $i--) {
                                        $quart_month = $start_month + $add_mont;
                                        $start_month = $quart_month;
                                        $end_month = date('m-Y', strtotime($end_date));
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

                                    if (in_array($date_month, $total_half_month)) {

                                        if (($current_month_year != $schedule_month_year)) {
                                            if ($formt_current_date <= $formt_reminder_date) {
                                                $start_reminder = date("Y-m-d", strtotime("$reminder_date -7 day"));
                                                $formt_start_reminder = new DateTime($start_reminder);

                                                if ($formt_start_reminder <= $formt_reminder_date) {
                                                    $frequency = $action_value['reminder_frequency'];
                                                    switch ($frequency) {
                                                        case '0':
                                                            for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+1 day')) {
                                                                $day_frequency[] = $i->format("Y-m-d");
                                                            }
                                                            array_push($day_frequency, $reminder_date);
                                                            break;
                                                        case '1':
                                                            for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+2 day')) {
                                                                $day_frequency[] = $i->format("Y-m-d");
                                                            }
                                                            array_push($day_frequency, $reminder_date);
                                                            break;
                                                        case '2':
                                                            for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+3 day')) {
                                                                $day_frequency[] = $i->format("Y-m-d");
                                                            }
                                                            array_push($day_frequency, $reminder_date);
                                                            break;
                                                        case '3':
                                                            for ($i = $formt_start_reminder; $i <= $formt_reminder_date; $i->modify('+4 day')) {
                                                                $day_frequency[] = $i->format("Y-m-d");
                                                            }
                                                            array_push($day_frequency, $reminder_date);
                                                            break;

                                                        default:
                                                            break;
                                                    }

                                                    if (array_intersect([$current_date], $day_frequency)) {

                                                        foreach ($Dept_head_data as $dkey => $dep_value) {
                                                            if ($dep_value) {
                                                                $user = $dep_value->dept_head_mail;
                                                                $name = $dep_value->dept_head_name;
                                                                $review_date = $reminder_date;

                                                                Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                                                    $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                                                    $m->to($user, 'admin')->subject('Upcoming half yearly action plan review!');
                                                                });
                                                            }
                                                        }
                                                    }
                                                }
                                            } else {

                                                foreach ($Dept_head_data as $dkey => $dep_value) {

                                                    // delay frequency
                                                    $add_reminder = date("Y-m-d", strtotime("$reminder_date +1 day"));
                                                    $formt_reminder_date = new DateTime($add_reminder);
                                                    $formt_current_date = new DateTime($current_date);
                                                    $start_reminder2 = date("Y-m-d", strtotime("$reminder_date +3 day"));
                                                    $formt_start_reminder2 = new DateTime($start_reminder2);

                                                    switch ($frequency) {
                                                        case '0':
                                                            for ($i = $formt_reminder_date; $i <= $formt_start_reminder2; $i->modify('+1 day')) {
                                                                $delay_frequency[] = $i->format("Y-m-d");
                                                            }
                                                            array_push($delay_frequency, $reminder_date);
                                                            break;
                                                        default:
                                                            break;
                                                    }

                                                    $removed = array_pop($delay_frequency);
                                                    if (array_intersect([$current_date], $delay_frequency)) {
                                                        $user = $dep_value->dept_head_mail;
                                                        $name = $dep_value->dept_head_name;
                                                        $review_date = $reminder_date;

                                                        Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                                            $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                                            $m->to($user, 'admin')->subject('Delay half yearly action plan review!');
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    $day_frequency = [];
                                    $delay_frequency = [];
                                    $total_half_month = [];
                                }
                            }

                            // Start Yearly
                            if ($action_value['control_point'] == 'Yearly') {
                                print_r("YEarly");
                                print_r($action_value['definition']);
                                print_r($action_value['reminder_date']);
                                $Dept_head_data = DB::table('employers')->select('employers.name as dept_head_name', 'employers.email as dept_head_mail')
                                    ->join('department_masters', 'employers.user_id', '=', 'department_masters.user_id')
                                    ->where('department_masters.id', '=', $action_value['dept_id'])
                                    ->get();

                                $schedule_month_date = DB::table('action_plan_schedules')->select('month_date')->where('deleted_at', null)->where('action_plan_id', $action_value['id'])->orderBy('id', 'DESC')->first();

                                $t = json_encode($schedule_month_date);
                                $tt = json_decode($t, true);
                                $ttt = implode($tt);

                                $schedule_month_year = date('m-Y', strtotime($ttt));

                                date_add($date, date_interval_create_from_date_string(($action_value['reminder_date'] - 1) . ' days'));
                                $formt_current_date = new DateTime($current_date);
                                $reminder_date = date_format($date, 'Y-m-d');
                                $formt_reminder_date = new DateTime($reminder_date);
                                $start_date = $action_value['start_date'];
                                $formt_start_date = new DateTime($start_date);
                                $end_date = $action_value['end_date'];
                                $formt_end_date = new DateTime($end_date);
                                $definition = $action_value['definition'];
                                $control_point = $action_value['control_point'];

                                if (($formt_current_date >= $formt_start_date) && ($current_new_date <= $formt_end_date)) {

                                    $start_month = date('m', strtotime($start_date));
                                    $add_mont = 12;

                                    for ($i = 1; $i > 0; $i--) {
                                        $quart_month = $start_month + $add_mont;
                                        $start_month = $quart_month;
                                        $end_month = date('m-Y', strtotime($action_value->end_date));
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

                                    if (in_array($date_month, $total_year_month)) {

                                        if (($current_month_year != $schedule_month_year)) {

                                            if ($formt_current_date <= $formt_reminder_date) {

                                                $start_reminder = date("Y-m-d", strtotime("$reminder_date -7 day"));
                                                $formt_start_reminder = new DateTime($start_reminder);

                                                if ($formt_start_reminder <= $formt_reminder_date) {
                                                    $frequency = $action_value['reminder_frequency'];
                                                    switch ($frequency) {
                                                        case '0':
                                                            for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+1 day')) {
                                                                $day_frequency[] = $i->format("Y-m-d");
                                                            }
                                                            array_push($day_frequency, $reminder_date);
                                                            break;
                                                        case '1':
                                                            for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+2 day')) {
                                                                $day_frequency[] = $i->format("Y-m-d");
                                                            }
                                                            array_push($day_frequency, $reminder_date);
                                                            break;
                                                        case '2':
                                                            for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+3 day')) {
                                                                $day_frequency[] = $i->format("Y-m-d");
                                                            }
                                                            array_push($day_frequency, $reminder_date);
                                                            break;
                                                        case '3':
                                                            for ($i = $formt_start_reminder; $i <= $formt_reminder_date; $i->modify('+4 day')) {
                                                                $day_frequency[] = $i->format("Y-m-d");
                                                            }
                                                            array_push($day_frequency, $reminder_date);
                                                            break;

                                                        default:
                                                            break;
                                                    }

                                                    if (array_intersect([$current_date], $day_frequency)) {

                                                        foreach ($Dept_head_data as $dkey => $dep_value) {

                                                            if ($dep_value) {
                                                                $user = $dep_value->dept_head_mail;
                                                                $name = $dep_value->dept_head_name;
                                                                $review_date = $reminder_date;

                                                                Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                                                    $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                                                    $m->to($user, 'admin')->subject('Upcoming yearly action plan review!');
                                                                });
                                                            }
                                                        }
                                                    }
                                                }
                                            } else {
                                                foreach ($Dept_head_data as $dkey => $dep_value) {
                                                    // delay frequency
                                                    $add_reminder = date("Y-m-d", strtotime("$reminder_date +1 day"));
                                                    $formt_reminder_date = new DateTime($add_reminder);
                                                    $formt_current_date = new DateTime($current_date);
                                                    $start_reminder2 = date("Y-m-d", strtotime("$reminder_date +3 day"));
                                                    $formt_start_reminder2 = new DateTime($start_reminder2);

                                                    switch ($frequency) {
                                                        case '0':
                                                            for ($i = $formt_reminder_date; $i <= $formt_start_reminder2; $i->modify('+1 day')) {
                                                                $delay_frequency[] = $i->format("Y-m-d");
                                                            }
                                                            array_push($delay_frequency, $reminder_date);
                                                            break;
                                                        default:
                                                            break;
                                                    }

                                                    $removed = array_pop($delay_frequency);

                                                    if (array_intersect([$current_date], $delay_frequency)) {
                                                        $user = $dep_value->dept_head_mail;
                                                        $name = $dep_value->dept_head_name;
                                                        $review_date = $reminder_date;

                                                        Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                                            $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                                            $m->to($user, 'admin')->subject('Delay yearly action plan review!');
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    $delay_frequency = [];
                                    $day_frequency = [];
                                    $total_year_month = [];
                                }
                            }
                        }
                    }
                }
            }
            return ('sucees');
        }
    }
}
