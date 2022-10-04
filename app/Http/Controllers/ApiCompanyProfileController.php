<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Dwij\Laraadmin\Models\Module;
use App\Models\Company_profile;
use Illuminate\Support\Str;
use File;

class ApiCompanyProfileController extends ResponseApiController
{
	/**
	 * Store and company profile in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_company_setting_update(Request $request)
	{
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
				}
			}
			if (!empty($request['image_id'])) {
				$request['company_logo'] = $request['image_id'];
			}

			$company_profiles_id = Module::updateRow("company_profiles", $request, $request['company_id']);
		}
		if (!empty($request['company_settings_id'])) {
			$company_setting_id = Module::updateRow("company_settings", $request, $request['company_settings_id']);
		}
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully update company setting';
		return $this->sendResponse();
	}

	public function api_company_setting_view(Request $request)
	{
		$str_data = DB::table('str_obj_statuses')->select('id', 'status_name', 'accuracy_percentage', 'max', 'min', 'color_code')->where('company_id', $request->company_id)->get();
		$baseUrl = url('/') . '/files/';
		$company_setting_data = Company_profile::select('company_profiles.*', 'company_profiles.created_at as company_created_date', 'company_profiles.id as company_id', 'employers.email', 'company_settings.*', 'company_settings.id as company_settings_id', DB::raw("CONCAT('{$baseUrl}', uploads.hash, '/', uploads.name) as file_name"))->leftjoin('company_settings', 'company_profiles.id', '=', 'company_settings.company_id')->leftjoin('employers', 'company_profiles.user_id', '=', 'employers.user_id')->leftjoin('uploads', 'company_profiles.company_logo', '=', 'uploads.id')->where('company_profiles.id', $request['company_id'])->get()->toarray();
		$company_data['str_obj_data'] = $str_data;
		$company_data['kpi_data'] = $str_data;
		$company_data['task_data'] = $str_data;
		$company_data['general_data'] = $company_setting_data;


		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully update company setting';
		$this->apiResponse['data'] = $company_data;
		return $this->sendResponse();
	}
}
