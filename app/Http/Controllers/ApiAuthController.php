<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Session;
use Hash;
use Validator;
use Dwij\Laraadmin\Models\Module;
use App\Models\Company_profile;
use App\Models\Login_access_token;
use Mail;

class ApiAuthController extends ResponseApiController
{
	/**
	 * Store a newly user signuup in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_user_signup(Request $request)
	{

		try {
			DB::beginTransaction();
			$insert_id = Module::insert("users", $request);
			$request['user_id'] = $insert_id;
			$request['multi_unit_id'] =  implode(",", $request->multi_unit_id);
			$request['multi_dept_id'] =  implode(" ", $request->multi_dept_id);
			$request['multi_section_id'] =  implode(" ", $request->multi_section_id);

			$insert_id = DB::table('employers')->insertGetId(
				['name' => $request['name'], 'email' => $request['email'], 'role_id' => $request['role_id'], 'company_id' => $request['company_id'], 'multi_dept_id' =>$request['multi_dept_id'], 'multi_unit_id' => $request['multi_unit_id'], 'multi_section_id' =>$request['multi_section_id'], 'user_id' => $request['user_id']]
			);

			$date = date('Y-m-d h:i:s');
			DB::table('role_user')->insertGetId(
				['role_id' => $request->role_id, 'user_id' => $request->user_id, 'created_at' => $date, 'updated_at' => $date]
			);
			// Send mail to User his new Password
			$userEmail = $request->email;
			$password = $request->password;
			
			if (env('MAIL_USERNAME') != null && env('MAIL_USERNAME') != "null" && env('MAIL_USERNAME') != "") {
				//	Send mail to User his new Password
				Mail::send('emails.send_login_cred', ['email' => $userEmail, 'password' => $password], function ($m) use ($userEmail) {
					$m->from(env('MAIL_USERNAME'), 'PrimaPlus');
					$m->to($userEmail, 'Admin')->subject('Welcome to Prima Plus!');
				});
			}
			$access_token = uniqid();
			$date = date('Y-m-d h:i:s');
			$login_accesstoken_data =	DB::table('login_access_tokens')->insert(['user_id' => $request->user_id, 'access_token' => $access_token, 'created_at' => $date, 'updated_at' => $date]);
			
			if ($login_accesstoken_data) {
				DB::commit();
				$this->apiResponse['status'] = "success";
				$this->apiResponse['login_access_token'] = $access_token;
				$this->apiResponse['message'] = 'You are successfully signup credential send your mail!';
				return $this->sendResponse();
			} else {
				DB::rollback();
				$this->apiResponse['status'] = "failed";
				$this->apiResponse['login_access_token'] = $access_token;
				$this->apiResponse['message'] = 'Failed!';
				return $this->sendResponse();
			}
		} catch (\Exception $e) {
			DB::rollback();
			$this->apiResponse['status'] = "failed";
			$this->apiResponse['login_access_token'] = '';
			$this->apiResponse['message'] = $e->getMessage();
			return $this->sendResponse();
		}
	}
	/**
	 * Store a newly user login in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_user_login(Request $request)
	{
		$rules = Module::validateRules("users", $request);
		$validator = Validator::make($request->all(), $rules);
		if ($validator->fails()) {
			$message = $validator->errors()->first();
			$errors = $request->all();
			return $this->respondValidationError($message, $errors);
		} else {
			$email = $request['email'];
			$password = $request['password'];

			$users_data = DB::table('users')->select('users.id', 'users.email', 'users.name','designation')
			->leftjoin('employers','users.id','=','employers.user_id')
				->where('users.email', $email)->first();

			if (empty($users_data)) {
				$message = 'E-mail ID is not matched, please check your credential !';
				return $this->respondNotFound($message);
			}
			$role_data = DB::table('role_user')->where('user_id', $users_data->id)
				->join('roles', 'role_user.role_id', '=', 'roles.id')
				->first();
			$role_id = $role_data->role_id;
			$emp_data = DB::table('employers')->where('user_id', $users_data->id)->first();
			// print_r($emp_data);die();
			if (!empty($emp_data->photo_id)) {
				$file_name = DB::table('uploads')
					->select('uploads.name as file_name', 'uploads.hash')
					->where('uploads.deleted_at', NULL)
					->where('id', $emp_data->photo_id)
					->first();
				if (!empty($file_name->file_name))
					$users_data->profile_picture = url('/') . '/files/' . $file_name->hash . '/' . $file_name->file_name;
			} else {
				$users_data->profile_picture = '';
			}

			$users_data->company_id = $emp_data->company_id;

			if (!empty($role_id)) {
				if (!empty($users_data->email)) {
					// Check validation
					if (auth()->attempt(['email' => $email, 'password' => $password])) {
						$user_id = $users_data->id;
						$access_token = uniqid();
						$date = date('Y-m-d h:i:s');
						$users_data->access_token = $access_token;
						$login_accesstoken_data = DB::table('login_access_tokens')->insert(
							['user_id' => $user_id, 'access_token' => $access_token, 'created_at' => $date, 'updated_at' => $date]
						);

						/* if (!empty($emp_data->company_id)) {
							$users_data->company_details = 'true';
						} else {
							$users_data->company_details = 'false';
						} */

						$company_profile = Company_profile::select('company_profiles.*', 'company_profiles.id as company_id', 'company_steps.step_no', 'company_steps.step_name')
							->leftjoin('company_steps', 'company_profiles.company_step_id', '=', 'company_steps.id')
							->where('company_profiles.id', $emp_data->company_id)->get()->toarray();
						if (empty($company_profile)) {
							$users_data->company_details = 'false';
						} else {
							$users_data->step_no = $company_profile[0]['step_no'];
							$users_data->company_step_id = $company_profile[0]['company_step_id'];
							$users_data->step_name = $company_profile[0]['step_name'];

							if ($company_profile[0]['step_no'] == 5) {
								$users_data->company_details = 'true';
							} else {
								$users_data->company_details = 'false';
							}
						}
						if ($login_accesstoken_data == true) {
							$this->apiResponse['status'] = "success";
							$this->apiResponse['login_access_token'] = $access_token;
							$this->apiResponse['role_id'] = $role_id;
							$this->apiResponse['role_name'] = $role_data->display_name;
							$this->apiResponse['unit_id'] = $emp_data->multi_unit_id;
							$this->apiResponse['dept_id'] = $emp_data->multi_dept_id;
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
				$message = 'This is not valid user !';
				return $this->respondInternalError($message);
			}
		}
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
		$user_data = DB::table('users')->select('users.email', 'users.password')->where('id', $request['user_id'])->where('deleted_at', null)->first();
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
			$password = bcrypt($request->new_password);
			DB::table('users')->where('id', $login_access_tokens_data->user_id)->update([
				'password' => $password
			]);
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
		$user_data = DB::table('employers')->select('employers.user_id')
			->where('deleted_at', NULL)
			->where('reset_password_token', $request->reset_password_token)
			->first();
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
	/**
	 * Store a newly reset password update in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_get_user_details(request $request)
	{
		if (in_array($request->role_id, array(1, 2))) {
			$user_data = DB::table('employers')->select('employers.name', 'employers.designation', 'employers.gender', 'employers.email', 'employers.user_id', 'employers.date_birth', 'employers.mobile', 'employers.mobile2', 'employers.pan_card_no', 'employers.city', 'employers.address', 'employers.multi_unit_id', 'employers.multi_dept_id', 'employers.multi_section_id','roles.display_name','roles.id as role_id')
				->leftjoin('roles','employers.role_id','=','roles.id')
				->where('employers.deleted_at', NULL)
				->where('company_id', $request->company_id)
				->get();
			foreach ($user_data as $key => $value) {
				$multi_unit_id = explode(',', $value->multi_unit_id);
				$multi_dept_id = explode(',', $value->multi_dept_id);
				$multi_section_id = explode(',', $value->multi_section_id);
				$multi_unit_ids = DB::table('units')->select('id as unit_id', 'unit_name')
					->where('deleted_at', NULL)
					->whereIn('id', $multi_unit_id)
					->get();
				if (empty($multi_unit_ids)) {
					$multi_unit_ids[] = array(['unit_id' => 0, 'unit_name' => '']);
				}
				$user_data[$key]->multi_unit_ids = $multi_unit_ids;

				$multi_dept_ids = DB::table('department_masters')->select('id as dept_id', 'dept_name')
					->where('deleted_at', NULL)
					->whereIn('id', $multi_dept_id)
					->get();
				if (empty($multi_dept_ids)) {
					$multi_dept_ids[] = array(['dept_id' => 0, 'dept_name' => '']);
				}
				$user_data[$key]->multi_dept_ids = $multi_dept_ids;

				$multi_section_ids = DB::table('sections')->select('id as section_id', 'section_name')
					->where('deleted_at', NULL)
					->whereIn('id', $multi_section_id)
					->get();
				if (empty($multi_section_ids)) {
					$multi_section_ids[] = array(['section_id' => 0, 'section_name' => '']);
				}
				$user_data[$key]->multi_section_ids = $multi_section_ids;
			}
			$this->apiResponse['status'] = "success";
			$this->apiResponse['message'] = "users details list!";
			$this->apiResponse['data'] = $user_data;
			return $this->sendResponse();
		} else {
			$this->apiResponse['status'] = "error";
			$this->apiResponse['message'] = "You are not authenticated user!";
			return $this->sendResponse();
		}
	}


	public function api_user_signup_file(Request $request)
	{
		if ($request->hasFile('submit') != null && $request->file('submit')->isValid()) {
			$filename = $request->submit->getClientOriginalName();
			$extension = $request->submit->getClientOriginalExtension();
			$tempPath = $request->submit->getRealPath();
			$fileSize = $request->submit->getSize();
			$mimeType = $request->submit->getMimeType();
			$filename = uniqid() . '_' . $filename;
			// Valid File Extensions
			$valid_extension = array("ods", "csv");

			// 2MB in Bytes
			$maxFileSize = 2097152;


			// Check file extension
			if (in_array(strtolower($extension), $valid_extension)) {
				// Check file size

				if ($fileSize <= $maxFileSize) {
					// File upload location
					$location = 'storage/userlist';

					// Upload file
					$request->file('submit')->move($location, $filename);

					// Import CSV to Database
					$filepath = public_path($location . "/" . $filename);

					// Reading file
					$file = fopen($filepath, "r");

					$Duplicate_Data_arr = array();
					$success_Data_arr = array();
					$Not_valid_Data_arr = array();
					$date = date('Y-m-d h:i:s');
					$i = 0;
					while (($filedata = fgetcsv($file, 1000, ",")) !== FALSE) {
						if ($i == 0) {
							$i++;
							continue;
						}
						$roles = ['super_admin' => 1, 'admin' => 2, 'dept_admin' => 3, 'user' => 4];
						$insertData = array(
							"name" => $filedata[0],
							"context_id" => $filedata[1],
							"email" => $filedata[2],
							"password" => $filedata[3],
							"remember_token" => $filedata[4] ?? null,
							"deleted_at" => $filedata[5] ?? null,
							"created_at" => $filedata[6],
							"updated_at" => $filedata[7] ?? null,
							"company_id" => $filedata[8],
							"date"		 => $date[10],
							'role_id'    => $roles[$filedata[9]],
						);
						//print_r($insertData);
						$object = (object) $insertData;
						$users_data = DB::table('users')->select('users.id', 'users.email', 'users.name')
							->where('email', $object->email)
							->where('deleted_at', NULL)->first();
						if (filter_var($object->email, FILTER_VALIDATE_EMAIL)) {
							if (empty($users_data)) {

								$insert_id = DB::table('users')->insertGetId(
									['name' => $object->name, 'context_id' => $object->context_id, 'email' => $object->email, 'password' => $object->password, 'remember_token' => $object->remember_token, 'created_at' => $object->date, 'company_id' => $object->company_id,]
								);
								$object->user_id = $insert_id;
								$insert_id = DB::table('employers')->insertGetId(
									['name' => $object->name, 'email' => $object->email, 'created_at' => $object->date, 'company_id' => $object->company_id, 'user_id' => $object->user_id]
								);
								$insert_id = DB::table('role_user')->insertGetId(
									['role_id' => $object->role_id, 'user_id' => $object->user_id, 'created_at' => $object->date, 'updated_at' => $object->date,]
								);
								$access_token = uniqid();
								$login_accesstoken_data = DB::table('login_access_tokens')->insertGetId(
									['access_token' => $access_token, 'user_id' => $object->user_id, 'created_at' => $object->date, 'updated_at' => $object->date,]
								);
								$success_Data_arr[] = $object->email;

								// Send mail to User his new Password
								/* $userEmail = $object->email;
							$password = $object->password;
							if (env('MAIL_USERNAME') != null && env('MAIL_USERNAME') != "null" && env('MAIL_USERNAME') != "") {
								//	Send mail to User his new Password
								Mail::send('emails.send_login_cred', ['email' => $userEmail, 'password' => $password], function ($m) use ($userEmail) {
									$m->from('sotam1992@gmail.com', 'jobsearch');
									$m->to($userEmail, 'Admin')->subject('Businessplus.com login credential');
								});
							} */
							} else {
								$Duplicate_Data_arr[] = $insertData['email'];
							}
						} else {
							$Not_valid_Data_arr[] = $object->email;
						}
					}
					$i++;
					fclose($file);
					$this->apiResponse['status'] = "success";
					$this->apiResponse['Successful Entery'] = $success_Data_arr;
					$this->apiResponse['Duplicate Entery'] = $Duplicate_Data_arr;
					$this->apiResponse['Not Valid Entery'] = $Not_valid_Data_arr;
					$this->apiResponse['message'] = 'You are successfully signup credential send your mail!';
					return $this->sendResponse();
					Session::flash('message', 'Import Successful.');
				} else {
					Session::flash('message', 'File too large. File must be less than 2MB.');
				}
			} else {
				Session::flash('message', 'Invalid File Extension.');
			}
		}
	}
}
