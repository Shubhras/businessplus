<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use DateTime;
use Dwij\Laraadmin\Models\Module;
use Carbon\Carbon;
use Mail;
use App\Models\Login_access_token;
use App\Models\Strategic_objective;

class ApiMailFunAutoReminder extends ResponseApiController
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
    public function api_review_mail_action_plan(Request $request)
    {
     
        $pending_review = [];
        $total_actions = DB::table('employers')->select('employers.name', 'employers.mobile', 'employers.email', 'employers.role_id', 'employers.user_id', 'employers.company_id', 'action_plans.id as action_plan_id', 'action_plans.definition', 'action_plans.target', 'action_plans.control_point', 'action_plans.owner', 'action_plans.co_owner', 'action_plans.status', 'action_plans.unit_id', 'action_plans.initiatives_id', 'action_plans.start_date', 'action_plans.end_date', 'action_plans.reminder_date', 'action_plans.reminder_frequency', 'action_plan_schedules.month_date', 'action_plan_schedules.review_month_date', 'action_plan_schedules.comment', 'action_plan_schedules.implement_data', 'action_plan_schedules.recovery_plan', 'action_plan_schedules.responsibility', 'action_plans.dept_id', 'department_masters.dept_name', 'emp.user_id as dept_head_id', 'emp.name as dept_head_name', 'emp.email as dept_head')
            ->join('action_plans', 'employers.user_id', '=', 'action_plans.user_id')
            ->join('department_masters', 'action_plans.dept_id', '=', 'department_masters.id')
            ->join('employers as emp', 'department_masters.user_id', '=', 'emp.user_id')
            ->join('action_plan_schedules', 'action_plans.id', '=', 'action_plan_schedules.action_plan_id')
            ->whereRaw("FIND_IN_SET(" . $request->unit_id . ",employers.multi_unit_id)")
            ->where('employers.company_id', $request->company_id)
            ->whereIn('action_plans.dept_id', $request->dept_alot)
            ->where('action_plans.deleted_at', NULL)
            ->where('action_plans.unit_id', $request->unit_id)
            ->where('action_plan_schedules.deleted_at', NULL)
            ->where('department_masters.deleted_at', NULL)
            ->where('action_plan_schedules.review_month_date', NULL)
            ->get();

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
    // dump($reminder_date,  $current_date);
    // dump($action_plan_value);
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

                            $pending_review[] = array('definition' => $action_plan_value->definition, 'control_point' => $action_plan_value->control_point, 'name' => $action_plan_value->name, 'review_month_date' => $reminder_date, 'status' => 'Upcoming', 'color' => '#ffd933','dept_id'=>$action_plan_value->dept_id);

                            if (array_intersect([$current_date], $day_frequency)) {
                                $user = $action_plan_value->email;
                                $name = $action_plan_value->name;
                                $definition = $action_plan_value->definition;
                                $review_date = $reminder_date;
                                $control_point = $action_plan_value->control_point;
     
                            
                                // Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                //     $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                //     $m->to($user, 'admin')->subject('Your Reminder1!');
                                // });
                            }
                        }
                    } else {
                        $pending_review[] = array('definition' => $action_plan_value->definition, 'control_point' => $action_plan_value->control_point, 'name' => $action_plan_value->name, 'review_month_date' => $reminder_date, 'status' => 'Delayed', 'color' => '#ef5350','dept_id'=>$action_plan_value->dept_id);
                        $delay_date[] = date('Y-m-d', strtotime($reminder_date . ' + 5 days'));
                        if (array_intersect([$current_date], $delay_date)) {
                            $user = $action_plan_value->dept_head;
                            $name = $action_plan_value->dept_head_name;
                            $definition = $action_plan_value->definition;
                            $review_date = $reminder_date;
                            $control_point = $action_plan_value->control_point;
                           
                            // Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                            //     $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                            //     $m->to($user, 'admin')->subject('Your Reminder22!');
                            // });
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
                                $pending_review[] = array('definition' => $action_plan_value->definition, 'control_point' => $action_plan_value->control_point, 'name' => $action_plan_value->name, 'review_month_date' => $reminder_date, 'status' => 'Upcoming', 'color' => '#ffd933','dept_id'=>$action_plan_value->dept_id);
                                if (array_intersect([$current_date], $day_frequency)) {
                                    $user = $action_plan_value->email;
                                    $name = $action_plan_value->name;
                                    $definition = $action_plan_value->definition;
                                    $review_date = $reminder_date;
                                    $control_point = $action_plan_value->control_point;
                                    /*  Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                        $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                        $m->to($user, 'admin')->subject('Your Reminder!');
                                    }); */
                                }
                            }
                        } else {
                            $pending_review[] = array('definition' => $action_plan_value->definition, 'control_point' => $action_plan_value->control_point, 'name' => $action_plan_value->name, 'review_month_date' => $reminder_date, 'status' => 'Delayed', 'color' => '#ef5350','dept_id'=>$action_plan_value->dept_id);

                            $delay_date[] = date('Y-m-d', strtotime($reminder_date . ' + 4 days'));
                            if (array_intersect([$current_date], $delay_date)) {
                                $user = $action_plan_value->dept_head;
                                $name = $action_plan_value->dept_head_name;
                                $definition = $action_plan_value->definition;
                                $review_date = $reminder_date;
                                $control_point = $action_plan_value->control_point;
                                
                                Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                    $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                    $m->to($user, 'admin')->subject('Your Reminder2!');
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
                                $pending_review[] = array('definition' => $action_plan_value->definition, 'control_point' => $action_plan_value->control_point, 'name' => $action_plan_value->name, 'review_month_date' => $reminder_date, 'status' => 'Upcoming', 'color' => '#ffd933','dept_id'=>$action_plan_value->dept_id);

                                if (array_intersect([$current_date], $day_frequency)) {
                                    $user = $action_plan_value->email;
                                    $name = $action_plan_value->name;
                                    $definition = $action_plan_value->definition;
                                    $review_date = $reminder_date;
                                    $control_point = $action_plan_value->control_point;
                                  
                                    Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                        $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                        $m->to($user, 'admin')->subject('Your Reminder3!');
                                    });
                                }
                            }
                        } else {
                            $pending_review[] = array('definition' => $action_plan_value->definition, 'control_point' => $action_plan_value->control_point, 'name' => $action_plan_value->name, 'review_month_date' => $reminder_date, 'status' => 'Delayed', 'color' => '#ef5350','dept_id'=>$action_plan_value->dept_id);

                            $delay_date[] = date('Y-m-d', strtotime($reminder_date . ' + 4 days'));
                            if (array_intersect([$current_date], $delay_date)) {
                                $user = $action_plan_value->dept_head;
                                $name = $action_plan_value->dept_head_name;
                                $definition = $action_plan_value->definition;
                                $review_date = $reminder_date;
                                $control_point = $action_plan_value->control_point;
                                
                                Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                    $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                    $m->to($user, 'admin')->subject('Your Reminder4!');
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
                                $pending_review[] = array('definition' => $action_plan_value->definition, 'control_point' => $action_plan_value->control_point, 'name' => $action_plan_value->name, 'review_month_date' => $action_plan_value->review_month_date, 'status' => 'Upcoming', 'color' => '#ffd933','dept_id'=>$action_plan_value->dept_id);

                                if (array_intersect([$current_date], $day_frequency)) {
                                    $user = $action_plan_value->email;
                                    $name = $action_plan_value->name;
                                    $definition = $action_plan_value->definition;
                                    $review_date = $reminder_date;
                                    $control_point = $action_plan_value->control_point;
                                    
                                    Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                        $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                        $m->to($user, 'admin')->subject('Your Reminder5!');
                                    });
                                }
                            }
                        } else {
                            $pending_review[] = array('definition' => $action_plan_value->definition, 'control_point' => $action_plan_value->control_point, 'name' => $action_plan_value->name, 'review_month_date' => $action_plan_value->review_month_date, 'status' => 'Delayed', 'color' => '#ef5350','dept_id'=>$action_plan_value->dept_id);

                            $delay_date[] = date('Y-m-d', strtotime($reminder_date . ' + 4 days'));
                            if (array_intersect([$current_date], $delay_date)) {
                                $user = $action_plan_value->dept_head;
                                $name = $action_plan_value->dept_head_name;
                                $definition = $action_plan_value->definition;
                                $review_date = $reminder_date;
                                $control_point = $action_plan_value->control_point;
                                print_r($user); die;
                                Mail::send('emails.action_plan_review', ['name' => $name, 'definition' => $definition, 'review_date' => $review_date, 'control_point' => $control_point], function ($m) use ($user) {
                                    $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                    $m->to($user, 'admin')->subject('Your Reminder6!');
                                });
                            }
                        }
                    }
                    $total_year_month = [];
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
  }