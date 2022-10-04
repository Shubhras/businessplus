<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Dwij\Laraadmin\Models\Module;
use App\Models\Project;
use App\Models\Project_milestone;
use App\Models\Project_member;
use App\Models\Employer;
use App\Models\Projct_extrnal_membr;
use App\Models\Project_kpi_mileston;
use App\Models\Project_kpi;
use App\Models\Project_governance;
use App\Models\Project_bdget_trakig;
use App\Models\Project_majr_actvity;
use App\Models\Project_sub_actvity;
use App\Models\Project_isue_tracker;
use App\Models\Project_issue_remark;
use App\Models\Project_risk_as_log;
use App\Models\Project_deviation;
use App\Models\Project_resource;
use Illuminate\Support\Str;
use File;
use DateTime;

class ApiProjectController extends ResponseApiController
{
	public function __construct()
	{
		//$this->beforeFilter('auth', ['on' => 'post']);
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
		/* print_r($request->all());
		die; */
		try {
			switch ($request->projectDetails) {
				case 'project':

					if (!empty($request['project_id'])) {
						if (!empty($request->project_logo)) {
							$file_extension = substr($request['project_logo'], 5, strpos($request['project_logo'], ';') - 5);
							if (Str::startsWith($request['project_logo'], "data:$file_extension;base64,")) {
								$image_info = $this->decodeBase64($request->project_logo);
								$destination = public_path('storage/project_logo/');
								if (!File::isDirectory($destination)) {
									$this->create_file_directory($destination);
								}
								$project_Image = $request['image_id'];
								$image_id = $this->fileupoload($destination, $image_info, $project_Image);
								$request['project_logo'] = $image_id;
								$request['image_id'] = $image_id;
							}
						}
						$project_id	= Module::updateRow('Projects', $request, $request->project_id);
						$request['project_id'] = $project_id;
						$project_Data = $request->all();
						$this->apiResponse['status'] = "success";
						$this->apiResponse['message'] = 'Successfully save your project!';
						$this->apiResponse['data'] = $project_Data;
						break;
					} else {

						if (!empty($request->project_logo)) {
							$file_extension = substr($request['project_logo'], 5, strpos($request['project_logo'], ';') - 5);
							if (Str::startsWith($request['project_logo'], "data:$file_extension;base64,")) {
								$image_info = $this->decodeBase64($request->project_logo);
								$destination = public_path('storage/project_logo/');
								if (!File::isDirectory($destination)) {
									$this->create_file_directory($destination);
								}
								$project_Image = $request['image_id'];
								$image_id = $this->fileupoload($destination, $image_info, $project_Image);
								$request['project_logo'] = $image_id;
								$request['image_id'] = $image_id;
							}
						}
						$project_id = Module::insert("projects", $request);
						$request['project_id'] = $project_id;
						$project_Data = $request->all();
						$this->apiResponse['status'] = "success";
						$this->apiResponse['message'] = 'Successfully save your project!';
						$this->apiResponse['data'] = $project_Data;
						break;
					}
				case 'projectTeam':
					//print_r($request->all());die;
					$project_Team_Data = [];
					$request['resource_uesr'] = $request['user_id'];
					if (isset($request['project_leader_id'])) {

						if (!empty($request['project_leader_id'])) {

							if (!empty($request['pro_leader_logo_id'])) {
								$file_extension = substr($request['pro_leader_logo'], 5, strpos($request['pro_leader_logo'], ';') - 5);
								if (Str::startsWith($request['pro_leader_logo'], "data:$file_extension;base64,")) {
									$image_info = $this->decodeBase64($request['pro_leader_logo']);
									$destination = public_path('storage/team_memeber/');
									if (!File::isDirectory($destination)) {
										$this->create_file_directory($destination);
									}
									$image_id = $this->fileupoload($destination, $image_info, $request['pro_leader_logo_id']);
									Employer::where('user_id', $request['user_id'])->update(['photo_id' => $image_id, 'mobile' => $request->mobile]);
									$request['pro_leader_logo_id'] = $image_id;
								}
							}

							Employer::where('user_id', $request['user_id'])->update(['mobile' => $request->mobile]);

							$project_id	= Module::updateRow('Project_members',  $request, $request->project_leader_id);
							$resource_data = Project_resource::where('resource_uesr', $request['resource_uesr'])->where('project_id', $request['project_id'])->get()->toarray();

							if (empty($resource_data)) {
								$request['project_resources_id'] = Module::insert('project_resources', (object) $request);
							}
						} else {

							$file_extension = substr($request['pro_leader_logo'], 5, strpos($request['pro_leader_logo'], ';') - 5);
							if (Str::startsWith($request['pro_leader_logo'], "data:$file_extension;base64,")) {
								$image_info = $this->decodeBase64($request['pro_leader_logo']);
								$destination = public_path('storage/team_memeber/');
								if (!File::isDirectory($destination)) {
									$this->create_file_directory($destination);
								}
								$image_id = $this->fileupoload($destination, $image_info, $request['pro_leader_logo_id']);
								Employer::where('user_id', $request['user_id'])->update(['photo_id' => $image_id, 'mobile' => $request->mobile]);
								$request['pro_leader_logo_id'] = $image_id;
							}
							Employer::where('user_id', $request['user_id'])->update(['mobile' => $request->mobile]);
							$request['project_leader_id'] = Module::insert('project_members', $request);
							$resource_data = Project_resource::where('resource_uesr', $request['resource_uesr'])->where('project_id', $request['project_id'])->get()->toarray();

							if (empty($resource_data)) {
								$request['project_resources_id'] = Module::insert('project_resources', (object) $request);
							}
							Project::where('id', $request['project_id'])->update(['project_step_id' => $request->project_step_id]);
						}
					}
					//For Co-leader
					if (!empty($request->pro_co_leader[0]['project_co_leader_id']) && isset($request->pro_co_leader[0]['project_co_leader_id'])) {

						$pro_co_value = $request->pro_co_leader[0];
						$file_extension = substr($pro_co_value['pro_co_leader_logo'], 5, strpos($pro_co_value['pro_co_leader_logo'], ';') - 5);
						if (Str::startsWith($pro_co_value['pro_co_leader_logo'], "data:$file_extension;base64,")) {
							$image_info = $this->decodeBase64($pro_co_value['pro_co_leader_logo']);
							$destination = public_path('storage/project_co_leader/');
							if (!File::isDirectory($destination)) {
								$this->create_file_directory($destination);
							}
							$image_id = $this->fileupoload($destination, $image_info, $pro_co_value['pro_co_leader_logo_id']);
							Employer::where('user_id', $pro_co_value['user_id'])->update(['photo_id' => $image_id, 'mobile' => $pro_co_value['mobile']]);
							$pro_co_value['pro_co_leader_logo_id'] = $image_id;
							$pro_co_value['pro_co_leader_logo'] = "";
						}
						Employer::where('user_id', $pro_co_value['user_id'])->update(['mobile' => $pro_co_value['mobile']]);
						$project_co_leader_id = Module::updateRow("project_members", (object) $pro_co_value, $pro_co_value['project_co_leader_id']);
						$pro_co_value['project_co_leader_id'] = $project_co_leader_id;
						$pro_co_value['resource_uesr'] = $pro_co_value['user_id'];
						$resource_data = Project_resource::where('resource_uesr', $pro_co_value['resource_uesr'])->where('project_id', $pro_co_value['project_id'])->get()->toarray();
						if (empty($resource_data)) {

							$request['project_resources_id'] = Module::insert('project_resources', (object) $pro_co_value);
						}
					} else {
						$pro_co_value = $request->pro_co_leader[0];
						$file_extension = substr($pro_co_value['pro_co_leader_logo'], 5, strpos($pro_co_value['pro_co_leader_logo'], ';') - 5);
						if (Str::startsWith($pro_co_value['pro_co_leader_logo'], "data:$file_extension;base64,")) {
							$image_info = $this->decodeBase64($pro_co_value['pro_co_leader_logo']);
							$destination = public_path('storage/project_co_leader/');
							if (!File::isDirectory($destination)) {
								$this->create_file_directory($destination);
							}
							$image_id = $this->fileupoload($destination, $image_info, $pro_co_value['pro_co_leader_logo_id']);
							Employer::where('user_id', $pro_co_value['user_id'])->update(['photo_id' => $image_id, 'mobile' => $pro_co_value['mobile']]);
							$pro_co_value['pro_co_leader_logo_id'] = $image_id;
							$pro_co_value['pro_co_leader_logo'] = "";
						}

						Employer::where('user_id', $pro_co_value['user_id'])->update(['mobile' => $pro_co_value['mobile']]);
						$project_co_leader_id = Module::insert("project_members", (object) $pro_co_value);
						$pro_co_value['project_co_leader_id'] = $project_co_leader_id;
						$pro_co_value['resource_uesr'] = $pro_co_value['user_id'];

						$resource_data = Project_resource::where('resource_uesr', $pro_co_value['user_id'])->where('project_id', $pro_co_value['project_id'])->get()->toarray();
						if (empty($resource_data)) {

							$pro_co_value['project_resources_id'] = Module::insert('project_resources', (object) $pro_co_value);
						}
					}
					$request['pro_co_leader'] = $pro_co_value;

					if (!empty($request->company_user) && isset($request->company_user)) {
						$temp_company_user = $request->company_user;
						foreach ($temp_company_user as $com_user_key => $com_user_value) {


							if (!empty($com_user_value['project_company_user_id'])) {

								$file_extension = substr($com_user_value['company_user_logo'], 5, strpos($com_user_value['company_user_logo'], ';') - 5);
								if (Str::startsWith($com_user_value['company_user_logo'], "data:$file_extension;base64,")) {
									$image_info = $this->decodeBase64($com_user_value['company_user_logo']);
									$destination = public_path('storage/team_memeber/');
									if (!File::isDirectory($destination)) {
										$this->create_file_directory($destination);
									}
									$image_id = $this->fileupoload($destination, $image_info, $com_user_value['company_user_logo_id']);
									Employer::where('user_id', $com_user_value['user_id'])->update(['photo_id' => $image_id, 'mobile' => $com_user_value['mobile']]);
									$temp_company_user[$com_user_key]['company_user_logo_id'] = $image_id;
									$temp_company_user[$com_user_key]['company_user_logo'] = "";
								}
								Employer::where('user_id', $com_user_value['user_id'])->update(['mobile' => $com_user_value['mobile']]);
								$project_member_id = Module::updateRow("project_members", (object) $com_user_value, $com_user_value['project_company_user_id']);
								$temp_company_user[$com_user_key]['project_company_user_id'] = $project_member_id;

								$com_user_value['resource_uesr'] = $com_user_value['user_id'];
								$resource_data = Project_resource::where('resource_uesr', $com_user_value['resource_uesr'])->where('project_id', $com_user_value['project_id'])->get()->toarray();
								if (empty($resource_data)) {

									$request['project_resources_id'] = Module::insert('project_resources', (object) $com_user_value);
								}
							} else {
								$file_extension = substr($com_user_value['company_user_logo'], 5, strpos($com_user_value['company_user_logo'], ';') - 5);
								if (Str::startsWith($com_user_value['company_user_logo'], "data:$file_extension;base64,")) {
									$image_info = $this->decodeBase64($com_user_value['company_user_logo']);
									$destination = public_path('storage/team_memeber/');
									if (!File::isDirectory($destination)) {
										$this->create_file_directory($destination);
									}
									$image_id = $this->fileupoload($destination, $image_info, $com_user_value['company_user_logo_id']);
									Employer::where('user_id', $com_user_value['user_id'])->update(['photo_id' => $image_id, 'mobile' => $com_user_value['mobile']]);
									$temp_company_user[$com_user_key]['company_user_logo_id'] = $image_id;
									$temp_company_user[$com_user_key]['company_user_logo'] = "";
								}
								Employer::where('user_id', $com_user_value['user_id'])->update(['mobile' => $com_user_value['mobile']]);
								$project_member_id = Module::insert("project_members", (object) $com_user_value);
								$temp_company_user[$com_user_key]['project_company_user_id'] = $project_member_id;
								$com_user_value['resource_uesr'] = $com_user_value['user_id'];

								$resource_data = Project_resource::where('resource_uesr', $com_user_value['resource_uesr'])->where('project_id', $com_user_value['project_id'])->get()->toarray();
								if (empty($resource_data)) {

									$temp_company_user[$com_user_key]['project_resources_id'] = Module::insert('project_resources', (object) $com_user_value);
								}
							}
						}

						$request['company_user'] = $temp_company_user;
					}
					if (!empty($request->external_user) && isset($request->external_user)) {
						$temp_ex_user = $request->external_user;
						foreach ($temp_ex_user as $ext_user_key => $extenal_user_value) {


							if (!empty($extenal_user_value['project_ex_user_id'])) {

								$file_extension = substr($extenal_user_value['external_user_logo'], 5, strpos($extenal_user_value['external_user_logo'], ';') - 5);
								if (Str::startsWith($extenal_user_value['external_user_logo'], "data:$file_extension;base64,")) {
									$image_info = $this->decodeBase64($extenal_user_value['external_user_logo']);
									$destination = public_path('storage/team_memeber/');
									if (!File::isDirectory($destination)) {
										$this->create_file_directory($destination);
									}
									$image_id = $this->fileupoload($destination, $image_info, $extenal_user_value['project_ex_user_img_id']);
									$extenal_user_value['photo'] = $image_id;
									$temp_ex_user[$ext_user_key]['project_ex_user_img_id'] = Module::insert('project_members', $request);
									$temp_ex_user[$ext_user_key]['external_user_logo'] = "";
								}
								$project_ex_member_id = Module::updateRow("projct_extrnal_membrs", (object) $extenal_user_value, $extenal_user_value['project_ex_user_id']);
								$temp_ex_user[$ext_user_key]['project_ex_user_id'] = $project_ex_member_id;

								$extenal_user_value['externl_user'] = $extenal_user_value['project_ex_user_id'];
								$resource_data = Project_resource::where('externl_user', $extenal_user_value['project_ex_user_id'])->where('project_id', $extenal_user_value['project_id'])->get()->toarray();
								if (empty($resource_data)) {

									$request['project_resources_id'] = Module::insert('project_resources', (object) $extenal_user_value);
								}
							} else {
								$file_extension = substr($extenal_user_value['external_user_logo'], 5, strpos($extenal_user_value['external_user_logo'], ';') - 5);
								if (Str::startsWith($extenal_user_value['external_user_logo'], "data:$file_extension;base64,")) {
									$image_info = $this->decodeBase64($extenal_user_value['external_user_logo']);
									$destination = public_path('storage/team_memeber/');
									if (!File::isDirectory($destination)) {
										$this->create_file_directory($destination);
									}
									$image_id = $this->fileupoload($destination, $image_info, $extenal_user_value['project_ex_user_img_id']);
									$extenal_user_value['photo'] = $image_id;
									$temp_ex_user[$ext_user_key]['project_ex_user_img_id'] = $image_id;
									$temp_ex_user[$ext_user_key]['external_user_logo'] = "";
								}

								$project_ex_member_id = Module::insert("projct_extrnal_membrs", (object) $extenal_user_value);
								$temp_ex_user[$ext_user_key]['project_ex_user_id'] = $project_ex_member_id;


								$extenal_user_value['externl_user'] = $project_ex_member_id;
								$resource_data = Project_resource::where('externl_user', $project_ex_member_id)->where('project_id', $extenal_user_value['project_id'])->get()->toarray();
								if (empty($resource_data)) {

									$request['project_resources_id'] = Module::insert('project_resources', (object) $extenal_user_value);
								}
							}
						}
						$request['external_user'] = $temp_ex_user;
					}
					/*  $project_member_data =  Project_member::first()->ProjectMember()->get();
						*/
					Project::where('id', $request['project_id'])->update(['project_step_id' => $request->project_step_id]);
					$project_member_data = Project_member::where('project_id', $request->project_id)
						->select('project_members.user_id', 'project_members.project_id', 'users.name')
						->join('users', 'project_members.user_id', '=', 'users.id')
						->get();
					$request_data = $request->all();
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Save Your Project  Team!';
					$this->apiResponse['data'] = $project_member_data;
					$this->apiResponse['Team_data'] = $request_data;
					break;
				case 'projectKeyDates':
					/* $request['start_date'] = date('d-m-Y', strtotime($request['start_date']));
					$request['end_date'] = date('d-m-Y', strtotime($request['end_date'])); */
					$tem_mile_stone = $request->mile_stone;
					foreach ($tem_mile_stone as $mile_stone_key => $mile_stone_data) {
						if (!empty($mile_stone_data['project_milestone_id'])) {

							$project_milestone_id = Module::updateRow('project_milestones', (object) $mile_stone_data, $mile_stone_data['project_milestone_id']);
							$tem_mile_stone[$mile_stone_key]['project_milestone_id'] = $project_milestone_id;
						} else {

							$project_milestone_id = Module::insert('project_milestones', (object) $mile_stone_data);
							$tem_mile_stone[$mile_stone_key]['project_milestone_id'] = $project_milestone_id;
						}
						Project::where('id', $request['project_id'])->update(['project_step_id' => $request->project_step_id]);
					}
					$request['mile_stone'] = $tem_mile_stone;
					$projcet_mile_stone_data = $request->all();
					//$e = Module::updateRow('Projects', (object) $request, $request['project_id']);

					/* 		DB::table('projects')->where('id', $request['project_id'])->update([
						'start_date' => $request['start_date'], 'project_duration' => $request['project_duration'], 'end_date' => $request['end_date']
					]); */
					/* $projcet_mile_stone_data = Project_milestone::where('project_id', $request['project_id'])->get()->toArray(); */
					Project::where('id', $request['project_id'])->update(['project_step_id' => $request->project_step_id]);
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Save Your Project Milestone';
					$this->apiResponse['data'] = $projcet_mile_stone_data;
					break;
				case 'projectActivity':

					$tem_project_activity = $request->majar_activity;
					if (!empty($tem_project_activity)) {

						foreach ($tem_project_activity as $major_activity_key => $major_activity_data) {
							if (!empty($major_activity_data['project_activity_id'])) {

								$Project_majr_actvity_id = Module::updateRow("project_majr_actvities", (object) $major_activity_data, $major_activity_data['project_activity_id']);

								$tem_project_activity[$major_activity_key]['project_activity_id'] = $Project_majr_actvity_id;
							} else {

								$major_activity_count = DB::table('project_majr_actvities')->where('project_id', $major_activity_data['project_id'])->count();
								$srno = $major_activity_count + 1;
								$sr_no = $major_activity_data['project_id'] . '.' . $srno;
								$major_activity_data['activity_sr_no'] = $sr_no;
								$Project_majr_actvity_id = Module::insert("project_majr_actvities", (object) $major_activity_data);

								$tem_project_activity[$major_activity_key]['project_activity_id'] = $Project_majr_actvity_id;
							}
						}
					}

					$request['majar_activity'] = $tem_project_activity;
					$projcet_major_activity_data = $request->all();
					Project::where('id', $request['project_id'])->update(['project_step_id' => $request->project_step_id]);
					/* $projcet_major_activity_data = Project_majr_actvity::where('project_id', $request['project_id'])->get()->toArray(); */
					/* $projcet_major_activity_data = Project::find($request->project_id)->ProjectMajorActivity()->get()->toArray(); */
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Save Your Project Activity';
					$this->apiResponse['data'] = $projcet_major_activity_data;
					break;

				case 'projectSubActivity':

					$tem_sub_activity_data = $request['sub_activity'];
					foreach ($tem_sub_activity_data as $sub_activity_key => $sub_activity_value) {
						if (!empty($sub_activity_value['project_sub_actvity_id'])) {

							$project_sub_activity = Module::updateRow("project_sub_actvities", (object) $sub_activity_value, $sub_activity_value['project_sub_actvity_id']);
							$tem_sub_activity_data[$sub_activity_key]['project_sub_actvity_id'] = $project_sub_activity;
						} else {
							$sub_activity_count = DB::table('project_sub_actvities')->where('major_activity_id', $sub_activity_value['major_activity_id'])->count();
							$srno = $sub_activity_count + 1;
							$sr_no = $sub_activity_value['major_activity_id'] . '.' . $srno;
							$sub_activity_value['sub_activity_sr_no'] = $sr_no;
							$project_sub_activity = Module::insert("project_sub_actvities", (object) $sub_activity_value);
							$tem_sub_activity_data[$sub_activity_key]['project_sub_actvity_id'] = $project_sub_activity;
							$tem_sub_activity_data[$sub_activity_key]['sub_activity_sr_no'] = $sr_no;
						}
					}
					Project::where('id', $request['project_id'])->update(['project_step_id' => $request->project_step_id]);
					$request['sub_activity'] = $tem_sub_activity_data;
					$sub_activity_data = $request->all();
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Save Your Project SubActivity';
					$this->apiResponse['data'] = $sub_activity_data;
					break;
				case 'kpiProject':

					if (!empty($request['project_kpi_id'])) {

						$project_kpi_id = Module::updateRow('project_kpis', $request, $request['project_kpi_id']);
					} else {

						$project_kpi_id = Module::insert('project_kpis', $request);
					}
					$request['project_kpi_id'] = $project_kpi_id;
					$temp_kpi_mile_stone_data  = $request['kpi_mile_stone'];
					foreach ($temp_kpi_mile_stone_data as $kpi_mile_stone_key => $kpi_mile_stone_value) {
						if (!empty($kpi_mile_stone_value['kpi_mile_stone_id'])) {
							$kpi_mile_stone_value['project_kpi_id'] = $project_kpi_id;
							$kpi_mile_stone_id = Module::updateRow('project_kpi_milestons', (object) $kpi_mile_stone_value, $kpi_mile_stone_value['kpi_mile_stone_id']);
							$temp_kpi_mile_stone_data[$kpi_mile_stone_key]['kpi_mile_stone_id'] = $kpi_mile_stone_id;
						} else {

							$project_kpi_milestons_count = DB::table('project_kpi_milestons')->where('project_kpi_id', $request['project_kpi_id'])->count();
							$srno = $project_kpi_milestons_count + 1;
							$sr_no = $request['project_kpi_id'] . '.' . $srno;
							$kpi_mile_stone_value['project_kpi_sr_no'] = $sr_no;
							$kpi_mile_stone_value['project_kpi_id'] = $project_kpi_id;
							$kpi_mile_stone_id = Module::insert('project_kpi_milestons', (object) $kpi_mile_stone_value);
							$temp_kpi_mile_stone_data[$kpi_mile_stone_key]['kpi_mile_stone_id'] = $kpi_mile_stone_id;
							$temp_kpi_mile_stone_data[$kpi_mile_stone_key]['project_kpi_sr_no'] = $sr_no;
						}
					}
					$request['kpi_mile_stone'] = $temp_kpi_mile_stone_data;
					$kpi_data = $request->all();

					Project::where('id', $request['project_id'])->update(['project_step_id' => $request->project_step_id]);

					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Save Your KpiProject ';
					$this->apiResponse['data'] = $kpi_data;
					break;
				case 'governanceProject':

					$temp_data = $request->all();
					foreach ($temp_data['govMeting'] as $mkey => $GovsData) {
						if (!empty($GovsData['project_gov_id'])) {

							$project_gov_id = Module::updateRow('project_governances', (object) $GovsData, $GovsData['project_gov_id']);
							$temp_data['govMeting'][$mkey]['project_gov_id'] = $project_gov_id;
							$project_gov_memebers_id = DB::table('project_gov_memebers')->where('id', $GovsData['project_gov_memebers_id'])->update(
								['project_gov_id' => $project_gov_id, 'member_id' => $GovsData['gov_member']]
							);
							$temp_data['govMeting'][$mkey]['project_gov_memebers_id'] = $project_gov_memebers_id;
						} else {
							$project_gov_id = Module::insert('project_governances', (object) $GovsData);
							$temp_data['govMeting'][$mkey]['project_gov_id'] = $project_gov_id;
							$project_gov_memebers_id = DB::table('project_gov_memebers')->insertGetId(
								['project_gov_id' => $project_gov_id, 'member_id' => $GovsData['gov_member']]
							);
							$temp_data['govMeting'][$mkey]['project_gov_memebers_id'] = $project_gov_memebers_id;
						}
					}
					Project::where('id', $request['project_id'])->update(['project_step_id' => $request->project_step_id]);
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Save Your Project Governance';
					$this->apiResponse['data'] = $temp_data;
					break;
				case 'budgetTrackProject':

					Project::where('id', $request['project_id'])->update(['project_cost' => $request['total_pro_cost'], 'currency' => $request['currency']]);
					$temp_budget_tracking_data = $request->all();

					foreach ($temp_budget_tracking_data['allocation_dept'] as $allocation_key => $project_allocation_value) {

						if (!empty($project_allocation_value['project_budget_id'])) {

							$project_budget_id = Module::updateRow('project_bdget_trakigs', (object) $project_allocation_value, $project_allocation_value['project_budget_id']);
							$temp_budget_tracking_data['allocation_dept'][$allocation_key]['project_budget_id'] = $project_budget_id;
						} else {

							$project_budget_id = Module::insert('project_bdget_trakigs', (object) $project_allocation_value);
							$temp_budget_tracking_data['allocation_dept'][$allocation_key]['project_budget_id'] = $project_budget_id;
						}
					}
					$budget_tracking_data = $temp_budget_tracking_data;
					Project::where('id', $request['project_id'])->update(['project_step_id' => $request->project_step_id]);
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Save Your Project Budget Tracking';
					$this->apiResponse['data'] = $budget_tracking_data;
					break;
				case 'projectIssueTracker':

					if (!empty($request['project_issue_id'])) {

						$project_issue_id = Module::updateRow('project_isue_trackers', $request, $request['project_issue_id']);
					} else {

						$project_issue_id = Module::insert('project_isue_trackers', $request);
					}
					$request['project_issue_id'] = $project_issue_id;
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Save Your Project Issue Tracker';
					$this->apiResponse['data'] = $request->all();
					break;

				case 'RiskAccessmentLog':

					if (!empty($request['risk_accesment_id'])) {
						$project_issue_id = Module::updateRow('project_risk_as_logs', $request, $request['risk_accesment_id']);
					} else {
						$risk_accesment_id = Module::insert('project_risk_as_logs', $request);
					}
					$request['risk_accesment_id'] = $risk_accesment_id;
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Save Your Project Risk Accessment Log';
					$this->apiResponse['data'] = $request->all();

					break;
				case 'projectDeviation':

					if (!empty($request->hasFile('upload_id'))) {
						$image_info = $request['upload_id'];
						$destination = public_path('storage/issue_remark/');
						$file_id = $request['file_id'];
						$file_id = $this->UploadFile($destination, $image_info, $file_id);
						$request->file_id = $file_id;
					}
					$deviation_id = Module::insert('project_deviations', $request);
					$request['deviation_id'] = $deviation_id;
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Save Your Project Devation';
					$this->apiResponse['data'] = $request->all();
					break;
				case 'ResourcePlanning':
					//print_r($request->all());die;
					foreach ($request['data_user'] as $rdkey => $rdvalue) {
						$rdvalue['resource_uesr'] = $request['user_id'];
						$rdvalue['project_id'] = $request['project_id'];
						if (!empty($rdvalue['id'])) {
							$resource_id = Module::updateRow('project_resources', (object) $rdvalue, $rdvalue['id']);
						} else {
							$resource_id = Module::insert('project_resources', (object) $rdvalue);
						}
					}
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Save Your Resource Planning';
					break;
			}
			return $this->sendResponse();
		} catch (\Exception $e) {
			$this->apiResponse['message'] = $e->getMessage();
			return $this->sendResponse();
		}
	}
	//api-update single project
	public function api_update_single_project(Request $request)
	{
		try {
			switch ($request->projectDetails) {
				case 'kpiProject':
					if (!empty($request['project_kpi_id'])) {

						$project_kpi_id = Module::updateRow('project_kpis', $request, $request['project_kpi_id']);

						foreach ($request['kpi_mile_stone'] as $key => $kpi_mile_stone_data) {

							if (!empty($kpi_mile_stone_data['kpi_mile_stone_id'])) {
								Module::updateRow('project_kpi_milestons', (object) $kpi_mile_stone_data, $kpi_mile_stone_data['kpi_mile_stone_id']);
							} else {

								$project_kpi_milestons_count = DB::table('project_kpi_milestons')->where('project_kpi_id', $request['project_kpi_id'])->count();
								$srno = $project_kpi_milestons_count + 1;
								$sr_no = $request['project_kpi_id'] . '.' . $srno;
								$kpi_mile_stone_data['project_kpi_sr_no'] = $sr_no;
								$kpi_mile_stone_data['project_kpi_id'] = $project_kpi_id;
								$kpi_mile_stone_id = Module::insert('project_kpi_milestons', (object) $kpi_mile_stone_data);
							}
						}
						$this->apiResponse['status'] = "success";
						$this->apiResponse['message'] = 'Successfully Update Your ProjectKpi ';
					}
					if (!empty($request['kpi_mile_stone_id'])) {


						DB::table('project_kpi_milestons')->where('id', $request['kpi_mile_stone_id'])->update([
							'project_kpi_actual' => $request['project_kpi_actual'], 'project_kpi_reason' => $request['project_kpi_reason'], 'project_kpi_solution' => $request['project_kpi_solution'], 'project_kpi_status' => $request['project_kpi_status']
						]);
						$this->apiResponse['status'] = "success";
						$this->apiResponse['message'] = 'Successfully Update Your Project Milestone ';
					}
					break;
				case 'projectActivity':
					if (!empty($request['project_activity_id'])) {
						$Project_majr_actvity_id = Module::updateRow("project_majr_actvities", $request, $request['project_activity_id']);
					}
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Save Your Project Activity ';
					break;
				case 'projectSubActivity':

					if (!empty($request['project_sub_actvity_id'])) {

						$project_sub_activity = Module::updateRow("project_sub_actvities", $request, $request['project_sub_actvity_id']);
					}
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Update Your Project SubActivity ';
					break;
				case 'governanceProject':

					if (!empty($request['project_gov_id'])) {
						$project_gov_id = Module::updateRow('project_governances', (object) $request, $request['project_gov_id']);
						$project_gov_memebers_id = DB::table('project_gov_memebers')->where('id', $request['project_gov_memebers_id'])->update(
							['project_gov_id' => $project_gov_id, 'member_id' => $request['gov_member']]
						);
					}
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Update Your Project Governances';
					break;
				case 'projectIssueTracker':

					if (!empty($request['issue_id'])) {
						$project_Issue_Tracker = Module::updateRow("project_isue_trackers", (object)$request, $request['issue_id']);
					}
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Update Your Project Issue Tracker ';
					break;
				case 'RiskAccessmentLog':

					if (!empty($request['id'])) {
						$project_Risk_Accessment = Module::updateRow("project_risk_as_logs", $request, $request['id']);
					}
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Update Your Risk Accessment Log ';
					break;
				case 'projectDeviation':

					if (!empty($request['deviation_id'])) {
						if (!empty($request->hasFile('upload_id'))) {
							$image_info = $request['upload_id'];
							$destination = public_path('storage/issue_remark/');
							$file_id = $request['file_id'];
							$file_id = $this->UploadFile($destination, $image_info, $file_id);
							$request->file_id = $file_id;
						}
						$deviation_id = Module::updateRow('project_deviations', $request, $request['deviation_id']);
						$request['deviation_id'] = $deviation_id;
						$this->apiResponse['status'] = "success";
						$this->apiResponse['message'] = 'Successfully Update Your Project Devation';
						$this->apiResponse['data'] = $request->all();
					}
			}
			return $this->sendResponse();
		} catch (\Exception $e) {
			$this->apiResponse['message'] = $e->getMessage();
			return $this->sendResponse();
		}
	}

	//api-view-single projet
	public function api_view_single_projects(Request $request)
	{
		$singleData = [];
		$baseUrl = url('/') . '/files/';
		$singleData['projectData'] = Project::select('projects.*', 'department_masters.dept_name', DB::raw("CONCAT('{$baseUrl}', uploads.hash, '/', uploads.name) as file_name"))->where('projects.id', $request['project_id'])
			->leftjoin('uploads', 'projects.project_logo', '=', 'uploads.id')
			->leftjoin('department_masters', 'projects.department_id', '=', 'department_masters.id')
			->get()->toArray();

		$singleData['project_member_data'] = Project_member::select('project_members.*', 'project_members.id as project_company_user_id', 'employers.name',  'employers.user_id', 'employers.email', 'employers.mobile', 'employers.multi_dept_id', 'employers.photo_id', DB::raw("CONCAT('{$baseUrl}', uploads.hash, '/', uploads.name) as file_name"))
			->leftjoin('employers', 'project_members.user_id', '=', 'employers.user_id')
			->leftjoin('uploads', 'employers.photo_id', '=', 'uploads.id')->where('project_id', $request['project_id'])
			->get()->toArray();

		$singleData['project_ex_member_data'] = Projct_extrnal_membr::select('projct_extrnal_membrs.*', 'projct_extrnal_membrs.id as project_ex_user_id', DB::raw("CONCAT('{$baseUrl}', uploads.hash, '/', uploads.name) as file_name"))->where('project_id', $request['project_id'])
			->leftjoin('uploads', 'projct_extrnal_membrs.photo', '=', 'uploads.id')
			->get()->toArray();

		$singleData['project_milestone_data'] = Project_milestone::select('project_milestones.*', 'project_milestones.id as project_milestone_id', DB::raw("DATE_FORMAT(project_milestones.mile_stone_date, '%d-%m-%Y') as mile_stone_date"))->where('project_id', $request['project_id'])->get()->toArray();

		$singleData['project_majr_activity_data'] = Project_majr_actvity::select(
			'project_majr_actvities.*',
			'project_majr_actvities.id as project_activity_id',
			DB::raw("DATE_FORMAT(project_majr_actvities.activity_start_date, '%d-%m-%Y') as activity_start_date"),
			DB::raw("DATE_FORMAT(project_majr_actvities.activity_end_date, '%d-%m-%Y') as activity_end_date"),
			'project_milestones.*',
			'employers.name as responsibility_person',
			'employers.user_id as user_id',
			'preceeding_data.activity_name as preceeding_activity_name',
			DB::raw("DATE_FORMAT(preceeding_data.activity_start_date, '%d-%m-%Y') as preceeding_activity_start_date"),
			DB::raw("DATE_FORMAT(preceeding_data.activity_end_date, '%d-%m-%Y') as preceeding_activity_end_date"),
			'next_actiovity_data.activity_name as next_activity_name',
			DB::raw("DATE_FORMAT(next_actiovity_data.activity_start_date, '%d-%m-%Y') as next_activity_start_date"),
			DB::raw("DATE_FORMAT(next_actiovity_data.activity_end_date, '%d-%m-%Y') as next_activity_end_date"),
			'projct_extrnal_membrs.ex_membar_name',
			'projct_extrnal_membrs.id as project_ex_user_id'
		)->leftjoin('project_milestones', 'project_majr_actvities.milestone_id', '=', 'project_milestones.id')->leftjoin('employers', 'project_majr_actvities.responsibility', '=', 'employers.user_id')->leftjoin('project_majr_actvities as preceeding_data', 'project_majr_actvities.preceeding_activity', '=', 'preceeding_data.id')->leftjoin('project_majr_actvities as next_actiovity_data', 'project_majr_actvities.preceeding_activity', '=', 'next_actiovity_data.id')->leftjoin('projct_extrnal_membrs', 'project_majr_actvities.other_responsibility', '=', 'projct_extrnal_membrs.id')
			->orderBy('project_majr_actvities.id', 'DESC')
			->where('project_majr_actvities.project_id', $request['project_id'])->where('project_majr_actvities.deleted_at', NULL)->get()->toArray();

		foreach ($singleData['project_majr_activity_data'] as $project_majr_activity_key => $project_majr_activity_value) {

			$single_project_sub_activity_data = Project_sub_actvity::select('project_sub_actvities.*', 'project_sub_actvities.id as project_sub_actvity_id', 'project_majr_actvities.activity_start_date', 'project_majr_actvities.activity_end_date', 'project_majr_actvities.activity_name')->join('project_majr_actvities', 'project_sub_actvities.major_activity_id', '=', 'project_majr_actvities.id')
				->where('project_sub_actvities.major_activity_id', $project_majr_activity_value['project_activity_id'])
				->orderBy('project_sub_actvities.id', 'DESC')
				->where('project_majr_actvities.id', $project_majr_activity_value['project_activity_id'])->where('project_sub_actvities.deleted_at', NULL)->get()->toArray();
			$singleData['project_majr_activity_data'][$project_majr_activity_key]['project_sub_activity_data'] = $single_project_sub_activity_data;
		}
		$singleData['project_kpi_data'] = Project_kpi::select('project_kpis.*', 'project_kpis.id as project_kpi_id', 'u_o_ms.name as uom_name', 'department_masters.dept_name')->leftjoin('u_o_ms', 'project_kpis.project_kpi_uom', '=', 'u_o_ms.id')->leftjoin('department_masters', 'project_kpis.project_kpi_dept', '=', 'department_masters.id')
			->orderBy('project_kpis.id', 'DESC')
			->where('project_id', $request['project_id'])
			->get()->toArray();
		foreach ($singleData['project_kpi_data'] as $project_kpi_key => $project_kpi_value) {

			$single_project_kpi_milestone_data = Project_kpi_mileston::select('project_kpi_milestons.*', 'project_kpi_milestons.id as kpi_mile_stone_id', 'project_milestones.milestone_name')->leftjoin('project_milestones', 'project_kpi_milestons.milestone_id', '=', 'project_milestones.id')->where('project_kpi_milestons.project_kpi_id', $project_kpi_value['project_kpi_id'])->get()->toArray();

			$singleData['project_kpi_data'][$project_kpi_key]['project_kpi_milestone_data'] = $single_project_kpi_milestone_data;
		}

		$singleData['project_milestone_and_kpi_data'] = Project_milestone::select('project_milestones.*')->where('project_id', $request['project_id'])->get()->toarray();

		foreach ($singleData['project_milestone_and_kpi_data'] as $milestonekey => $mvalue) {

			$project_milestone_and_kpi_rel_data = Project_kpi_mileston::select('project_kpi_milestons.*', 'project_kpi_milestons.id as kpi_mile_stone_id', 'project_kpis.*', 'department_masters.dept_name', 'u_o_ms.name as uom_name')->where('project_kpi_milestons.project_id', $mvalue['project_id'])->where('milestone_id', $mvalue['id'])
				->leftjoin('project_kpis', 'project_kpi_milestons.project_kpi_id', '=', 'project_kpis.id')
				->leftjoin('u_o_ms', 'project_kpis.project_kpi_uom', '=', 'u_o_ms.id')
				->leftjoin('department_masters', 'project_kpis.project_kpi_dept', '=', 'department_masters.id')
				->get()->toarray();
			$singleData['project_milestone_and_kpi_data'][$milestonekey]['project_kpi_data'] = $project_milestone_and_kpi_rel_data;
		}

		$singleData['project_goverances'] = Project_governance::select(
			'project_governances.*',
			'project_governances.id as project_gov_id',
			'chair_employers.name as chair_person_name',
			DB::raw("CONCAT('{$baseUrl}', chair_person.hash, '/', chair_person.name) as chair_person_img"),
			DB::raw("CONCAT('{$baseUrl}', co_chair_personn.hash, '/', co_chair_personn.name) as co_chair_person_img"),
			'co_chair_employers.name as co_chair_person_name',
			'gov_member.name as member_name',
			'project_gov_memebers.member_id',
			'project_gov_memebers.id as project_gov_memebers_id'
		)->where('project_governances.project_id', $request['project_id'])
			->leftjoin('employers as chair_employers', 'project_governances.chair_person', '=', 'chair_employers.user_id')
			->leftjoin('employers as co_chair_employers', 'project_governances.co_chair_person', '=', 'co_chair_employers.user_id')
			->leftjoin('project_gov_memebers', 'project_governances.id', '=', 'project_gov_memebers.project_gov_id')
			->leftjoin('employers as gov_member', 'project_gov_memebers.member_id', '=', 'gov_member.user_id')
			->leftjoin('uploads as chair_person', 'chair_employers.photo_id', '=', 'chair_person.id')
			->leftjoin('uploads as co_chair_personn', 'co_chair_employers.photo_id', '=', 'co_chair_personn.id')
			->orderBy('project_governances.id', 'DESC')
			->get()->toArray();
		foreach ($singleData['project_goverances'] as $Gkey => $Gov_data) {
			$MemDataa = explode(',', $Gov_data['member_id']);
			$GovMemberData = DB::table('employers')->select('employers.name as member_name', 'employers.user_id as member_id', DB::raw("CONCAT('{$baseUrl}', gov_member.hash, '/', gov_member.name) as gov_member_img"))
				->leftjoin('uploads as gov_member', 'employers.photo_id', '=', 'gov_member.id')
				->whereIn('employers.user_id', $MemDataa)->get();

			$singleData['project_goverances'][$Gkey]['gov_members'] = $GovMemberData;
		}
		$singleData['project_budget_tracking'] = Project_bdget_trakig::select('project_bdget_trakigs.*', 'project_bdget_trakigs.id as project_budget_id', 'department_masters.dept_name')->leftjoin('department_masters', 'project_bdget_trakigs.dept_id', '=', 'department_masters.id')
			->orderBy('project_bdget_trakigs.id', 'DESC')
			->where('project_id', $request['project_id'])->get()->toArray();


		$singleData['projectIssueTracker'] = Project_isue_tracker::select('project_isue_trackers.*', 'department_masters.dept_name', 'employers.name as issue_task_owner_name ', 'priorities.name as priority_name', 'statuses.status_name')
			->leftjoin('department_masters', 'project_isue_trackers.issue_task_dept', '=', 'department_masters.id')
			->leftjoin('employers', 'project_isue_trackers.issue_task_owner', '=', 'employers.user_id')
			->leftjoin('statuses', 'project_isue_trackers.issue_status', '=', 'statuses.id')
			->leftjoin('priorities', 'project_isue_trackers.issue_task_priority', '=', 'priorities.id')
			->orderBy('project_isue_trackers.id', 'DESC')
			->where('project_id', $request['project_id'])->get()->toArray();



		foreach ($singleData['projectIssueTracker'] as $project_issue_key => $issue_tracker_value) {

			$co_ownwer_cs_value = explode(',', $issue_tracker_value['issue_task_co_owner']);
			$co_ownwer_ary_value = DB::table('employers')->select('name', 'user_id as co_owner_id')->whereIn('user_id', $co_ownwer_cs_value)->get();

			$singleData['projectIssueTracker'][$project_issue_key]['issue_task_co_ownwer_value'] = $co_ownwer_ary_value;
		}

		$singleData['RiskAccessmentLog'] = Project_risk_as_log::select('project_risk_as_logs.*', 'priorities.name as risk_level_name', 'employers.name as risk_responsibility_name')->where('project_id', $request['project_id'])
			->leftjoin('employers', 'project_risk_as_logs.risk_responsibility', '=', 'employers.user_id')
			->leftjoin('priorities', 'project_risk_as_logs.risk_level', '=', 'priorities.id')
			->get()->toArray();

		$singleData['projectDeviation'] = Project_deviation::select('project_deviations.*', 'department_masters.dept_name', 'employers.name as deviation_aprove_usr_name', DB::raw("CONCAT('{$baseUrl}', uploads.hash, '/', uploads.name) as file_name"), 'priorities.name as deviation_risk_name')
			->leftjoin('department_masters', 'department_masters.id', '=', 'project_deviations.deviation_dept')
			->leftjoin('employers', 'project_deviations.deviation_aprove_usr', '=', 'employers.user_id')
			->leftjoin('uploads', 'project_deviations.file_id', '=', 'uploads.id')
			->leftjoin('priorities', 'project_deviations.deviation_risk', '=', 'priorities.id')
			->where('project_id', $request['project_id'])->get()->toArray();

		$TWdata = array();
		$r = 1;
		$formt_start_date = new DateTime($singleData['projectData'][0]['start_date']);
		$formt_end_date = new DateTime($singleData['projectData'][0]['end_date']);
		for ($i = $formt_start_date; $i < $formt_end_date; $i->modify('+7 day')) {
			$week_frequency = new DateTime($i->format("Y-m-d"));
			$TWdata['totalweek'][] = "w" . $r;
			$r++;
		}

		$singleData['ResourcePlanning'] = $TWdata;
		$resourceData = Project_resource::select('project_resources.*', 'employers.name')
			->leftjoin('employers', 'project_resources.resource_uesr', '=', 'employers.user_id')
			->where('project_id', $request['project_id'])->get()->toArray();
		//print_r($resourceData);die;
		if (!empty($TWdata)) {
			$u = array();
			foreach ($TWdata['totalweek'] as $Wkey => $TWvalue) {
				foreach ($resourceData as $rkey => $rvalue) {
					$p	= array_search($rvalue['resource_uesr'], array_column($u, 'user_id'));
					if (false === $p) {
						$p = array_push($u, array("user_id" => $rvalue['resource_uesr'], "user" => $rvalue['name'], "totalweeks" => array())) - 1;
					}
					$q = array_search($TWvalue, array_column($u[$p]['totalweeks'], 'week'));
					if (false === $q) {
						$q = array_push($u[$p]['totalweeks'], array("id" => 0, "week" => $TWvalue, "target" => 0, "actual" => 0)) - 1;
					}
					$r = array_search($rvalue['week'], array_column($u[$p]['totalweeks'], 'week'));
					if ($r !== false) {
						$u[$p]['totalweeks'][$r] = array("id" => $rvalue['id'], "week" => $rvalue['week'], "target" => $rvalue['target'], "actual" => $rvalue['actual']);
					}
				}
			}

			$singleData['ResourcePlanning']['recourceData'] = $u;
		}
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = "project list response";
		$this->apiResponse['data'] = $singleData;
		return $this->sendResponse();
	}

	//api delete single projects

	public function api_delete_single_projects(Request $request)
	{
		try {
			switch ($request->projectDetails) {
				case 'project':

					if (!empty($request['project_id'])) {
						$project_id	= Module::updateRow('Projects', $request, $request->project_id);
						$request['project_id'] = $project_id;
						$project_Data = $request->all();
						$this->apiResponse['status'] = "success";
						$this->apiResponse['message'] = 'Successfully delete your project!';
						$this->apiResponse['data'] = $project_Data;
						break;
					}
				case 'projectTeam':

					if (isset($request['project_company_user_id'])) {

						$project_member_id = DB::table('project_members')->where('id', $request['project_company_user_id'])->update(['deleted_at' => $request['deleted_at']]);
					}

					if (isset($request['project_ex_user_id'])) {

						$project_member_id = DB::table('projct_extrnal_membrs')->where('id', $request['project_ex_user_id'])->update(['deleted_at' => $request['deleted_at']]);
					}

					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully delete Your Project  Team!';
					//$this->apiResponse['data'] = $project_member_data;
					//$this->apiResponse['Team_data'] = $request_data;
					break;
				case 'projectKeyDates':

					if (isset($request['project_milestone_id'])) {
						$project_milestone_id = DB::table('project_milestones')->where('id', $request['project_milestone_id'])->update(['deleted_at' => $request['deleted_at']]);
					}
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully delete Your Project Milestone';
					//$this->apiResponse['data'] = $projcet_mile_stone_data;
					break;
				case 'projectActivity':

					if (!empty($request['project_activity_id'])) {
						//$Project_majr_actvity_id = Project_majr_actvity::where('id', $request['project_activity_id'])->forceDelete();
						$project_milestone_id = DB::table('project_majr_actvities')->where('id', $request['project_activity_id'])->update(['deleted_at' => $request['deleted_at']]);

						$project_sub_activity_id = DB::table('project_sub_actvities')->where('major_activity_id', $request['project_activity_id'])->update(['deleted_at' => $request['deleted_at']]);
					}

					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully delete Your Project Activity';
					//$this->apiResponse['data'] = $projcet_major_activity_data;
					break;

				case 'projectSubActivity':

					if (!empty($request['project_sub_actvity_id'])) {
						$project_sub_activity_id = DB::table('project_sub_actvities')->where('id', $request['project_sub_actvity_id'])->update(['deleted_at' => $request['deleted_at']]);
					}

					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully delete Your Project SubActivity';
					//$this->apiResponse['data'] = $sub_activity_data;
					break;
				case 'kpiProject':

					if (!empty($request['project_kpi_id'])) {
						$kpi_id = DB::table('project_kpis')->where('id', $request['project_kpi_id'])->update(['deleted_at' => $request['deleted_at']]);

						$kpi_mile_stone_id = DB::table('project_kpi_milestons')->whereIn('id', $request['multi_kpi_mile_stone_id'])->update(['deleted_at' => $request['deleted_at']]);
						$this->apiResponse['status'] = "success";
						$this->apiResponse['message'] = 'Successfully delete Your KpiProject ';
					}
					if (!empty($request['kpi_mile_stone_id'])) {
						$kpi_mile_stone_id = DB::table('project_kpi_milestons')->where('id', $request['kpi_mile_stone_id'])->update(['deleted_at' => $request['deleted_at']]);

						$this->apiResponse['status'] = "success";
						$this->apiResponse['message'] = 'Successfully delete Your Milestone ';
					}
					break;
				case 'governanceProject':
					if (!empty($request['project_gov_id'])) {

						$project_gov_memebers_id = DB::table('project_governances')->where('id', $request['project_gov_id'])->update(
							['deleted_at' => $request['deleted_at']]
						);
						$project_gov_memebers_id = DB::table('project_gov_memebers')->where('id', $request['project_gov_memebers_id'])->update(
							['deleted_at' => $request['deleted_at']]
						);
					}
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully delete Your Governances ';
					break;
				case 'budgetTrackProject':

					if (!empty($request['project_budget_id'])) {
						$project_budget_id = DB::table('project_bdget_trakigs')->where('id', $request['project_budget_id'])->update(['deleted_at' => $request['deleted_at']]);
					}
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Delete Your Project Budget Tracking';
					//$this->apiResponse['data'] = $budget_tracking_data;
					break;
				case 'projectIssueTracker':
					if (!empty($request['issue_id'])) {
						$project_budget_id = DB::table('project_isue_trackers')->where('id', $request['issue_id'])->update(['deleted_at' => $request['deleted_at']]);
					}
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Delete Your Project Budget Tracking';
					//$this->apiResponse['data'] = $budget_tracking_data;
					break;
				case 'RiskAccessmentLog':
					if (!empty($request['id'])) {

						$project_Risk_Accessment = DB::table('project_risk_as_logs')->where('id', $request['id'])->update(['deleted_at' => $request['deleted_at']]);
					}
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Delete Your Risk Accessment Log ';
					break;
				case 'projectDeviation':

					if (!empty($request['deviation_id'])) {
						$deviation_id = DB::table('project_deviations')->where('id', $request['deviation_id'])->update(['deleted_at' => $request['deleted_at']]);
					}
					$this->apiResponse['status'] = "success";
					$this->apiResponse['message'] = 'Successfully Delete Your Project Devation';
					break;
			}
			return $this->sendResponse();
		} catch (\Exception $e) {
			$this->apiResponse['message'] = $e->getMessage();
			return $this->sendResponse();
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
		//	$query = DB::raw("(CASE WHEN user_group='1' THEN 'Admin') as name");
		//make date acc. to financial year.
		$getDate = $this->getFinancialDate($request['fyear'] ? $request['fyear'] : '', $request['year']);
		$start_date = $getDate['start_date'];
		$end_date = $getDate['end_date'];
		$projects_data = Project::select('projects.id as project_id', 'projects.project_name', 'projects.department_id', 'department_masters.dept_name', 'projects.user_id', 'projects.status_id', 'projects.project_cost', 'projects.start_date', 'projects.end_date', 'projects.currency', 'projects.project_duration', 'project_members.project_leader', 'employers.name as leader_name', 'projects.project_step_id', \DB::raw('(CASE 
		WHEN projects.project_step_id != "5" THEN "Draft" 
		ELSE statuses.status_name
		END) AS status_name'))
			->join('statuses', 'projects.status_id', '=', 'statuses.id')
			->leftjoin('project_members', function ($join) {
				$join->on('projects.id', '=', 'project_members.project_id')
					->on('project_members.project_leader', '=', DB::raw('1'));
			})
			->leftjoin('employers', 'project_members.user_id', '=', 'employers.user_id')
			->leftjoin('department_masters', 'projects.department_id', '=', 'department_masters.id')
			->where('projects.unit_id', $request['unit_id'])
			->where(function ($q) use ($start_date, $end_date) {
				$q->whereBetween('projects.start_date', [$start_date, $end_date])
					->orwhereBetween('projects.end_date', [$start_date, $end_date])
					->orwhere(function ($p) use ($start_date, $end_date) {
						$p->where('projects.start_date', '<=', $start_date)
							->where('projects.end_date', '>=', $end_date);
					});
			})
			->orderBy('projects.id', 'desc')
			// ->toSql();
			->get()->toArray();

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
		if (!empty($request->user_id)) {
			$date = date('Y-m-d h:i:s');
			DB::table('projects')->where('projects.id', $request->project_id)->update(['deleted_at' => $date]);
			$this->apiResponse['status'] = "success";
			$this->apiResponse['message'] = 'Successfully delete your project!';
			return $this->sendResponse();
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
		$insert_id = Module::insert("project_histories", $request);
		if (!empty($request->status_id)) {
			DB::table('projects')->where('projects.id', $request->project_id)->update(['status_id' => $request->status_id]);
		}
		if (!empty($request->hasFile('upload_id'))) {
			$upload_id = $request->file('upload_id');
			$file_name = time() . $upload_id->getClientOriginalName();
			$destination = $_SERVER["DOCUMENT_ROOT"] . '/businessplus/storage/uploads';
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
		$projects_remark_data = DB::table('project_histories')->select('projects.id as project_id', 'projects.project_name', 'project_histories.logedin_user_id as user_id', 'users.name', 'project_histories.status_id', 'statuses.status_name', 'project_histories.remark', 'project_histories.id as project_remark_id', 'project_histories.updated_at')
			->join('projects', 'project_histories.project_id', '=', 'projects.id')
			->join('users', 'project_histories.logedin_user_id', '=', 'users.id')
			->join('statuses', 'project_histories.status_id', '=', 'statuses.id')
			->where('project_histories.deleted_at', NULL)
			->where('project_histories.project_id', $request->project_id)
			->orderBy('project_histories.id', 'desc')
			->get();

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
		if ($request->user_id == $request['project_user_id']) {
			$insert_id = Module::updateRow("project_histories", $request, $request->project_remark_id);
			if (!empty($request->status_id)) {
				DB::table('projects')->where('projects.id', $request->project_id)->update(['status_id' => $request->status_id]);
			}
			if (!empty($request->hasFile('upload_id'))) {
				$upload_id = $request->file('upload_id');
				$file_name = time() . $upload_id->getClientOriginalName();
				$destination = $_SERVER["DOCUMENT_ROOT"] . '/businessplus/storage/uploads';
				$request->file('upload_id')->move($destination, $file_name);

				$string = "123456stringsawexs";
				$extension = pathinfo($upload_id, PATHINFO_EXTENSION);
				$path = $destination . '/' . $file_name;
				$public = 1;
				$hash = str_shuffle($string);

				$request->user_id = $request->user_id;
				$request->name = $file_name;
				$request->extension = $extension;
				$request->path = $path;
				$request->public = $public;
				$request->hash = $hash;
				$date = date('Y-m-d h:i:s');
				$file_id = Module::insert("uploads", $request);
				$request->logedin_user_id = $request->user_id;
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
		if ($request->user_id == $request['project_user_id']) {
			$date = date('Y-m-d h:i:s');
			DB::table('project_histories')->where('project_histories.id', $request->project_remark_id)->where('project_histories.logedin_user_id', $request->user_id)->update(['deleted_at' => $date]);
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
		if ($request->user_id == $request['project_user_id']) {
			$date = date('Y-m-d h:i:s');
			DB::table('project_files')->where('project_files.id', $request->project_files_id)->where('project_files.logedin_user_id', $request->user_id)->update(['deleted_at' => $date]);
			$this->apiResponse['status'] = "success";
			$this->apiResponse['message'] = 'Successfully delete your project remark file !';
			return $this->sendResponse();
		} else {
			$message = "Permission denied for this project remark file!";
			$errors = 'user does not match for this project remark file !';
			return $this->respondValidationError($message, $errors);
		}
	}
	//api issue tracker ADD remark
	public function api_issue_tracker_remark(Request $request)
	{
		if (!empty($request['issue_remark_id'])) {
			if (!empty($request->hasFile('upload_id'))) {
				$image_info = $request['upload_id'];
				$destination = public_path('storage/issue_remark/');
				$file_id = $request['file_id'];
				$file_id = $this->UploadFile($destination, $image_info, $file_id);
				$request->image_id = $file_id;
			}
			$project_issue_id = DB::table('project_issue_remarks')->where('id',  $request['issue_remark_id'])->update(["remark" => $request['remark'], "issue_id" => $request['issue_id'], "image_id" => $request['image_id'], "status_id" => $request['status_id'], "user_id" => $request['user_id'], 'deleted_at' => $request['deleted_at']]);

			if (!empty($request->status_id && $request->issue_id)) {
				DB::table('project_isue_trackers')->where('id', $request->issue_id)->update(['issue_status' => $request->status_id, 'completion_date' => $request['completion_date'], 'issue_revised_date' => $request['issue_revised_date']]);
			}
			$this->apiResponse['status'] = "success";
			$this->apiResponse['message'] = 'Successfully update your Issue Remark!';
			return $this->sendResponse();
		} else {

			if (!empty($request->hasFile('upload_id'))) {
				$image_info = $request['upload_id'];
				$destination = public_path('storage/issue_remark/');
				$file_id = $request['file_id'];
				$file_id = $this->UploadFile($destination, $image_info, $file_id);
				$request->image_id = $file_id;
			}

			$insert_id = Module::insert("project_issue_remarks", $request);
			if ($request->status_id == 3 || $request->status_id == 4) {
				$request['completion_date'] = date('Y-m-d h:i:s');
			} else {
				$request->completion_date = '';
			}

			if (!empty($request->status_id)) {
				DB::table('project_isue_trackers')->where('id', $request->issue_id)->update(['issue_status' => $request->status_id, 'completion_date' => $request['completion_date'], 'issue_revised_date' => $request['issue_revised_date']]);
			}
			$this->apiResponse['status'] = "success";
			$this->apiResponse['message'] = 'Successfully save your Issue Remark!';
			return $this->sendResponse();
		}
	}

	//api issue tracker remark view data 

	public function api_view_single_remark_data(Request $request)
	{
		try {
			switch ($request->projectDetails) {
				case 'IssueTrackerRemark':

					if (!empty($request['issue_id'])) {
						$singleRowData['IssueTrackerRemark'] = Project_isue_tracker::select('project_isue_trackers.*', 'department_masters.dept_name', 'employers.name as issue_task_owner_name ', 'priorities.name as priority_name', 'statuses.status_name')
							->leftjoin('department_masters', 'project_isue_trackers.issue_task_dept', '=', 'department_masters.id')
							->leftjoin('employers', 'project_isue_trackers.issue_task_owner', '=', 'employers.user_id')
							->leftjoin('statuses', 'project_isue_trackers.issue_status', '=', 'statuses.id')
							->leftjoin('priorities', 'project_isue_trackers.issue_task_priority', '=', 'priorities.id')
							->where('project_isue_trackers.id', $request['issue_id'])->get()->toArray();

						$baseUrl = url('/') . '/files/';
						$singleRowData['IssueRemarks']  = Project_issue_remark::select('project_issue_remarks.*', 'statuses.status_name', DB::raw("CONCAT('{$baseUrl}', uploads.hash, '/', uploads.name) as file_name"), 'employers.name as issue_remark_user_name', 'project_isue_trackers.issue_task_name')
							->leftjoin('statuses', 'project_issue_remarks.status_id', '=', 'statuses.id')
							->leftjoin('uploads', 'project_issue_remarks.image_id', '=', 'uploads.id')
							->leftjoin('employers', 'project_issue_remarks.user_id', '=', 'employers.user_id')
							->leftjoin('project_isue_trackers', 'project_issue_remarks.issue_id', '=', 'project_isue_trackers.id')
							->where('project_issue_remarks.issue_id', $request['issue_id'])->get()->toArray();

						$this->apiResponse['status'] = "success";
						$this->apiResponse['message'] = 'Successfully view your single issue tracker data!';
						$this->apiResponse['data'] = $singleRowData;
						break;
					}
			}
			return $this->sendResponse();
		} catch (\Exception $e) {
			$this->apiResponse['message'] = $e->getMessage();
			return $this->sendResponse();
		}
	}
	// api for project view graph
	public function api_poject_view_graph(Request $request)
	{
		try {
			$Gdata = array();
			$r = 1;
			$current_date = date("Y-m-d");
			$project_data = Project::select('projects.*')->where('id', $request['project_id'])->get()->toarray();
			$formt_start_date = new DateTime($project_data[0]['start_date']);
			$formt_currnet_date = new DateTime($current_date);
			for ($i = $formt_start_date; $i < $formt_currnet_date; $i->modify('+7 day')) {

				$week_frequency = new DateTime($i->format("Y-m-d"));
				$p = $i->format('Y-m-d');
				$Gdata['week'][] = "W$r<br>$p";
				//$Gdata['date'][] = $p->format('Y-m-d');
				$issue = DB::table('project_isue_trackers')
					->where('project_id', $request['project_id'])
					->where('created_at', '<=', $week_frequency)
					->whereNull('deleted_at')
					->get();

				$Gdata['total_issue'][] = count($issue);
				$open = 0;
				$delayed = 0;
				$closed = 0;
				$cwd = 0;
				$hold = 0;
				foreach ($issue as $ikey => $issue_value) {
					switch ($issue_value->issue_status) {
						case '1': //Open
							$open++;
							break;
						case '2': //Delayed
							$delayed++;
							break;
						case '3': //Closed
							$closed++;
							break;
						case '4': //Closed With Delay
							$cwd++;
							break;
						case '5': // On Hold
							$hold++;
							break;
					}
				}
				$Gdata['Open'][] = $open;
				$Gdata['Delayed'][] = $delayed;
				$Gdata['Closed'][] = $closed;
				$Gdata['Closed_With_Delay'][] = $cwd;
				$Gdata['On_Hold'][] = $hold;
				$r++;
			}

			$pltotal = 0;
			$plopen = 0;
			$pldelayed = 0;
			$plclosed = 0;
			$plcwd = 0;
			$plhold = 0;

			$pmtotal = 0;
			$pmopen = 0;
			$pmdelayed = 0;
			$pmclosed = 0;
			$pmcwd = 0;
			$pmhold = 0;

			$phtotal = 0;
			$phopen = 0;
			$phdelayed = 0;
			$phclosed = 0;
			$phcwd = 0;
			$phhold = 0;
			//print_r($issue);die;
			foreach ($issue as $priorityKey => $priorityValue) {
				switch ($priorityValue->issue_task_priority) {
					case '1': //Low
						$pltotal++;
						switch ($priorityValue->issue_status) {
							case '1': //Open
								$plopen++;
								break;
							case '2': //Delayed
								$pldelayed++;
								break;
							case '3': //Closed
								$plclosed++;
								break;
							case '4': //Closed With Delay
								$plcwd++;
								break;
							case '5': // On Hold
								$plhold++;
								break;
						}
						break;
					case '2': //Medium
						$pmtotal++;
						switch ($priorityValue->issue_status) {
							case '1':
								$pmopen++;
								break;
							case '2':
								$pmdelayed++;
								break;
							case '3':
								$pmclosed++;
								break;
							case '4':
								$pmcwd++;
								break;
							case '5':
								$pmhold++;
								break;
						}
						break;
					case '3': //High
						$phtotal++;
						switch ($priorityValue->issue_status) {

							case '1':
								$phopen++;
								break;
							case '2':
								$phdelayed++;
								break;
							case '3':
								$phclosed++;
								break;
							case '4':
								$phcwd++;
								break;
							case '5':
								$phhold++;
								break;
						}
						break;
				}
			}

			$Gdata['low']['pltotal'] = $pltotal;
			$Gdata['low']['plopen'] = $plopen;
			$Gdata['low']['pldelayed'] = $pldelayed;
			$Gdata['low']['plclosed'] = $plclosed;
			$Gdata['low']['plcwd'] = $plcwd;
			$Gdata['low']['plhold'] = $plhold;

			$Gdata['medium']['pmtotal'] = $pmtotal;
			$Gdata['medium']['pmopen'] = $pmopen;
			$Gdata['medium']['pmdelayed'] = $pmdelayed;
			$Gdata['medium']['pmclosed'] = $pmclosed;
			$Gdata['medium']['pmcwd'] = $pmcwd;
			$Gdata['medium']['pmhold'] = $pmhold;

			$Gdata['high']['phtotal'] = $phtotal;
			$Gdata['high']['phopen'] = $phopen;
			$Gdata['high']['phdelayed'] = $phdelayed;
			$Gdata['high']['phclosed'] = $phclosed;
			$Gdata['high']['phcwd'] = $phcwd;
			$Gdata['high']['phhold'] = $phhold;


			$GraphData['issueRemarkGraph'] = $Gdata;

			$major_activity_data = Project_majr_actvity::select('id', DB::raw("CONCAT(id,' ',activity_name) as text"), DB::raw("DATE_FORMAT(activity_start_date, '%d-%m-%Y') as start_date"), DB::raw("DATE_FORMAT(activity_end_date, '%d-%m-%Y') as end_date"), DB::raw("'project' as type"), DB::raw(' "" as parent'), DB::raw(' 2 as progress'), DB::raw(' "true" as open'), DB::raw(' "#FFD933" as color'))->where('project_id', $request['project_id'])->get()->toArray();
			$link_major_activity_data = $major_activity_data;

			foreach ($major_activity_data as $meky => $mvalue) {

				$major_sub_activity_data =  Project_sub_actvity::select('id', DB::raw("CONCAT(sub_activity_sr_no,' ',sub_activity_name) as text"), DB::raw("DATE_FORMAT(sb_actvity_strt_date, '%d-%m-%Y') as start_date"), DB::raw("DATE_FORMAT(sb_actvity_end_date, '%d-%m-%Y') as end_date"), 'major_activity_id as parent', DB::raw(' 3 as progress'), DB::raw(' "true" as open'), DB::raw(' "#548ca7" as color'))->where('major_activity_id', $mvalue['id'])->get()->toArray();
				$major_activity_data	= array_merge($major_activity_data, $major_sub_activity_data);
			}

			foreach ($link_major_activity_data as $lkey => $lvalue) {
				$Tdata['links'][] = array('id' => $lvalue['id'], 'source' => $lvalue['id'], "target" => "", "type" => 0);
				$major_sub_activity_data =  Project_sub_actvity::select('id', 'id as source', 'major_activity_id as target', DB::raw(" 0 as type"))->where('major_activity_id', $lvalue['id'])->get()->toArray();
				$Tdata['links'] = array_merge($Tdata['links'], $major_sub_activity_data);
			}

			$Tdata['data'] = $major_activity_data;
			$GraphData['projectActivityGraph'] = $Tdata;

			$project_kpi_data = Project_kpi::select('project_kpis.id as kpi_id', 'project_kpis.*', 'project_kpi_milestons.*', 'project_kpi_milestons.id as project_kpi_milestone_id', 'department_masters.dept_name')
				->leftjoin('project_kpi_milestons', 'project_kpis.id', '=', 'project_kpi_milestons.project_kpi_id')
				->leftjoin('department_masters', 'project_kpis.project_kpi_dept', '=', 'department_masters.id')
				->where('project_kpis.project_id', $request['project_id'])
				->where('project_kpi_milestons.project_id', $request['project_id'])

				->get()->toarray();
			$project_kpis_dept = array();
			foreach ($project_kpi_data as $pkey => $project_kpi_value) {

				$p	= array_search($project_kpi_value['project_kpi_dept'], array_column($project_kpis_dept, 'project_kpi_dept'));
				if (false === $p) {
					$p = array_push($project_kpis_dept, array("project_kpi_dept" => $project_kpi_value['project_kpi_dept'], "kpi_milestone_data" => array())) - 1;
				}
				$r = array_push($project_kpis_dept[$p]['kpi_milestone_data'], $project_kpi_value);
			}

			$project_kpis_data = array();
			$deliverable_data = array();
			foreach ($project_kpis_dept as $deptkey => $dept_value) {
				$totald = 0;
				$green = 0;
				$red = 0;
				$yellow = 0;
				foreach ($dept_value['kpi_milestone_data'] as $kkey => $kvalue) {

					switch ($kvalue['project_kpi_status']) {
						case 'Green':
							$totald++;
							$green++;
							break;
						case 'Red':
							$totald++;
							$red++;
							break;
						case 'Yellow':
							$totald++;
							$yellow++;
							break;
					}
				}

				$project_kpis_data['dept_id'] = $kvalue['project_kpi_dept'];
				$project_kpis_data['dept_name'] = $kvalue['dept_name'];
				$project_kpis_data['total'] = $totald;
				$project_kpis_data['Green'] = $green;
				$project_kpis_data['Red'] = $red;
				$project_kpis_data['Yellow'] = $yellow;
				array_push($deliverable_data, $project_kpis_data);
			}
			$GraphData['projectDeliverable'] = $deliverable_data;

			$TWdata = array();
			$r = 1;
			$formt_start_date = new DateTime($project_data[0]['start_date']);
			$formt_end_date = new DateTime($project_data[0]['end_date']);
			for ($i = $formt_start_date; $i < $formt_end_date; $i->modify('+7 day')) {
				//$wf = new DateTime($i->format("Y-m-d"));
				$wf = $i->format('Y-m-d');
				$TWdata['week'][] = "w$r<br>$wf";
				$TWdata['totalweek'][] = "w$r";
				$r++;
			}

			if (empty($request['user_id'])) {
				$resourceData = Project_resource::select('project_resources.*', 'employers.name')
					->leftjoin('employers', 'project_resources.resource_uesr', '=', 'employers.user_id')
					->where('project_id', $request['project_id'])->get()->toArray();

				$tmp_actual = [];
				$tmp_target = [];
				$tmp_percent = [];
				if (!empty($TWdata)) {
					foreach ($TWdata['totalweek'] as $Wkey => $TWvalue) {
						$total_actual = 0;
						$total_target = 0;
						foreach ($resourceData as $rkey => $rvalue) {
							if ($TWvalue == $rvalue['week']) {
								$total_actual = $total_actual + $rvalue['actual'];
								$total_target = $total_target + $rvalue['target'];
							}
						}
						array_push($tmp_target, $total_target);
						array_push($tmp_actual, $total_actual);
						if ($total_target == 0) {
							$total_percent = 0;
						} else {
							$total_percent = round(($total_actual / $total_target) * 100, 2);
						}
						array_push($tmp_percent, $total_percent);
					}
					$TWdata['target'] = $tmp_target;
					$TWdata['actual'] = $tmp_actual;
					$TWdata['percent'] = $tmp_percent;
				}
			} else {
				$resourceData = Project_resource::select('project_resources.*', 'employers.name')
					->leftjoin('employers', 'project_resources.resource_uesr', '=', 'employers.user_id')
					->where('project_resources.resource_uesr', $request['user_id'])
					->where('project_id', $request['project_id'])->get()->toArray();
				/* print_r($resourceData);
				die; */
				$tmp_actual = [];
				$tmp_target = [];
				$tmp_percent = [];
				if (!empty($TWdata)) {
					foreach ($TWdata['totalweek'] as $Wkey => $TWvalue) {
						$total_actual = 0;
						$total_target = 0;
						foreach ($resourceData as $rkey => $rvalue) {
							if ($TWvalue == $rvalue['week']) {
								$total_actual = $total_actual + $rvalue['actual'];
								$total_target = $total_target + $rvalue['target'];
							}
						}
						array_push($tmp_target, $total_target);
						array_push($tmp_actual, $total_actual);
						if ($total_target == 0) {
							$total_percent = 0;
						} else {
							$total_percent = round(($total_actual / $total_target) * 100, 2);
						}
						array_push($tmp_percent, $total_percent);
					}
					$TWdata['target'] = $tmp_target;
					$TWdata['actual'] = $tmp_actual;
					$TWdata['percent'] = $tmp_percent;
				}
			}
			$GraphData['ResourceGraphData'] = $TWdata;

			$this->apiResponse['status'] = "success";
			$this->apiResponse['message'] = 'Successfully view your  issue tracker data!';
			$this->apiResponse['data'] = $GraphData;
			return $this->sendResponse();
		} catch (\Exception $e) {
			$this->apiResponse['message'] = $e->getMessage();
			return $this->sendResponse();
		}
	}

	public function api_view_project_dashboard(Request $request)
	{
		try {
			//department wise data
			$DashboardData = [];
			$project_Dept_Data = [];
			$dept_year_data = [];

			//make date acc. to financial year.
			$getDate = $this->getFinancialDate($request['fyear'] ? $request['fyear'] : '', $request['year']);
			$start_date = $getDate['start_date'];
			$end_date = $getDate['end_date'];

			$projectData = Project::select('projects.*', 'department_masters.dept_name')
				->leftjoin('department_masters', 'projects.department_id', '=', 'department_masters.id')
				//->leftjoin('project_members', 'projects.id', '=', 'project_members.project_id')
				->where('projects.unit_id', $request['unit_id'])
				//->where('project_members.project_leader',1)
				->where('projects.start_date', '!=', '0000-00-00')
				->where(function ($q) use ($start_date, $end_date) {
					$q->whereBetween('projects.start_date', [$start_date, $end_date])
						->orwhereBetween('projects.end_date', [$start_date, $end_date])
						->orwhere(function ($p) use ($start_date, $end_date) {
							$p->where('projects.start_date', '<=', $start_date)
								->where('projects.end_date', '>=', $end_date);
						});
				})
				->get()->toarray();

			foreach ($projectData as $pkey => $project_value) {
				$start_year = date("Y", strtotime($project_value['start_date']));

				$p	= array_search($project_value['department_id'], array_column($project_Dept_Data, 'department_id'));
				if (false === $p) {
					$p = array_push($project_Dept_Data, array("department_id" => $project_value['department_id'], "dept_name" => $project_value['dept_name'], "projects" => array())) - 1;
				}
				$r = array_push($project_Dept_Data[$p]['projects'], $project_value);

				$pyear = array_search($start_year, array_column($dept_year_data, 'year'));
				if (false === $pyear) {
					$pyear = array_push($dept_year_data, array("year" => $start_year,  "projects" => array())) - 1;
				}
				$yr = array_push($dept_year_data[$pyear]['projects'], $project_value);
			}


			$project_temp_Data = array();
			$dept_data = array();
			foreach ($project_Dept_Data as $deptkey => $dept_value) {
				$totald = 0;
				$open = 0;
				$delayed = 0;
				$closed = 0;
				$cwd = 0;
				$hold = 0;
				foreach ($dept_value['projects'] as $projectkey => $project_value) {

					switch ($project_value['status_id']) {
						case '1': //Open
							$totald++;
							$open++;
							break;
						case '2': //Delayed
							$totald++;
							$delayed++;
							break;
						case '3': //Closed
							$totald++;
							$closed++;
							break;
						case '4': //Closed With Delay
							$totald++;
							$cwd++;
							break;
						case '5': // On Hold
							$totald++;
							$hold++;
							break;
					}
				}

				$project_temp_Data['dept_id'] = $dept_value['department_id'];
				$project_temp_Data['dept_name'] = $dept_value['dept_name'];
				$project_temp_Data['total'] = $totald;
				$project_temp_Data['open'] = $open;
				$project_temp_Data['delayed'] = $delayed;
				$project_temp_Data['closed'] = $closed;
				$project_temp_Data['closedWithDelay'] = $cwd;
				$project_temp_Data['onHold'] = $hold;
				array_push($dept_data, $project_temp_Data);
			}
			$DashboardData['project_Dept_Data'] = $dept_data;
			$project_temp_year_data = array();
			$temp_year_data = array();
			foreach ($dept_year_data as $pkey => $pvalue) {
				$totald = 0;
				$open = 0;
				$delayed = 0;
				$closed = 0;
				$cwd = 0;
				$hold = 0;
				foreach ($pvalue['projects'] as $qkey => $qvalue) {
					switch ($qvalue['status_id']) {
						case '1': //Open
							$totald++;
							$open++;
							break;
						case '2': //Delayed
							$totald++;
							$delayed++;
							break;
						case '3': //Closed
							$totald++;
							$closed++;
							break;
						case '4': //Closed With Delay
							$totald++;
							$cwd++;
							break;
						case '5': // On Hold
							$totald++;
							$hold++;
							break;
					}
				}

				$project_temp_year_data['year'] = $pvalue['year'];
				$project_temp_year_data['total'] = $totald;
				$project_temp_year_data['open'] = $open;
				$project_temp_year_data['delayed'] = $delayed;
				$project_temp_year_data['closed'] = $closed;
				$project_temp_year_data['closedWithDelay'] = $cwd;
				$project_temp_year_data['onHold'] = $hold;
				array_push($temp_year_data, $project_temp_year_data);
			}



			//year wise data
			/*			$tempArray = [];
			foreach ($project_Dept_Data as $dept_key => $project_dept_value) {
				$dept_year_data = [];
				foreach ($project_dept_value['projects'] as $ykey => $project_year_value) {
					$start_year = date("Y", strtotime($project_year_value['start_date']));
					$pyear = array_search($start_year, array_column($dept_year_data, 'year'));
					if (false === $pyear) {
						$pyear = array_push($dept_year_data, array("year" => $start_year,  "projects" => array())) - 1;
					}
					$r = array_push($dept_year_data[$pyear]['projects'], $project_year_value);
				}
				array_push($tempArray, $dept_year_data);
			}

			
			 $project_temp_year_data = array();
			$temp_year_data = array();
			foreach ($tempArray as $pkey => $temp_value) {
				foreach ($temp_value as $qkey => $q_value) {
					$totald = 0;
					$open = 0;
					$delayed = 0;
					$closed = 0;
					$cwd = 0;
					$hold = 0;
					foreach ($q_value['projects'] as $rkey => $rvalue) {
						switch ($rvalue['status_id']) {
							case '1': //Open
								$totald++;
								$open++;
								break;
							case '2': //Delayed
								$totald++;
								$delayed++;
								break;
							case '3': //Closed
								$totald++;
								$closed++;
								break;
							case '4': //Closed With Delay
								$totald++;
								$cwd++;
								break;
							case '5': // On Hold
								$totald++;
								$hold++;
								break;
						}
					}
					$project_temp_year_data['dept_id'] = $q_value['dept_id'];
					$project_temp_year_data['dept_name'] = $q_value['dept_name'];
					$project_temp_year_data['year'] = $q_value['year'];
					$project_temp_year_data['total'] = $totald;
					$project_temp_year_data['open'] = $open;
					$project_temp_year_data['delayed'] = $delayed;
					$project_temp_year_data['closed'] = $closed;
					$project_temp_year_data['closedWithDelay'] = $cwd;
					$project_temp_year_data['onHold'] = $hold;
					array_push($temp_year_data, $project_temp_year_data);
				}
			} */
			$DashboardData['project_Dept_Year_Data'] = $temp_year_data;
			$this->apiResponse['status'] = "success";
			$this->apiResponse['message'] = 'Successfully View Your Project DashboardData';
			$this->apiResponse['data'] = $DashboardData;
			return $this->sendResponse();
		} catch (\Exception $e) {
			$this->apiResponse['message'] = $e->getMessage();
			return $this->sendResponse();
		}
	}

	//api for gantt chart data

	public function api_view_poject_gantt_chart_data(Request $request)
	{
		$project_data = Project::select('projects.id', 'projects.project_name as text', 'projects.start_date', 'projects.end_date')->where('id', $request['project_id'])->get()->toarray();

		$mileStone_data = Project_milestone::select(DB::raw("CONCAT(project_milestones.id, '0')as id"),DB::raw('("-") as responsibility'), 'project_milestones.milestone_name as text',DB::raw('("-") as end_date') ,DB::raw("DATE_FORMAT(project_milestones.mile_stone_date, '%d-%m-%Y') as start_date"), DB::raw("DATE_FORMAT(project_milestones.mile_stone_date, '%d-%m-%Y') as end_date"), 'project_milestones.symbol', 'project_milestones.milestone_status as status_name', DB::raw('("") as parent'), DB::raw('(0.5) as progress'), DB::raw('("true") as open'), DB::raw('("milestone") as type'))->where('project_id', $request['project_id'])->where('project_milestones.deleted_at', NULL)->get()->toarray();


		$projcet_major_activity_data = Project::select(DB::raw("CONCAT(project_majr_actvities.id, '1')as id"), 'employers.name as responsibility', 'project_majr_actvities.activity_name as text', DB::raw("DATE_FORMAT(project_majr_actvities.activity_start_date, '%d-%m-%Y') as start_date"), DB::raw("DATE_FORMAT(project_majr_actvities.activity_end_date, '%d-%m-%Y') as end_date"), DB::raw("CONCAT(project_majr_actvities.milestone_id, '0')as parent"), 'project_majr_actvities.preceeding_activity', DB::raw('(0.5) as progress'), DB::raw('("true") as open'), DB::raw('("#548ca7") as color'), DB::raw('("activity") as type'))
			->leftjoin('project_majr_actvities', 'projects.id', '=', 'project_majr_actvities.project_id')
			->leftjoin('employers', 'project_majr_actvities.responsibility', '=', 'employers.user_id')

			->where('project_majr_actvities.project_id', $request['project_id'])->where('project_majr_actvities.deleted_at', NULL)->get()->toarray();


		//$projcet_major_activity_data = Project_majr_actvity::with('preceeding_activity')->where('project_majr_actvities.project_id', $request['project_id'])->where('project_majr_actvities.deleted_at', NULL)->get()->toarray();


		$project_sub_activity = Project_majr_actvity::select(DB::raw("CONCAT(project_sub_actvities.id, '2')as id"),  'employers.name as responsibility','project_sub_actvities.sub_activity_name as text', DB::raw("DATE_FORMAT(project_sub_actvities.sb_actvity_strt_date, '%d-%m-%Y') as start_date"), DB::raw("DATE_FORMAT(project_sub_actvities.sb_actvity_end_date, '%d-%m-%Y') as end_date"), DB::raw("CONCAT(project_majr_actvities.id, '1')as parent"), DB::raw('(0.5) as progress'), DB::raw('("true") as open'), DB::raw('("#548ca7") as color'), DB::raw('("subactivity") as type'))
			->join('project_sub_actvities', 'project_majr_actvities.id', '=', 'project_sub_actvities.major_activity_id')
			->leftjoin('employers', 'project_sub_actvities.responsibility', '=', 'employers.user_id')
			->where('project_sub_actvities.deleted_at', NULL)
			->where('project_majr_actvities.project_id', $request['project_id'])->get()->toarray();


		$graph_data = array_merge($mileStone_data, $projcet_major_activity_data, $project_sub_activity);


		$project_link_data[] = Project::select('projects.id', 'projects.id as source', DB::raw('("") as target'), DB::raw('(1) as type'))->find($request['project_id'])->toarray();

		$mileStone_link_data = Project_milestone::select(DB::raw("CONCAT(project_milestones.id, '0')as id"), DB::raw("CONCAT(project_milestones.id, '0')as source"), DB::raw('("") as target'), DB::raw('(1) as type'))->where('project_id', $request['project_id'])->where('project_milestones.deleted_at', NULL)->get()->toarray();


		$projcet_major_link_data = Project::select(DB::raw("CONCAT(project_majr_actvities.id, '1')as id"), DB::raw("CONCAT(project_majr_actvities.id, '1')as source"), DB::raw("CONCAT(project_majr_actvities.milestone_id, '0')as target"), DB::raw('(1) as type'))->leftjoin('project_majr_actvities', 'projects.id', '=', 'project_majr_actvities.project_id')->where('project_majr_actvities.project_id', $request['project_id'])->where('project_majr_actvities.deleted_at', NULL)->get()->toarray();


		$project_sub_link_data = Project_majr_actvity::select(DB::raw("CONCAT(project_sub_actvities.id, '2')as id"), DB::raw("CONCAT(project_sub_actvities.id, '2')as source"), DB::raw("CONCAT(project_majr_actvities.id, '1')as target"), DB::raw('(1) as type'))
			->join('project_sub_actvities', 'project_majr_actvities.id', '=', 'project_sub_actvities.major_activity_id')
			->where('project_sub_actvities.deleted_at', NULL)
			->where('project_majr_actvities.project_id', $request['project_id'])->get()->toarray();


		$graph_link = array_merge($mileStone_link_data, $projcet_major_link_data, $project_sub_link_data);


		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = "project activity and sub activity data";
		$this->apiResponse['data'] = array("data" => $graph_data, "links" => $graph_link, "projectData" => $project_data);
		return $this->sendResponse();
	}
}
