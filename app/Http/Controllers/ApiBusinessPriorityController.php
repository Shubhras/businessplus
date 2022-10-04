<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Dwij\Laraadmin\Models\Module;
use Carbon\Carbon;

class ApiBusinessPriorityController extends ResponseApiController
{
	/**
	 * Store and business priority in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_add_business_priority(Request $request)
	{
		Module::insert("business_priorities", $request);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully save business priorities!';
		return $this->sendResponse();
	}
	/**
	 * View business priority in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_view_business_priority(Request $request)
	{
	
		if ($request['fyear'] == 'april-march') {
			$request['start_date'] = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
			$request['end_date'] = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');

			$business_priorities_data = DB::table('business_priorities')->select('id as business_priority_id', 'business_priority', 'keywords')
				->where('deleted_at', NULL)->where('company_id',$request['company_id'])
				->whereBetween('business_priorities.created_at', [$request['start_date'], $request['end_date']])
				->orderBy('id', 'desc')
				->get();
				
		} else {
			$request['start_date'] = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
			$request['end_date'] = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');

			$business_priorities_data = DB::table('business_priorities')->select('id as business_priority_id', 'business_priority', 'keywords')
				->where('deleted_at', NULL)->where('company_id',$request['company_id'])
				//->where('company_id', $request['company_id'])
				->whereBetween('business_priorities.created_at', [$request['start_date'], $request['end_date']])
				->orderBy('id', 'desc')
				->get();
		}
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = "unit list business  priorities data";
		$this->apiResponse['data'] = $business_priorities_data;
		return $this->sendResponse();
	}
	/**
	 * Store edit business priority in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_update_business_priority(Request $request)
	{
		Module::updateRow("business_priorities", (object)$request, $request['business_priority_id']);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully update business priority!';
		return $this->sendResponse();
	}
	/**
	 * delete business priority in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_delete_business_priority(Request $request)
	{
		$date = date('Y-m-d h:i:s');
		DB::table('business_priorities')->where('id', $request->business_priority_id)->update(['deleted_at' => $date]);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully delete business priority!';
		return $this->sendResponse();
	}
}
