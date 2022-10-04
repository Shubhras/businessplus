<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Dwij\Laraadmin\Models\Module;
use App\Http\Requests;

class ApiEventController extends ResponseApiController
{
  public function api_add_events(Request $request)
  {
    if (!empty($request)) {
      Module::insert("Events", $request);
      $this->apiResponse['status'] = "success";
      $this->apiResponse['message'] = 'Successfully save your Events!';
      return $this->sendResponse();
    }
  }

  public function api_view_events(Request $request)
  {
    /* $getDate = $this->getFinancialDate($request['financial_year'] ?: '', $request['year']);
    $start_date = $getDate['start_date'];
    $end_date = $getDate['end_date']; */
    $events_data = DB::table('events')->select('*')
      ->where('deleted_at', NULL)
      /* ->where(function ($q) use ($start_date, $end_date) {
        $q->whereBetween('events.start_date', [$start_date, $end_date])
          ->orwhereBetween('events.end_date', [$start_date, $end_date])
          ->orwhere(function ($p) use ($start_date, $end_date) {
            $p->where('events.start_date', '<=', $start_date)
              ->where('events.end_date', '>=', $end_date);
          });
      }) */
      ->get();
    $this->apiResponse['status'] = "success";
    $this->apiResponse['message'] = "Events response";
    $this->apiResponse['data'] = $events_data;
    return $this->sendResponse();
  }

  public function api_update_events(Request $request)
  {
    if (!empty($request->events_id)) {
      Module::updateRow("Events", $request,  $request->events_id);
      $this->apiResponse['status'] = "success";
      $this->apiResponse['message'] = 'Successfully update your Events!';
      return $this->sendResponse();
    }
  }

  public function api_delete_events(Request $request)
  {
    if (!empty($request->events_id)) {
      $date= date('Y-m-d H:i:s');
      DB::table('events')->where('id', $request->events_id)->update(['deleted_at' => $date]);
      $this->apiResponse['status'] = "success";
      $this->apiResponse['message'] = 'Successfully Delete your Events!';
      return $this->sendResponse();
    }
  }


}
