<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use DB;
use Dwij\Laraadmin\Models\Module;
use Illuminate\Http\Request;

class ApiThreatsController extends ResponseApiController
{
    /**
     * Store and threats in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_add_threats(Request $request)
    {
        Module::insert("threats", $request);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully save threats!';
        return $this->sendResponse();
    }
    /**
     * View threats in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_threats(Request $request)
    {

        if ($request['fyear'] == 'april-march') {
            $start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
        } else {
            $start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        }

        $threats_data = DB::table('threats')->select('id as threats_id', 'threats', 'keywords')
            ->where('unit_id', $request['unit_id'])
            ->where('company_id', $request['company_id'])
            ->where(function ($q) use ($start_date, $end_date) {
                $q->whereBetween('threats.start_date', [$start_date, $end_date])
                    ->orwhereBetween('threats.end_date', [$start_date, $end_date])
                    ->orwhere(function ($p) use ($start_date, $end_date) {
                        $p->where('threats.start_date', '<=', $start_date)
                            ->where('threats.end_date', '>=', $end_date);
                    });
            })
            ->where('deleted_at', null)
            ->orderBy('id', 'desc')
            ->get();

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "unit list business  threats data";
        $this->apiResponse['data'] = $threats_data;
        return $this->sendResponse();
    }
    /**
     * Store edit threats in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_update_threats(Request $request)
    {
        Module::updateRow("threats", $request, $request->threats_id);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully update threats!';
        return $this->sendResponse();
    }
    /**
     * delete threats in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_threats(Request $request)
    {
        $date = date('Y-m-d h:i:s');
        DB::table('threats')->where('id', $request->threats_id)->update(['deleted_at' => $date]);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully delete threats!';
        return $this->sendResponse();
    }
}
