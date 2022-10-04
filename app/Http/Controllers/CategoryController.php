<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Dwij\Laraadmin\Models\Module;


class CategoryController extends ResponseApiController
{
	/**
	 * Store and category in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_add_category(Request $request)
	{
		Module::insert("categories", $request);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully save categories!';
		return $this->sendResponse();
	}
	/**
	 * View catogories in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_view_category(Request $request)
	{
		$category_data = DB::table('categories')->select('id as category_id', 'category_name', 'enable')
			->where('deleted_at', NULL)
			->where('company_id', $request->company_id)
			->get();
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = "Categories list response";
		$this->apiResponse['data'] = $category_data;
		return $this->sendResponse();
	}
	/**
	 * Store update category in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_update_category(Request $request)
	{
		if (empty($data['login_access_tokens_data'])) {
			$message = "token mismatch !";
			$errors = $request->all();
			return $this->respondValidationError($message, $errors);
		} else {
			$id = $request->category_id;
			Module::updateRow("categories", $request, $id);
			$this->apiResponse['status'] = "success";
			$this->apiResponse['message'] = 'Successfully update categories!';
			return $this->sendResponse();
		}
	}
	/**
	 * delete unit in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_delete_category(Request $request)
	{
		$date = date('Y-m-d h:i:s');
		DB::table('categories')->where('id', $request->category_id)->update(['deleted_at' => $date]);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully delete categories!';
		return $this->sendResponse();
	}
}
