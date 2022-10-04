<?php

namespace App\Console;

use App\Models\Inspire;
use DB;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        Commands\Inspire::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        /* DB::table('tasks')->where([['end_date', '<', date('Y-m-d h:i:s')], ['status_id', '!=', 3], ['status_id', '!=', 4]])->update(
        ["status_id" => 2]
        ); */
        $schedule->call(function () {
            DB::table('project_isue_trackers')->where([['issue_end_date', '<', date('Y-m-d h:i:s')], ['issue_status', '!=', 3], ['issue_status', '!=', 4]])->update(
                ["issue_status" => 2]
            );
            DB::table('tasks')->where([['end_date', '<', date('Y-m-d h:i:s')], ['status_id', '!=', 3], ['status_id', '!=', 4]])->update(
                ["status_id" => 2]
            );
        })->everyMinute();

        /*  $schedule->call(function(){
        DB::table('tests')->insert(['test_name' => 'rajendra parmar']);
        })->everyMinute(); */
        $schedule->call('App\Http\Controllers\ApiKpiController@api_str_obj_review_cron');
        // $schedule->call('App\Http\Controllers\ApiKpiController@api_review_actual_data_cron');
        //$schedule->call('App\Http\Controllers\ApiStrategicObjectivesController@api_str_obj_review')->daily();

        /*  $schedule->command('minute:update')
    ->everyMinute(); */
    }
}
