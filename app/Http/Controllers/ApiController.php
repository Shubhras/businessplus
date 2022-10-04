<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Hash;
use Validator;
use Dwij\Laraadmin\Models\Module;
use Mail;
class ApiController extends ResponseApiController
{
    public function __construct()
    {
        //$this->beforeFilter('auth', ['on' => 'post']);
    }
    /**
     * Show the application common element over the site.
     *
     * @return Response
     */
    public function common(Request $request)
    {
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
        return $data;
    }
    /**
     * Store a newly user signuup in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_user_signup(Request $request)
    {
        $rules = Module::validateRules("users", $request);
        $rules = array(
            'email' => 'unique:users,email|email|required',
            'name' => 'required',
            'password' => 'required|min:6',
            'role_id' => 'required',
            'dept_master_id' => 'required',
            'unit_id' => 'required',
            'section_id' => 'required',
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        } else {
            $date = date('Y-m-d h:i:s');
            $insert_id = Module::insert("users", $request);
            $request->user_id = $insert_id;
            $insert_id = Module::insert("employers", $request);

            DB::insert('insert into role_user (role_id,user_id,created_at,updated_at) values(?,?,?,?)', [$request->role_id, $request->user_id, $date, $date]);

            // Send mail to User his new Password
            $userEmail = $request->email;
            $password = $request->password;

            try {
                if (env('MAIL_USERNAME') != null && env('MAIL_USERNAME') != "null" && env('MAIL_USERNAME') != "") {
                    // Send mail to User his new Password
                    Mail::send('emails.send_login_cred', ['email' => $userEmail, 'password' => $password], function ($m) use ($userEmail) {
                        $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                        $m->to($userEmail, 'Admin')->subject('Welcome to Prima Plus!');
                    });
                }
            } catch (Exception $e) {
                echo 'Message: ' . $e->getMessage();
            }
            $user_id = $request->user_id;
            $access_token = uniqid();
            $date = date('Y-m-d h:i:s');
            $login_accesstoken_data = DB::insert('insert into login_access_tokens (user_id,access_token,created_at,updated_at) values(?,?,?,?)', [$user_id, $access_token, $date, $date]);
            if ($login_accesstoken_data == true) {
                $this->apiResponse['status'] = "success";
                $this->apiResponse['login_access_token'] = $access_token;
                $this->apiResponse['message'] = 'You are successfully signup credential send your mail!';
                return $this->sendResponse();
            }
        }
    }

    /* user login */
    /**
     * Store a newly user login in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_user_login(Request $request)
    {
        $rules = Module::validateRules("users", $request);
        $rules = array(
            'email' => 'required|email',
            'password' => 'required'
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        } else {
            $email = $request->input('email');
            $password = $request->input('password');
            $users_data = DB::table('users')->select('users.id', 'users.email', 'users.name')
                ->where('email', $email)->first();
            if (empty($users_data)) {
                $message = 'Username not avilable !';
                return $this->respondNotFound($message);
            }
            $role_data = DB::table('role_user')->where('user_id', $users_data->id)->first();
            $role_id = $role_data->role_id;
            if (!empty($role_id)) {
                if (!empty($users_data->email)) {
                    // Check validation
                    if (auth()->attempt(['email' => $email, 'password' => $password])) {
                        $user_id = $users_data->id;
                        $access_token = uniqid();
                        $date = date('Y-m-d h:i:s');
                        $login_accesstoken_data = DB::insert('insert into login_access_tokens (user_id,access_token,created_at,updated_at) values(?,?,?,?)', [$user_id, $access_token, $date, $date]);
                        if ($login_accesstoken_data == true) {
                            $this->apiResponse['status'] = "success";
                            $this->apiResponse['login_access_token'] = $access_token;
                            $this->apiResponse['role_id'] = $role_id;
                            $this->apiResponse['message'] = 'You are successfully login';
                            $this->apiResponse['data'] = $users_data;
                            return $this->sendResponse();
                        }
                    } else {
                        $message = 'Password does not valid !';
                        return $this->respondInternalError($message);
                    }
                } else {
                    $message = 'User not avilable !';
                    return $this->respondInternalError($message);
                }
            } else {
                /*$data['access_token']=$request->token;*/
                $message = 'This is not valid user !';
                return $this->respondInternalError($message);
            }
        }
    }
    /**
     * view profile to database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_profile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'role_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $login_access_tokens_data = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        if (empty($login_access_tokens_data)) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->role_id != 1) {
            $user_data = DB::table('employers')->select('employers.id as emp_id', 'employers.name', 'employers.designation', 'employers.gender', 'employers.mobile', 'employers.mobile2', 'employers.email', 'employers.city', 'employers.address', 'employers.date_birth', 'employers.date_hire', 'employers.dept_master_id', 'department_masters.dept_name', 'employers.unit_id', 'units.unit_name', 'employers.section_id', 'sections.section_name', 'employers.pan_card_no', 'employers.user_id')
                ->join('department_masters', 'employers.dept_master_id', '=', 'department_masters.id')
                ->join('units', 'employers.unit_id', '=', 'units.id')
                ->join('sections', 'employers.section_id', '=', 'sections.id')
                ->where('employers.deleted_at', null)
                ->where('employers.user_id', $login_access_tokens_data->user_id)
                ->first();
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = "Profile view response !";
            $this->apiResponse['data'] = $user_data;
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
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'emp_id' => 'required',
            'name' => 'required',
            'gender' => 'required',
            'mobile' => 'required',
            'email' => 'required',
            'city' => 'required',
            'address' => 'required',
            'date_birth' => 'required',
            'date_hire' => 'required',
            'dept_master_id' => 'required',
            'unit_id' => 'required',
            'section_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $login_access_tokens_data = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        if (empty($login_access_tokens_data)) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $id = $request->emp_id;
        $insert_id = Module::updateRow("Employers", $request, $id);
        DB::table('users')->where('id', $login_access_tokens_data->user_id)->update([
            'name' => $request->name
        ]);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "successfully update your profile";
        return $this->sendResponse();
    }
    /**
     * add event in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_event(request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'role_id' => 'required',
            'event_name' => 'required',
            'category_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $login_access_tokens_data = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        if (empty($login_access_tokens_data)) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->role_id == 1) {
            $insert_id = Module::insert("events", $request);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = "Successfully add your event !";
            return $this->sendResponse();
        } else {
            $message = "Edit permission denied for add event !";
            $errors = 'Edit user does not match for add event !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /**
     * view event in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_event(request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'role_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $login_access_tokens_data = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        if (empty($login_access_tokens_data)) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->role_id == 1) {
            $events_data = DB::table('events')->select('events.id as event_id', 'events.event_name', 'events.category_id', 'categories.category_name')
                ->join('categories', 'events.category_id', '=', 'categories.id')
                ->where('events.deleted_at', null)
                ->get();
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = "Successfully add your event !";
            $this->apiResponse['data'] = $events_data;
            return $this->sendResponse();
        } else {
            $message = "Edit permission denied for add event !";
            $errors = 'Edit user does not match for add event !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /**
     * get department acording to unit to database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function get_department(Request $request)
    {
        $validator = Validator::make($request->all(), [
            /*'login_access_token' => 'required',*/
            'unit_id' => 'required',
        ]);

        $department_masters = DB::table('department_masters')->select('id', 'dept_name')
            ->where('deleted_at', null)
            ->where('unit_id', $request->unit_id)
            ->get();
       //     dump($department_masters);die;
        $data['department_masters'] = $department_masters;
        $message = 'dapartment master module dropdown list';
        return $this->respondCreated($message, $data);
    }
    /**
     * get section acording to department to database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function get_section(Request $request)
    {
        // dump($request);die;
        $sections = DB::table('sections')->select('id', 'section_name')
            ->where('deleted_at', null)
            ->where('dept_id', $request->dept_id)
            ->get();
        $data['sections'] = $sections;
        $message = 'sections master module dropdown list';
        return $this->respondCreated($message, $data);
    }
    /**
     * get strategic objectives acording to units to database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function get_strategic_objectives(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'unit_id' => 'required',

        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $login_access_tokens_data = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        if (empty($login_access_tokens_data)) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }

        $sections = DB::table('strategic_objectives')->select('id', 'description')
            ->where('deleted_at', null)
            ->where('unit_id', $request->unit_id)
            ->get();
        $data['sections'] = $sections;
        $message = 'strategic objectives module dropdown list';
        return $this->respondCreated($message, $data);
    }
    /**
     * get initiatives acording to units to database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function get_initiatives(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'unit_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $login_access_tokens_data = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        if (empty($login_access_tokens_data)) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }

        $sections = DB::table('initiatives')->select('id', 'definition')
            ->where('deleted_at', null)
            ->where('unit_id', $request->unit_id)
            ->get();
        $data['sections'] = $sections;
        $message = 'initiatives module dropdown list';
        return $this->respondCreated($message, $data);
    }
    /**
     * get user role to database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_get_select_modules()
    {
        $user_role = DB::table('roles')->select('roles.id', 'roles.display_name')->where('deleted_at', null)
            ->skip(1)->take(5)
            ->get();
        $units = DB::table('units')->select('units.id', 'units.unit_name', 'units.unit_address')
            ->where('deleted_at', null)
            ->where('enable', 'yes')
            ->get();
        $department_masters = DB::table('department_masters')->select('department_masters.id', 'department_masters.dept_name')
            ->where('deleted_at', null)
            ->where('enable', 'yes')
            ->get();

        $categories = DB::table('categories')->select('categories.id', 'categories.category_name')
            ->where('deleted_at', null)
            ->get();

        $events = DB::table('events')->select('events.id', 'events.event_name')
            ->where('deleted_at', null)
            ->get();

        $sections = DB::table('sections')->select('sections.id', 'sections.section_name')
            ->where('deleted_at', null)
            ->where('enable', 'yes')
            ->get();

        $status = DB::table('statuses')->select('statuses.id', 'statuses.status_name')
            ->where('deleted_at', null)

            ->get();

        $priorities = DB::table('priorities')->select('priorities.id', 'priorities.priority_name')
            ->where('deleted_at', null)

            ->get();

        $functions = DB::table('function_mods')->select('function_mods.id', 'function_mods.function_name')
            ->where('deleted_at', null)
            ->get();

        $business_initiatives = DB::table('business_initiatives')->select('business_initiatives.id', 'business_initiatives.business_initiative')
            ->where('deleted_at', null)
            ->get();
        $users = DB::table('users')->select('users.id', 'users.name')
            ->where('deleted_at', null)
            ->get();

        $projects = DB::table('projects')->select('projects.id', 'projects.project_name')
            ->where('deleted_at', null)
            ->get();

        $users = DB::table('users')->select('users.id', 'users.name')
            ->where('deleted_at', null)
            ->get();

        $projects = DB::table('projects')->select('projects.id', 'projects.project_name')
            ->where('deleted_at', null)
            ->get();

        $message = 'master module dropdown list';
        $data['user_role'] = $user_role;
        $data['department_masters'] = $department_masters;
        $data['units'] = $units;
        $data['sections'] = $sections;
        $data['status'] = $status;
        $data['priorities'] = $priorities;
        $data['functions'] = $functions;
        $data['categories'] = $categories;
        $data['business_initiatives'] = $business_initiatives;
        $data['events'] = $events;
        $data['users'] = $users;
        $data['projects'] = $projects;
        // return $this->respondCreated($message, $data);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "Project remark data list response";
        $this->apiResponse['data'] = $data;
        return $this->sendResponse();
        /*print_r($user_role); die;*/
    }

    /**
     * get user role to database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_get_select_auth_module(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',

        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $login_access_tokens_data = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        if (empty($login_access_tokens_data)) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }

        $users = DB::table('users')->select('users.id', 'users.name')
            ->where('deleted_at', null)
            ->get();

        $projects = DB::table('projects')->select('projects.id', 'projects.project_name')
            ->where('deleted_at', null)
            ->get();

        $message = 'master module dropdown list';
        $data['users'] = $users;
        $data['projects'] = $projects;
        return $this->respondCreated($message, $data);
        /*print_r($user_role); die;*/
    }


    /*user reset password update*/
    /**
     * Store a newly searchJobDetails in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_change_password(request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'current_password' => 'required',
            'new_password' => 'required|min:6|same:confirm_password',
            'confirm_password' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $login_access_tokens_data = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        if (empty($login_access_tokens_data)) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        /*print_r($login_access_tokens_data); die;*/
        $user_data = DB::table('users')->select('users.email', 'users.password')->where('id', $login_access_tokens_data->user_id)->where('deleted_at', null)->first();
        /*print_r($user_data); die;*/
        if (!empty($user_data)) {
            if (!(Hash::check($request->get('current_password'), $user_data->password))) {
                // The passwords matches
                $this->apiResponse['status'] = "errors";
                $this->apiResponse['errors'] = "Your current password does not matches with the password you provided. Please try again.";
                return $this->sendResponse();
            }
            if (strcmp($request->get('current_password'), $request->get('new_password')) == 0) {
                //Current password and new password are same
                $this->apiResponse['status'] = "errors";
                $this->apiResponse['errors'] = "New Password cannot be same as your current password. Please choose a different password.";
                return $this->sendResponse();
            }

            //Change Password
            /*$user = Auth::user();*/
            $password = bcrypt($request->new_password);
            /*print_r($password); die;*/
            DB::table('users')->where('id', $login_access_tokens_data->user_id)->update([
                'password' => $password

            ]);
            /*$user->save();*/
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = "Password changed successfully !";
            return $this->sendResponse();
        }
    }
    /**
     * Store a newly reset password in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_reset_password(request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = "email fields are required";
            return $this->respondValidationError($message, $errors);
        }

        $user_data = DB::table('users')->select('users.email', 'users.id as user_id')
            ->where('deleted_at', NULL)
            ->where('email', $request->email)
            ->first();
        if (empty($user_data)) {
            $message = "User not found";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if (!empty($user_data)) {
            // Send mail to User his new Password
            $resetPassword = uniqid();
            $resetPassword = substr($resetPassword, 1, 6);
            $userEmail = $user_data->email;
            $password = $resetPassword;

            if (env('MAIL_USERNAME') != null && env('MAIL_USERNAME') != "null" && env('MAIL_USERNAME') != "") {
                // Send mail to User his new Password
                Mail::send('emails.send_reset_password', ['password' => $password], function ($m) use ($userEmail) {
                    $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                    $m->to($userEmail, 'Admin')->subject('Reset Password Token!');
                });
            }
            $date = date('Y-m-d h:i:s');
            $password = $resetPassword;
            DB::table('employers')->where('user_id', $user_data->user_id)->update([
                'reset_password_token' => $password
            ]);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = "Please chack your email send reset password token !";
            return $this->sendResponse();
        } else {
            $this->apiResponse['status'] = "errors";
            $this->apiResponse['errors'] = "user email not found !";
            return $this->sendResponse();
        }
    }
    /**
     * Store a newly reset password update in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_resetpassword_update(request $request)
    {
        $validator = Validator::make($request->all(), [
            'reset_password_token' => 'required',
            'new_password' => 'required|min:6|same:confirm_password',
            'confirm_password' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = "all fields are required";
            return $this->respondValidationError($message, $errors);
        }

        $user_data = DB::table('employers')->select('employers.user_id')
            ->where('deleted_at', NULL)
            ->where('reset_password_token', $request->reset_password_token)
            ->first();
        /*print_r($user_data); die;*/
        if (!empty($user_data)) {
            $password = bcrypt($request->new_password);
            DB::table('users')->where('id', $user_data->user_id)->update([
                'password' => $password
            ]);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = "successfully reset your password";
            return $this->sendResponse();
        } else {
            $this->apiResponse['status'] = "errors";
            $this->apiResponse['errors'] = "Rest password token not valid !";
            return $this->sendResponse();
        }
    }

    /*projects */
    /**
     * Store and select project in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_projects(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        if (!empty($data['login_access_tokens_data']->user_id)) {
            $request->user_id = $data['login_access_tokens_data']->user_id;
        }
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }

        $validator = Validator::make($request->all(), [
            'project_name' => 'required',
            'unit_id' => 'required',
            'department_id' => 'required',
            'category_id' => 'required',
            //'event_id' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
            //'status_id' => 'required',
            'business_init_id' => 'required',
            //'enable' => 'required',

        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = "all fields are required";
            return $this->respondValidationError($message, $errors);
        } else {
            $request->status_id = 1;
            $insert_id = Module::insert("projects", $request);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully save your project!';
            return $this->sendResponse();
        }
    }
    /*edit projects */
    /**
     * Store and select project in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_edit_projects(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'project_id' => 'required',
            'user_id' => 'required',
            //'project_name' => 'required',
            //'unit_id' => 'required',
            //'department_id' => 'required',
            //'category_id' => 'required',
            //'event_id' => 'required',
            // 'start_date' => 'required',
            //'end_date' => 'required',
            'status_id' => 'required',
            // 'business_init_id' => 'required',
            //'enable' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $id = $request->project_id;
        $users_id = $data['login_access_tokens_data']->user_id;

        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $users_id) {
            $insert_id = Module::updateRow("Projects", $request, $id);
            if (!empty($request->status_id)) {
                DB::table('projects')->where('projects.id', $request->project_id)->update(['status_id' => $request->status_id]);
            }
            if (!empty($request->status_id)) {
                $date = date('Y-m-d h:i:s');
                DB::insert('insert into project_histories (project_id,status_id,logedin_user_id,created_at,updated_at) values(?,?,?,?,?)', [$request->project_id, $request->status_id, $users_id, $date, $date]);
            }
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully update your project!';
            return $this->sendResponse();
        } else {
            $message = "Edit permission denied for this project !";
            $errors = 'Edit user does not match for this project !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /*view projects */
    /**
     * Store and edit project in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_projects(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'unit_id' => 'required',
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
        $projects_data = DB::table('projects')->select('projects.id as project_id', 'projects.unit_id', 'projects.department_id', 'projects.category_id', 'projects.status_id', 'projects.business_init_id', 'projects.project_name', 'units.unit_name', 'department_masters.dept_name', 'categories.category_name', 'projects.start_date', 'projects.end_date', 'projects.user_id', 'users.name', 'statuses.status_name', 'business_initiatives.business_initiative', 'projects.enable')
            ->join('units', 'projects.unit_id', '=', 'units.id')
            ->join('department_masters', 'projects.department_id', '=', 'department_masters.id')
            ->join('categories', 'projects.category_id', '=', 'categories.id')
            //->join('events', 'projects.event_id', '=', 'events.id')
            ->join('users', 'projects.user_id', '=', 'users.id')
            ->join('statuses', 'projects.status_id', '=', 'statuses.id')
            ->join('business_initiatives', 'projects.business_init_id', '=', 'business_initiatives.id')
            ->where('projects.deleted_at', NULL)
            ->where('projects.user_id', $data['login_access_tokens_data']->user_id)
            ->where('projects.unit_id', $request->unit_id)
            ->orderBy('projects.id', 'desc')
            ->get();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "project list response";
        $this->apiResponse['data'] = $projects_data;
        return $this->sendResponse();
    }
    /*view projects details*/
    /**
     * Store and edit project in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_projects_details(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'project_id' => 'required',
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
        $projects_data = DB::table('projects')->select('projects.id as project_id', 'projects.unit_id', 'projects.department_id', 'projects.category_id', 'projects.event_id', 'projects.status_id', 'projects.business_init_id', 'projects.project_name', 'units.unit_name', 'department_masters.dept_name', 'categories.category_name', 'events.event_name', 'projects.start_date', 'projects.end_date', 'projects.user_id', 'users.name', 'statuses.status_name', 'business_initiatives.business_initiative', 'projects.enable')
            ->join('units', 'projects.unit_id', '=', 'units.id')
            ->join('department_masters', 'projects.department_id', '=', 'department_masters.id')
            ->join('categories', 'projects.category_id', '=', 'categories.id')
            ->join('events', 'projects.event_id', '=', 'events.id')
            ->join('users', 'projects.user_id', '=', 'users.id')
            ->join('statuses', 'projects.status_id', '=', 'statuses.id')
            ->join('business_initiatives', 'projects.business_init_id', '=', 'business_initiatives.id')
            ->where('projects.deleted_at', NULL)
            /*->where('projects.user_id', $data['login_access_tokens_data']->user_id)*/
            ->where('projects.id', $request->project_id)
            ->orderBy('projects.id', 'desc')
            ->first();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "project list response";
        $this->apiResponse['data'] = $projects_data;
        return $this->sendResponse();
    }
    /*delete projects */
    /**
     * Store and select delete project in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_projects(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'project_id' => 'required',
            'user_id' => 'required',

        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $users_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $users_id) {
            $date = date('Y-m-d h:i:s');
            DB::table('projects')->where('projects.id', $request->project_id)->update(['deleted_at' => $date]);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully delete your project!';
            return $this->sendResponse();
        } else {
            $message = "Delete permission denied for this project !";
            $errors = 'Delete user does not match for this project !';
            return $this->respondValidationError($message, $errors);
        }
    }

    /*add projects remark*/
    /**
     * Store project remark in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_remark_projects(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'project_id' => 'required',
            //'status_id' => 'required',
            //'remark' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        if (!empty($data['login_access_tokens_data']->user_id)) {
            $request->logedin_user_id = $data['login_access_tokens_data']->user_id;
        }
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }

        $insert_id = Module::insert("project_histories", $request);
        if (!empty($request->status_id)) {
            DB::table('projects')->where('projects.id', $request->project_id)->update(['status_id' => $request->status_id]);
        }
        /*$request->project_id = $insert_id;*/
        if (!empty($request->hasFile('upload_id'))) {
            $upload_id = $request->file('upload_id');
            /*$image_name = time().$social_security->getClientOriginalName();*/
            $file_name = time() . $upload_id->getClientOriginalName();
            $destination = $_SERVER["DOCUMENT_ROOT"] . '/adminbusinessplus/storage/uploads';
            $request->file('upload_id')->move($destination, $file_name);

            $string = "123456stringsawexs";
            $extension = pathinfo($upload_id, PATHINFO_EXTENSION);
            $path = $destination . '/' . $file_name;
            $public = 1;
            $user_id = $request->logedin_user_id;
            $hash = str_shuffle($string);
            $request->project_remark_id = $insert_id;
            $request->user_id = $request->logedin_user_id;
            $request->name = $file_name;
            $request->extension = $extension;
            $request->path = $path;
            $request->public = $public;
            $request->hash = $hash;
            $date = date('Y-m-d h:i:s');
            $file_id = Module::insert("uploads", $request);
            $request->upload_id = $file_id;
            $image_idss = Module::insert("project_files", $request);
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully save your project remark!';
        return $this->sendResponse();
    }

    /*view remark view projects*/
    /**
     * remark view projects in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_projects_remark(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'project_id' => 'required'
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
        $projects_remark_data = DB::table('project_histories')->select('projects.id as project_id', 'projects.project_name', 'project_histories.logedin_user_id as user_id', 'users.name', 'project_histories.status_id', 'statuses.status_name', 'project_histories.remark', 'project_histories.id as project_remark_id', 'project_histories.updated_at')
            ->join('projects', 'project_histories.project_id', '=', 'projects.id')
            ->join('users', 'project_histories.logedin_user_id', '=', 'users.id')
            ->join('statuses', 'project_histories.status_id', '=', 'statuses.id')
            ->where('project_histories.deleted_at', NULL)
            ->where('project_histories.project_id', $request->project_id)
            ->orderBy('project_histories.id', 'desc')
            ->get();
        /*print_r($projects_remark_data); die;*/
        foreach ($projects_remark_data as $key => $row) {
            $projects_remark_file_data = DB::table('project_files')->select('project_files.id as project_files_id', 'uploads.name as file_name', 'uploads.hash', 'users.name as user_name', 'users.id as user_id', 'projects.project_name', 'project_files.project_id', 'project_files.updated_at')
                ->join('uploads', 'project_files.upload_id', '=', 'uploads.id')
                ->join('users', 'project_files.logedin_user_id', '=', 'users.id')
                ->join('projects', 'project_files.project_id', '=', 'projects.id')
                ->where('project_files.deleted_at', NULL)
                ->where('project_files.project_id', $request->project_id)
                ->where('project_files.project_remark_id', $row->project_remark_id)
                ->orderBy('project_files.id', 'desc')
                ->get();

            $projects_remark_data[$key]->projects_remark_file_data = $projects_remark_file_data;
        }
        foreach ($projects_remark_data as $key1 => $value1) {
            foreach ($projects_remark_data[$key1]->projects_remark_file_data as $key => $row) {
                if (!empty($row->file_name)) {
                    $image_path = url('/') . '/files/' . $row->hash . '/' . $row->file_name;
                    $projects_remark_data[$key1]->projects_remark_file_data[$key]->image_path = $image_path;
                } else {
                    $projects_remark_data[$key1]->projects_remark_file_data[$key]->image_path = '';
                }
            }
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "Project remark data list response";
        $this->apiResponse['data'] = $projects_remark_data;
        return $this->sendResponse();
    }
    /*project view remark files */
    /**
     * Store and edit project in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_projects_remark_file(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'project_id' => 'required'
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
        $projects_remark_file_data = DB::table('project_files')->select('project_files.id as project_files_id', 'uploads.name as file_name', 'uploads.hash', 'users.name as user_name', 'users.id as user_id', 'projects.project_name', 'project_files.project_id', 'project_files.updated_at')
            ->join('uploads', 'project_files.upload_id', '=', 'uploads.id')
            ->join('users', 'project_files.logedin_user_id', '=', 'users.id')
            ->join('projects', 'project_files.project_id', '=', 'projects.id')
            ->where('project_files.deleted_at', NULL)
            ->where('project_files.project_id', $request->project_id)
            ->orderBy('project_files.id', 'desc')
            ->get();
        foreach ($projects_remark_file_data as $key => $row) {
            if (!empty($row->file_name)) {
                $projects_remark_file_data[$key]->image_path = url('/') . '/files/' . $row->hash . '/' . $row->file_name;
            } else {
                $projects_remark_file_data[$key]->image_path = ' ';
            }
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "Project remark data list response";
        $this->apiResponse['data'] = $projects_remark_file_data;
        return $this->sendResponse();
    }
    /*edit projects remark */
    /**
     * Store edit task remark in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_edit_projects_remark(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'project_remark_id' => 'required',
            'user_id' => 'required',
            'project_id' => 'required',
            //'status_id' => 'required',
            //'remark' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $id = $request->project_remark_id;
        $logedin_user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $logedin_user_id) {
            $insert_id = Module::updateRow("project_histories", $request, $id);
            if (!empty($request->status_id)) {
                DB::table('projects')->where('projects.id', $request->project_id)->update(['status_id' => $request->status_id]);
            }
            if (!empty($request->hasFile('upload_id'))) {
                $upload_id = $request->file('upload_id');
                $file_name = time() . $upload_id->getClientOriginalName();
                $destination = $_SERVER["DOCUMENT_ROOT"] . '/adminbusinessplus/storage/uploads';
                $request->file('upload_id')->move($destination, $file_name);

                $string = "123456stringsawexs";
                $extension = pathinfo($upload_id, PATHINFO_EXTENSION);
                $path = $destination . '/' . $file_name;
                $public = 1;
                $hash = str_shuffle($string);

                $request->user_id = $logedin_user_id;
                $request->name = $file_name;
                $request->extension = $extension;
                $request->path = $path;
                $request->public = $public;
                $request->hash = $hash;
                $date = date('Y-m-d h:i:s');
                $file_id = Module::insert("uploads", $request);
                $request->logedin_user_id = $logedin_user_id;
                $request->upload_id = $file_id;
                $image_idss = Module::insert("project_files", $request);
            }
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully update project remark!';
            return $this->sendResponse();
        } else {
            $message = "Permission denied for this project remark !";
            $errors = 'user does not match for this project remark !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /*delete project remark */
    /**
     * Store and select delete project in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_projects_remark(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'project_remark_id' => 'required',
            'user_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $logedin_user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $logedin_user_id) {
            $date = date('Y-m-d h:i:s');
            DB::table('project_histories')->where('project_histories.id', $request->project_remark_id)->where('project_histories.logedin_user_id', $logedin_user_id)->update(['deleted_at' => $date]);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully delete your project remark!';
            return $this->sendResponse();
        } else {
            $message = "Permission denied for this project !";
            $errors = 'user does not match for this project !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /*delete project remark file */
    /**
     * Store and select delete project in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_projects_remark_file(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'project_files_id' => 'required',
            'user_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $logedin_user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $logedin_user_id) {
            $date = date('Y-m-d h:i:s');
            DB::table('project_files')->where('project_files.id', $request->project_files_id)->where('project_files.logedin_user_id', $logedin_user_id)->update(['deleted_at' => $date]);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully delete your project remark file !';
            return $this->sendResponse();
        } else {
            $message = "Permission denied for this project remark file!";
            $errors = 'user does not match for this project remark file !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /*task */
    /**
     * Store task in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_tasks(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        if (!empty($data['login_access_tokens_data']->user_id)) {
            $request->user_id = $data['login_access_tokens_data']->user_id;
        }
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }

        $validator = Validator::make($request->all(), [
            'task_name' => 'required',
            'task_owner_id' => 'required',
            'project_id' => 'required',
            'unit_id' => 'required',
            'department_id' => 'required',
            'priority_id' => 'required',
            //'event_id' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
            //'completion_date' => 'required',
            // 'status_id' => 'required',
            'assign_to' => 'required',
            //'enable' => 'required',

        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = "all fields are required";
            return $this->respondValidationError($message, $errors);
        } else {
            $request->status_id = 1;
            $insert_id = Module::insert("tasks", $request);
            /*$assign_arr = explode(',', $request->assign_to);*/
            $date = date('Y-m-d h:i:s');
            foreach ($request->assign_to as $key => $user_id) {
                DB::insert('insert into task_assigns (task_id,user_id,created_at,updated_at) values(?,?,?,?)', [$insert_id, $user_id, $date, $date]);
            }
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully save your task!';
            return $this->sendResponse();
        }
    }

    /*edit task */
    /**
     * Store edit task in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_edit_tasks(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'user_id' => 'required',
            'task_id' => 'required',
            //'task_name' => 'required',
            //'task_owner_id' => 'required',
            //'project_id' => 'required',
            'unit_id' => 'required',
            //'department_id' => 'required',
            //'priority_id' => 'required',
            //'event_id' => 'required',
            //'start_date' => 'required',
            //'end_date' => 'required',
            //'completion_date' => 'required',
            //'status_id' => 'required',
            //'assign_to' => 'required',
            //'enable' => 'required',
            //'reminder_frequency' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $id = $request->task_id;
        if (!empty($data['login_access_tokens_data']->user_id)) {
            $users_id = $data['login_access_tokens_data']->user_id;
        }
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $users_id) {
            $date = date('Y-m-d h:i:s');
            if ($request->status_id == 3 || $request->status_id == 4) {
                $newDate = date("d-m-Y h:i:s", strtotime($date));
                $request->completion_date = $newDate;
            } else {
                $request->completion_date = '';
            }
            $insert_id = Module::updateRow("Tasks", $request, $id);
            if (!empty($request->status_id)) {
                DB::insert('insert into task_histories (task_id,status_id,logedin_user_id,created_at,updated_at) values(?,?,?,?,?)', [$request->task_id, $request->status_id, $users_id, $date, $date]);
            }
            DB::table('task_assigns')->where('task_assigns.task_id', $request->task_id)->update(['deleted_at' => $date]);
            /*$assign_arr = explode(',', $request->assign_to);*/
            if (isset($request->assign_to)) {
                foreach ($request->assign_to as $key => $user_id) {
                    DB::insert('insert into task_assigns (task_id,user_id,created_at,updated_at) values(?,?,?,?)', [$insert_id, $user_id, $date, $date]);
                }
            }
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully update your task!';
            return $this->sendResponse();
        } else {
            $message = "Permission denied for this task !";
            $errors = 'user does not match for this task !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /**
     * View task in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_tasks(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'unit_id' => 'required',
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
        $tasks_data = DB::table('tasks')->select('tasks.user_id', 'tasks.id as tasks_id', 'tasks.unit_id', 'tasks.priority_id', 'tasks.project_id', 'tasks.department_master_id', 'tasks.status_id', 'tasks.task_owner_id', 'tasks.assign_to', 'tasks.task_name', 'priorities.priority_name', 'projects.project_name', 'units.unit_name', 'department_masters.dept_name', 'tasks.start_date', 'tasks.end_date', 'tasks.completion_date', 'tasks.enable', 'task_owaner.name as task_owaner_name', 'create_to_user_name.name as create_to_user_name', 'statuses.status_name', 'tasks.reminder_frequency')
            ->leftjoin('priorities', 'tasks.priority_id', '=', 'priorities.id')
            ->leftjoin('projects', 'tasks.project_id', '=', 'projects.id')
            ->leftjoin('units', 'tasks.unit_id', '=', 'units.id')
            ->leftjoin('department_masters', 'tasks.department_master_id', '=', 'department_masters.id')
            //->leftjoin('events', 'tasks.event_id', '=', 'events.id')
            ->leftjoin('users as task_owaner', 'tasks.task_owner_id', '=', 'task_owaner.id')
            ->leftjoin('users as create_to_user_name', 'tasks.user_id', '=', 'create_to_user_name.id')
            ->leftjoin('statuses', 'tasks.status_id', '=', 'statuses.id')
            ->leftjoin('task_assigns', 'tasks.id', '=', 'task_assigns.task_id')
            ->where('tasks.deleted_at', NULL)
            ->where('task_assigns.deleted_at', NULL)
            ->where('tasks.unit_id', $request->unit_id)
            ->where('tasks.user_id', $data['login_access_tokens_data']->user_id)
            ->orderBy('tasks.id', 'desc')
            ->orwhere([
                ['task_assigns.user_id', $data['login_access_tokens_data']->user_id],
                ['tasks.deleted_at', NULL], ['tasks.unit_id', $request->unit_id]
            ])->groupBy('tasks_id')->get();
        foreach ($tasks_data as $key => $row) {
            $task_assigns_data = DB::table('task_assigns')->select('task_assigns.task_id', 'tasks.task_name', 'task_assigns.user_id', 'users.name')
                ->join('users', 'task_assigns.user_id', '=', 'users.id')
                ->join('tasks', 'task_assigns.task_id', '=', 'tasks.id')
                ->where('task_assigns.deleted_at', NULL)
                ->where('task_assigns.task_id', $row->tasks_id)
                ->get();
            $tasks_data[$key]->task_assigns_data = $task_assigns_data;
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "tasks list response";
        $this->apiResponse['data'] = $tasks_data;
        /*$this->apiResponse['task_assigns_data'] = $task_assigns_data1;*/
        return $this->sendResponse();
    }
    /**
     * View task details in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_tasks_details(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'tasks_id' => 'required',
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
        $tasks_data = DB::table('tasks')->select('tasks.user_id', 'tasks.id as tasks_id', 'tasks.unit_id', 'tasks.priority_id', 'tasks.project_id', 'tasks.department_master_id', 'tasks.status_id', 'tasks.task_owner_id', 'tasks.assign_to', 'tasks.task_name', 'priorities.priority_name', 'projects.project_name', 'units.unit_name', 'department_masters.dept_name', 'tasks.start_date', 'tasks.end_date', 'tasks.completion_date', 'tasks.enable', 'task_owaner.name as task_owaner_name', 'assign_to_user.name as assign_to_user_name', 'statuses.status_name')
            ->leftjoin('priorities', 'tasks.priority_id', '=', 'priorities.id')
            ->leftjoin('projects', 'tasks.project_id', '=', 'projects.id')
            ->leftjoin('units', 'tasks.unit_id', '=', 'units.id')
            ->leftjoin('department_masters', 'tasks.department_master_id', '=', 'department_masters.id')
            //->leftjoin('events', 'tasks.event_id', '=', 'events.id')
            ->leftjoin('users as task_owaner', 'tasks.task_owner_id', '=', 'task_owaner.id')
            ->leftjoin('users as assign_to_user', 'tasks.user_id', '=', 'assign_to_user.id')
            ->leftjoin('statuses', 'tasks.status_id', '=', 'statuses.id')
            ->leftjoin('task_assigns', 'tasks.id', '=', 'task_assigns.task_id')
            ->where('tasks.deleted_at', NULL)
            ->where('tasks.id', $request->tasks_id)
            /*->where('task_assigns.deleted_at',NULL)*/
            /*->where('tasks.user_id', $data['login_access_tokens_data']->user_id)*/
            ->orderBy('tasks.id', 'desc')
            ->distinct()
            ->first();
        /*print_r($tasks_data); die;*/
        if ($tasks_data->tasks_id != '') {
            $task_assigns_data = DB::table('task_assigns')->select('task_assigns.task_id', 'tasks.task_name', 'task_assigns.user_id', 'users.name')
                ->join('users', 'task_assigns.user_id', '=', 'users.id')
                ->join('tasks', 'task_assigns.task_id', '=', 'tasks.id')
                ->where('task_assigns.deleted_at', NULL)
                ->where('task_assigns.task_id', $tasks_data->tasks_id)
                ->get();
            $tasks_data->task_assigns_data = $task_assigns_data;
        } else {
            $tasks_data->task_assigns_data = '';
        }

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "tasks list response";
        $this->apiResponse['data'] = $tasks_data;
        return $this->sendResponse();
    }

    /*delete tasks */
    /**
     * Store and select delete project in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_tasks(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'task_id' => 'required',
            'user_id' => 'required',

        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $users_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $users_id) {
            $date = date('Y-m-d h:i:s');
            DB::table('tasks')->where('tasks.id', $request->task_id)->update(['deleted_at' => $date]);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully delete your tasks!';
            return $this->sendResponse();
        } else {
            $message = "Permission denied for this task !";
            $errors = 'user does not match for this task !';
            return $this->respondValidationError($message, $errors);
        }
    }

    /*add task remark*/
    /**
     * Store task remark in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_remark_tasks(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'task_id' => 'required',
            //'reminder_frequency' => 'required',
            //'status_id' => 'required',
            //'remark' => 'required',
            /* 'upload_id' => 'required',*/
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $id = $request->task_id;
        $request->logedin_user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }

        $insert_id = Module::insert("task_histories", $request);
        $date = date('Y-m-d h:i:s');
        if ($request->status_id == 3 || $request->status_id == 4) {
            $date = date('Y-m-d h:i:s');
            $newDate = date("d-m-Y h:i:s", strtotime($date));
            $request->completion_date = $newDate;
        } else {
            $request->completion_date = '';
        }
        if (!empty($request->status_id)) {
            DB::table('tasks')->where('tasks.id', $request->task_id)->update(['status_id' => $request->status_id], ['completion_date' => $request->completion_date]);
        }
        /*$request->task_id = $insert_id;*/
        if (!empty($request->hasFile('upload_id'))) {
            $upload_id = $request->file('upload_id');
            $file_name = time() . $upload_id->getClientOriginalName();
            $destination = $_SERVER["DOCUMENT_ROOT"] . '/adminbusinessplus/storage/uploads';
            $request->file('upload_id')->move($destination, $file_name);

            $string = "123456stringsawexs";
            $extension = pathinfo($upload_id, PATHINFO_EXTENSION);
            $path = $destination . '/' . $file_name;
            $public = 1;
            $user_id = $request->logedin_user_id;
            $hash = str_shuffle($string);

            $request->user_id = $request->logedin_user_id;
            $request->name = $file_name;
            $request->extension = $extension;
            $request->path = $path;
            $request->public = $public;
            $request->hash = $hash;
            $request->task_remark_id = $insert_id;
            $date = date('Y-m-d h:i:s');
            $file_id = Module::insert("uploads", $request);
            $request->upload_id = $file_id;
            $image_idss = Module::insert("tasks_files", $request);
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully save your task remark!';
        return $this->sendResponse();
    }

    /*view remark view */
    /**
     * Store and edit project in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_tasks_remark(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'tasks_id' => 'required'
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
        $tasks_remark_data = DB::table('task_histories')->select('tasks.id as tasks_id', 'tasks.task_name', 'task_histories.logedin_user_id as user_id', 'users.name', 'task_histories.status_id', 'statuses.status_name', 'task_histories.remark', 'task_histories.updated_at', 'task_histories.id as task_remark_id')
            ->leftjoin('tasks', 'task_histories.task_id', '=', 'tasks.id')
            ->leftjoin('users', 'task_histories.logedin_user_id', '=', 'users.id')
            ->leftjoin('statuses', 'task_histories.status_id', '=', 'statuses.id')
            ->where('task_histories.task_id', $request->tasks_id)
            ->where('task_histories.deleted_at', NULL)
            ->orderBy('task_histories.id', 'desc')
            ->get();
        /*print_r($tasks_remark_data);die;*/
        foreach ($tasks_remark_data as $key => $row) {
            $tasks_remark_file_data = DB::table('tasks_files')->select('tasks_files.id as tasks_files_id', 'tasks_files.task_id as tasks_id', 'tasks_files.updated_at', 'uploads.name as file_name', 'uploads.hash')
                ->join('uploads', 'tasks_files.upload_id', '=', 'uploads.id')
                ->join('users', 'tasks_files.logedin_user_id', '=', 'users.id')
                ->join('task_histories', 'tasks_files.task_remark_id', '=', 'task_histories.id')
                ->where('tasks_files.deleted_at', NULL)
                ->where('tasks_files.task_id', $request->tasks_id)
                ->where('tasks_files.task_remark_id', $row->task_remark_id)
                ->orderBy('tasks_files.id', 'desc')
                ->get();
            $tasks_remark_data[$key]->tasks_remark_file_data = $tasks_remark_file_data;
        }

        foreach ($tasks_remark_data as $key1 => $value1) {
            foreach ($tasks_remark_data[$key1]->tasks_remark_file_data as $key => $row) {
                if (!empty($row->file_name)) {
                    $image_path = url('/') . '/files/' . $row->hash . '/' . $row->file_name;
                    $tasks_remark_data[$key1]->tasks_remark_file_data[$key]->image_path = $image_path;
                } else {
                    $tasks_remark_data[$key1]->tasks_remark_file_data[$key]->image_path = '';
                }
            }
        }

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "tasks_remark_data list response";
        $this->apiResponse['data'] = $tasks_remark_data;
        return $this->sendResponse();
    }

    /*view remark files */
    /**
     * Store and edit project in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_tasks_remark_file(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'tasks_id' => 'required'
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
        $tasks_remark_file_data = DB::table('tasks_files')->select('tasks_files.id as tasks_files_id', 'uploads.name as file_name', 'uploads.hash', 'users.name as user_name', 'users.id as user_id', 'tasks.task_name', 'tasks_files.task_id as tasks_id', 'tasks_files.updated_at')
            ->leftjoin('uploads', 'tasks_files.upload_id', '=', 'uploads.id')
            ->leftjoin('users', 'tasks_files.logedin_user_id', '=', 'users.id')
            ->leftjoin('tasks', 'tasks_files.task_id', '=', 'tasks.id')
            ->where('tasks_files.deleted_at', NULL)
            ->where('tasks_files.task_id', $request->tasks_id)
            ->orderBy('tasks_files.id', 'desc')
            ->get();
        foreach ($tasks_remark_file_data as $key => $row) {
            if (!empty($row->file_name)) {
                $tasks_remark_file_data[$key]->image_path = url('/') . '/files/' . $row->hash . '/' . $row->file_name;
            } else {
                $tasks_remark_file_data[$key]->image_path = ' ';
            }
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "tasks_remark_data list response";
        $this->apiResponse['data'] = $tasks_remark_file_data;
        return $this->sendResponse();
    }

    /*edit task remark */
    /**
     * Store edit task remark in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_edit_tasks_remark(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'task_remark_id' => 'required',
            'user_id' => 'required',
            'tasks_id' => 'required',
            //'status_id' => 'required',
            //'remark' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $id = $request->task_remark_id;
        $logedin_user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $logedin_user_id) {
            $insert_id = Module::updateRow("task_histories", $request, $id);
            if ($request->status_id == 3 || $request->status_id == 4) {
                $date = date('Y-m-d h:i:s');
                $newDate = date("d-m-Y h:i:s", strtotime($date));
                $request->completion_date = $newDate;
            } else {
                $request->completion_date = '';
            }
            if (!empty($request->status_id)) {
                DB::table('tasks')->where('tasks.id', $request->tasks_id)->update(['status_id' => $request->status_id], ['completion_date' => $request->completion_date]);
            }
            $request->task_id = $request->tasks_id;
            if (!empty($request->hasFile('upload_id'))) {
                $upload_id = $request->file('upload_id');
                /*$image_name = time().$social_security->getClientOriginalName();*/
                $file_name = time() . $upload_id->getClientOriginalName();
                $destination = $_SERVER["DOCUMENT_ROOT"] . '/adminbusinessplus/storage/uploads';
                $request->file('upload_id')->move($destination, $file_name);

                $string = "123456stringsawexs";
                $extension = pathinfo($upload_id, PATHINFO_EXTENSION);
                $path = $destination . '/' . $file_name;
                $public = 1;
                $user_id = $logedin_user_id;
                $hash = str_shuffle($string);

                $request->user_id = $logedin_user_id;
                $request->name = $file_name;
                $request->extension = $extension;
                $request->path = $path;
                $request->public = $public;
                $request->hash = $hash;
                $date = date('Y-m-d h:i:s');
                $file_id = Module::insert("uploads", $request);
                $request->logedin_user_id = $logedin_user_id;
                $request->upload_id = $file_id;
                $image_idss = Module::insert("tasks_files", $request);
            }
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully update task remark!';
            return $this->sendResponse();
        } else {
            $message = "Edit permission denied for this task !";
            $errors = 'Edit user does not match for this task !';
            return $this->respondValidationError($message, $errors);
        }
    }

    /*delete tasks remark */
    /**
     * Store and select delete project in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_tasks_remark(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'task_remark_id' => 'required',
            'user_id' => 'required',

        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $logedin_user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $logedin_user_id) {
            $date = date('Y-m-d h:i:s');
            DB::table('task_histories')->where('task_histories.id', $request->task_remark_id)->where('task_histories.logedin_user_id', $logedin_user_id)->update(['deleted_at' => $date]);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully delete your tasks remark!';
            return $this->sendResponse();
        } else {
            $message = "Delete permission denied for this task !";
            $errors = 'Delete user does not match for this task !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /*delete task remark file */
    /**
     * delete and task remark data in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_tasks_remark_file(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'tasks_files_id' => 'required',
            'user_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $logedin_user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $logedin_user_id) {
            $date = date('Y-m-d h:i:s');
            DB::table('tasks_files')->where('tasks_files.id', $request->tasks_files_id)->where('tasks_files.logedin_user_id', $logedin_user_id)->update(['deleted_at' => $date]);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully delete your task remark file !';
            return $this->sendResponse();
        } else {
            $message = "Permission denied for this task remark file!";
            $errors = 'user does not match for this task remark file !';
            return $this->respondValidationError($message, $errors);
        }
    }

    /*add business plans*/
    /**
     * Store business plans in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_business_plans(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            //'vision' => 'required',
            //'mission' => 'required',
            //'message_of_ceo' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $id = $request->task_id;
        $request->logedin_user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $insert_id = Module::insert("business_plans", $request);

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully save your business plans!';
        return $this->sendResponse();
    }
    /*view business plans */
    /**
     * View business plans to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_business_plans(Request $request)
    {
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
        $business_plans = DB::table('business_plans')->select('business_plans.id', 'business_plans.vision', 'business_plans.mission', 'business_plans.message_of_ceo')
            ->where('business_plans.deleted_at', NULL)
            ->where('business_plans.id', 1)
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
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'id' => 'required',
            'vision' => 'required',
            'mission' => 'required',
            'message_of_ceo' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $id = $request->id;
        $logedin_user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $insert_id = Module::updateRow("business_plans", $request, $id);
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully update business plans!';
        return $this->sendResponse();
    }
    /*add KPI Trackers*/
    /**
     * Store KPI Trackers in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_kpi_trackers(Request $request)
    {
        /*print_r($request->all()); die;*/
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'kpi_name' => 'required',
            'unit_id' => 'required',
            'department_id' => 'required',
            'section_id' => 'required',
            'ideal_trend' => 'required',
            //'kpi_type' => 'required',
            'unit_of_measurement' => 'required',
            'target_range_min' => 'required',
            'target_range_max' => 'required',
            'kpi_definition' => 'required|max:10000'
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $request->user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $insert_id = Module::insert("add_kpis", $request);

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully save your kpi!';
        return $this->sendResponse();
    }
    /*view KPI Trackers */
    /**
     * View KPI Trackers to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_kpi_trackers(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'unit_id' => 'required',
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
        $add_kpis_data = DB::table('add_kpis')->select('add_kpis.id as kpi_id', 'add_kpis.kpi_name', 'units.id as unit_id', 'units.unit_name', 'add_kpis.department_id', 'department_masters.dept_name', 'add_kpis.section_id', 'sections.section_name', 'add_kpis.ideal_trend', 'add_kpis.unit_of_measurement', 'add_kpis.target_range_min', 'add_kpis.target_range_max', 'add_kpis.kpi_definition', 'users.id as user_id', 'users.name as user_name')
            ->join('units', 'add_kpis.unit_id', '=', 'units.id')
            ->join('department_masters', 'add_kpis.department_id', '=', 'department_masters.id')
            ->join('sections', 'add_kpis.section_id', '=', 'sections.id')
            ->join('users', 'add_kpis.user_id', '=', 'users.id')
            ->where('add_kpis.deleted_at', NULL)
            ->where('add_kpis.unit_id', $request->unit_id)
            ->orderBy('add_kpis.id', 'desc')
            ->get();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "KPI Trackers data list response";
        $this->apiResponse['data'] = $add_kpis_data;
        return $this->sendResponse();
    }
    /*add KPI Targets*/
    /**
     * Store KPI Trackers in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_add_targets(Request $request)
    {
        /*print_r($request->all()); die;*/
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'kpi_id' => 'required',
            'target_year' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $request->user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $kpi_targets = DB::table('kpi_targets')
            ->where('target_year', $request->target_year)
            ->where('kpi_id', $request->kpi_id)
            ->first();
        if (empty($kpi_targets)) {
            $insert_id = Module::insert("kpi_targets", $request);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully save your kpi target!';
            return $this->sendResponse();
        } else {
            $this->apiResponse['status'] = "error";
            $this->apiResponse['message'] = 'Already insert this target year data !';
            return $this->sendResponse();
            $message = "Already insert this target year data !";
            $errors = 'Already insert this target year data !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /*Edit edit kpi tragets */
    /**
     * Store edit KPI Trackerss in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_edit_targets(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'kpi_id' => 'required',
            'user_id' => 'required',
            'target_id' => 'required',
            'target_year' => 'required',

        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $users_id = $data['login_access_tokens_data']->user_id;
        $id = $request->target_id;
        $logedin_user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $users_id) {
            $insert_id = Module::updateRow("kpi_targets", $request, $id);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully update KPI edit target!';
            return $this->sendResponse();
        } else {
            $message = "Edit permission denied for this KPI Trackers !";
            $errors = 'Edit user does not match for this KPI Trackers !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /*add KPI Actuals*/
    /**
     * Store KPI actuals in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_add_actuals(Request $request)
    {
        /*print_r($request->all()); die;*/
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'kpi_id' => 'required',
            'actual_year' => 'required',

        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $request->user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $kpi_targets = DB::table('kpi_actuals')
            ->where('actual_year', $request->actual_year)
            ->where('kpi_id', $request->kpi_id)
            ->first();
        if (empty($kpi_targets)) {
            $insert_id = Module::insert("kpi_actuals", $request);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully save your kpi actuals!';
            return $this->sendResponse();
        } else {
            $message = "Already insert this actual year data !";
            $errors = 'Already insert this actual year data !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /*Edit edit kpi actuals */
    /**
     * Store edit KPI Trackerss in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_edit_actuals(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'kpi_id' => 'required',
            'user_id' => 'required',
            'actual_id' => 'required',
            'actual_year' => 'required',

        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $users_id = $data['login_access_tokens_data']->user_id;
        $id = $request->actual_id;
        $logedin_user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $users_id) {
            $insert_id = Module::updateRow("kpi_actuals", $request, $id);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully update KPI edit actuals!';
            return $this->sendResponse();
        } else {
            $message = "Edit permission denied for this KPI Trackers !";
            $errors = 'Edit user does not match for this KPI Trackers !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /*view KPI Trackers */
    /**
     * View KPI Trackers to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_kpi_trackers_track(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'unit_id' => 'required',
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
        $department_masters = DB::table('department_masters')->select('id', 'dept_name')
            ->where('deleted_at', NULL)
            ->where('unit_id', $request->unit_id)
            ->get();
        foreach ($department_masters as $key1 => $row) {
            $add_kpis_data = DB::table('add_kpis')->select('add_kpis.id as kpi_id', 'add_kpis.kpi_name', 'units.id as unit_id', 'units.unit_name', 'add_kpis.department_id', 'department_masters.dept_name', 'add_kpis.section_id', 'sections.section_name', 'add_kpis.ideal_trend', 'add_kpis.unit_of_measurement', 'add_kpis.target_range_min', 'add_kpis.target_range_max', 'add_kpis.kpi_definition', 'users.id as user_id', 'users.name as user_name')
                ->leftjoin('units', 'add_kpis.unit_id', '=', 'units.id')
                ->leftjoin('department_masters', 'add_kpis.department_id', '=', 'department_masters.id')
                ->leftjoin('sections', 'add_kpis.section_id', '=', 'sections.id')
                ->leftjoin('users', 'add_kpis.user_id', '=', 'users.id')
                ->where('add_kpis.deleted_at', NULL)
                ->where('add_kpis.unit_id', $request->unit_id)
                ->where('add_kpis.department_id', $row->id)
                ->orderBy('add_kpis.id', 'desc')
                ->get();
            $department_masters[$key1]->add_kpis_data = $add_kpis_data;

            $date = date('Y');

            foreach ($add_kpis_data as $key2 => $row_kpi) {
                $kpi_targets = DB::table('kpi_targets')->select('id as target_id', 'target_year', 'kpi_id', 'jan', 'feb', 'mar', 'apr', 'may', 'june', 'july', 'aug', 'sept', 'oct', 'nov', 'dec')
                    ->where('kpi_targets.kpi_id', $row_kpi->kpi_id)
                    ->where('kpi_targets.target_year', $date)
                    ->first();

                if ($kpi_targets) {
                    $department_masters[$key1]->add_kpis_data[$key2]->kpi_targets[] = $kpi_targets;
                    $department_masters[$key1]->add_kpis_data[$key2]->has_kpi_target = true;
                } else {
                    $department_masters[$key1]->add_kpis_data[$key2]->has_kpi_target = false;
                }
            }

            foreach ($add_kpis_data as $key4 => $row_bf_ty) {
                $kpi_targets_yr = DB::table('kpi_targets')
                    ->where('kpi_targets.kpi_id', $row_bf_ty->kpi_id)
                    ->where('kpi_targets.target_year', '<', $date)
                    ->where('kpi_targets.target_year', '>=', ($date - 4))
                    ->get();
                $kpi_targets_yr_p1 = DB::table('kpi_targets')
                    ->where('kpi_targets.kpi_id', $row_bf_ty->kpi_id)
                    ->where('kpi_targets.target_year', '<', $date)
                    ->where('kpi_targets.target_year', '>=', ($date - 3))
                    ->get();
                foreach ($kpi_targets_yr as $key5 => $row_bf_ty1) {
                    $avg = ($row_bf_ty1->apr + $row_bf_ty1->may + $row_bf_ty1->june + $row_bf_ty1->july + $row_bf_ty1->aug + $row_bf_ty1->sept + $row_bf_ty1->oct + $row_bf_ty1->nov + $row_bf_ty1->dec);
                    /*$avg = round($avg); 
                    $function_mods[$key1]->add_kpis_data[$key4]->kpi_targets[] = array("kpi_id"=>"$row_bf_ty1->kpi_id","target_year"=>"$row_bf_ty1->target_year","avg"=>$avg);*/
                }
                foreach ($kpi_targets_yr_p1 as $key6 => $row_bf_ty1_p1) {
                    $avg1 = ($row_bf_ty1_p1->jan + $row_bf_ty1_p1->feb + $row_bf_ty1_p1->mar);
                    $total_avg = round(($avg + $avg1) / 12);

                    $department_masters[$key1]->add_kpis_data[$key4]->kpi_targets[] = array("kpi_id" => "$row_bf_ty1->kpi_id", "target_year" => "$row_bf_ty1->target_year", "avg" => $total_avg);
                }
            }
            // query select data from kpi table where year is less than and equal to current year and greater than and equal to current year - 4
            // you will get kpi data for 5 years

            // loop through data and create your json
            // current year :: current year - 4
            // if (row->target_year == current-year) => extract data of 12 months

            // else => row->target_year => apr 2018 - dec 2018 + jan 2019 - mar 2019
            foreach ($add_kpis_data as $key3 => $row_kpi1) {
                $kpi_actuals = DB::table('kpi_actuals')->select('id as actual_id', 'actual_year', 'kpi_id', 'jan', 'feb', 'mar', 'apr', 'may', 'june', 'july', 'aug', 'sept', 'oct', 'nov', 'dec')
                    ->where('kpi_actuals.kpi_id', $row_kpi1->kpi_id)
                    ->where('kpi_actuals.actual_year', $date)
                    ->first();

                if ($kpi_actuals) {
                    $department_masters[$key1]->add_kpis_data[$key3]->kpi_actuals[] = $kpi_actuals;
                    $department_masters[$key1]->add_kpis_data[$key3]->has_kpi_actual = true;
                } else {
                    $department_masters[$key1]->add_kpis_data[$key3]->has_kpi_actual = false;
                }
            }
            foreach ($add_kpis_data as $key6 => $row_bf_ay) {
                $kpi_actuals_yr = DB::table('kpi_actuals')
                    ->where('kpi_actuals.kpi_id', $row_bf_ay->kpi_id)
                    ->where('kpi_actuals.actual_year', '<', $date)
                    ->where('kpi_actuals.actual_year', '>=', ($date - 4))
                    ->get();
                $kpi_actuals_yr_p1 = DB::table('kpi_actuals')
                    ->where('kpi_actuals.kpi_id', $row_bf_ay->kpi_id)
                    ->where('kpi_actuals.actual_year', '<', $date)
                    ->where('kpi_actuals.actual_year', '>=', ($date - 3))
                    ->get();
                foreach ($kpi_actuals_yr as $key7 => $row_bf_ay1) {
                    $avg = $row_bf_ay1->apr + $row_bf_ay1->may + $row_bf_ay1->june + $row_bf_ay1->july + $row_bf_ay1->aug + $row_bf_ay1->sept + $row_bf_ay1->oct + $row_bf_ay1->nov + $row_bf_ay1->dec;
                    /*$avg = round($avg); 
                    $function_mods[$key1]->add_kpis_data[$key6]->kpi_actuals[] = array("kpi_id"=>"$row_bf_ay1->kpi_id","actual_year"=>"$row_bf_ay1->actual_year","avg"=>$avg);*/
                }
                foreach ($kpi_actuals_yr_p1 as $key7 => $row_bf_ay1_p1) {
                    $avg1 = ($row_bf_ay1->jan + $row_bf_ay1->feb + $row_bf_ay1->mar);
                    $total_avg = round(($avg + $avg1) / 12);
                    $department_masters[$key1]->add_kpis_data[$key6]->kpi_actuals[] = array("kpi_id" => "$row_bf_ay1->kpi_id", "actual_year" => "$row_bf_ay1->actual_year", "avg" => $total_avg);
                }
            }
        }

        unset($key1, $key2, $row, $row_kpi);


        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "KPI Trackers data list response";
        $this->apiResponse['data'] = $department_masters;
        return $this->sendResponse();
    }
    /*Edit KPI Trackers */
    /**
     * Store edit KPI Trackerss in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_edit_kpi_trackers(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'user_id' => 'required',
            'kpi_id' => 'required',
            'kpi_name' => 'required',
            //'unit_id' => 'required',
            'department_id' => 'required',
            'section_id' => 'required',
            'ideal_trend' => 'required',
            //'kpi_type' => 'required',
            'unit_of_measurement' => 'required',
            'target_range_min' => 'required',
            'target_range_max' => 'required',
            'kpi_definition' => 'required|max:10000'
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $users_id = $data['login_access_tokens_data']->user_id;
        $id = $request->kpi_id;
        $logedin_user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $users_id) {
            $insert_id = Module::updateRow("add_kpis", $request, $id);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully update KPI Trackers!';
            return $this->sendResponse();
        } else {
            $message = "Edit permission denied for this KPI Trackers !";
            $errors = 'Edit user does not match for this KPI Trackers !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /*delete KPI Trackers */
    /**
     * Store and select delete project in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_kpi_trackers(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'kpi_id' => 'required',
            'user_id' => 'required',

        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $users_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $users_id) {
            $date = date('Y-m-d h:i:s');
            DB::table('add_kpis')->where('add_kpis.id', $request->kpi_id)->where('add_kpis.user_id', $users_id)->update(['deleted_at' => $date]);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully delete your KPI Trackers !';
            return $this->sendResponse();
        } else {
            $message = "Delete permission denied for this KPI Trackers !";
            $errors = 'Delete user does not match for this KPI Trackers !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /*add strategic objectives*/
    /**
     * Store strategic objectives in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_strategic_objectives(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'target_current_year' => 'required',
            'target_for_cur_y_1' => 'required',
            'target_for_cur_y_2' => 'required',
            'unit_id' => 'required',
            'department_id' => 'required',
            //'functions_id' => 'required',
            'tracking_frequency' => 'required',
            'description' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $request->user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        foreach ($request->department_id as $key => $dept_id) {
            $request->department_id = $dept_id;
            $insert_id = Module::insert("strategic_objectives", $request);
        }

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully save your strategic objectives !';
        return $this->sendResponse();
    }
    /*view strategic objectives */
    /**
     * View strategic objectives to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_strategic_objectives(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'unit_id' => 'required',
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
        $strategic_objectives = DB::table('strategic_objectives')->select('strategic_objectives.id as strategic_objectives_id', 'strategic_objectives.target_current_year', 'strategic_objectives.target_for_cur_y_1', 'strategic_objectives.target_for_cur_y_2', 'units.id as unit_id', 'units.unit_name', 'strategic_objectives.department_id', 'users.id as user_id', 'users.name as user_name', 'strategic_objectives.tracking_frequency', 'strategic_objectives.description')
            ->leftjoin('units', 'strategic_objectives.unit_id', '=', 'units.id')
            /*->leftjoin('department_masters', 'strategic_objectives.department_id', '=', 'department_masters.id')*/
            /*->leftjoin('function_mods', 'strategic_objectives.functions_id', '=', 'function_mods.id')*/
            ->leftjoin('users', 'strategic_objectives.user_id', '=', 'users.id')
            ->where('strategic_objectives.deleted_at', NULL)
            ->where('strategic_objectives.unit_id', $request->unit_id)
            ->get();
        /*print_r($strategic_objectives); die;*/
        if (!empty($strategic_objectives)) {
            foreach ($strategic_objectives as $row) {
                /*$f = explode('""', $row->department_id);*/
                $v = str_replace('"', '', $row->department_id);
                $z = str_replace('[', '', $v);
                $a = str_replace(']', '', $z);
                $f = explode(",", $a);
                /*print_r($f); die;*/
                foreach ($f as $key => $value) {
                    $row->department_masters[] = DB::table('department_masters')->select('id as dept_id', 'dept_name')
                        ->where('department_masters.deleted_at', NULL)
                        ->where('department_masters.id', $row->department_id)
                        ->first();
                }
            }
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "strategic_objectives list response";
        $this->apiResponse['data'] = array_reverse($strategic_objectives);
        return $this->sendResponse();
    }
    /*Edit strategic objectives */
    /**
     * Store edit strategic objectives in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_edit_strategic_objectives(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'strategic_objectives_id' => 'required',
            'user_id' => 'required',
            'target_current_year' => 'required',
            'target_for_cur_y_1' => 'required',
            'target_for_cur_y_2' => 'required',
            //'unit_id' => 'required',
            //'department_id' => 'required',
            /*'functions_id' => 'required',*/
            'tracking_frequency' => 'required',
            'description' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $users_id = $data['login_access_tokens_data']->user_id;
        $id = $request->strategic_objectives_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $users_id) {
            $insert_id = Module::updateRow("strategic_objectives", $request, $id);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully update strategic objectives !';
            return $this->sendResponse();
        } else {
            $message = "Edit permission denied for this strategic objectives !";
            $errors = 'Edit user does not match for this strategic objectives !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /*delete strategic objectives */
    /**
     * delete strategic objectives in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_strategic_objectives(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'strategic_objectives_id' => 'required',
            'user_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $users_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $users_id) {
            $date = date('Y-m-d h:i:s');
            DB::table('strategic_objectives')->where('strategic_objectives.id', $request->strategic_objectives_id)->where('strategic_objectives.user_id', $users_id)->update(['deleted_at' => $date]);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully delete your strategic objectives!';
            return $this->sendResponse();
        } else {
            $message = "Delete permission denied for this strategic objectives !";
            $errors = 'Delete user does not match for this strategic objectives !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /* add initiatives */
    /**
     * Store initiatives in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_add_initiatives(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            's_o_id' => 'required',
            'dept_id' => 'required',
            'section_id' => 'required',
            'unit_id' => 'required',
            'definition' => 'required',
            'user_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $request->user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $insert_id = Module::insert("initiatives", $request);

        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully save your initiatives data !';
        return $this->sendResponse();
    }
    /*view initiatives to database */
    /**
     * View strategic objectives to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_initiative(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'unit_id' => 'required',
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
        $initiatives = DB::table('initiatives')->select('initiatives.id as initiatives_id', 'initiatives.definition', 'initiatives.user_id', 'initiatives.s_o_id', 'strategic_objectives.description as strategic_objectives_description', 'initiatives.dept_id', 'department_masters.dept_name', 'initiatives.section_id', 'sections.section_name')
            ->leftjoin('sections', 'initiatives.section_id', '=', 'sections.id')
            ->leftjoin('department_masters', 'initiatives.dept_id', '=', 'department_masters.id')
            ->leftjoin('strategic_objectives', 'initiatives.s_o_id', '=', 'strategic_objectives.id')
            ->leftjoin('users', 'initiatives.user_id', '=', 'users.id')
            ->where('department_masters.deleted_at', NULL)
            ->where('strategic_objectives.deleted_at', NULL)
            ->where('users.deleted_at', NULL)
            ->where('initiatives.deleted_at', NULL)
            ->where('initiatives.unit_id', $request->unit_id)
            ->get();
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "initiatives list response";
        $this->apiResponse['data'] = array_reverse($initiatives);
        return $this->sendResponse();
    }
    /*edit initiatives */
    /**
     * Store edit initiatives in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_edit_initiatives(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'user_id' => 'required',
            'initiatives_id' => 'required',
            's_o_id' => 'required',
            'dept_id' => 'required',
            'section_id' => 'required',
            'user_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        // $request->definition = $request->action_plan_definition;
        $id = $request->initiatives_id;
        if (!empty($data['login_access_tokens_data']->user_id)) {
            $users_id = $data['login_access_tokens_data']->user_id;
        }
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $users_id) {
            $date = date('Y-m-d h:i:s');
            $insert_id = Module::updateRow("initiatives", $request, $id);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully update your initiatives!';
            return $this->sendResponse();
        } else {
            $message = "Permission denied for this initiatives !";
            $errors = 'user does not match for this initiatives !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /*delete initiatives */
    /**
     * delete initiatives in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_initiatives(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'initiatives_id' => 'required',
            'user_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $logedin_user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $logedin_user_id) {
            $date = date('Y-m-d h:i:s');
            DB::table('initiatives')->where('id', $request->initiatives_id)->update(['deleted_at' => $date]);
            $action_plans_ids = DB::table('action_plans')->select('id')->where('initiatives_id', $request->initiatives_id)
                ->get();
            foreach ($action_plans_ids as $key => $action_plan_row_id) {
                DB::table('action_plan_assigns')->where('action_plan_id', $action_plan_row_id->id)->update(['deleted_at' => $date]);
            }
            DB::table('action_plans')->where('initiatives_id', $request->initiatives_id)->update(['deleted_at' => $date]);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully delete your initiatives!';
            return $this->sendResponse();
        } else {
            $message = "Permission denied for this initiatives!";
            $errors = 'user does not match for this initiatives!';
            return $this->respondValidationError($message, $errors);
        }
    }
    /* add initiatives */
    /**
     * Store action_plans in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_add_action_plans(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'initiatives_id' => 'required',
            'definition' => 'required',
            'target' => 'required',
            'start_date' => 'required',
            'control_point' => 'required',
            /* 'owner' => 'required',*/
            'co_owner' => 'required',
            'status' => 'required',
            'unit_id' => 'required',
            'user_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $request->user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $insert_id = Module::insert("action_plans", $request);
        foreach ($request->co_owner as $key => $value) {
            $request->co_owner = $value;
            $date = date('Y-m-d h:i:s');
            DB::insert('insert into action_plan_schedules (action_plan_id,owner_id,status,created_at,updated_at) values(?,?,?,?,?)', [$insert_id, $request->co_owner, $request->status, $date, $date]);

            DB::insert('insert into action_plan_assigns (action_plan_id,co_owner_id,created_at,updated_at) values(?,?,?,?)', [$insert_id, $request->co_owner, $date, $date]);
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = 'Successfully save your action plans data !';
        return $this->sendResponse();
    }
    /*view strategic objectives */
    /**
     * View strategic objectives to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_strategic_objectives_data(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'unit_id' => 'required',
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
        $department_masters = DB::table('department_masters')->select('id', 'dept_name')
            ->where('deleted_at', NULL)
            ->where('unit_id', $request->unit_id)
            ->get();

        foreach ($department_masters as $key => $dept) {
            $strategic_objectives = DB::table('strategic_objectives')->select('strategic_objectives.id as strategic_objectives_id', 'strategic_objectives.target_current_year', 'strategic_objectives.target_for_cur_y_1', 'strategic_objectives.target_for_cur_y_2', 'units.id as unit_id', 'units.unit_name', 'strategic_objectives.department_id', 'department_masters.dept_name', 'users.id as user_id', 'users.name as user_name', 'strategic_objectives.tracking_frequency', 'strategic_objectives.description')
                ->leftjoin('units', 'strategic_objectives.unit_id', '=', 'units.id')
                ->leftjoin('users', 'strategic_objectives.user_id', '=', 'users.id')
                ->leftjoin('department_masters', 'strategic_objectives.department_id', '=', 'department_masters.id')
                ->where('strategic_objectives.deleted_at', NULL)
                ->where('strategic_objectives.unit_id', $request->unit_id)
                ->where('strategic_objectives.department_id', $dept->id)
                ->get();
            $department_masters[$key]->strategic_objectives = $strategic_objectives;
            // print_r($strategic_objectives); die;
            foreach ($strategic_objectives as $key1 => $s_o_row) {
                $initiatives = DB::table('initiatives')->select('initiatives.id as initiatives_id', 'initiatives.definition', 'initiatives.s_o_id', 'strategic_objectives.description', 'initiatives.dept_id', 'department_masters.dept_name', 'initiatives.section_id', 'sections.section_name', 'initiatives.user_id')
                    ->leftjoin('strategic_objectives', 'initiatives.s_o_id', '=', 'strategic_objectives.id')
                    ->leftjoin('department_masters', 'initiatives.dept_id', '=', 'department_masters.id')
                    ->leftjoin('sections', 'initiatives.section_id', '=', 'sections.id')
                    ->where('initiatives.deleted_at', NULL)
                    ->where('initiatives.s_o_id', $s_o_row->strategic_objectives_id)
                    ->get();
                $department_masters[$key]->strategic_objectives[$key1]->initiatives = $initiatives;
                foreach ($initiatives as $key2 => $initiatives_row) {
                    $action_plans = DB::table('action_plans')->select('action_plans.id as action_plans_id', 'action_plans.definition', 'action_plans.target', 'action_plans.start_date', 'action_plans.control_point', 'action_plans.co_owner', 'action_plans.status', 'action_plans.initiatives_id', 'action_plans.user_id', 'users.name as co_owner_name')
                        ->leftjoin('users', 'action_plans.co_owner', '=', 'users.id')
                        ->where('users.deleted_at', NULL)
                        ->where('action_plans.deleted_at', NULL)
                        ->where('action_plans.initiatives_id', $initiatives_row->initiatives_id)
                        ->get();
                    $department_masters[$key]->strategic_objectives[$key1]->initiatives[$key2]->action_plans = $action_plans;
                    foreach ($action_plans as $key4 => $action_plans_row_user) {
                        $action_plans_assign_user = DB::table('action_plan_assigns')->select('action_plan_assigns.action_plan_id', 'action_plan_assigns.co_owner_id', 'users.name as user_name')
                            ->leftjoin('users', 'action_plan_assigns.co_owner_id', '=', 'users.id')
                            ->where('action_plan_assigns.deleted_at', NULL)
                            ->where('users.deleted_at', NULL)
                            ->where('action_plan_assigns.action_plan_id', $action_plans_row_user->action_plans_id)
                            ->get();



                        foreach ($action_plans_assign_user as $acu_key => $acu_row) {
                            $action_plan_schedules = DB::table('action_plan_schedules')->select('month_date', 'owner_id as co_owner_id', 'status')
                                ->where('action_plan_schedules.deleted_at', NULL)
                                ->where('action_plan_schedules.action_plan_id', $acu_row->action_plan_id)
                                ->where('action_plan_schedules.owner_id', $acu_row->co_owner_id)
                                ->get();

                            $action_plans_assign_user[$acu_key]->schedules = $action_plan_schedules;
                        }

                        $department_masters[$key]->strategic_objectives[$key1]->initiatives[$key2]->action_plans[$key4]->action_plans_assign_user = $action_plans_assign_user;
                    }
                    //    foreach ($action_plans as $key3 => $action_plans_row) {
                    //        $action_plan_schedules = DB::table('action_plan_schedules')
                    //    ->where('action_plan_schedules.deleted_at',NULL)
                    //    ->where('action_plan_schedules.action_plan_id', $action_plans_row->action_plans_id)
                    //    ->get();
                    //    /*print_r($action_plan_schedules);die;*/
                    //     $department_masters[$key]->strategic_objectives[$key1]->initiatives[$key2]->action_plans[$key3]->action_plan_schedules = $action_plan_schedules;  
                    // }
                }
            }
        }


        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "strategic_objectives list response";
        $this->apiResponse['data'] = $department_masters;
        return $this->sendResponse();
    }
    /*view action plan to database */
    /**
     * View strategic objectives to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_view_initiative_and_action_plan(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'unit_id' => 'required',
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
        $action_plans = DB::table('action_plans')->select('action_plans.id as action_plan_id', 'action_plans.user_id', 'initiatives.definition as initiatives_definition', 'action_plans.definition as action_plan_definition', 'action_plans.target', 'action_plans.start_date', 'action_plans.control_point', 'action_plans.status', 'action_plans.initiatives_id', 'users.name as co_owner_name')
            ->leftjoin('initiatives', 'action_plans.initiatives_id', '=', 'initiatives.id')
            ->leftjoin('action_plan_assigns', 'action_plans.id', '=', 'action_plan_assigns.action_plan_id')
            ->leftjoin('users', 'action_plan_assigns.co_owner_id', '=', 'users.id')
            ->where('users.deleted_at', NULL)
            ->where('initiatives.deleted_at', NULL)
            ->where('action_plans.deleted_at', NULL)
            ->where('action_plans.unit_id', $request->unit_id)
            ->groupBy('action_plans.id')
            ->get();
        foreach ($action_plans as $key => $action_plans_row) {
            $assign_action_plan_user = DB::table('action_plan_assigns')->select('action_plan_assigns.co_owner_id as co_owner', 'users.name as user_name')
                ->join('users', 'action_plan_assigns.co_owner_id', '=', 'users.id')
                ->where('users.deleted_at', NULL)
                ->where('action_plan_assigns.deleted_at', NULL)
                ->where('action_plan_assigns.action_plan_id', $action_plans_row->action_plan_id)->get();
            $action_plans[$key]->assign_action_plan_user = $assign_action_plan_user;
        }
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "action plan list response";
        $this->apiResponse['data'] = array_reverse($action_plans);
        return $this->sendResponse();
    }
    /*edit action plan */
    /**
     * Store edit task in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_edit_action_plan(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'user_id' => 'required',
            'action_plan_id' => 'required',
            'unit_id' => 'required',
            'action_plan_definition' => 'required',
            'initiatives_id' => 'required',
            'target' => 'required',
            'start_date' => 'required',
            'control_point' => 'required',
            'status' => 'required',
            'user_id' => 'required',
            'co_owner' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $request->definition = $request->action_plan_definition;
        $id = $request->action_plan_id;
        if (!empty($data['login_access_tokens_data']->user_id)) {
            $users_id = $data['login_access_tokens_data']->user_id;
        }
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $users_id) {
            $date = date('Y-m-d h:i:s');
            $insert_id = Module::updateRow("action_plans", $request, $id);
            DB::table('action_plan_assigns')->where('action_plan_assigns.action_plan_id', $request->action_plan_id)->update(['deleted_at' => $date]);
            if (isset($request->co_owner)) {
                foreach ($request->co_owner as $key => $co_owner_row) {
                    DB::insert('insert into action_plan_assigns (action_plan_id,co_owner_id,created_at,updated_at) values(?,?,?,?)', [$insert_id, $co_owner_row, $date, $date]);
                }
            }
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully update your action plan!';
            return $this->sendResponse();
        } else {
            $message = "Permission denied for this action plan !";
            $errors = 'user does not match for this action plan !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /*delete action plan */
    /**
     * delete and task remark data in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_delete_action_plan(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'action_plan_id' => 'required',
            'user_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $logedin_user_id = $data['login_access_tokens_data']->user_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->user_id == $logedin_user_id) {
            $date = date('Y-m-d h:i:s');
            DB::table('action_plans')->where('id', $request->action_plan_id)->update(['deleted_at' => $date]);
            DB::table('action_plan_assigns')->where('action_plan_id', $request->action_plan_id)->update(['deleted_at' => $date]);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully delete your action plan!';
            return $this->sendResponse();
        } else {
            $message = "Permission denied for this action plan!";
            $errors = 'user does not match for this action_plan!';
            return $this->respondValidationError($message, $errors);
        }
    }
    /* add initiatives */
    /**
     * Store action_plans in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function api_add_action_plan_schedules(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'action_plan_id' => 'required',
            'status' => 'required',
            'co_owner_id' => 'required',
            'month_date' => 'required',
        ]);
        if ($validator->fails()) {
            $message = $validator->errors()->first();
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request->login_access_token)->first();
        $user_id = $data['login_access_tokens_data']->user_id;
        $request->owner_id = $request->co_owner_id;
        if (empty($data['login_access_tokens_data'])) {
            $message = "token mismatch !";
            $errors = $request->all();
            return $this->respondValidationError($message, $errors);
        }
        if ($request->owner_id == $user_id) {
            $insert_id = Module::insert("action_plan_schedules", $request);
            $this->apiResponse['status'] = "success";
            $this->apiResponse['message'] = 'Successfully update your action plan schedules!';
            return $this->sendResponse();
        } else {
            $message = "Permission denied for this action plan schedules !";
            $errors = 'user does not match for this action plan schedules !';
            return $this->respondValidationError($message, $errors);
        }
    }
    /*view kpi dashboard */
    /**
     * View view kpi dashboard to database.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function view_kpi_dashboard(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_access_token' => 'required',
            'unit_id' => 'required',
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
        $department_data = DB::table('department_masters')->select('id as dept_id', 'dept_name')->where('deleted_at', NULL)->where('unit_id', $request->unit_id)->get();
        foreach ($department_data as $key => $dept_row) {
            $total_kpi = DB::table('add_kpis')->where('deleted_at', NULL)
                ->where('department_id', $dept_row->dept_id)
                ->count();
            $all_total_kpi = 0;
            $all_total_kpi = $all_total_kpi + $total_kpi;
            $department_data[$key]->all_total_kpi = $all_total_kpi;
            $department_data[$key]->total_kpi = $total_kpi;
            $department_data[$key]->green = 0;
            $department_data[$key]->red = 0;
            $department_data[$key]->yellow = 0;
            $department_data[$key]->gray = 0;
            $kpi_data = DB::table('add_kpis')->select('id as kpi_id', 'kpi_name', 'department_id')->where('deleted_at', NULL)
                ->where('department_id', $dept_row->dept_id)
                ->get();
            $department_data[$key]->kpi_data = $kpi_data;
            foreach ($kpi_data as $key1 => $kpi_data_row) {
                $date = date('Y');
                $kpi_targets_yr = DB::table('kpi_targets')
                    ->where('kpi_id', $kpi_data_row->kpi_id)
                    ->where('target_year', $date)
                    ->first();
                if (!empty($kpi_targets_yr)) {
                    $total_target = ($kpi_targets_yr->jan + $kpi_targets_yr->feb + $kpi_targets_yr->mar + $kpi_targets_yr->apr + $kpi_targets_yr->may + $kpi_targets_yr->june + $kpi_targets_yr->july + $kpi_targets_yr->aug + $kpi_targets_yr->sept + $kpi_targets_yr->oct + $kpi_targets_yr->nov + $kpi_targets_yr->dec);
                    //print_r($total_target); die;
                    $department_data[$key]->kpi_data[$key1]->total_target = $total_target;
                } else {

                    $total_target = NULL;
                    $department_data[$key]->kpi_data[$key1]->total_target = $total_target;
                }
                $kpi_actuals_yr = DB::table('kpi_actuals')
                    ->where('kpi_actuals.kpi_id', $kpi_data_row->kpi_id)
                    ->where('kpi_actuals.actual_year', $date)
                    ->first();
                if (!empty($kpi_actuals_yr)) {
                    $total_actual = ($kpi_actuals_yr->jan + $kpi_actuals_yr->feb + $kpi_actuals_yr->mar + $kpi_actuals_yr->apr + $kpi_actuals_yr->may + $kpi_actuals_yr->june + $kpi_actuals_yr->july + $kpi_actuals_yr->aug + $kpi_actuals_yr->sept + $kpi_actuals_yr->oct + $kpi_actuals_yr->nov + $kpi_actuals_yr->dec);
                    $department_data[$key]->kpi_data[$key1]->total_actual = $total_actual;
                    //$total_actual = 2;
                } else {
                    $department_data[$key]->kpi_data[$key1]->total_actual = NULL;
                }
                if ($total_target != 0 && $total_target != NULL && $total_actual != 0 && $total_actual != NULL) {
                    $avg = $total_target / $total_actual;
                    if ($avg >= 0.9) {
                        $department_data[$key]->green += 1;
                    } else if ($avg < 0.9 && $avg >= 0.7) {
                        $department_data[$key]->yellow += 1;
                    } else {
                        $department_data[$key]->red += 1;
                    }
                } else {
                    $avg = 'NULL';
                    $department_data[$key]->gray += 1;
                }
            }
            unset($department_data[$key]->kpi_data);
        }
        /*print_r($kpi_data); die;*/
        $this->apiResponse['status'] = "success";
        $this->apiResponse['message'] = "action plan list response";
        $this->apiResponse['data'] = array_reverse($department_data);
        return $this->sendResponse();
    }
}
