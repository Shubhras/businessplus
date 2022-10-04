<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Dwij\Laraadmin\Models\Module;

class ApiTaskController extends ResponseApiController
{
	/*view remark files */
	/**
	 * Store and edit project in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function get_task_dashboard_data(Request $request)
	{
		$total_task = DB::table('tasks')->where('tasks.deleted_at', NULL)->where('tasks.unit_id', $request->unit_id)
			->count();
		$delayed_task = DB::table('tasks')->where('tasks.deleted_at', NULL)->where('tasks.unit_id', $request->unit_id)->where('tasks.status_id', 2) //2=Delayed
			->count();
		$open = DB::table('tasks')->where('tasks.deleted_at', NULL)->where('tasks.unit_id', $request->unit_id)->where('tasks.status_id', 1) //1=open
			->count();
		$on_hold = DB::table('tasks')->where('tasks.deleted_at', NULL)->where('tasks.unit_id', $request->unit_id)->where('tasks.status_id', 5) //5=On Hold
			->count();
		$closed = DB::table('tasks')->where('tasks.deleted_at', NULL)
			->where('tasks.unit_id', $request->unit_id)
			->where('tasks.status_id', 3)->count();

		$closed_with_delay = DB::table('tasks')->where('tasks.deleted_at', NULL)
			->where('tasks.unit_id', $request->unit_id)
			->where('tasks.status_id', 4)->count(); //Closed Closed With Delay
		$closed_task = $closed + $closed_with_delay;
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = "tasks_remark_data list response";
		$this->apiResponse['total_task'] = $total_task;
		$this->apiResponse['open'] = $open;
		$this->apiResponse['delayed_task'] = $delayed_task;
		$this->apiResponse['closed_task'] = $closed_task;
		$this->apiResponse['on_hold'] = $on_hold;
		return $this->sendResponse();
	}
	/*task */
	/**
	 * Store task in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_add_tasks(Request $request)
	{
		$request->status_id = 1;
		$request->department_master_id = $request->department_id;
		$insert_id = Module::insert("tasks", $request);
		$date = date('Y-m-d h:i:s');
		if (!empty($request->assign_to)) {
			foreach ($request->assign_to as $key => $user_id) {
				DB::table('task_assigns')->insert(['task_id' => $insert_id, 'user_id' => $user_id, 'created_at' => $date, 'updated_at' => $date]);
			}
		}
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully save your task!';
		return $this->sendResponse();
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

		$date = date('Y-m-d h:i:s');
		if ($request->status_id == 3 || $request->status_id == 4) {
			$newDate = date("d-m-Y h:i:s", strtotime($date));
			$request->completion_date = $newDate;
		} else {
			$request->completion_date = '';
		}
		$insert_id = Module::updateRow("Tasks", $request,  $request->task_id);
		if (!empty($request->status_id)) {
			DB::table('task_histories')->insert(['task_id' => $request->task_id, 'status_id' => $request->status_id, 'logedin_user_id' => $request->user_id, 'created_at' => $date, 'updated_at' => $date]);
		}
		DB::table('task_assigns')->where('task_assigns.task_id', $request->task_id)->update(['deleted_at' => $date]);
		if (isset($request->assign_to)) {
			foreach ($request->assign_to as $key => $user_id) {
				DB::table('task_assigns')->insert(['task_id' => $insert_id, 'user_id' => $user_id, 'created_at' => $date, 'updated_at' => $date]);
			}
		}
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully update your task!';
		return $this->sendResponse();
	}
	/**
	 * View task in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_view_tasks(Request $request)
	{
		$getDate = $this->getFinancialDate($request['fyear'] ? $request['fyear'] : '', $request['year']);
		$start_date = $getDate['start_date'];
		$end_date = $getDate['end_date'];


		

			$tasks_data = DB::table('tasks')->select('tasks.*', 'tasks.id as tasks_id', 'priorities.name as priority_name', 'projects.project_name', 'units.unit_name', 'department_masters.dept_name', 'task_owaner.name as task_owaner_name', 'create_to_user_name.name as create_to_user_name', 'statuses.status_name', 'create_to_user_name.id as create_to_user_id', 'events.event_name', 'events.id as event_id')
			->leftjoin('priorities', 'tasks.priority_id', '=', 'priorities.id')
			->leftjoin('projects', 'tasks.project_id', '=', 'projects.id')
			->leftjoin('units', 'tasks.unit_id', '=', 'units.id')
			->leftjoin('department_masters', 'tasks.department_master_id', '=', 'department_masters.id')
			->leftjoin('users as task_owaner', 'tasks.task_owner_id', '=', 'task_owaner.id')
			->leftjoin('users as create_to_user_name', 'tasks.user_id', '=', 'create_to_user_name.id')
			->leftjoin('statuses', 'tasks.status_id', '=', 'statuses.id')
			->leftjoin('events', 'tasks.event_id', '=', 'events.id')
			->where('tasks.unit_id', $request->unit_id)
			->where('tasks.deleted_at', NULL)
			->orderBy('tasks.id', 'desc')
			->groupBy('tasks_id')
			->where(function ($q) use ($start_date, $end_date) {
				$q->whereBetween('tasks.start_date', [$start_date, $end_date])
					->orwhereBetween('tasks.end_date', [$start_date, $end_date])
					->orwhere(function ($p) use ($start_date, $end_date) {
						$p->where('tasks.start_date', '<=', $start_date)
							->where('tasks.end_date', '>=', $end_date);
					});
			})->get(); 
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
		$tasks_data = DB::table('tasks')->select('tasks.user_id', 'tasks.id as tasks_id', 'tasks.unit_id', 'tasks.priority_id', 'tasks.project_id', 'tasks.department_master_id', 'tasks.status_id', 'tasks.task_owner_id', 'tasks.assign_to', 'tasks.task_name', 'priorities.name as priority_name', 'projects.project_name', 'units.unit_name', 'department_masters.dept_name', 'tasks.start_date', 'tasks.end_date', 'tasks.completion_date', 'tasks.enable', 'task_owaner.name as task_owaner_name', 'assign_to_user.name as assign_to_user_name', 'statuses.status_name')
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
		//if ($request->user_id == $users_id) {
		$date = date('Y-m-d h:i:s');
		DB::table('tasks')->where('tasks.id', $request->task_id)->update(['deleted_at' => $date]);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully delete your tasks!';
		return $this->sendResponse();
		/*}else{
    		$message = "Permission denied for this task !";
			$errors = 'user does not match for this task !';
			return $this->respondValidationError($message, $errors);
    	}*/
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
			$destination = $_SERVER["DOCUMENT_ROOT"] . '/businessplus/storage/uploads';
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
		$tasks_remark_data = DB::table('task_histories')->select('tasks.id as tasks_id', 'tasks.task_name', 'task_histories.logedin_user_id as user_id', 'users.name', 'task_histories.status_id', 'statuses.status_name', 'task_histories.remark', 'task_histories.updated_at', 'task_histories.id as task_remark_id')
			->leftjoin('tasks', 'task_histories.task_id', '=', 'tasks.id')
			->leftjoin('users', 'task_histories.logedin_user_id', '=', 'users.id')
			->leftjoin('statuses', 'task_histories.status_id', '=', 'statuses.id')
			->where('task_histories.task_id', $request->tasks_id)
			->where('task_histories.deleted_at', NULL)
			->orderBy('task_histories.id', 'desc')
			->get();
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
		if ($request->user_id == $request['task_user_id']) {
			Module::updateRow("task_histories", $request, $request->task_remark_id);
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
			$upload_id = $request->file('upload_id');
			$file_name = time() . $upload_id->getClientOriginalName();
			$destination = $_SERVER["DOCUMENT_ROOT"] . '/businessplus/storage/uploads';
			$request->file('upload_id')->move($destination, $file_name);

			$string = "123456stringsawexs";
			$extension = pathinfo($upload_id, PATHINFO_EXTENSION);
			$path = $destination . '/' . $file_name;
			$public = 1;
			$hash = str_shuffle($string);
			$request->name = $file_name;
			$request->extension = $extension;
			$request->path = $path;
			$request->public = $public;
			$request->hash = $hash;
			$date = date('Y-m-d h:i:s');
			$file_id = Module::insert("uploads", $request);
			$request->logedin_user_id = $request['user_id'];
			$request->upload_id = $file_id;
			Module::insert("tasks_files", $request);
		}
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully update task remark!';
		return $this->sendResponse();
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
		$date = date('Y-m-d h:i:s');
		DB::table('task_histories')->where('task_histories.id', $request->task_remark_id)->where('task_histories.logedin_user_id', $request['user_id'])->update(['deleted_at' => $date]);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully delete your tasks remark!';
		return $this->sendResponse();
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

		$date = date('Y-m-d h:i:s');
		DB::table('tasks_files')->where('tasks_files.id', $request->tasks_files_id)->where('tasks_files.logedin_user_id', $request['task_user_id'])->update(['deleted_at' => $date]);
		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = 'Successfully delete your task remark file !';
		return $this->sendResponse();
	}

	/**
	 * Task dashboard in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function api_view_task_dashboard(Request $request)
	{

		//make date acc. to financial year.
		$getDate = $this->getFinancialDate($request['fyear'] ? $request['fyear'] : '', $request['year']);
		$start_date = $getDate['start_date'];
		$end_date = $getDate['end_date'];
		// print_r($end_date);

		// die;
		$task_data = DB::table('tasks')->where('deleted_at', NULL)->where('unit_id', $request->unit_id)
			->where(function ($q) use ($start_date, $end_date) {
				$q->whereBetween('tasks.start_date', [$start_date, $end_date])
					->orwhereBetween('tasks.end_date', [$start_date, $end_date])
					->orwhere(function ($p) use ($start_date, $end_date) {
						$p->where('tasks.start_date', '<=', $start_date)
							->where('tasks.end_date', '>=', $end_date);
					});
			})
			->get();
		$total = 0;
		$open = 0;
		$delayed = 0;
		$closed = 0;
		$closedWithDelay = 0;
		$onHold = 0;
		foreach ($task_data as $key => $row) {
			$total++;
			if ($row->status_id == 1) {
				$open++;
			}
			if ($row->status_id == 2) {
				$delayed++;
			}
			if ($row->status_id == 3) {
				$closed++;
			}
			if ($row->status_id == 4) {
				$closedWithDelay++;
			}
			if ($row->status_id == 5) {
				$onHold++;
			}
		}
		$data['task_data'] = array(
			'total' => $total,
			'open' => $open,
			'delayed' => $delayed,
			'closed' => $closed,
			'closedWithDelay' => $closedWithDelay,
			'onHold' => $onHold
		);


		$get_dept = DB::table('department_masters')->select('id as dept_id', 'dept_name')->where('deleted_at', NULL)->where('unit_id', $request->unit_id)->get();

		foreach ($get_dept as $dept_key => $dept_row) {
			$task_data_dept = DB::table('tasks')
				->where('deleted_at', NULL)
				->where('department_master_id', $dept_row->dept_id)
				->where(function ($q) use ($start_date, $end_date) {
					$q->whereBetween('tasks.start_date', [$start_date, $end_date])
						->orwhereBetween('tasks.end_date', [$start_date, $end_date])
						->orwhere(function ($p) use ($start_date, $end_date) {
							$p->where('tasks.start_date', '<=', $start_date)
								->where('tasks.end_date', '>=', $end_date);
						});
				})
				->where('unit_id', $request->unit_id)->get();
			//$get_dept[$dept_key]->task_data = (object)[];
			$get_dept[$dept_key]->total = 0;
			$get_dept[$dept_key]->open = 0;
			$get_dept[$dept_key]->delayed = 0;
			$get_dept[$dept_key]->closed = 0;
			$get_dept[$dept_key]->closedWithDelay = 0;
			$get_dept[$dept_key]->onHold = 0;
			foreach ($task_data_dept as $key_task => $row_task) {
				$get_dept[$dept_key]->total += 1;
				if ($row_task->status_id == 1) {
					$get_dept[$dept_key]->open += 1;
				}
				if ($row_task->status_id == 2) {
					$get_dept[$dept_key]->delayed += 1;
				}
				if ($row_task->status_id == 3) {
					$get_dept[$dept_key]->closed += 1;
				}
				if ($row_task->status_id == 4) {
					$get_dept[$dept_key]->closedWithDelay += 1;
				}
				if ($row_task->status_id == 5) {
					$get_dept[$dept_key]->onHold += 1;
				}
			}
		}

		$this->apiResponse['status'] = "success";
		$this->apiResponse['message'] = "task dashboard response";
		$this->apiResponse['data'] = $data;
		$this->apiResponse['data_acording_to_dept'] = $get_dept;
		return $this->sendResponse();
	}
}
