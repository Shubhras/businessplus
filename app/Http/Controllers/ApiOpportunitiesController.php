<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Dwij\Laraadmin\Models\Module;
use Carbon\Carbon;

class ApiOpportunitiesController extends ResponseApiController
{
	/**
	 * Store and opportunities in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_add_opportunities(Request $request)
	{
		Module::insert("opportunities", $request);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully save opportunities!';
		return $this->sendResponse();
	}
	/**
	 * View opportunities in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_view_opportunities(Request $request)
	{
		if ($request['fyear'] == 'april-march') {
			$start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
			$end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
		} else {
			$start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
			$end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
		}
		$opportunities_data = DB::table('opportunities')->select('id as opportunities_id', 'opportunities', 'keywords', 'created_at')
			->where('deleted_at', NULL)
			->where('unit_id', $request['unit_id'])
			->where('company_id', $request['company_id'])
			->where(function ($q) use ($start_date, $end_date) {
				$q->whereBetween('opportunities.start_date', [$start_date, $end_date])
					->orwhereBetween('opportunities.end_date', [$start_date, $end_date])
					->orwhere(function ($p) use ($start_date, $end_date) {
						$p->where('opportunities.start_date', '<=', $start_date)
							->where('opportunities.end_date', '>=', $end_date);
					});
			})
			->orderBy('id', 'desc')
			->get();

		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = "unit list business  opportunities data";
		$this->apiResponse['data'] = $opportunities_data;
		return $this->sendResponse();
	}
	/**
	 * Store edit opportunities in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_update_opportunities(Request $request)
	{
		Module::updateRow("opportunities", $request, $request->opportunities_id);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully update opportunities!';
		return $this->sendResponse();
	}
	/**
	 * delete opportunities in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_delete_opportunities(Request $request)
	{
		$date = date('Y-m-d h:i:s');
		DB::table('opportunities')->where('id', $request->opportunities_id)->update(['deleted_at' => $date]);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully delete opportunities!';
		return $this->sendResponse();
	}
}
