<?php
/**
 * Controller genrated using LaraAdmin
 * Help: http://laraadmin.com
 */

namespace App\Http\Controllers\LA;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests;
use Auth;
use DB;
use Validator;
use Datatables;
use Collective\Html\FormFacade as Form;
use Dwij\Laraadmin\Models\Module;
use Dwij\Laraadmin\Models\ModuleFields;

use App\Models\Task;

class TasksController extends Controller
{
	public $show_action = true;
	public $view_col = 'task_name';
	public $listing_cols = ['id', 'task_name', 'event_id', 'priority_id', 'project_id', 'department_master_id', 'unit_id', 'user_id', 'start_date', 'end_date', 'completion_date', 'status_id', 'enable', 'assign_to'];
	
	public function __construct() {
		// Field Access of Listing Columns
		if(\Dwij\Laraadmin\Helpers\LAHelper::laravel_ver() == 5.3) {
			$this->middleware(function ($request, $next) {
				$this->listing_cols = ModuleFields::listingColumnAccessScan('Tasks', $this->listing_cols);
				return $next($request);
			});
		} else {
			$this->listing_cols = ModuleFields::listingColumnAccessScan('Tasks', $this->listing_cols);
		}
	}
	
	/**
	 * Display a listing of the Tasks.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		$module = Module::get('Tasks');
		$statuses_data = DB::table('statuses')->select('statuses.id','statuses.status_name')
    	->where('deleted_at', null)
    	->get();
		$units = DB::table('units')->select('units.id','units.unit_name')
    	->where('deleted_at', null)
    	->where('enable', 'yes')
    	->get();
		if(Module::hasAccess($module->id)) {
			return View('la.tasks.index', [
				'statuses_data' => $statuses_data,
				'units' => $units,
				'show_actions' => $this->show_action,
				'listing_cols' => $this->listing_cols,
				'module' => $module
			]);
		} else {
            return redirect(config('laraadmin.adminRoute')."/");
        }
	}

	/**
	 * Show the form for creating a new task.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created task in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		if(Module::hasAccess("Tasks", "create")) {
		
			$rules = Module::validateRules("Tasks", $request);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();
			}
			
			$insert_id = Module::insert("Tasks", $request);
			$date=date('Y-m-d h:i:s');

        	foreach ($request->assign_to as $key => $user_id) {
        		DB::insert('insert into task_assigns (task_id,user_id,created_at,updated_at) values(?,?,?,?)',[$insert_id,$user_id,$date,$date]);

        	}
			return redirect()->route(config('laraadmin.adminRoute') . '.tasks.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Display the specified task.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		if(Module::hasAccess("Tasks", "view")) {
			
			$task = Task::find($id);
			if(isset($task->id)) {
				$module = Module::get('Tasks');
				$module->row = $task;
				
				return view('la.tasks.show', [
					'module' => $module,
					'view_col' => $this->view_col,
					'no_header' => true,
					'no_padding' => "no-padding"
				])->with('task', $task);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("task"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Show the form for editing the specified task.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		if(Module::hasAccess("Tasks", "edit")) {			
			$task = Task::find($id);
			if(isset($task->id)) {	
				$module = Module::get('Tasks');
				$module->row = $task;
				$units_data = DB::table('units')->select('units.id','units.unit_name')
		    	->where('deleted_at', null)
		    	->where('enable', 'yes')
		    	->get();

		    	$dept_data = DB::table('department_masters')->select('department_masters.id','department_masters.dept_name')
		    	->where('deleted_at', null)
		    	->where('enable', 'yes')
		    	->where('unit_id', $task->unit_id)
		    	->get();
				
				return view('la.tasks.edit', [
					'units_data' => $units_data,
					'dept_data' => $dept_data,
					'module' => $module,
					'view_col' => $this->view_col,
				])->with('task', $task);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("task"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Update the specified task in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id)
	{
		if(Module::hasAccess("Tasks", "edit")) {
			
			$rules = Module::validateRules("Tasks", $request, true);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();;
			}
			
			$insert_id = Module::updateRow("Tasks", $request, $id);
			$date=date('Y-m-d h:i:s');
        	DB::table('task_assigns')->where('task_assigns.task_id',$id)->update(['deleted_at' =>$date ]);
        	/*$assign_arr = explode(',', $request->assign_to);*/
        	foreach ($request->assign_to as $key => $user_id) {
        		DB::insert('insert into task_assigns (task_id,user_id,created_at,updated_at) values(?,?,?,?)',[$insert_id,$user_id,$date,$date]);

        	}
			return redirect()->route(config('laraadmin.adminRoute') . '.tasks.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Remove the specified task from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		if(Module::hasAccess("Tasks", "delete")) {
			Task::find($id)->delete();
			
			// Redirecting to index() method
			return redirect()->route(config('laraadmin.adminRoute') . '.tasks.index');
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}
	
	/**
	 * Datatable Ajax fetch
	 *
	 * @return
	 */
	public function dtajax()
	{
		$values = DB::table('tasks')->select($this->listing_cols)->whereNull('deleted_at')->orderBy('id','desc');
		$out = Datatables::of($values)->make();
		$data = $out->getData();

		$fields_popup = ModuleFields::getModuleFields('Tasks');
		
		for($i=0; $i < count($data->data); $i++) {
			for ($j=0; $j < count($this->listing_cols); $j++) { 
				$col = $this->listing_cols[$j];
				if($fields_popup[$col] != null && starts_with($fields_popup[$col]->popup_vals, "@")) {
					$data->data[$i][$j] = ModuleFields::getFieldValue($fields_popup[$col], $data->data[$i][$j]);
				}
				if($col == $this->view_col) {
					$data->data[$i][$j] = '<a href="'.url(config('laraadmin.adminRoute') . '/tasks/'.$data->data[$i][0]).'">'.$data->data[$i][$j].'</a>';
				}
				// else if($col == "author") {
				//    $data->data[$i][$j];
				// }
			}
			
			if($this->show_action) {
				$output = '';
				if(Module::hasAccess("Tasks", "edit")) {
					$output .= '<a href="'.url(config('laraadmin.adminRoute') . '/tasks/'.$data->data[$i][0].'/edit').'" class="btn btn-warning btn-xs" style="display:inline;padding:2px 5px 3px 5px;"><i class="fa fa-edit"></i></a>';
				}
				
				if(Module::hasAccess("Tasks", "delete")) {
					$output .= Form::open(['route' => [config('laraadmin.adminRoute') . '.tasks.destroy', $data->data[$i][0]], 'method' => 'delete', 'style'=>'display:inline']);
					$output .= ' <button class="btn btn-danger btn-xs" type="submit"><i class="fa fa-times"></i></button>';
					$output .= Form::close();
				}
				$data->data[$i][] = (string)$output;
			}
		}
		$out->setData($data);
		return $out;
	}
}
