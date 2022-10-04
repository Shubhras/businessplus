<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use DB;
use Dwij\Laraadmin\Models\Module;
use Illuminate\Http\Request;

class ApiWeaknessesController extends ResponseApiController
{
    /**
     * Store and weaknesses in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_add_weaknesses(Request $request)
    {
        Module::insert("weaknesses", $request);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully save weaknesses!';
        return $this->sendResponse();
    }
    /**
     * View weaknesses in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_weaknesses(Request $request)
    {
        if ($request['fyear'] == 'april-march') {
            $start_date = Carbon::create($request->year, 04)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year + 1, 03)->lastOfMonth()->format('Y-m-d');
        } else {
            $start_date = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        }
        $request['start_date'] = Carbon::create($request->year, 01)->startOfMonth()->format('Y-m-d');
        $request['end_date'] = Carbon::create($request->year, 12)->lastOfMonth()->format('Y-m-d');
        $weaknesses_data = DB::table('weaknesses')->select('id as weaknesses_id', 'weaknesses', 'keywords', 'created_at')
            ->where('unit_id', $request['unit_id'])
            ->where('company_id', $request['company_id'])
            ->where('deleted_at', null)
            ->where(function ($q) use ($start_date, $end_date) {
                $q->whereBetween('weaknesses.start_date', [$start_date, $end_date])
                    ->orwhereBetween('weaknesses.end_date', [$start_date, $end_date])
                    ->orwhere(function ($p) use ($start_date, $end_date) {
                        $p->where('weaknesses.start_date', '<=', $start_date)
                            ->where('weaknesses.end_date', '>=', $end_date);
                    });
            })
            ->orderBy('id', 'desc')
            ->get();

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "unit list business  weaknesses data";
        $this->apiResponse['data'] = $weaknesses_data;
        return $this->sendResponse();
    }
    /**
     * Store edit weaknesses in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_update_weaknesses(Request $request)
    {
        Module::updateRow("weaknesses", $request, $request->weaknesses_id);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully update weaknesses!';
        return $this->sendResponse();
    }
    /**
     * delete weaknesses in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_weaknesses(Request $request)
    {
        $date = date('Y-m-d h:i:s');
        DB::table('weaknesses')->where('id', $request->weaknesses_id)->update(['deleted_at' => $date]);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully delete weaknesses!';
        return $this->sendResponse();
    }
}
