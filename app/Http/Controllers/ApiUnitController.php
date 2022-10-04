<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Dwij\Laraadmin\Models\Module;


class ApiUnitController extends ResponseApiController
{
    /**
     * Get units in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_get_unit(Request $request)
    {
        $array = explode(',', ($request->unit_id));
        $unit_data = DB::table('units')->select('units.id', 'units.unit_name')
            ->where('units.deleted_at', NULL)
            ->whereIn('id', $array)
            ->get();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "unit list response";
        $this->apiResponse['data'] = $unit_data;
        return $this->sendResponse();
    }
    /**
     * Store and unit in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_unit(Request $request)
    {

        $unit_id = Module::insert("units", $request);
        $request['unit_id'] =  $unit_id;
        DB::statement("UPDATE employers
        SET
          multi_unit_id =
          concat(multi_unit_id,',',$unit_id) WHERE
          user_id = $request->user_id
        ");
        $this->apiResponse['status'] = "success";
        $this->apiResponse['data'] = $request->all();
        $this->apiResponse['message'] = 'Successfully save unit!';
        return $this->sendResponse();
    }
    /**
     * View units in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_unit(Request $request)
    {
        $unit_data = DB::table('units')->select('units.id', 'units.unit_name', 'units.unit_address', 'company_profiles.company_name', 'units.enable')
            ->join('company_profiles', 'units.company_id', '=', 'company_profiles.id')
            ->where('units.deleted_at', NULL)
            ->where('company_id', $request->company_id)
            ->orderBy('units.id', 'desc')
            ->get();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "unit list response";
        $this->apiResponse['data'] = $unit_data;
        return $this->sendResponse();
    }
    /**
     * Store edit unit in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_edit_unit(Request $request)
    {
        Module::updateRow("units", $request, $request->id);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully update unit!';
        return $this->sendResponse();
    }
    /**
     * delete unit in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_unit(Request $request)
    {
        // print_r($request->all());die;
        try {
            DB::beginTransaction();
            $date = date('Y-m-d h:i:s');
            //unit delete
            DB::table('units')->where('units.id', $request->unit_id)->update(['deleted_at' => $date]);
            $r = "'$request->unit_id'";
            DB::statement("UPDATE employers
            SET
              multi_unit_id =
                TRIM(BOTH ',' FROM REPLACE(CONCAT(',', multi_unit_id, ','), ',$request->unit_id,', ','))
            WHERE
              FIND_IN_SET($r, multi_unit_id) AND user_id = $request->user_id
            ");
            //departments delete
            $get_dept_ids = DB::table('department_masters')->select('id as dept_id', 'company_id')->where('unit_id', $request->id)->where('deleted_at', NULL)->get();
            DB::table('department_masters')->where('department_masters.unit_id', $request->unit_id)->update(['deleted_at' => $date]);
            //sections delete
            foreach ($get_dept_ids as $key => $row) {
                DB::table('sections')->where('sections.dept_id', $row->dept_id)->update(['deleted_at' => $date]);
            }
            DB::commit();
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully delete unit!';
            return $this->sendResponse();
        } catch (\Exception $e) {
            DB::rollback();
             $this->apiResponse['message'] = $e->getMessage();
             return $this->sendResponse();
        }
    }
}
