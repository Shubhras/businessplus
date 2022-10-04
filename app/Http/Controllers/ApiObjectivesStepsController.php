<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;

class ApiObjectivesStepsController extends ResponseApiController
{
    /**
     * Get action plan acording to iniative id in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function add_objectives__steps(Request $request)
    {
        $date = date('Y-m-d h:i:s');
        // dump($data);
        $datas = DB::table('objectives_steps')->insert(["step_id" => $request->step_id,
            "step_name" => $request->step_name,
            "unit_id" => $request->unit_id,
            "company_id" => $request->company_id,
            "user_id" => $request->user_id,
            "created_at" => $date,
            "updated_at" => $date,
        ]);
        // Module::insert('department_masters', (object) $deptValue);
        // dump($data );

        // dump($data);
        // dump($request);die;
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully Save Your Objectives Steps Settings';
        $this->apiResponse['data'] = $request->all();
        // print_r($request->unit_id);
        // print_r($request->login_access_token);die;
        return $this->sendResponse();
    }

    public function get_objectives_steps(Request $request)
    {
        $tempData = [];
        // $requested_dept_id = explode(',', $request->dept_id);
        $tempData['objectives_stepsinfo'] = DB::table('objectives_steps')->select('*')
            ->where('unit_id', $request['unit_id'])
            ->where('user_id', $request['user_id'])->orderBy('id', 'DESC')->get();

        $tempData['strategic_objectivesinfo'] = DB::table('strategic_objectives')->select('*')
            ->where('deleted_at', null)
            ->where('unit_id', $request['unit_id'])
            ->where('user_id', $request['user_id'])->orderBy('id', 'DESC')->first();

        // dump($tempData['strategic_objectivesinfo']);

        $tempData['initiativesinfo'] = DB::table('initiatives')->select('*')
            ->where('deleted_at', null)
        // ->where('s_o_id', $tempData['strategic_objectivesinfo'].'id')
            ->where('unit_id', $request['unit_id'])
            ->where('user_id', $request['user_id'])->orderBy('id', 'DESC')->first();

        $tempData['action_plansinfo'] = DB::table('action_plans')->select('*')
            ->where('deleted_at', null)
            ->where('unit_id', $request['unit_id'])
            ->where('user_id', $request['user_id'])->first();

        // $tempData['department_masters'] = DB::table('department_masters')->select('*')
        //     ->where('deleted_at', null)
        //     ->where('unit_id', $request['unit_id'])
        //     ->where('company_id', $request['company_id'])->get();

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "Objectives Steps list response";
        $this->apiResponse['data'] = array_reverse($tempData);
        return $this->sendResponse();
    }
}
