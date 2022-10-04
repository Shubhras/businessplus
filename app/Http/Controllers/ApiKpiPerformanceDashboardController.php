<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;

class ApiKpiPerformanceDashboardController extends ResponseApiController
{
    /**
     * Get kpi in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_get_kpi_performance_dash(Request $request)
    {
        $kpi_performance_dashes = DB::table('kpi_performance_dashes')->select('id as kpi_performance_dash_id', 'name')
            ->where('deleted_at', null)
            ->get();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "kpi list response";
        $this->apiResponse['data'] = $kpi_performance_dashes;
        return $this->sendResponse();
    }
    /**
     * View KPI Trackers to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_kpi_performance(Request $request)
    {
        $add_kpis_data = DB::table('add_kpis')->select('add_kpis.id as kpi_id', 'add_kpis.kpi_name', 'add_kpis.kpi_performance', 'add_kpis.performance_dash', 'kpi_performance_dashes.name as performance_dash_name')
            ->leftjoin('kpi_performance_dashes', 'add_kpis.performance_dash', '=', 'kpi_performance_dashes.id')
            ->where('add_kpis.deleted_at', null)
            ->where('add_kpis.unit_id', $request->unit_id)
            ->where('add_kpis.kpi_performance', 1)
            ->orderBy('add_kpis.id', 'desc')
            ->get();

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "KPI Trackers data list response";
        $this->apiResponse['data'] = $add_kpis_data;
        return $this->sendResponse();
    }
    /**
     * Store edit KPI Trackerss in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_update_performance_kpi(Request $request)
    {
        $kpi_data = DB::table('add_kpis')->where('kpi_performance', 1)->where('performance_dash', $request->kpi_performance_dash_id)->first();
        if (empty($kpi_data) || $request->kpi_performance_dash_id == 1) {
            $date = date("Y-m-d h:i:s");
            DB::table('add_kpis')->where('id', $request->kpi_id)->update([
                'performance_dash' => $request->kpi_performance_dash_id,
                'created_at' => $date,
            ]);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = "Successfully update performance dashboard kpi!";
            return $this->sendResponse();
        } else {
            $message = "already assign this categories!";
            $errors = "already assign this categories!";
            return $this->respondValidationError($message, $errors);
        }
    }
    /**
     * View Lead KPI Trackers to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_performance_kpi_dashboard(Request $request)
    {
        $requested_dept_id = explode(',', $request->dept_id);
        
        $months = ['jan' => 1, 'feb' => 2, 'mar' => 3, 'apr' => 4, 'may' => 5, 'jun' => 6, 'jul' => 7, 'aug' => 8, 'sep' => 9, 'oct' => 10, 'nov' => 11, 'dec' => 12];

        // $add_kpis_data = DB::table('add_kpis')->select('lead_kpi', 'add_kpis.id as kpi_id', 'add_kpis.kpi_name', 'units.id as unit_id', 'units.unit_name', 'add_kpis.department_id', 'department_masters.dept_name', 'add_kpis.section_id', 'sections.section_name', 'add_kpis.ideal_trend', 'add_kpis.unit_of_measurement', 'u_o_ms.name as u_o_m_name', 'add_kpis.target_range_min', 'add_kpis.target_range_max', 'add_kpis.kpi_definition', 'users.id as user_id', 'users.name as user_name', 'add_kpis.performance_dash', 'kpi_performance_dashes.slug', 'kpi_performance_dashes.name as performance_dash_name')
        //     ->leftjoin('units', 'add_kpis.unit_id', '=', 'units.id')
        //     ->leftjoin('department_masters', 'add_kpis.department_id', '=', 'department_masters.id')
        //     ->leftjoin('sections', 'add_kpis.section_id', '=', 'sections.id')
        //     ->leftjoin('users', 'add_kpis.user_id', '=', 'users.id')
        //     ->leftjoin('kpi_performance_dashes', 'add_kpis.performance_dash', '=', 'kpi_performance_dashes.id')
        //     ->leftjoin('u_o_ms', 'add_kpis.unit_of_measurement', '=', 'u_o_ms.id')
        //     ->where('add_kpis.deleted_at', NULL)
        //     ->where('add_kpis.unit_id', $request->unit_id)
        //     //->where('add_kpis.department_id',$row->id)
        //     //->orderBy('add_kpis.id', 'desc')
        //     ->where('add_kpis.kpi_performance', 1)
        //     ->whereNotIn('add_kpis.performance_dash', array(0, 1))
        //     //->whereIn('add_kpis.performance_dash','!=',[0,1])
        //     ->orderByRaw("FIELD(kpi_performance_dashes.slug , 'Customer', 'Company', 'Employee') ASC")
        //     ->get();

        // $add_kpis_data = DB::table('add_kpis')->select('*')
        $add_kpis_data = DB::table('add_kpis')->select('lead_kpi', 'add_kpis.id as kpi_id', 'add_kpis.kpi_name', 'units.id as unit_id', 'units.unit_name', 'add_kpis.department_id', 'department_masters.dept_name', 'add_kpis.section_id', 'sections.section_name', 'add_kpis.ideal_trend', 'add_kpis.unit_of_measurement', 'u_o_ms.name as u_o_m_name', 'add_kpis.target_range_min', 'add_kpis.target_range_max', 'add_kpis.kpi_definition', 'users.id as user_id', 'users.name as user_name', 'add_kpis.performance_dash', 'kpi_performance_dashes.slug', 'kpi_performance_dashes.name as performance_dash_name')
            ->leftjoin('units', 'add_kpis.unit_id', '=', 'units.id')
            ->leftjoin('department_masters', 'add_kpis.department_id', '=', 'department_masters.id')
            ->leftjoin('sections', 'add_kpis.section_id', '=', 'sections.id')
            ->leftjoin('users', 'add_kpis.user_id', '=', 'users.id')
            ->leftjoin('kpi_performance_dashes', 'add_kpis.performance_dash', '=', 'kpi_performance_dashes.id')
            ->leftjoin('u_o_ms', 'add_kpis.unit_of_measurement', '=', 'u_o_ms.id')
            ->whereIn('add_kpis.department_id', $requested_dept_id)
            ->where('add_kpis.unit_id', $request->unit_id)
            // ->where('add_kpis.department_id',$row->id)
            ->orderBy('add_kpis.id', 'desc')
            // ->whereIn('add_kpis.kpi_performance', [1,'yes'])
            ->where('add_kpis.performance_dash', 1)
            ->where('add_kpis.lead_kpi', 1)
            ->where('add_kpis.deleted_at', null)

        // ->whereIn('add_kpis.performance_dash','!=',[0,1])
            ->orderByRaw("FIELD(kpi_performance_dashes.slug , 'Customer', 'Company', 'Employee') ASC")
            ->get();

        $date = date('Y');
        $year_upto = 4;
        $month = date('m');
        $prev_month = date('m');
        $year_range_master = [$date];
        for ($i = 1; $i <= $year_upto; $i++) {
            array_push($year_range_master, $date - $i);
        }
        foreach ($add_kpis_data as $key4 => $row_bf_ty) {
            $year_range = $year_range_master;
            $kpi_targets_yr = DB::table('kpi_targets')->select('id as target_id', 'ytd', 'target_year', 'kpi_id', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec')
                ->where('kpi_targets.kpi_id', $row_bf_ty->kpi_id)
                ->where('kpi_targets.target_year', '<=', $date)
                ->where('kpi_targets.target_year', '>=', ($date - $year_upto))
                ->get();
            if (count($kpi_targets_yr) > 0) {
                foreach ($kpi_targets_yr as $key_a => $kpi_a) {
                    $current_month_target = 0;
                    $total_avg = 0;
                    foreach ($kpi_a as $k => $m) {
                        if (isset($months[$k]) && $months[$k] <= $month) {
                            $current_month_target += $m;
                        }
                    }
                    $kpi_a->current_month_target = $current_month_target;
                    foreach ($kpi_targets_yr as $key_b => $kpi_b) {
                        $total_Avg = (($kpi_b->apr + $kpi_b->may + $kpi_b->jun + $kpi_b->jul + $kpi_b->aug + $kpi_b->sep + $kpi_b->oct + $kpi_b->nov + $kpi_b->dec + $kpi_b->jan + $kpi_b->feb + $kpi_b->mar) / 12);
                        $kpi_b->avg = round($total_Avg, 2);
                        $total_Avg = 0;
                        /*  if ($kpi_a->target_year == ($kpi_b->target_year - 1)) {
                        $total_avg = round(($kpi_a->apr + $kpi_a->may + $kpi_a->june + $kpi_a->july + $kpi_a->aug + $kpi_a->sept + $kpi_a->oct + $kpi_a->nov + $kpi_a->dec + $kpi_b->jan + $kpi_b->feb + $kpi_b->mar) / 12);
                        $add_kpis_data[$key4]->kpi_targets[] = array("kpi_id" => $kpi_a->kpi_id, "target_year" => $kpi_a->target_year, "avg" => $total_avg);
                        }*/
                        $index = array_search($kpi_b->target_year, $year_range);
                        if ($index >= 0) {
                            unset($year_range[$index]);
                        }
                    }
                    /* if ($kpi_a->target_year == $date) {
                    $add_kpis_data[$key4]->kpi_targets[] = $kpi_a;
                    $add_kpis_data[$key4]->has_kpi_target = true;
                    } else {
                    $add_kpis_data[$key4]->has_kpi_target = false;
                    } */
                    if (count($year_range) > 0 && $key_a == 0) {
                        foreach ($year_range as $year) {
                            $add_kpis_data[$key4]->kpi_targets[] = array("kpi_id" => $kpi_a->kpi_id, "target_year" => $year, "avg" => 0, "current_month_target" => 0);
                        }
                    }
                    $add_kpis_data[$key4]->kpi_targets[] = $kpi_a;
                }
            }
        }
        $currnent_month = date('m');
        $year_ranges_master = [$date];
        for ($j = 1; $j <= 4; $j++) {
            array_push($year_ranges_master, $date - $j);
        }
        foreach ($add_kpis_data as $key6 => $row_bf_ay) {
            $year_ranges = $year_ranges_master;
            $kpi_actuals_yr = DB::table('kpi_actuals')->select('id as actual_id', 'ytd', 'actual_year', 'kpi_id', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec')
                ->where('kpi_actuals.kpi_id', $row_bf_ay->kpi_id)
                ->where('kpi_actuals.actual_year', '<=', $date)
                ->where('kpi_actuals.actual_year', '>=', ($date - $year_upto))
                ->get();

            if (count($kpi_actuals_yr) > 0) {
                foreach ($kpi_actuals_yr as $key_act_a => $kpi_act_a) {
                    $current_month_actual = 0;
                    $total_avg = 0;
                    foreach ($kpi_act_a as $k => $m) {
                        if (isset($months[$k]) && $months[$k] <= $month) {
                            $current_month_actual += $m;
                        }
                    }
                    $kpi_act_a->current_month_actual = $current_month_actual;
                    foreach ($kpi_actuals_yr as $key_act_b => $kpi_act_b) {

                        $total_Actual_Avg = (($kpi_act_b->apr + $kpi_act_b->may + $kpi_act_b->jun + $kpi_act_b->jul + $kpi_act_b->aug + $kpi_act_b->sep + $kpi_act_b->oct + $kpi_act_b->nov + $kpi_act_b->dec + $kpi_act_b->jan + $kpi_act_b->feb + $kpi_act_b->mar) / 12);

                        $kpi_act_b->avg = round($total_Actual_Avg, 2);
                        $total_Actual_Avg = 0;

                        /*  if ($kpi_act_a->actual_year == ($kpi_act_b->actual_year - 1)) {
                        $total_avg = round(($kpi_act_a->apr + $kpi_act_a->may + $kpi_act_a->june + $kpi_act_a->july + $kpi_act_a->aug + $kpi_act_a->sept + $kpi_act_a->oct + $kpi_act_a->nov + $kpi_act_a->dec + $kpi_act_b->jan + $kpi_act_b->feb + $kpi_act_b->mar) / 12);
                        $add_kpis_data[$key6]->kpi_actuals[] = array("kpi_id" => $kpi_act_a->kpi_id, "actual_year" => $kpi_act_a->actual_year, "avg" => $total_avg);
                        }*/
                        $index = array_search($kpi_act_b->actual_year, $year_ranges);
                        if ($index >= 0) {
                            unset($year_ranges[$index]);
                        }
                    }
                    /*  if ($kpi_act_a->actual_year == $date) {
                    $add_kpis_data[$key6]->kpi_actuals[] = $kpi_act_a;
                    $add_kpis_data[$key6]->has_kpi_actual = true;
                    } else {
                    $add_kpis_data[$key6]->has_kpi_actual = false;
                    } */
                    if (count($year_ranges) > 0 && $key_act_a == 0) {
                        foreach ($year_ranges as $years) {
                            $add_kpis_data[$key6]->kpi_actuals[] = array("kpi_id" => $kpi_act_a->kpi_id, "actual_year" => $years, "avg" => 0, "current_month_actual" => 0);
                        }
                    }
                    $add_kpis_data[$key6]->kpi_actuals[] = $kpi_act_a;
                }
            } else {
                $add_kpis_data[$key6]->kpi_actuals = array();
                if (count($year_ranges) > 0) {
                    foreach ($year_ranges as $years) {
                        array_push($add_kpis_data[$key6]->kpi_actuals, array("kpi_id" => $row_bf_ay->kpi_id, "actual_year" => $years, "avg" => 0));
                    }
                }
            }
        }
        foreach ($add_kpis_data as $addkpikey => $addkpivalue) {
            if ($addkpivalue->kpi_targets[4]->ytd == "0.0") {
                $addkpivalue->kpistatus = 0;
            } else {
                $addkpivalue->kpistatus = (($addkpivalue->kpi_actuals[4]->ytd) / ($addkpivalue->kpi_targets[4]->ytd));
            }
        }
        //  }
        foreach ($add_kpis_data as $addkpikey => $addkpivalue) {
            if ($addkpivalue->kpi_targets[4]->ytd == "0.0") {
                $addkpivalue->kpistatus = 0;
            } else {
                $addkpivalue->kpistatus = (($addkpivalue->kpi_actuals[4]->ytd) / ($addkpivalue->kpi_targets[4]->ytd));
            }
        }
        unset($key1, $key2, $key6, $key4, $row, $row_kpi);
        /* if(!empty($add_kpis_data)){
        foreach ($add_kpis_data as $key_data => $row_data){
        if(in_array($row_data->performance_dash, [2,3,4,5])){
        $data['Customer'][] = $row_data;
        }else if(in_array($row_data->performance_dash, [6,7,8,9,10,11,12,13])){
        $data['Company'][] = $row_data;
        }else if(in_array($row_data->performance_dash, [14,15,16,17])){
        $data['Employee'][] = $row_data;
        }
        }
        }
        if(empty($data['Company'])){
        $data['Company'] = '';
        }
        if(empty($data['Customer'])){
        $data['Customer'] = '';
        }
        if(empty($data['Employee'])){
        $data['Employee'] = '';
        } */
        // print_r($add_kpis_data);die;
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "Lead KPI Trackers data list response";
        $this->apiResponse['data'] = $add_kpis_data;
        return $this->sendResponse();
    }
    /**
     * View view kpi dashboard to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_performance_status_kpi_dashboard(Request $request)
    {
        $department_data = DB::table('department_masters')->select('id as dept_id', 'dept_name')->where('deleted_at', null)->where('unit_id', $request->unit_id)->get();
        foreach ($department_data as $key => $dept_row) {
            $total_kpi = DB::table('add_kpis')->where('deleted_at', null)
                ->where('department_id', $dept_row->dept_id)
                ->where('kpi_performance', 1)
                ->whereNotIn('performance_dash', array(0, 1))
                ->count();
            $all_total_kpi = 0;
            $all_total_kpi = $all_total_kpi + $total_kpi;
            $department_data[$key]->all_total_kpi = $all_total_kpi;
            $department_data[$key]->total_kpi = $total_kpi;
            $department_data[$key]->green = 0;
            $department_data[$key]->red = 0;
            $department_data[$key]->yellow = 0;
            $department_data[$key]->gray = 0; //gray status count add to actual and target NULL both
            $kpi_data = DB::table('add_kpis')->select('id as kpi_id', 'kpi_name', 'department_id')->where('deleted_at', null)
                ->where('department_id', $dept_row->dept_id)
                ->where('kpi_performance', 1)
                ->whereNotIn('performance_dash', array(0, 1))
                ->get();
            $department_data[$key]->kpi_data = $kpi_data;
            foreach ($kpi_data as $key1 => $kpi_data_row) {
                $date = date('Y');
                $kpi_targets_yr = DB::table('kpi_targets')
                    ->where('kpi_id', $kpi_data_row->kpi_id)
                    ->where('target_year', $date)
                    ->first();

                if (!empty($kpi_targets_yr)) {
                    $total_target = ($kpi_targets_yr->jan + $kpi_targets_yr->feb + $kpi_targets_yr->mar + $kpi_targets_yr->apr + $kpi_targets_yr->may + $kpi_targets_yr->jun + $kpi_targets_yr->jul + $kpi_targets_yr->aug + $kpi_targets_yr->sep + $kpi_targets_yr->oct + $kpi_targets_yr->nov + $kpi_targets_yr->dec);
                    //print_r($total_target); die;
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
                    $total_actual = ($kpi_actuals_yr->jan + $kpi_actuals_yr->feb + $kpi_actuals_yr->mar + $kpi_actuals_yr->apr + $kpi_actuals_yr->may + $kpi_actuals_yr->jun + $kpi_actuals_yr->jul + $kpi_actuals_yr->aug + $kpi_actuals_yr->sep + $kpi_actuals_yr->oct + $kpi_actuals_yr->nov + $kpi_actuals_yr->dec);
                    $department_data[$key]->kpi_data[$key1]->total_actual = $total_actual;
                } else {
                    $department_data[$key]->kpi_data[$key1]->total_actual = null;
                }
                if ($total_target != 0 && $total_target != null && $total_actual != 0 && $total_actual != null) {
                    $avg = $total_target / $total_actual;
                    if ($avg >= 0.9) {
                        $department_data[$key]->green += 1;
                    } else if ($avg < 0.9 && $avg >= 0.7) {
                        $department_data[$key]->yellow += 1;
                    } else {
                        $department_data[$key]->red += 1;
                    }
                } else {
                    $avg = 'NULL';
                    $department_data[$key]->gray += 1;
                }
            }
            unset($department_data[$key]->kpi_data);
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "performance kpi status list response";
        $this->apiResponse['data'] = $department_data;
        return $this->sendResponse();
    }
}
