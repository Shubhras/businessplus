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

use App\Models\Project_risk_as_log;

class Project_risk_as_logsController extends Controller
{
	public $show_action = true;
	public $view_col = 'risk_item';
	public $listing_cols = ['id', 'risk_item', 'risk_time_required', 'risk_level', 'risk_responsibility', 'risk_mtiqation_plan', 'project_id'];
	
	public function __construct() {
		// Field Access of Listing Columns
		if(\Dwij\Laraadmin\Helpers\LAHelper::laravel_ver() == 5.3) {
			$this->middleware(function ($request, $next) {
				$this->listing_cols = ModuleFields::listingColumnAccessScan('Project_risk_as_logs', $this->listing_cols);
				return $next($request);
			});
		} else {
			$this->listing_cols = ModuleFields::listingColumnAccessScan('Project_risk_as_logs', $this->listing_cols);
		}
	}
	
	/**
	 * Display a listing of the Project_risk_as_logs.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		$module = Module::get('Project_risk_as_logs');
		
		if(Module::hasAccess($module->id)) {
			return View('la.project_risk_as_logs.index', [
				'show_actions' => $this->show_action,
				'listing_cols' => $this->listing_cols,
				'module' => $module
			]);
		} else {
            return redirect(config('laraadmin.adminRoute')."/");
        }
	}

	/**
	 * Show the form for creating a new project_risk_as_log.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created project_risk_as_log in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		if(Module::hasAccess("Project_risk_as_logs", "create")) {
		
			$rules = Module::validateRules("Project_risk_as_logs", $request);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();
			}
			
			$insert_id = Module::insert("Project_risk_as_logs", $request);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.project_risk_as_logs.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Display the specified project_risk_as_log.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		if(Module::hasAccess("Project_risk_as_logs", "view")) {
			
			$project_risk_as_log = Project_risk_as_log::find($id);
			if(isset($project_risk_as_log->id)) {
				$module = Module::get('Project_risk_as_logs');
				$module->row = $project_risk_as_log;
				
				return view('la.project_risk_as_logs.show', [
					'module' => $module,
					'view_col' => $this->view_col,
					'no_header' => true,
					'no_padding' => "no-padding"
				])->with('project_risk_as_log', $project_risk_as_log);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("project_risk_as_log"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Show the form for editing the specified project_risk_as_log.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		if(Module::hasAccess("Project_risk_as_logs", "edit")) {			
			$project_risk_as_log = Project_risk_as_log::find($id);
			if(isset($project_risk_as_log->id)) {	
				$module = Module::get('Project_risk_as_logs');
				
				$module->row = $project_risk_as_log;
				
				return view('la.project_risk_as_logs.edit', [
					'module' => $module,
					'view_col' => $this->view_col,
				])->with('project_risk_as_log', $project_risk_as_log);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("project_risk_as_log"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Update the specified project_risk_as_log in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id)
	{
		if(Module::hasAccess("Project_risk_as_logs", "edit")) {
			
			$rules = Module::validateRules("Project_risk_as_logs", $request, true);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();;
			}
			
			$insert_id = Module::updateRow("Project_risk_as_logs", $request, $id);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.project_risk_as_logs.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Remove the specified project_risk_as_log from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		if(Module::hasAccess("Project_risk_as_logs", "delete")) {
			Project_risk_as_log::find($id)->delete();
			
			// Redirecting to index() method
			return redirect()->route(config('laraadmin.adminRoute') . '.project_risk_as_logs.index');
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
		$values = DB::table('project_risk_as_logs')->select($this->listing_cols)->whereNull('deleted_at');
		$out = Datatables::of($values)->make();
		$data = $out->getData();

		$fields_popup = ModuleFields::getModuleFields('Project_risk_as_logs');
		
		for($i=0; $i < count($data->data); $i++) {
			for ($j=0; $j < count($this->listing_cols); $j++) { 
				$col = $this->listing_cols[$j];
				if($fields_popup[$col] != null && starts_with($fields_popup[$col]->popup_vals, "@")) {
					$data->data[$i][$j] = ModuleFields::getFieldValue($fields_popup[$col], $data->data[$i][$j]);
				}
				if($col == $this->view_col) {
					$data->data[$i][$j] = '<a href="'.url(config('laraadmin.adminRoute') . '/project_risk_as_logs/'.$data->data[$i][0]).'">'.$data->data[$i][$j].'</a>';
				}
				// else if($col == "author") {
				//    $data->data[$i][$j];
				// }
			}
			
			if($this->show_action) {
				$output = '';
				if(Module::hasAccess("Project_risk_as_logs", "edit")) {
					$output .= '<a href="'.url(config('laraadmin.adminRoute') . '/project_risk_as_logs/'.$data->data[$i][0].'/edit').'" class="btn btn-warning btn-xs" style="display:inline;padding:2px 5px 3px 5px;"><i class="fa fa-edit"></i></a>';
				}
				
				if(Module::hasAccess("Project_risk_as_logs", "delete")) {
					$output .= Form::open(['route' => [config('laraadmin.adminRoute') . '.project_risk_as_logs.destroy', $data->data[$i][0]], 'method' => 'delete', 'style'=>'display:inline']);
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
