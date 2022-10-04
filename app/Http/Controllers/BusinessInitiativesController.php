<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Dwij\Laraadmin\Models\Module;

class BusinessInitiativesController extends ResponseApiController
{
	/**
	 * Store and business initiatives in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_add_business_initiatives(Request $request)
	{
		Module::insert("business_initiatives", $request);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully save business initiatives!';
		return $this->sendResponse();
	}
	/**
	 * View business initiatives in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_view_business_initiatives(Request $request)
	{
		$category_data = DB::table('business_initiatives')->select('id as business_initiatives_id', 'business_initiative', 'enable')
			->where('deleted_at', NULL)
			->where('company_id', $request->company_id)
			->get();
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = "Categories list business initiative";
		$this->apiResponse['data'] = $category_data;
		return $this->sendResponse();
	}
	/**
	 * Store update business initiatives in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_update_business_initiatives(Request $request)
	{
		$data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
		if (!empty($data['login_access_tokens_data']->user_id)) {
			$users_id = $data['login_access_tokens_data']->user_id;
		}
		if (empty($data['login_access_tokens_data'])) {
			$message = "token mismatch !";
			$errors = $request->all();
			return $this->respondValidationError($message, $errors);
		} else {
			$id = $request->business_initiatives_id;
			$insert_id = Module::updateRow("business_initiatives", $request, $id);
			$this->apiResponse['status'] = "success";
			$this->apiResponse['message'] = 'Successfully update business initiatives!';
			return $this->sendResponse();
		}
	}
	/**
	 * delete business initiatives in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_delete_business_initiatives(Request $request)
	{
		$date = date('Y-m-d h:i:s');
		DB::table('business_initiatives')->where('id', $request->business_initiatives_id)->update(['deleted_at' => $date]);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully delete business initiatives!';
		return $this->sendResponse();
	}
}
