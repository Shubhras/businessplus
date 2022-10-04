<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Dwij\Laraadmin\Models\Module;
use App\Http\Requests;

class ApiEventController extends ResponseApiController
{
  public function add_events(Request $request)
  {
    if (!empty($request)) {
      Module::insert("Events", $request);
      $this->apiResponse['status'] = "success";
      $this->apiResponse['message'] = 'Successfully save your Events!';
      return $this->sendResponse();
    }
  }

  public function view_events(Request $request)
  {$start_date = $getDate['start_date'];
    $end_date = $getDate['end_date'];
    
    $events_data = DB::table('events')->select('events.id as events_id', 'event_name')
      ->where('deleted_at', NULL)
      ->where(function ($q) use ($start_date, $end_date) {
				$q->whereBetween('tasks.start_date', [$start_date, $end_date])
					->orwhereBetween('tasks.end_date', [$start_date, $end_date])
					->orwhere(function ($p) use ($start_date, $end_date) {
						$p->where('tasks.start_date', '<=', $start_date)
						->where('tasks.end_date', '>=', $end_date);
					})
      ->get();
    $this->apiResponse['status'] = "success";
    $this->apiResponse['message'] = "Events response";
    $this->apiResponse['data'] = $events_data;
    return $this->sendResponse();
  }

  public function update_events(Request $request)
  { if (!empty($request->events_id)){
    Module::updateRow("Events", $request,  $request->events_id);
    $this->apiResponse['status'] = "success";
    $this->apiResponse['message'] = 'Successfully update your Events!';
    return $this->sendResponse();
  }
  }

  public function delete_events(Request $request)
  {if (!empty($request->events_id)){
    $date = date('Y-m-d h:i:s');
    DB::table('events')->where('events.id', $request->events_id)->update(['deleted_at' => $date]);
    $this->apiResponse['status'] = "success";
    $this->apiResponse['message'] = 'Successfully delete your Events';
    return $this->sendResponse();
  }}
}
