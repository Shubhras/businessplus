<?php

namespace App\Http\Controllers;

use DB;
use Dwij\Laraadmin\Models\Module;
use Illuminate\Http\Request;

class ApiBusinessPlanController extends ResponseApiController
{
    /*add business plans*/
    /**
     * Store business plans in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_business_plans(Request $request)
    {
        if (!empty($request)) {
            Module::insert("business_plans", $request);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully save your business plans!';
            return $this->sendResponse();
        }
    }
    /*view business plans */
    /**
     * View business plans to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_business_plans(Request $request)
    {
        $business_plans = DB::table('business_plans')->select('business_plans.id', 'business_plans.vision', 'business_plans.mission', 'business_plans.message_of_ceo', 'business_plans.values', 'business_plans.highlights')
            ->where('business_plans.deleted_at', null)
            ->where('company_id', $request->company_id)
            ->first();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "Business plans data list response";
        $this->apiResponse['data'] = $business_plans;
        return $this->sendResponse();
    }
    /*edit business plans */
    /**
     * Store edit business plans in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_edit_business_plans(Request $request)
    {
        if (!empty($request->id)) {
            Module::updateRow("business_plans", $request, $request->id);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully update business plans!';
            return $this->sendResponse();
        }
    }
}
