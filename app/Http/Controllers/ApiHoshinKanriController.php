<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Dwij\Laraadmin\Models\Module;

class ApiHoshinKanriController extends ResponseApiController
{
    /**
     * Store hoshin kanri in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_add_hoshin_kanri(Request $request)
    {
        $hoshin_kanri_id = Module::insert("hoshin_kanris", $request);
        $hk_dept_heads = [];
        $hk_section_heads = [];
        $hk_supervisor_heads = [];
        for ($i = 0; $i < count($request->itemDepartment); $i++) {
            $hk_dept_heads[] = array(
                "assign_user" => $request->itemDepartment[$i]['itemhead'],
                "value" => $request->itemDepartment[$i]['itemvalue'],
                "percent" => $request->itemDepartment[$i]['itemparsent'],
                "allocation_id" => $request->dept_head,
                "hoshin_kanri_id" => $hoshin_kanri_id,
            );
        }
        DB::table('hk_dept_heads')->insert($hk_dept_heads);
        for ($j = 0; $j < count($request->itemSection); $j++) {
            $hk_section_heads[] = array(
                "assign_user" => $request->itemSection[$j]['itemhead'],
                "value" => $request->itemSection[$j]['itemvalue'],
                "percent" => $request->itemSection[$j]['itemparsent'],
                "allocation_id" => $request->section_head,
                "hoshin_kanri_id" => $hoshin_kanri_id,
            );
        }
        DB::table('hk_section_heads')->insert($hk_section_heads);
        for ($k = 0; $k < count($request->itemSupervisor); $k++) {
            $hk_supervisor_heads[] = array(
                "assign_user" => $request->itemSupervisor[$k]['itemhead'],
                "value" => $request->itemSupervisor[$k]['itemvalue'],
                "percent" => $request->itemSupervisor[$k]['itemparsent'],
                "allocation_id" => $request->supervisor_head,
                "hoshin_kanri_id" => $hoshin_kanri_id,
            );
        }
        DB::table('hk_supervisor_heads')->insert($hk_supervisor_heads);
        $this->apiResponse['status'] = "uccess";
        $this->apiResponse['message'] = 'Successfully add new department!';
        return $this->sendResponse();
    }
    /**
     * Store hoshin kanri in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_hoshin_kanri(Request $request)
    {
        $hoshin_kanris = DB::table('hoshin_kanris')->select('hoshin_kanris.id as hoshin_kanris_id', 'hoshin_kanris.unit_id', 'units.unit_name', 'hoshin_kanris.dept_id', 'department_masters.dept_name', 'hoshin_kanris.str_obj_id', 'strategic_objectives.description as str_obj_description', 'hoshin_kanris.initiatives_id', 'initiatives.definition as initiatives_definition', 'hoshin_kanris.action_plan_id', 'action_plans.definition as action_plan_definition', 'hoshin_kanris.kpi_id', 'add_kpis.kpi_name', 'hoshin_kanris.area_manager', 'area_manager_user.name as area_manager_user_name', 'hoshin_kanris.area_manager_value', 'hoshin_kanris.area_manager_percent', 'hoshin_kanris.dept_head', 'dept_head_user.name as dept_head_user_name', 'hoshin_kanris.dept_head_value', 'hoshin_kanris.dept_head_percent', 'hoshin_kanris.section_head', 'section_head_user.name as section_head_user_name', 'hoshin_kanris.section_head_value', 'hoshin_kanris.section_head_percent', 'hoshin_kanris.supervisor_head', 'supervisor_head_user.name as supervisor_head_user_name', 'hoshin_kanris.superv_head_value', 'hoshin_kanris.superv_head_percent')
            ->leftjoin('units', 'hoshin_kanris.unit_id', '=', 'units.id')
            ->leftjoin('department_masters', 'hoshin_kanris.dept_id', '=', 'department_masters.id')
            ->leftjoin('strategic_objectives', 'hoshin_kanris.str_obj_id', '=', 'strategic_objectives.id')
            ->leftjoin('initiatives', 'hoshin_kanris.initiatives_id', '=', 'initiatives.id')
            ->leftjoin('action_plans', 'hoshin_kanris.action_plan_id', '=', 'action_plans.id')
            ->leftjoin('add_kpis', 'hoshin_kanris.kpi_id', '=', 'add_kpis.id')
            ->leftjoin('users as area_manager_user', 'hoshin_kanris.area_manager', '=', 'area_manager_user.id')
            ->leftjoin('users as dept_head_user', 'hoshin_kanris.dept_head', '=', 'dept_head_user.id')
            ->leftjoin('users as section_head_user', 'hoshin_kanris.section_head', '=', 'section_head_user.id')
            ->leftjoin('users as supervisor_head_user', 'hoshin_kanris.supervisor_head', '=', 'supervisor_head_user.id')
            ->where('hoshin_kanris.deleted_at', NULL)
            ->where('hoshin_kanris.unit_id', $request->unit_id)
            ->get();
        foreach ($hoshin_kanris as $key => $value) {
            if ($value->dept_head != 1) {
                $hk_dept_heads_head = array(['assign_user' => $value->dept_head, 'assign_user_name' => $value->dept_head_user_name, 'value' => $value->dept_head_value, 'percent' => $value->dept_head_percent]);
                $hk_dept_heads_user = DB::table('hk_dept_heads')->select('hk_dept_heads.id as hk_dept_heads_id', 'hk_dept_heads.assign_user', 'users.name as assign_user_name', 'hk_dept_heads.value', 'hk_dept_heads.percent')
                    ->leftjoin('users', 'hk_dept_heads.assign_user', '=', 'users.id')
                    ->where('hk_dept_heads.deleted_at', NULL)
                    ->where('hk_dept_heads.hoshin_kanri_id', $value->hoshin_kanris_id)
                    ->where('hk_dept_heads.allocation_id', $value->dept_head)->get();
                if (empty($hk_dept_heads_user) && empty($hk_dept_heads_head)) {
                    $hk_dept_heads_user[] = array(['hk_dept_heads_id' => '', 'assign_user' => '', 'assign_user_name' => '', 'value' => '', 'percent' => '']);
                }
                array_unshift($hk_dept_heads_user, $hk_dept_heads_head[0]);
                $hoshin_kanris[$key]->hk_dept_heads_user = $hk_dept_heads_user;
            }
            if ($value->section_head != 1) {
                $hk_section_head_head = array(['assign_user' => $value->section_head, 'assign_user_name' => $value->section_head_user_name, 'value' => $value->section_head_value, 'percent' => $value->section_head_percent]);

                $hk_section_heads_user = DB::table('hk_section_heads')->select('hk_section_heads.id as hk_section_heads_id', 'hk_section_heads.assign_user', 'users.name as assign_user_name', 'hk_section_heads.value', 'hk_section_heads.percent')
                    ->leftjoin('users', 'hk_section_heads.assign_user', '=', 'users.id')
                    ->where('hk_section_heads.deleted_at', NULL)
                    ->where('hk_section_heads.hoshin_kanri_id', $value->hoshin_kanris_id)
                    ->where('hk_section_heads.allocation_id', $value->section_head)
                    ->get();
                if (empty($hk_section_heads_user) && empty($hk_section_head_head)) {
                    $hk_section_heads_user[] = array(['hk_section_heads_id' => '', 'assign_user' => '', 'assign_user_name' => '', 'value' => '', 'percent' => '']);
                }
                array_unshift($hk_section_heads_user, $hk_section_head_head[0]);
                $hoshin_kanris[$key]->hk_section_heads_user = $hk_section_heads_user;
            }
            if ($value->supervisor_head != 1) {
                $hk_supervisor_head_head = array(['assign_user' => $value->supervisor_head, 'assign_user_name' => $value->supervisor_head_user_name, 'value' => $value->superv_head_value, 'percent' => $value->superv_head_percent]);

                $hk_supervisor_heads_user = DB::table('hk_supervisor_heads')->select('hk_supervisor_heads.id as hk_supervisor_heads_id', 'hk_supervisor_heads.assign_user', 'users.name as assign_user_name', 'hk_supervisor_heads.value', 'hk_supervisor_heads.percent')
                    ->leftjoin('users', 'hk_supervisor_heads.assign_user', '=', 'users.id')
                    ->where('hk_supervisor_heads.deleted_at', NULL)
                    ->where('hk_supervisor_heads.hoshin_kanri_id', $value->hoshin_kanris_id)
                    ->where('hk_supervisor_heads.allocation_id', $value->supervisor_head)
                    ->get();
                if (empty($hk_supervisor_heads_user) && empty($hk_supervisor_head_head)) {
                    $hk_supervisor_heads_user[] = array(['hk_supervisor_heads_id' => '', 'assign_user' => '', 'assign_user_name' => '', 'value' => '', 'percent' => '']);
                }
                array_unshift($hk_supervisor_heads_user, $hk_supervisor_head_head[0]);
                $hoshin_kanris[$key]->hk_supervisor_heads_user = $hk_supervisor_heads_user;
            }
        }
        $requested_dept_id = json_decode($request->dept_id, true);
        if (!empty($hoshin_kanris)) {
            foreach ($hoshin_kanris as $key => $hosha_kanris_value) {
                if (($request->role_id == 5 || $request->role_id == 6) && !in_array($hosha_kanris_value->dept_id, $requested_dept_id)) {
                    unset($hoshin_kanris[$key]);
                }
            }
        }
        $this->apiResponse['status'] = "uccess";
        $this->apiResponse['message'] = 'hoshin kanris data list!';
        $this->apiResponse['data'] = $hoshin_kanris;
        return $this->sendResponse();
    }
}
