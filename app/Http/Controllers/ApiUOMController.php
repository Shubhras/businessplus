<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Dwij\Laraadmin\Models\Module;


class ApiUOMController extends ResponseApiController
{


    /**
     * Store and UOM in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_add_uom(Request $request)
    {
        $tempuomname = trim($request->name);
        $request['name'] = $tempuomname;

        $uom_data = DB::table('u_o_ms')->select('name')
        ->where('company_id', $request->company_id)
        ->where('deleted_at', null)->get();

        foreach ($uom_data as $key => $uom_row) {
            if ($request->name == $uom_row->name) {
                $this->apiResponse['status'] = false;
                return $this->respond_uom_name_unique();
            }
        }
        try{
            Module::insert("u_o_ms", $request);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully save UOM!';
            return $this->sendResponse();
        }
        catch (\Exception $e) {
            $this->apiResponse['status'] = "False";
            $this->apiResponse['message'] = $e->getMessage();
            return $this->sendResponse();
        }
    }
    /**
     * View uom in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_uom(Request $request)
    {
        // $my_array1 = array(['uom_id' =>0, 'uom_name'=>'Not Applicable']);
        $uom_data = DB::table('u_o_ms')->select('id as uom_id', 'name as uom_name')
            ->where('deleted_at', NULL)
            ->where('company_id', $request->company_id)
            ->get();
            // $testt =array_merge($my_array1, $uom_data);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "UOM list response";
        $this->apiResponse['data'] = $uom_data;
        return $this->sendResponse();
    }
    /**
     * Store update category in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_update_uom(Request $request)
    {
        $tempuomname = trim($request->name);
        $request['name'] = $tempuomname;

        $uom_data = DB::table('u_o_ms')->select('name','id')
        ->where('company_id', $request->company_id)
        ->where('deleted_at', null)->get();

        foreach ($uom_data as $key => $uom_row) {
            if (($request->name == $uom_row->name) && ($request->uom_id != $uom_row->id)) {
                $this->apiResponse['status'] = false;
                return $this->respond_uom_name_unique();
            }
        }
        
try{
        Module::updateRow("u_o_ms", $request, $request->uom_id);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully update uom!';
        return $this->sendResponse();
    }catch (\Exception $e) {
            $this->apiResponse['status'] = "False";
            $this->apiResponse['message'] = $e->getMessage();
            return $this->sendResponse();
        }
    }
    /**
     * delete unit in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_uom(Request $request)
    {
        $date = date('Y-m-d h:i:s');
        DB::table('u_o_ms')->where('id', $request->uom_id)->update(['deleted_at' => $date]);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully delete uom!';
        return $this->sendResponse();
    }
}
