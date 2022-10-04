<?php

/* namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests; */

namespace App\Http\Controllers;

use App\Models\Company_profile;
use App\Models\Company_setting;
use App\Models\Department_master;
use App\Models\Employer;
use App\Models\Section;
use App\Models\Unit;
use App\Models\User;
use DB;
use Dwij\Laraadmin\Models\Module;
use File;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Mail;
//use Illuminate\Support\Facades\Storage;
use Validator;

class ApiNewCompanySetup extends ResponseApiController
{

    public function api_new_company_setup(Request $request)
    {
        // dump("Companydata", $request);
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }

        try {
            DB::beginTransaction();
            switch ($request['companyDetails']) {

                case 'comanyInfo':

                    if (!empty($request['company_id'])) {

                        if (!empty($request->company_logo)) {
                            $file_extension = substr($request['company_logo'], 5, strpos($request['company_logo'], ';') - 5);
                            if (Str::startsWith($request['company_logo'], "data:$file_extension;base64,")) {
                                $image_info = $this->decodeBase64($request->company_logo);
                                $destination = public_path('storage/company_logo/');
                                if (!File::isDirectory($destination)) {
                                    $this->create_file_directory($destination);
                                }
                                $project_Image = $request['image_id'];
                                $image_id = $this->fileupoload($destination, $image_info, $project_Image);
                                $request['company_logo'] = $image_id;
                                $request['image_id'] = $image_id;
                            }
                        }
                        DB::commit();
                        $companyId = Module::updateRow('company_profiles', (object) $request, $request->company_id);
                        $request['company_id'] = $companyId;
                        $request['company_step_id'] = Module::updateRow('company_steps', (object) $request, $request['company_step_id']);
                        $company_Data = $request->all();

                        DB::table('company_profiles')->where('id', $request['company_id'])->update(['company_step_id' => $request['company_step_id']]);
                        $company_Data = $request->all();
                        $this->apiResponse['status'] = "success";
                        $this->apiResponse['message'] = 'Successfully save your CompanyData!';
                        $this->apiResponse['data'] = $company_Data;
                    } else {

                        if (!empty($request->company_logo)) {

                            $file_extension = substr($request['company_logo'], 5, strpos($request['company_logo'], ';') - 5);

                            if (Str::startsWith($request['company_logo'], "data:$file_extension;base64,")) {
                                $image_info = $this->decodeBase64($request->company_logo);
                                $destination = public_path('storage/company_logo/');
                                if (!File::isDirectory($destination)) {
                                    $this->create_file_directory($destination);
                                }
                                $project_Image = $request['image_id'];
                                $image_id = $this->fileupoload($destination, $image_info, $project_Image);
                                $request['company_logo'] = $image_id;
                                $request['image_id'] = $image_id;
                            }
                        }

                        $companyId = Module::insert('company_profiles', $request);

                        if (empty($companyId)) {
                            DB::rollback();
                            throw "Failed to created user company";
                        }
                        DB::commit();
                        DB::table('employers')->where('user_id', $request['user_id'])->update(['company_id' => $companyId]);
                        $request['company_id'] = $companyId;

                        $request['company_step_id'] = Module::insert('company_steps', $request);
                        DB::table('company_profiles')->where('id', $request['company_id'])->update(['company_step_id' => $request['company_step_id']]);

                        $company_Data = $request->all();
                        $this->apiResponse['status'] = "success";
                        $this->apiResponse['message'] = 'Successfully save your CompanyData!';
                        $this->apiResponse['data'] = $company_Data;
                    }
                    break;
                case 'comanyUnit':
                    //    print_r($request->all());die;
                    if (!empty($request['itemunits'])) {
                        $tempUnitData = $request['itemunits'];
                        foreach ($tempUnitData as $ukey => $unitValue) {
                            if (!empty($unitValue['unit_id'])) {

                                $unit_id = Module::updateRow('units', (object) $unitValue, $unitValue['unit_id']);
                                $tempUnitData[$ukey]['unit_id'] = $unit_id;
                                $unitIds[] = $unit_id;
                            } else {
                                $unit_id = Module::insert('units', (object) $unitValue);
                                $tempUnitData[$ukey]['unit_id'] = $unit_id;
                                DB::table('users')->where('id', $request['user_id'])->update(['company_id' => $request['company_id']]);
                                $unitIds[] = $unit_id;
                            }
                        }

                        $multi_unit_ids = implode(',', $unitIds);
                        if (count($tempUnitData) != count($unitIds)) {
                            DB::rollback();
                            throw "Failed to created company units.";
                        }
                        $request['itemunits'] = $tempUnitData;
                        DB::commit();
                        DB::table('employers')->where('user_id', $request['user_id'])->update(['multi_unit_id' => $multi_unit_ids]);
                        $request['company_step_id'] = Module::updateRow('company_steps', (object) $request, $request['company_step_id']);

                        $this->apiResponse['status'] = "success";
                        $this->apiResponse['message'] = 'Successfully save your Company Unit Data!';
                        $this->apiResponse['data'] = $request->all();
                    }
                    break;
                // invite user setup
                case 'companyUser':
                    //    dump($request['itemUsers']);die;
                    if (!empty($request['itemUsers'])) {

                        $date = date('Y-m-d h:i:s');

                        $tempUserInviteData = $request['itemUsers'];
                        foreach ($tempUserInviteData as $userkey => $userValue) {
                            // dump($userValue);
                            if (!empty($userValue['users_id'])) {

                                $tempdeptname = trim($userValue['dept_name']);
                                $userValue['dept_name'] = $tempdeptname;

                                $user_id = Module::updateRow('users', (object) $userValue, $userValue['users_id']);
                                $tempUserData[$userkey]['users_id'] = $user_id;
                                $userIds[] = $user_id;
                                $dept_id = $userValue['dept_id'];
                                $tempUserData[$userkey]['dept_id'] = $dept_id;
                                $deptIds[] = $dept_id;
                                // $usrdepart = $userValue['dept_id'];

                                $multi_dept_ids = implode(',', $deptIds);
                                // dump($multi_dept_ids);
                                $department_data = DB::table('department_masters')->select('dept_name')
                                    ->where('unit_id', $userValue['multi_unit_id'])
                                    ->where('deleted_at', null)->get();

                                // foreach ($department_data as $key => $dept_row) {
                                //     if ($userValue['dept_name'] == $dept_row->dept_name) {
                                //         $this->apiResponse['status'] = false;
                                //         // $this->apiResponse['message'] = 'Department is already exist!';
                                //         return $this->respond_dept_name_unique();
                                //     }
                                //     // dump("else",$dept_row->dept_name);
                                // }

                                DB::table('employers')->where('user_id', $userValue['users_id'])->where('deleted_at', null)->update(['name' => $userValue['name'], 'email' => $userValue['email'], 'multi_unit_id' => $userValue['multi_unit_id'], 'multi_dept_id' => $userValue['dept_id'], 'role_id' => $userValue['role_id']]);
                                DB::table('department_masters')->where('id', $userValue['dept_id'])->where('deleted_at', null)->update(["dept_name" => $userValue['dept_name'], "user_id" => $userValue['users_id'], "unit_id" => $userValue['multi_unit_id']]);

                            } else {
                                $tempdeptname = trim($userValue['dept_name']);
                                $userValue['dept_name'] = $tempdeptname;

                                $department_data = DB::table('department_masters')->select('dept_name')
                                    ->where('unit_id', $userValue['multi_unit_id'])
                                    ->where('deleted_at', null)->get();

                                foreach ($department_data as $key => $dept_row) {
                                    if ($userValue['dept_name'] == $dept_row->dept_name) {
                                        $this->apiResponse['status'] = false;
                                        // $this->apiResponse['message'] = 'Department is already exist!';
                                        return $this->respond_dept_name_unique();
                                    }
                                    // dump("else",$dept_row->dept_name);
                                }

                                $usertabledata = ["name" => $userValue['name'], "email" => $userValue['email'], "password" => $userValue['password'], "company_id" => $userValue['company_id'], "created_at" => $date, "updated_at" => $date];
                                // dump($userValue['dept_name']);

                                $testdeptname = $userValue['dept_name'];

                                // Insert into users
                                $user_id = Module::insert('users', (object) $usertabledata);

                                // Insert into employers
                                $tempUserInviteData[$userkey]['users_id'] = $user_id;
                                $userIds[] = $user_id;
                                // dump('user id');
                                $userValue['multi_dept_id'] = [];
                                $userValue['multi_dept_id'] = implode(",", $userValue['multi_dept_id']);
                                $userValue['multi_section_id'] = [];
                                $userValue['multi_section_id'] = implode(",", $userValue['multi_section_id']);
                                $employee_id = DB::table('employers')->insertGetId(
                                    ['name' => $userValue['name'], 'email' => $userValue['email'], 'role_id' => $userValue['role_id'], 'company_id' => $userValue['company_id'], 'multi_dept_id' => $userValue['dept_id'], 'multi_unit_id' => $userValue['multi_unit_id'], 'multi_section_id' => $userValue['multi_section_id'], 'user_id' => $user_id]
                                );

                                $tempData = Employer::select('employers.user_id as user_id')->where('company_id', $request['company_id'])->whereNotIn('user_id', [$request['user_id']])->orderBy('id', 'DESC')->first()->toarray();
                                DB::table('role_user')->insertGetId(
                                    ['role_id' => $userValue['role_id'], 'user_id' => $tempData['user_id'], 'created_at' => $date, 'updated_at' => $date]
                                );
                                //    dump($tempData);
                                // Insert into departmet

                                $depData = ["dept_name" => $testdeptname, "user_id" => $tempData['user_id'], "unit_id" => $userValue['multi_unit_id'], "created_at" => $date, "updated_at" => $date, "company_id" => $userValue['company_id']];
                                $dept_id = Module::insert('department_masters', (object) $depData);
                                $tempUserData[$userkey]['dept_id'] = $dept_id;
                                $deptIds[] = $dept_id;
                                // dump($deptIds);
                                $multi_dept_ids = implode(',', $deptIds);
                                // $userValue['multi_unit_id'] =  implode(",", $userValue['multi_unit_id']);
                                // dump($userValue['multi_dept_id']);
                                //    $test = $userValue['multi_section_id'] ;
                                //    gettype($test);die;

                                DB::table('employers')->where('user_id', $depData['user_id'])->where('deleted_at', null)->update(['multi_dept_id' => $dept_id]);
                                // Send mail

                                $userdata = User::where('id', $user_id)->get();

                                foreach ($userdata as $key => $userrow) {
                                    $userEmail = $userrow->email;
                                    $password = 'Prima@123';

                                    try {
                                        if (env('MAIL_USERNAME') != null && env('MAIL_USERNAME') != "null" && env('MAIL_USERNAME') != "") {
                                            Mail::send('emails.send_login_cred', ['email' => $userEmail, 'password' => $password], function ($m) use ($userEmail) {
                                                $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                                                $m->to($userEmail, 'Admin')->subject('Welcome to Prima Plus!');
                                            });
                                        }
                                    } catch (Exception $e) {
                                        echo 'Message: ' . $e->getMessage();
                                    }
                                }
                            }
                        }
                        // dump($deptIds);
                        $multi_user_ids = implode(',', $userIds);
                        $multi_dept_ids = implode(',', $deptIds);

                        // dump($multi_dept_ids);
                        if (count($tempUserInviteData) != count($userIds)) {
                            DB::rollback();
                            throw "Failed to created company users.";
                        }
                        $request['itemUsers'] = $tempUserInviteData;
                        DB::commit();
                        // dump('commit');
                        foreach ($multi_user_ids as $userkey => $user_ids) {
                            DB::table('employers')->where('user_id', $request['user_id'])->update(['user_id' => $user_ids]);
                        }

                        DB::table('employers')->where('user_id', $request['user_id'])->update(['multi_dept_id' => $multi_dept_ids]);

                        $request['company_step_id'] = Module::updateRow('company_steps', (object) $request, $request['company_step_id']);

                        $this->apiResponse['status'] = "success";
                        $this->apiResponse['message'] = 'Successfully save your Company User Data!';
                        $this->apiResponse['message'] = 'credential has been sent to the respective  Mail ID!';
                        $this->apiResponse['data'] = $request->all();
                    }
                    break;

                case 'comanyDept':
                    if (!empty($request['itemDept'])) {
                        $tempDeptData = $request['itemDept'];
                        foreach ($tempDeptData as $dkey => $deptValue) {
                            // dump($deptValue);die;
                            if (!empty($deptValue['dept_id'])) {

                                $dept_id = Module::updateRow('department_masters', (object) $deptValue, $deptValue['dept_id']);
                                $tempDeptData[$dkey]['dept_id'] = $dept_id;
                                $deptIds[] = $dept_id;
                                $usrdepart = $deptValue['user_id'];

                                //DB::table('employers')->where('user_id', $deptValue['user_id'])->update(['multi_dept_id' => $deptValue['dept_id']]);
                                // DB::statement("UPDATE employers
                                // SET
                                // multi_dept_id =
                                //   concat(multi_dept_id,',',$dept_id) WHERE
                                //   user_id = $usrdepart
                                // ");
                                $multi_dept_ids = implode(',', $deptIds);

                                $request['itemDept'] = $tempDeptData;
                                DB::commit();
                                DB::table('employers')->where('user_id', $usrdepart)->where('deleted_at', null)->update(['multi_dept_id' => $multi_dept_ids]);
                                //  dump($multi_dept_ids); die;
                                // print_r($multi_dept_ids);

                            } else {
                                $dept_id = Module::insert('department_masters', (object) $deptValue);
                                $tempDeptData[$dkey]['dept_id'] = $dept_id;
                                $deptIds[] = $dept_id;
                                $multi_dept_ids = implode(',', $deptIds);
                                //    dump($multi_dept_ids);
                                //$request['itemDept'] = $tempDeptData;
                                DB::commit();
                                DB::table('employers')->where('user_id', $usrdepart)->where('deleted_at', null)->update(['multi_dept_id' => $multi_dept_ids]);
                                // dump($multi_dept_ids);
                            }
                        }
                        $multi_dept_ids = implode(',', $deptIds);
                        if (count($tempDeptData) != count($deptIds)) {
                            DB::rollback();
                            throw "Failed to created company units.";
                        }
                        $request['itemDept'] = $tempDeptData;
                        DB::commit();
                        DB::table('employers')->where('user_id', $request['user_id'])->update(['multi_dept_id' => $multi_dept_ids]);
                        $request['company_step_id'] = Module::updateRow('company_steps', (object) $request, $request['company_step_id']);

                        $this->apiResponse['status'] = "success";
                        $this->apiResponse['message'] = 'Successfully save your Company Department Data!';
                        $this->apiResponse['data'] = $request->all();
                    }
                    break;
                case 'comanySection':

                    if (!empty($request['itemSections'])) {
                        $tempSectionData = $request['itemSections'];
                        foreach ($tempSectionData as $skey => $sectionValue) {

                            if (!empty($sectionValue['section_id'])) {
                                // dump("enter in not empty");
                                $section_id = Module::updateRow('sections', (object) $sectionValue, $sectionValue['section_id']);
                                $tempSectionData[$skey]['section_id'] = $section_id;
                                $sectionIds[] = $section_id;
                                $multi_section_ids = implode(',', $sectionIds);
                            } 
                            
                            else {
                                // dump("enter in  empty");
                                // dump($multi_dept_ids);
                                $section_id = Module::insert('sections', (object) $sectionValue);
                                $tempSectionData[$skey]['section_id'] = $section_id;
                                $sectionIds[] = $section_id;

                                DB::commit();
                                DB::table('employers')->where('user_id', $sectionValue['user_id'])->where('deleted_at', null)->update(['multi_section_id' => $multi_section_ids]);
                            }
                        }
                        $multi_section_ids = implode(',', $sectionIds);
                        if (count($tempSectionData) != count($sectionIds)) {
                            DB::rollback();
                            throw "Failed to created company units.";
                        }
                        $request['itemSections'] = $tempSectionData;
                        DB::commit();
                        DB::table('employers')->where('user_id', $request['user_id'])->update(['multi_section_id' => $multi_section_ids]);
                        $request['company_step_id'] = Module::updateRow('company_steps', (object) $request, $request['company_step_id']);

                        $this->apiResponse['status'] = "success";
                        $this->apiResponse['message'] = 'Successfully save your Company Section Data!';
                        $this->apiResponse['data'] = $request->all();
                    }
                    break;
                case 'comanyUserContSet':

                    if (!empty($request['comapny_setting_id'])) {
                        $request['comapny_setting_id'] = Module::updateRow('company_settings', $request, $request['comapny_setting_id']);
                    } else {

                        $request['comapny_setting_id'] = Module::insert('company_settings', $request);
                        // make default entries for UOM
                        $date = date('Y-m-d h:i:s');
                        $uom_names = ["n1" => "Not Applicable", "n2" => "Time", "n3" => "Hours", "n4" => "Days", "n5" => "Mandays", "n6" => "% Percentage", "n7" => "$ USD", "n8" => "INR", "n9" => "Mil", "n10" => "Month", "n11" => "Numbers"];
                        foreach ($uom_names as $name) {
                            $datas = DB::table('u_o_ms')->insert(["company_id" => $request->company_id,
                                "name" => $name,
                                "created_at" => $date,
                                "updated_at" => $date,
                            ]);
                        }
                    }
                    DB::commit();
                    $request['company_step_id'] = Module::updateRow('company_steps', (object) $request, $request['company_step_id']);
                    $this->apiResponse['status'] = "success";
                    $this->apiResponse['message'] = 'Successfully Save Your Company Control Setting!';
                    $this->apiResponse['data'] = $request->all();
                    break;
            }
            return $this->sendResponse();
        } catch (\Exception $e) {
            $this->apiResponse['status'] = "failed";
            // $this->apiResponse['status_code'] = 300;
            $this->apiResponse['message'] = 'Company creation failed you have entered duplicate mail ID! ';
            return $this->sendResponse2();
        }
    }

    public function api_view_new_company_setup(Request $request)
    {
        // dump($request);
        $tempData = [];
        $baseUrl = url('/') . '/files/';
        $tempData['comanyInfo'] = Company_profile::select('company_profiles.*', 'company_profiles.id as company_id', 'company_steps.step_no', 'company_steps.step_name', DB::raw("CONCAT('{$baseUrl}', uploads.hash, '/', uploads.name) as file_name"), 'employers.multi_dept_id', 'employers.multi_unit_id', 'employers.multi_section_id')
            ->leftjoin('uploads', 'company_profiles.company_logo', '=', 'uploads.id')
            ->leftjoin('company_steps', 'company_profiles.company_step_id', '=', 'company_steps.id')
            ->leftjoin('employers', 'company_profiles.user_id', '=', 'employers.user_id')
            ->where('company_profiles.id', $request['company_id'])->get()->toarray();

        $tempData['comanyUnit'] = Unit::where('company_id', $request['company_id'])->get()->toarray();

        // if(!empty($request['company_id'])){
        // $tempData['comanyUser'] = Employer::where('company_id', $request['company_id'])->get()->toarray();
        // }
        if (!empty($request['company_id'])) {
            // $tempData['comanyUser'] = Employer::where('company_id', $request['company_id'])->whereNotIn('user_id', [$request['user_id']])->get()->toarray();
            $tempData['comanyUser'] = Employer::select('employers.*', 'department_masters.dept_name', 'department_masters.id as dept_id')
                ->leftjoin('department_masters', 'employers.user_id', '=', 'department_masters.user_id')
                ->where('employers.company_id', $request['company_id'])
                ->where('department_masters.deleted_at', null)
                ->whereNotIn('employers.user_id', [$request['user_id']])->get()->toarray();

        } else {
            $tempData['comanyUser'] = [];
        }
        $tempData['comanyDept'] = Department_master::where('company_id', $request['company_id'])->get()->toarray();
        // DB::table('department_masters')->select('*')
        // ->where('company_id', $request['company_id'])->get();
        //Department_master::where('company_id', $request['company_id'])->get()->toarray();
        // dump($tempData['comanyDept']);
        $tempData['comanySection'] = Section::where('company_id', $request['company_id'])->get()->toarray();
        $tempData['comanyUserContSet'] = Company_setting::where('company_id', $request['company_id'])->get()->toarray();

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "Company profile response";
        $this->apiResponse['data'] = $tempData;
        return $this->sendResponse();
    }

    public function api_new_company_setupp(Request $request)
    {
        $request['created_at'] = date('Y-m-d h:i:s');
        $request['updated_at'] = date('Y-m-d h:i:s');
        $unit_id = array();
        $company_details = Company_profile::where('user_id', $request['user_id'])->first();
        $companyData = array();
        if (empty($company_details)) {
            DB::beginTransaction();
            try {
                $company = array('company_name' => $request->company['company_name'], 'user_id' => $request['user_id'], 'created_at' => $request->created_at, 'updated_at' => $request->updated_at);
                $company_id = DB::table('company_profiles')->insertGetId($company);
                $companyData['company_id'] = $company_id;
                if (empty($company_id)) {
                    DB::rollback();
                    throw "Failed to created user company";
                }
                if (isset($request->unit['itemunits'])) {
                    $units = $request->unit['itemunits'];
                    foreach ($units as $unit) {
                        $unit_data = array('company_id' => $company_id, 'unit_name' => $unit['unit_name'], 'unit_address' => $unit['unit_address'], 'created_at' => $request->created_at, 'updated_at' => $request->updated_at);
                        $unit_id[$unit['unit_id']] = DB::table('units')->insertGetId($unit_data);
                        $StorcompanyData['unit_id'][] = $unit_id[$unit['unit_id']];
                    }
                    //$multi_unit_ids=(json_encode($companyData['unit_id']));
                    $multi_unit_ids = implode(',', $StorcompanyData['unit_id']);
                    $companyData['unit_id'] = $multi_unit_ids;
                    if (count($unit_id) != count($units)) {
                        DB::rollback();
                        throw "Failed to created company units.";
                    }
                    if (isset($request->dept['itemDept'])) {
                        $depts = $request->dept['itemDept'];
                        foreach ($depts as $dept) {
                            foreach ($dept['dept_unit'] as $dept_unit) {
                                $dept_unit_id = $unit_id[$dept_unit];
                                $dept_data = array('dept_name' => $dept['dept_name'], 'user_id' => $request['user_id'], 'unit_id' => $dept_unit_id, 'created_at' => $request->created_at, 'updated_at' => $request->updated_at);
                                $dept_ids[] = DB::table('department_masters')->insertGetId($dept_data);
                            }
                            //$multi_dept_id=json_encode($dept_ids);
                            $multi_dept_id = implode(',', $dept_ids);
                            $companyData['dept_id'] = $multi_dept_id;
                        }
                    }
                }
                DB::commit();
                DB::table('employers')->where('user_id', $request['user_id'])->update([
                    'multi_unit_id' => $multi_unit_ids, 'multi_dept_id' => $multi_dept_id, 'company_id' => $company_id,
                ]);
                DB::table('users')->where('id', $request['user_id'])->update([
                    'company_id' => $company_id,
                ]);
                $this->apiResponse['status'] = "success";
                $this->apiResponse['message'] = 'Successfully update company details!';
                $this->apiResponse['data'] = $companyData;
                return $this->sendResponse();
            } catch (\Exception $e) {
                DB::rollback();
                $this->apiResponse['status'] = "failed";
                $this->apiResponse['message'] = 'Company creation failed! ' . $e->getMessage();
                return $this->sendResponse();
            }
        } else {
            $this->apiResponse['status'] = "failed";
            $this->apiResponse['message'] = 'Company already created!';
            return $this->sendResponse();
        }
    }
}
