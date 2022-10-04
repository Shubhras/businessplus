<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use DB;
use Dwij\Laraadmin\Models\Module;
use Carbon\Carbon;

class ApiBusinessObjectiveController extends ResponseApiController
{
	/**
	 * Store and business objective in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_add_business_objective(Request $request)
	{
		Module::insert("business_objectives", $request);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully save business objectives!';
		return $this->sendResponse();
	}
	/**
	 * View business objective in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_view_business_objective(Request $request)
	{
		if ($request['fyear'] == 'april-march') {
			$request['start_date'] = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
			$request['end_date'] = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');

			$business_objectives_data = DB::table('business_objectives')->select('id as business_objective_id', 'business_objective', 'keywords')
				->where('deleted_at', NULL)
				->where('company_id', $request['company_id'])
				->whereBetween('business_objectives.created_at', [$request['start_date'], $request['end_date']])
				->orderBy('id', 'desc')
				->get();
		} else {
			$request['start_date'] = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
			$request['end_date'] = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');

			$business_objectives_data = DB::table('business_objectives')->select('id as business_objective_id', 'business_objective', 'keywords')
				->where('deleted_at', NULL)
				->where('company_id', $request['company_id'])
				->whereBetween('business_objectives.created_at', [$request['start_date'], $request['end_date']])
				->orderBy('id', 'desc')
				->get();
		}

		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = "unit list business  objectives data";
		$this->apiResponse['data'] = $business_objectives_data;
		return $this->sendResponse();
	}
	/**
	 * Store edit business objective in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_update_business_objective(Request $request)
	{
		Module::updateRow("business_objectives", $request, $request->business_objective_id);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully update business objective!';
		return $this->sendResponse();
	}
	/**
	 * delete business priority in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_delete_business_objective(Request $request)
	{
		$date = date('Y-m-d h:i:s');
		DB::table('business_objectives')->where('id', $request->business_objective_id)->update(['deleted_at' => $date]);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully delete business objective!';
		return $this->sendResponse();
	}
}
