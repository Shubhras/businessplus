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

use App\Models\Action_plan_schedule;

class Action_plan_schedulesController extends Controller
{
	public $show_action = true;
	public $view_col = 'action_plan_id';
	public $listing_cols = ['id', 'comment', 'implement_data', 'recovery_plan', 'responsibility', 'action_plan_id', 'month_date', 'owner_id', 'status'];
	
	public function __construct() {
		// Field Access of Listing Columns
		if(\Dwij\Laraadmin\Helpers\LAHelper::laravel_ver() == 5.3) {
			$this->middleware(function ($request, $next) {
				$this->listing_cols = ModuleFields::listingColumnAccessScan('Action_plan_schedules', $this->listing_cols);
				return $next($request);
			});
		} else {
			$this->listing_cols = ModuleFields::listingColumnAccessScan('Action_plan_schedules', $this->listing_cols);
		}
	}
	
	/**
	 * Display a listing of the Action_plan_schedules.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		$module = Module::get('Action_plan_schedules');
		
		if(Module::hasAccess($module->id)) {
			return View('la.action_plan_schedules.index', [
				'show_actions' => $this->show_action,
				'listing_cols' => $this->listing_cols,
				'module' => $module
			]);
		} else {
            return redirect(config('laraadmin.adminRoute')."/");
        }
	}

	/**
	 * Show the form for creating a new action_plan_schedule.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created action_plan_schedule in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		if(Module::hasAccess("Action_plan_schedules", "create")) {
		
			$rules = Module::validateRules("Action_plan_schedules", $request);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();
			}
			
			$insert_id = Module::insert("Action_plan_schedules", $request);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.action_plan_schedules.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Display the specified action_plan_schedule.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		if(Module::hasAccess("Action_plan_schedules", "view")) {
			
			$action_plan_schedule = Action_plan_schedule::find($id);
			if(isset($action_plan_schedule->id)) {
				$module = Module::get('Action_plan_schedules');
				$module->row = $action_plan_schedule;
				
				return view('la.action_plan_schedules.show', [
					'module' => $module,
					'view_col' => $this->view_col,
					'no_header' => true,
					'no_padding' => "no-padding"
				])->with('action_plan_schedule', $action_plan_schedule);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("action_plan_schedule"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Show the form for editing the specified action_plan_schedule.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		if(Module::hasAccess("Action_plan_schedules", "edit")) {			
			$action_plan_schedule = Action_plan_schedule::find($id);
			if(isset($action_plan_schedule->id)) {	
				$module = Module::get('Action_plan_schedules');
				
				$module->row = $action_plan_schedule;
				
				return view('la.action_plan_schedules.edit', [
					'module' => $module,
					'view_col' => $this->view_col,
				])->with('action_plan_schedule', $action_plan_schedule);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("action_plan_schedule"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Update the specified action_plan_schedule in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id)
	{
		if(Module::hasAccess("Action_plan_schedules", "edit")) {
			
			$rules = Module::validateRules("Action_plan_schedules", $request, true);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();;
			}
			
			$insert_id = Module::updateRow("Action_plan_schedules", $request, $id);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.action_plan_schedules.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Remove the specified action_plan_schedule from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		if(Module::hasAccess("Action_plan_schedules", "delete")) {
			Action_plan_schedule::find($id)->delete();
			
			// Redirecting to index() method
			return redirect()->route(config('laraadmin.adminRoute') . '.action_plan_schedules.index');
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
		$values = DB::table('action_plan_schedules')->select($this->listing_cols)->whereNull('deleted_at');
		$out = Datatables::of($values)->make();
		$data = $out->getData();

		$fields_popup = ModuleFields::getModuleFields('Action_plan_schedules');
		
		for($i=0; $i < count($data->data); $i++) {
			for ($j=0; $j < count($this->listing_cols); $j++) { 
				$col = $this->listing_cols[$j];
				if($fields_popup[$col] != null && starts_with($fields_popup[$col]->popup_vals, "@")) {
					$data->data[$i][$j] = ModuleFields::getFieldValue($fields_popup[$col], $data->data[$i][$j]);
				}
				if($col == $this->view_col) {
					$data->data[$i][$j] = '<a href="'.url(config('laraadmin.adminRoute') . '/action_plan_schedules/'.$data->data[$i][0]).'">'.$data->data[$i][$j].'</a>';
				}
				// else if($col == "author") {
				//    $data->data[$i][$j];
				// }
			}
			
			if($this->show_action) {
				$output = '';
				if(Module::hasAccess("Action_plan_schedules", "edit")) {
					$output .= '<a href="'.url(config('laraadmin.adminRoute') . '/action_plan_schedules/'.$data->data[$i][0].'/edit').'" class="btn btn-warning btn-xs" style="display:inline;padding:2px 5px 3px 5px;"><i class="fa fa-edit"></i></a>';
				}
				
				if(Module::hasAccess("Action_plan_schedules", "delete")) {
					$output .= Form::open(['route' => [config('laraadmin.adminRoute') . '.action_plan_schedules.destroy', $data->data[$i][0]], 'method' => 'delete', 'style'=>'display:inline']);
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
