<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use DB;
use Dwij\Laraadmin\Models\Module;


class FAQSController extends ResponseApiController
{
	/**
	 * Store and faqs in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_add_faq(Request $request)
	{
		Module::insert("faqs", $request);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully save faq!';
		return $this->sendResponse();
	}
	/**
	 * View faqs in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_view_faq(Request $request)
	{
		$faq_data = DB::table('faqs')->select('id as faq_id', 'question', 'answer')
			->where('deleted_at', NULL)
			->where('company_id', $request->company_id)
			->orderBy('id', 'desc')
			->get();
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = "faqs list response";
		$this->apiResponse['data'] = $faq_data;
		return $this->sendResponse();
	}
	/**
	 * Store update faqs in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_update_faq(Request $request)
	{
		Module::updateRow("faqs", $request, $request->faq_id);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully update faq!';
		return $this->sendResponse();
	}
	/**
	 * delete faqs in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_delete_faq(Request $request)
	{
		$date = date('Y-m-d h:i:s');
		DB::table('faqs')->where('id', $request->faq_id)->update(['deleted_at' => $date]);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully delete faq!';
		return $this->sendResponse();
	}
}
