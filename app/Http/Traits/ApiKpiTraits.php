<?php

namespace App\Http\Traits;

use App\Models\Add_kpi;
use App\Models\Kpi_actual;
use Carbon\Carbon;
use DateTime;
use DB;
trait ApiKpiTraits
{

    /* kpi Target Conditions. */
    public function EditKPIActuallNull($request)
    {
        $target_data = DB::table('kpi_targets')->select('jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec')->where('id', $request->kpi_id)->first();

        $count = 0;
        $sum = 0;
        $lastmonth;
        if (!empty($target_data)) {

            foreach ($target_data as $k1 => $tvalue) {
                if ($tvalue != null) {
                    $count = $count + 1;
                    $sum = $sum + $tvalue;
                    $lastmonth = $tvalue;
                }
            }

            switch ($request->target_condition) {
                case "sum_up_all":
                    $target = $sum;
                    $target = round($target, 1);
                    break;
                case "average":
                    $target = $sum / 12;
                    $target = round($target, 1);
                    break;
                default:
                    $target = $lastmonth;
                    $target = round($target, 1);
            }
        }
        return $target;
    }
    public function UpdateTargetActuallNull($request)
    {
        $kpi_data = Add_kpi::select('target_condition')->where('id', $request->kpi_id)->first();

        $count = 0;
        $sum = 0;
        $lastmonth;
        if (!empty($request['targetData']['target_id']) && !empty($request['targetData']['target_year'])) {

            $temptarget = $request;
            $temptarget1 = $temptarget->except(['targetData.target_id', 'targetData.target_year']);

            foreach ($temptarget1['targetData'] as $k1 => $tvalue) {
                if ($tvalue != null) {
                    $count = $count + 1;
                    $sum = $sum + $tvalue;
                    $lastmonth = $tvalue;
                }
            }

            switch ($kpi_data->target_condition) {
                case "sum_up_all":
                    $target = $sum;
                    $target = round($target, 1);
                    break;
                case "average":
                    $target = $sum / 12;
                    $target = round($target, 1);
                    break;
                default:
                    $target = $lastmonth;
                    $target = round($target, 1);
            }
        }
        return $target;
    }
    public function KpiTargetActualbasedCondition($request)
    {
        $today = Carbon::now();
        $today = Carbon::now();
        $date_month = $today->format('M');
        $kpi_data = Add_kpi::select('target_condition')->where('id', $request->kpi_id)->first();
        $target_cond = $kpi_data->target_condition;
        //   dump($target_cond);
        if (!empty($request['targetData']['target_id']) && !empty($request['targetData']['target_year'])) {
            $count1 = 0;
            $sum1 = 0;
            $lastmonth;
            $temptarget = $kpi_actual_data;
            $temptarget1 = [];

            $temptarget1 = $request;
            // dump($request['updatedata']);

            $temptarget2 = $temptarget1->except(['targetData.target_id', 'targetData.target_year']);
            foreach ($request['updatedata'] as $ckey => $comment_data) {
                // $sum1 = $sum1;
                if ($comment_data['late_entry2'] == 'filled') {
                    $count1 = $count1 + 1;
                    $actualmonthname = [];
                    $actualmonthname = $comment_data['month'];
                    //    dump($actualmonthname);

                    foreach ($temptarget2['targetData'] as $k2 => $tvalue) {
                        if ($tvalue != null) {
                            $temptarget2[$k2]->value = $k2;
                            // dump ($temptarget2[$k2]->value);
                        }

                        if ($temptarget2[$k2]->value == $actualmonthname) {
                            $sum1 = $sum1 + $tvalue;
                            $lastmonth = $tvalue;

                        }
                    }
                }
                // else{
                //     foreach ($temptarget2['targetData'] as $k2 => $tvalue) {
                //         if ($tvalue != null) {
                //     $sum1 = $sum1+$tvalue;
                //         }
                //         dump($sum1);
                //     }
                // }
            }
            // if (empty($request['actualData']['jan']) && empty($request['actualData']['feb'])) {
            //     // dump("true");
            //     foreach ($temptarget2['targetData'] as $k22 => $ttvalue) {
            //         if ($ttvalue != null) {
            //             $count1 = $count1 + 1;
            //             $sum1 = $sum1 + $ttvalue;
            //         }
            //     }
            // }
            //   dump($kpi_data->target_condition);
            switch ($kpi_data->target_condition) {
                case "sum_up_all":
                    $target2 = $sum1;
                    $target2 = round($target2, 1);
                    // dump($target2);

                    break;
                case "average":
                    $target2 = $sum1 / $count1;

                    $target2 = round($target2, 1);
                    // dump($target2);
                    break;
                default:
                    // dump(true);
                    $target2 = $lastmonth;
                    $target2 = round($target2, 1);
            }
        }
        // dump
        //    dump($target2); die;
        return $target2;
    }
//  target calculation on add kpi
    public function KpiTargetCondition($request)
    {
        $today = Carbon::now();
        // dump($today->format('M'));
        $current_month = $today->format('M');
        // if($current_month == 'Jan'){

        //     $total = $request->jan+0;
        // }
        // if($current_month == 'Feb'){
        //     $total = $request->jan + $request->feb;
        // }
        // if($current_month == 'Mar'){

        //     $total = $request->jan + $request->feb;
        // }
        // if($current_month == 'Apr'){
        //     $total = $request->jan + $request->feb + $request->mar;
        // }
        // if($current_month == 'May'){
        //     $total = $request->jan + $request->feb + $request->mar + $request->apr;
        // }
        // if($current_month == 'Jun'){
        //     $total = $request->jan + $request->feb + $request->mar + $request->apr + $request->may;
        // }
        // if($current_month == 'Jul'){
        //     $total = $request->jan + $request->feb + $request->mar + $request->apr + $request->may + $request->jun;
        // }
        // if($current_month == 'Aug'){
        //     $total = $request->jan + $request->feb + $request->mar + $request->apr + $request->may + $request->jun + $request->jul;
        // }
        // if($current_month == 'Sep'){
        //     $total = $request->jan + $request->feb + $request->mar + $request->apr + $request->may + $request->jun + $request->jul + $request->aug;
        // }

        // if($current_month == 'Oct'){
        //     $total = $request->jan + $request->feb + $request->mar + $request->apr + $request->may + $request->jun + $request->jul + $request->aug + $request->sep;
        // }
        // if($current_month == 'Nov'){
        //     $total = $request->jan + $request->feb + $request->mar + $request->apr + $request->may + $request->jun + $request->jul + $request->aug + $request->sep + $request->oct;
        // }
        // if($current_month == 'Dec'){
        //     $total = $request->jan + $request->feb + $request->mar + $request->apr + $request->may + $request->jun + $request->jul + $request->aug + $request->sep + $request->oct + $request->nov + $request->dec;
        // }
        $total = 0;
        $total = $request->jan + $request->feb + $request->mar + $request->apr + $request->may + $request->jun + $request->jul + $request->aug + $request->sep + $request->oct + $request->nov + $request->dec;

        switch ($request->target_condition) {
            case "sum_up_all":
                $target = $total;
                $target = round($total, 1);
                break;
            case "average":
                $target = $total / 12;
                $target = round($target, 1);
                break;
            default:
                $target = $request->dec;
                $target = round($target, 1);
        }
        return $target;
    }

    // calculate year end for target based on target condition
    public function KpiTargetYearEndCondition($request)
    {
        $target_data = DB::table('kpi_targets')->select('target_condition', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec')->where('id', $request->kpi_id)->first();

        $total = 0;
        $total = $target_data->jan + $target_data->feb + $target_data->mar + $target_data->apr + $target_data->may + $target_data->jun + $target_data->jul + $target_data->aug + $target_data->sep + $target_data->oct + $target_data->nov + $target_data->dec;
        // echo "<pre>"; dump('target_data',$target_data);exit;
        if ($request->target_condition) {
            
            $target_condition = $request->target_condition;
            // echo "<pre>"; dump('if',$target_condition);
        } else {
            
            $target_condition = $target_data->target_condition;
            // echo "<pre>"; dump('else',$target_condition);
        }
        // echo "<pre>"; dump('target_condition',$target_condition);exit;

        switch ($target_condition) {
            case "sum_up_all":
                $target = $total;
                $target = round($total, 1);
                break;
            case "average":
                $target = $total / 12;
                $target = round($target, 1);
                break;
            default:
                $target = $target_data->dec;
                // echo "<pre>"; dump('target dec',$target);exit;
                $target = round($target, 1);
                }
        return $target;
    }
    /**

     *
     * @param string $fyear
     * @param int $frequency , Int $reminder_date
     *
     */

    public function getDayFrequecy(int $frequency, $formt_current_date, $formt_reminder_date, $reminder_date)
    {

        if ($formt_current_date <= $formt_reminder_date) {
            $start_reminder = date("Y-m-d", strtotime("$reminder_date -5 day"));
            $formt_start_reminder = new DateTime($start_reminder);
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
        } else {
            $start_reminder = date("Y-m-d", strtotime("$reminder_date +5 day"));
            $formt_start_reminder = new DateTime($start_reminder);
            switch ($frequency) {
                case '1':
                    for ($i = $formt_start_reminder; $i > $formt_reminder_date; $i->modify('-1 day')) {
                        $day_frequency[] = $i->format("Y-m-d");
                    }
                    array_push($day_frequency, $reminder_date);
                    break;
                case '2':
                    for ($i = $formt_start_reminder; $i > $formt_reminder_date; $i->modify('-2 day')) {
                        $day_frequency[] = $i->format("Y-m-d");
                    }
                    array_push($day_frequency, $reminder_date);
                    break;
                case '3':
                    for ($i = $formt_start_reminder; $i >= $formt_reminder_date; $i->modify('-3 day')) {
                        $day_frequency[] = $i->format("Y-m-d");
                    }
                    array_push($day_frequency, $reminder_date);
                    break;

                default:

                    break;
            }
        }
        return $day_frequency;
    }

    /**
     * get kpi data
     */
    public function getKpiData(int $deptId, $start_date, $end_date)
    {
        $kpi_data = Add_kpi::select('add_kpis.*', 'department_masters.user_id as dept_admin_id', 'employers.email as dept_admin')->where('department_id', $deptId)
            ->leftjoin('department_masters', 'add_kpis.department_id', '=', 'department_masters.id')
            ->leftjoin('employers', 'department_masters.user_id', '=', 'employers.user_id')
            ->where(function ($q) use ($start_date, $end_date) {
                $q->whereBetween('add_kpis.start_date', [$start_date, $end_date])
                    ->orwhereBetween('add_kpis.end_date', [$start_date, $end_date])
                    ->orwhere(function ($p) use ($start_date, $end_date) {
                        $p->where('add_kpis.start_date', '<=', $start_date)
                            ->where('add_kpis.end_date', '>=', $end_date);
                    });
            })->get()->toarray();

        return $kpi_data;
    }
    /**
     * get Actual Data
     *
     * @param int $kpi_id , int $cyear
     */

    public function getActualData(array $kvalue, int $cyear, int $cmonth, array $ddata, $reminder_date, $current_date, $upcoming_event_date = null)
    {
        if (!empty($upcoming_event_date)) {
            $upcoming_event_date = $upcoming_event_date;
        }

        $Actual_data = Kpi_actual::select('kpi_actuals.*', 'employers.email')->where('kpi_id', $kvalue['id'])->where('actual_year', $cyear)
            ->leftjoin('employers', 'kpi_actuals.user_id', '=', 'employers.user_id')
            ->get()->toArray();

        $actual_array = [];
        $upcomping_review = [];

        if (!empty($Actual_data)) {

            /* $month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'user_id'];
            print_r($month); */
            $month = ['jan' => 0, 'feb' => 1, 'mar' => 2, 'apr' => 3, 'may' => 4, 'jun' => 5, 'jul' => 6, 'aug' => 7, 'sep' => 8, 'oct' => 9, 'nov' => 10, 'dec' => 11];

            foreach ($Actual_data as $akey => $avalue) {
                foreach ($avalue as $mkey => $mvalue) {
                    //for all pending reviews.
                    if (array_key_exists($mkey, $month) && $month[$mkey] < $cmonth - 2) {
                        if (empty($mvalue)) {
                            $p = array('month' => [$mkey], 'actual_year' => $Actual_data[0]['actual_year'], 'kpi_id' => $kvalue['id'], 'kpi_name' => $kvalue['kpi_name'], 'dept_id' => $ddata['id'], 'dept_name' => $ddata['dept_name'], 'dept_admin' => $kvalue['dept_admin'], 'actual_user_id' => $avalue['user_id'], 'actual_user_email' => $avalue['email']);
                            $key = array_search($kvalue['id'], array_column($actual_array, 'kpi_id'));
                            if ($key > -1) {
                                array_push($actual_array[$key]['month'], $mkey);
                            } else {
                                array_push($actual_array, $p);
                            }
                        }
                    }

                    // for upcoming events.
                    if (array_key_exists($mkey, $month) && $month[$mkey] == $cmonth - 2) {
                        if (empty($mvalue)) {
                            if (($current_date >= $upcoming_event_date) && ($current_date <= $reminder_date)) {
                                $upcomping_review = array('month' => $mkey, 'actual_year' => $Actual_data[0]['actual_year'], 'kpi_id' => $kvalue['id'], 'kpi_name' => $kvalue['kpi_name'], 'dept_id' => $ddata['id'], 'dept_name' => $ddata['dept_name'], 'dept_admin' => $kvalue['dept_admin'], 'actual_user_id' => $avalue['user_id'], 'actual_user_email' => $avalue['email']);
                            } else {
                                if (!empty($actual_array)) {
                                    array_push($actual_array[$key]['month'], $mkey);
                                } else {
                                    $p = array('month' => [$mkey], 'actual_year' => $Actual_data[0]['actual_year'], 'kpi_id' => $kvalue['id'], 'kpi_name' => $kvalue['kpi_name'], 'dept_id' => $ddata['id'], 'dept_name' => $ddata['dept_name'], 'dept_admin' => $kvalue['dept_admin'], 'actual_user_id' => $avalue['user_id'], 'actual_user_email' => $avalue['email']);
                                    array_push($actual_array, $p);
                                }
                            }
                        }
                    }
                }
            }
        }
        return ['actual_data' => $Actual_data, 'actual_array' => $actual_array, 'upcomig_review' => $upcomping_review];
    }
    public function getActionPlanFrequency($control_point, $start_date, $end_date, $reminder_date, $frequency)
    {
        // $day_frequency = [];
        if ($control_point == 'Monthly') {
            $current_date = date("Y-m-d");
            $formt_current_date = new DateTime($current_date);
            $formt_start_date = new DateTime($start_date);
            $formt_end_date = new DateTime($end_date);
            $current_new_date = new DateTime(date("Y-m-d", strtotime("-1 months")));

            if (($formt_current_date >= $formt_start_date) && ($current_new_date <= $formt_end_date)) {
                $date = date_create(date('Y-m-d', strtotime("first day of")));
                date_add($date, date_interval_create_from_date_string(($reminder_date - 1) . ' days'));
                $reminder_date = date_format($date, 'Y-m-d');
                $current_date = date("Y-m-d");
                $formt_reminder_date = new DateTime($reminder_date);
                $formt_current_date = new DateTime($current_date);
                $formt_current_date = '2021-10-17 00:00:00.000000';

                if ($formt_current_date <= $formt_reminder_date) {
                    // print_r(" eggg");
                    // print_r($formt_reminder_date);
                    // print_r($formt_current_date);
                    $start_reminder = date("Y-m-d", strtotime("$reminder_date -4 day"));
                    $formt_start_reminder = new DateTime($start_reminder);
                    if ($formt_start_reminder <= $formt_reminder_date) {
                        // $frequency ='1';
                        switch ($frequency) {
                            case '0':
                                for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+1 day')) {
                                    $day_frequency[] = $i->format("Y-m-d");
                                }
                                array_push($day_frequency, $reminder_date);
                                // print_r('kyaa'.$frequency);die();
                                break;
                            case '1':
                                for ($i = $formt_start_reminder; $i < $formt_reminder_date; $i->modify('+2 day')) {
                                    $day_frequency[] = $i->format("Y-m-d");
                                    // print_r('1111'.$day_frequency);
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
                    }
                } else {

                    $pending_review[] = array('definition' => $action_plan_value->definition, 'control_point' => $action_plan_value->control_point, 'name' => $action_plan_value->name, 'review_month_date' => $reminder_date, 'status' => 'Delayed', 'color' => '#ef5350', 'dept_id' => $action_plan_value->dept_id);
                    $delay_date[] = date('Y-m-d', strtotime($reminder_date . ' + 3 days'));

                    if (array_intersect([$current_date], $delay_date)) {

                        // print_r($delay_date);
                        $user = $action_plan_value->dept_head;
                        $name = $action_plan_value->dept_head_name;
                        $definition = $action_plan_value->definition;
                        $review_date = $reminder_date;
                        $control_point = $action_plan_value->control_point;
                        if ($method === 'GET') {
                            //   print_r('I am in AP review');
                            //   print_r($user);
                            //   print_r($name);
                            //   print_r($definition);
                            //   print_r($review_date);
                            //   print_r($control_point);
                            //   $t ='ahujamohit327@gmail.com';
                            Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                $m->to($user, 'admin')->subject('Your Reminder +3 days monthly by rathor');
                            });
                        }
                    }
                }
            }
            return $day_frequency;
        }
    }
}
