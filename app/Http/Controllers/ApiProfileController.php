<?php

namespace App\Http\Controllers;

use DB;
use Dwij\Laraadmin\Models\Module;
use Illuminate\Http\Request;
use Response;
use View;

class ApiProfileController extends ResponseApiController
{
    /**
     * view profile to database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_profile(Request $request)
    {

        if ($request->role_id != 1) {
            $data['user_data'] = DB::table('employers')->select('employers.id as emp_id', 'employers.name', 'employers.designation', 'employers.gender', 'employers.mobile', 'employers.mobile2', 'employers.email', 'employers.city', 'employers.address', 'employers.date_birth', 'employers.date_hire', 'employers.multi_unit_id', 'employers.multi_dept_id', 'employers.multi_section_id', 'employers.pan_card_no', 'employers.user_id', 'employers.photo_id')
                ->where('employers.deleted_at', null)
                ->where('employers.user_id', $request->user_id)
                ->first();

            if (!empty($data['user_data']->photo_id)) {
                $file_name = DB::table('uploads')
                    ->select('uploads.name as file_name', 'uploads.hash')
                    ->where('uploads.deleted_at', null)
                    ->where('id', $data['user_data']->photo_id)
                    ->first();

                // foreach ($file_name as $key2) {
                // dump($key2->file_name);die;

                if (!empty($file_name->file_name)) {
                    $profile_picturess = url('/') . '/files/' . $file_name->hash . '/' . $file_name->file_name;
                    // $data['profile_picture'] = url('/') . '/files/' . $key2->hash . '/' . $key2->file_name;
                    // $data['user_data']['profile_picture'] = url('/') . '/files/' . $key2->hash . '/' . $key2->file_name;

                    $data['user_data']->profile_picture = $profile_picturess;
                    // dump($data['user_data']);die;
                }
                // }
            } else {
                $data['user_data']->profile_picture = '';
            }
            if (!empty($data['user_data']->multi_unit_id)) {
                $unit_id = explode(',', ($data['user_data']->multi_unit_id));
                $data['unit_data'] = DB::table("units")->select('id as unit_id', 'unit_name')->where('deleted_at', null)->whereIn("id", $unit_id)->get();
            } else {
                $data['unit_data'] = [];
            }
            if (!empty($data['user_data']->multi_dept_id)) {
                $dept_id = explode(',', ($data['user_data']->multi_dept_id));
                $data['department_masters'] = DB::table("department_masters")->select('id as dept_id', 'dept_name')->where('deleted_at', null)->whereIn("id", $dept_id)->get();
            } else {
                $data['department_masters'] = [];
            }
            if (!empty($data['user_data']->multi_section_id)) {
                $section_id = explode(',', ($data['user_data']->multi_section_id));
                $data['sections'] = DB::table("sections")->select('id as section_id', 'section_name')->where('deleted_at', null)->whereIn("id", $section_id)->get();
            } else {
                $data['sections'] = [];
            }
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = "Profile view response !";
            $this->apiResponse['data'] = $data;
            return $this->sendResponse();
        } else {
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = "Profile view response !";
            $this->apiResponse['data'] = '';
            return $this->sendResponse();
        }
    }
    /**
     * update profile in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_update_profile(request $request)
    {
        $request['multi_unit_id'] = implode(",", $request->multi_unit_id);
        $request['multi_dept_id'] = implode(",", $request->multi_dept_id);
        $request['multi_section_id'] = implode(",", $request->multi_section_id);

        $insert_id = DB::table('employers')->where('user_id', $request['user_id'])->update(
            ['name' => $request['name'], 'email' => $request['email'], 'gender' => $request['gender'], 'mobile' => $request['mobile'], 'city' => $request['city'], 'date_birth' => $request['date_birth'], 'address' => $request['address'], 'multi_dept_id' => $request['multi_dept_id'], 'multi_unit_id' => $request['multi_unit_id'], 'multi_section_id' => $request['multi_section_id'], 'user_id' => $request['user_id'], 'mobile2' => $request['mobile2'], 'designation' => $request['designation'], 'pan_card_no' => $request['pan_card_no'], 'role_id' => $request['role_id']]
        );
        DB::table('users')->where('id', $request['user_id'])->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);
        DB::table('role_user')->where('user_id', $request['user_id'])->update([
            'role_id' => $request->role_id,
        ]);

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "successfully update your profile";
        return $this->sendResponse();
    }

    public function api_update_profile_picture(Request $request)
    {
        try {
            if ($request->File('photo')->isValid()) {

                $name = uniqid() . '.' . $request->photo->getClientOriginalName();
                $destination = $_SERVER["DOCUMENT_ROOT"] . '/storage/profile_picture';
                $request->photo->move($destination, $name);

                $string = "123456stringsawexs";
                $extension = pathinfo($name, PATHINFO_EXTENSION);
                $path = $destination . '/' . $name;
                $public = 1;
                $hash = str_shuffle($string);

                $request->name = $name;
                $request->extension = $extension;
                $request->path = $path;
                $request->public = $public;
                $request->hash = $hash;
                $image_id = Module::insert("uploads", $request);
                DB::table('employers')->where('user_id', $request->user_id)->update(['photo_id' => $image_id]);
            } else {
                $this->apiResponse['message'] = "Invalid Image Uploaded";
                return $this->sendResponse();
            }
        } catch (Exception $e) {
            $this->apiResponse['message'] = $e->getMessage();
            return $this->sendResponse();
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "successfully update your profile";
        return $this->sendResponse();
    }

    public function api_delete_user(request $request)
    {
        $date = date('Y-m-d h:i:s');
        DB::table('employers')->where('user_id', $request->user_id)->update(['deleted_at' => $date]);
        DB::table('users')->where('id', $request->user_id)->update(['deleted_at' => $date]);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "User successfully deleted";
        return $this->sendResponse();
    }
    public function api_get_single_user_details(Request $request)
    {
        $userdata = DB::table('employers')->where('user_id', $request->user_id)->first();
        if (!empty($userdata->photo_id)) {
            $file_name = DB::table('uploads')
                ->select('uploads.name as file_name', 'uploads.hash')
                ->where('uploads.deleted_at', null)
                ->where('id', $userdata->photo_id)
                ->first();

            if (!empty($file_name->file_name)) {
                $userdata->profile_picture = url('/') . '/files/' . $file_name->hash . '/' . $file_name->file_name;
            }
        } else {
            $userdata->profile_picture = '';
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['data'] = $userdata;
        $this->apiResponse['message'] = "User successfully deleted";
        return $this->sendResponse();
    }

    public function api_get_user_details_unit_wise(request $request)
    {
        $dept_data = DB::table('employers')->select('employers.name ', 'employers.user_id', 'units.unit_name')
            ->join('units', 'employers.multi_unit_id', '=', 'units.id')
        // ->where('department_masters.deleted_at', NULL)
            ->where('employers.multi_unit_id', $request->unit_id)
            ->get();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "department data list response";
        $this->apiResponse['data'] = $dept_data;
        return $this->sendResponse();
    }
    //create group start from here
    public function api_create_group(request $request)
    {
        $date = date('Y-m-d h:i:s');
        //  echo "<pre>";  print_r($request['user_id']);
        $create_group_data = array(
            "login_access_token" => $request['login_access_token'],
            "company_id" => $request['company_id'],
            "admin_id" => $request['admin_id'],
            "group_name" => $request['group_name'],
            "group_description" => $request['group_description'],
            "created_at" => $date,
        );

        $query = DB::table('profile_create_groups')->insertGetId($create_group_data);

        $group_id = $query;
        $r = json_encode($request['user_id']);

        $add_members = array(
            "user_id" => $r,
            "group_id" => $group_id,
            "created_at" => $date,
        );

        DB::table('profile_group_members')->insert($add_members);

        $this->apiResponse['status'] = "success";
        $this->apiResponse['group name'] = $request->group_name;
        $this->apiResponse['group description'] = $request->group_description;
        $this->apiResponse['message'] = 'Successfully create your group!';
        return $this->sendResponse();
    }
    public function api_view_profile_joined_group(request $request)
    {
        $date = date('Y-m-d h:i:s');

        $profilegroupdata = DB::table('profile_create_groups')
            ->where('company_id', $request->company_id)
            ->where('deleted_at', null)
            ->get();

        foreach ($profilegroupdata as $key1 => $group_row) {
            $row = DB::table('profile_group_members')->where('group_id', $group_row->id)->first();

            $joined_user = json_decode($row->user_id);
            $users = array();
            foreach ($joined_user as $key2 => $value) {
                // echo $key2;
                $users[$key2] = DB::table('users')->select('id as user_id', 'name')
                    ->where('id', $value)
                    ->where('deleted_at', null)
                    ->first();
            }
            $profilegroupdata[$key1]->users_id = $users;

        }
        //    die;

        //   $profilegroupdata =   DB::table('profile_create_groups')->select('profile_create_groups.id as group_id', 'profile_create_groups.group_name' ,'profile_create_groups.group_description','profile_create_groups.admin_id','profile_group_members.id as group_members_id',json_decode('profile_group_members.user_id'))
        //     ->leftJoin('profile_group_members', 'profile_group_members.group_id', '=', 'profile_create_groups.id')
        //    ->get();

        // $profilegroupdata = DB::table('profile_create_groups')
        //     ->leftJoin('profile_group_members', 'profile_create_groups.id', '=', 'profile_group_members.group_id')
        //     ->select('profile_create_groups.id as create_group_id', 'profile_create_groups.group_name', 'profile_create_groups.group_description', 'profile_create_groups.admin_id', 'profile_group_members.id as group_members_id', 'profile_group_members.user_id')
        //     ->where('profile_create_groups.company_id', $request->company_id)
        //     ->where('profile_create_groups.deleted_at', null)
        //     ->get();

        // $user_id_arr = '';
        //  foreach($profilegroupdata as $u_id){
        //    $user_id_arr =  json_decode($u_id->user_id);
        //  }
        // echo "<pre>";
        // print_r($profilegroupdata);exit;

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'group joined list by company';
        $this->apiResponse['data'] = $profilegroupdata;
        return $this->sendResponse();
    }

    public function api_add_participant_to_group(request $request)
    {
        $result = $request['user_id'];
        $req_user_id = array();
        foreach ($result as $res) {
            $req_user_id[] = $res['user_id'];
        }

        // $row = DB::table('profile_group_members')->where('group_id', $request['group_id'])->first();
        // $user_id_db = json_decode($row->user_id);

        // foreach ($req_user_id as $id) {
        //     if (!in_array($id, $user_id_db)) {
        //         $user_id_db[] = $id;
        //     }
        // }
        // DB::table('profile_group_members')
        //     ->where('group_id', $request['group_id'])
        //     ->update(array('user_id' => json_encode($user_id_db)));

        DB::table('profile_group_members')
            ->where('group_id', $request['group_id'])
            ->update(array('user_id' => json_encode($req_user_id)));

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully added member to this group!';
        return $this->sendResponse();
    }

    public function api_get_profile_user_by_group_id(request $request)
    {
        $row = DB::table('profile_group_members')->where('group_id', $request['group_id'])->first();
        $joined_user = json_decode($row->user_id);
        $joined_users = [];

        foreach ($joined_user as $key => $value) {
            $joined_users[$key] = DB::table('users')->select('id as user_id', 'name')
                ->where('id', $value)
                ->where('deleted_at', null)
                ->first();
        }
        $this->apiResponse['data'] = $joined_users;
        $this->apiResponse['message'] = 'Already Joined users to this group';
        return $this->sendResponse();
    }
    public function api_profile_delete_group(Request $request)
    {

        $date = date('Y-m-d h:i:s');
        // DB::table('profile_group_members')->where('group_id', $request->group_id)->delete();
        // DB::table('profile_create_groups')->where('id', $request->group_id)->delete();

        $project_member_id = DB::table('profile_create_groups')->where('id', $request->group_id)->update(['deleted_at' => $date]);
        $project_member_id = DB::table('profile_group_members')->where('group_id', $request->group_id)->update(['deleted_at' => $date]);

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully delete your Group !';
        return $this->sendResponse();
    }

    public function api_get_profile_group_details(Request $request)
    {
        //print_r($request->all());
        $group_details = DB::table('profile_create_groups')->where('id', $request->group_id)->first();
        $this->apiResponse['data'] = $group_details;
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'group details by group id';
        return $this->sendResponse();
    }

    public function api_edit_profile_group_update(Request $request)
    {
        //print_r($request->all());

        DB::table('profile_create_groups')->where('id', $request['id'])->update([
            'group_name' => $request['group_name'],
            'group_description' => $request['group_description'],
        ]);

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "successfully update your profile";
        return $this->sendResponse();
    }
    public function get_post(Request $request)
    {
        $post_data = DB::table('post_images')
            ->where('user_id', $request->user_id)
            ->where('company_id', $request->company_id)
            ->where('deleted_at', null)
            ->get();

            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = "get post response !";
            $this->apiResponse['data'] = $post_data;
        return $this->sendResponse();
    }
    public function create_post(Request $request)
    {
        try {
            if ($request->File('photo')->isValid()) {

                $name = uniqid() . '.' . $request->photo->getClientOriginalName();
                $destination = $_SERVER["DOCUMENT_ROOT"] . '/storage/post_imges';

                $request->photo->move($destination, $name);

                $string = "123456stringsawexs";
                $extension = pathinfo($name, PATHINFO_EXTENSION);
                $path = $destination . '/' . $name;
                $public = 1;
                $hash = str_shuffle($string);

                $request->image_name = $name;
                // $request->extension = $extension;
                $request->image_path = $path;
                // $request->public = $public;
                // $request->hash = $hash;

                // $content1  = $request->content;
                // $request->content = $content1;
                // dump('suraj',$content);
                // exit;
                Module::insert("post_images", $request);
                // DB::table('employers')->where('user_id', $request->user_id)->update(['photo_id' => $image_id]);
            } else {
                $this->apiResponse['message'] = "Invalid Image Uploaded";
                return $this->sendResponse();
            }
        } catch (Exception $e) {
            $this->apiResponse['message'] = $e->getMessage();
            return $this->sendResponse();
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "successfully update your profile";
        return $this->sendResponse();
    }

}
