<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Dwij\Laraadmin\Models\Module;


class QuarterlyUpdateManufacturingController extends ResponseApiController
{
	public function Quarterly_add_Manufacturing(Request $request)
	{
		try {
			$quart_data = DB::table('quartupdatmanufacturs')
				->where('unit_id', $request->unit_id)
				->where('dept_id', $request->dept_id)
				->where('year', $request->year)
				->where('deleted_at', NULL)
				->where('quarterly', $request->quarterly)
				->get();
			if (empty($quart_data)) {
				if (!empty($request->hasFile('photo'))) {
					$id_array_award = array();
					foreach ($request->photo as $file) {
						$name = $file->getClientOriginalName();
						$destination = $_SERVER["DOCUMENT_ROOT"] . '/businessplus/storage/uploads';
						$file->move($destination, $name);
						$string = "123456stringsawexs";
						$extension = pathinfo($name, PATHINFO_EXTENSION);
						$path = $destination . '/' . $name;
						$public = 1;
						//$user_id = $context_id;
						$hash = str_shuffle($string);

						//$request->user_id = $context_id;
						$request->name = $name;
						$request->extension = $extension;
						$request->path = $path;
						$request->public = $public;
						$request->hash = $hash;
						/* $date=date('Y-m-d h:i:s'); */

						$image_id = Module::insert("uploads", $request);
						$id_array_award[] = $image_id;
						$output_award = array_merge($id_array_award);
						$insert_award_id = implode(", ", $output_award);
						$request->photo = $insert_award_id;
					}
				}
				$photo_id = Module::insert("QuartUpdatManufacturs", $request);
				$this->apiResponse['status'] = "success";
				$this->apiResponse['message'] = "Successfully Add Quarterly Summary";
				// $this->apiResponse['data']=$photo_id;
				return $this->sendResponse();
			} else {
				$this->apiResponse['status'] = "false";
				$this->apiResponse['message'] = "This Type entery already exits";
				return $this->sendResponse();
			}
		} catch (\Exception $e) {
			$this->apiResponse['status'] = false;
			$this->apiResponse['message'] = $e->getmessage();
			return $this->sendResponse();
		}
	}

	public function api_quarterly_view_manufacturing(Request $request)
	{
		$requested_dept_id = explode(',', $request->dept_id);
		$quartely_update = DB::table('quartupdatmanufacturs')
			->select('quartupdatmanufacturs.id as quartupdatmanufacturs_id', 'highlight', 'majorgaps', 'challenges', 'priorities', 'remark', 'quarterly', 'year', 'dept_id', 'department_masters.dept_name', 'quartupdatmanufacturs.unit_id', 'quartupdatmanufacturs.photo')
			->where('quartupdatmanufacturs.deleted_at', NULL)
			->where('quartupdatmanufacturs.unit_id', $request->unit_id)
			->join('department_masters', 'quartupdatmanufacturs.dept_id', '=', 'department_masters.id')
			->orderBy('year', 'asc')
			->get();
		foreach ($quartely_update as $key => $value) {
			if (in_array($value->dept_id, $requested_dept_id)) {
				$temp_key = explode(',', $value->photo);
				$file_name = DB::table('uploads')
					->select('uploads.name as file_name', 'uploads.hash')
					->where('uploads.deleted_at', NULL)
					->whereIn('uploads.id', $temp_key)
					->get();
				foreach ($file_name as $key2) {
					if (!empty($key2->file_name)) {
						$value->image_path[] = url('/') . '/files/' . $key2->hash . '/' . $key2->file_name;
					} else {
						$value->image_path[] = '';
					}
				}
			} else {
				unset($quartely_update[$key]);
			}
		}
		unset($key, $key2, $value);
		$quartely_update = array_values($quartely_update);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = "quarterly-view-manufacturing";
		$this->apiResponse['data'] = $quartely_update;
		return $this->sendResponse();
	}

	public function api_quarterly_delete_manufacturing(Request $request)
	{
		$date = date('Y-m-d h:i:s');
		DB::table('quartupdatmanufacturs')->where('id', $request->quartupdatmanufacturs_id)->update(['deleted_at' => $date]);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully delete quarterly update manufacturs';
		return $this->sendResponse();
	}

	public function api_quarterly_edit_manufacturing(Request $request)
	{
		try {
			if (!empty($request->hasFile('photo'))) {
				$id_array_award = array();
				foreach ($request->photo as $key => $file) {
					$name = $file->getClientOriginalName();
					$destination = $_SERVER["DOCUMENT_ROOT"] . '/businessplus/storage/uploads';
					$file->move($destination, $name);
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
					$id_array_award[] = $image_id;
					$output_award = array_merge($id_array_award);
					$insert_award_id = implode(", ", $output_award);
					$request->photo = $insert_award_id;
				}
			} else {
				$upload_id =	DB::table('quartupdatmanufacturs')->select('quartupdatmanufacturs.photo')
					->where('quartupdatmanufacturs.id', $request->quartupdatmanufacturs_id)
					->get();
				$request['photo'] = $upload_id[0]->photo;
			}
			Module::updateRow("QuartUpdatManufacturs", $request, $request->quartupdatmanufacturs_id);
			$this->apiResponse['status'] = "success";
			$this->apiResponse['message'] = 'Successfully update quarterly manufacturs!';
			return $this->sendResponse();
		} catch (\Exception $e) {
			$this->apiResponse['status'] = false;
			$this->apiResponse['message'] = $e->getmessage();
			//$this->apiResponse['data']=$photo_id;
			return $this->sendResponse();
		}
	}
	public function api_quarterly_filter_manufacturing(Request $request)
	{
		$quartely_update = DB::table('quartupdatmanufacturs')->select('quartupdatmanufacturs.id as quartupdatmanufacturs_id', 'highlight', 'majorgaps', 'challenges', 'priorities', 'photo', 'year', 'quarterly', 'dept_id', 'department_masters.dept_name', 'quartupdatmanufacturs.unit_id')->where('quartupdatmanufacturs.deleted_at', NULL)
			->where('quartupdatmanufacturs.id', $request->quartupdatmanufacturs_id)
			->join('department_masters', 'quartupdatmanufacturs.dept_id', '=', 'department_masters.id')
			->get();
		$temp_data_image = array();
		foreach ($quartely_update as $key => $row) {
			$temp_key = explode(',', $row->photo);
			$file_named = DB::table('uploads')
				->select('uploads.name as file_name', 'uploads.hash')
				->where('uploads.deleted_at', NULL)
				->whereIn('uploads.id', $temp_key)
				->get();
			foreach ($file_named as $key2) {
				if (!empty($key2->file_name)) {
					array_push($temp_data_image, url('/') . '/files/' . $key2->hash . '/' . $key2->file_name);
				} else {
					$temp_data_image = '';
				}
			}
			$quartely_update[$key]->image_path = $temp_data_image;
		}
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = "quarterly-filter-manufacturing";
		$this->apiResponse['data'] = $quartely_update[0];
		return $this->sendResponse();
	}
}
