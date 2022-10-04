<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use DB;
use Dwij\Laraadmin\Models\Module;
use Illuminate\Http\Request;

class ApiStrengthsController extends ResponseApiController
{
    /**
     * Store and strength in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_add_strength(Request $request)
    {
        Module::insert("strengths", $request);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully save strengths!';
        return $this->sendResponse();
    }
    /**
     * View strenth in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_strength(Request $request)
    {
        if ($request['fyear'] == 'april-march') {
            $start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
        } else {
            $start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        }
        $strength_data = DB::table('strengths')->select('id as strength_id', 'strength', 'keywords')
            ->where('unit_id', $request['unit_id'])
            ->where('company_id', $request['company_id'])
            ->where(function ($q) use ($start_date, $end_date) {
                $q->whereBetween('strengths.start_date', [$start_date, $end_date])
                    ->orwhereBetween('strengths.end_date', [$start_date, $end_date])
                    ->orwhere(function ($p) use ($start_date, $end_date) {
                        $p->where('strengths.start_date', '<=', $start_date)
                            ->where('strengths.end_date', '>=', $end_date);
                    });
            })
            ->where('deleted_at', null)
            ->orderBy('id', 'desc')
            ->get();

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "unit list business  strengths data";
        $this->apiResponse['data'] = $strength_data;
        return $this->sendResponse();
    }
    /**
     * Store edit strenth in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_update_strength(Request $request)
    {
        Module::updateRow("strengths", $request, $request->strength_id);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully update strength!';
        return $this->sendResponse();
    }
    /**
     * delete strenth in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_strength(Request $request)
    {
        $date = date('Y-m-d h:i:s');
        DB::table('strengths')->where('id', $request->strength_id)->update(['deleted_at' => $date]);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully delete strength!';
        return $this->sendResponse();
    }
}
