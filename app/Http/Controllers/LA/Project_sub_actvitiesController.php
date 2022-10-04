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

use App\Models\Project_sub_actvity;

class Project_sub_actvitiesController extends Controller
{
	public $show_action = true;
	public $view_col = 'major_activity_id';
	public $listing_cols = ['id', 'responsibility', 'major_activity_id', 'sub_activity_name', 'sb_actvity_strt_date', 'sb_actvity_end_date', 'project_id', 'sub_activity_sr_no'];
	
	public function __construct() {
		// Field Access of Listing Columns
		if(\Dwij\Laraadmin\Helpers\LAHelper::laravel_ver() == 5.3) {
			$this->middleware(function ($request, $next) {
				$this->listing_cols = ModuleFields::listingColumnAccessScan('Project_sub_actvities', $this->listing_cols);
				return $next($request);
			});
		} else {
			$this->listing_cols = ModuleFields::listingColumnAccessScan('Project_sub_actvities', $this->listing_cols);
		}
	}
	
	/**
	 * Display a listing of the Project_sub_actvities.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		$module = Module::get('Project_sub_actvities');
		
		if(Module::hasAccess($module->id)) {
			return View('la.project_sub_actvities.index', [
				'show_actions' => $this->show_action,
				'listing_cols' => $this->listing_cols,
				'module' => $module
			]);
		} else {
            return redirect(config('laraadmin.adminRoute')."/");
        }
	}

	/**
	 * Show the form for creating a new project_sub_actvity.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created project_sub_actvity in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		if(Module::hasAccess("Project_sub_actvities", "create")) {
		
			$rules = Module::validateRules("Project_sub_actvities", $request);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();
			}
			
			$insert_id = Module::insert("Project_sub_actvities", $request);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.project_sub_actvities.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Display the specified project_sub_actvity.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		if(Module::hasAccess("Project_sub_actvities", "view")) {
			
			$project_sub_actvity = Project_sub_actvity::find($id);
			if(isset($project_sub_actvity->id)) {
				$module = Module::get('Project_sub_actvities');
				$module->row = $project_sub_actvity;
				
				return view('la.project_sub_actvities.show', [
					'module' => $module,
					'view_col' => $this->view_col,
					'no_header' => true,
					'no_padding' => "no-padding"
				])->with('project_sub_actvity', $project_sub_actvity);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("project_sub_actvity"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Show the form for editing the specified project_sub_actvity.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		if(Module::hasAccess("Project_sub_actvities", "edit")) {			
			$project_sub_actvity = Project_sub_actvity::find($id);
			if(isset($project_sub_actvity->id)) {	
				$module = Module::get('Project_sub_actvities');
				
				$module->row = $project_sub_actvity;
				
				return view('la.project_sub_actvities.edit', [
					'module' => $module,
					'view_col' => $this->view_col,
				])->with('project_sub_actvity', $project_sub_actvity);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("project_sub_actvity"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Update the specified project_sub_actvity in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id)
	{
		if(Module::hasAccess("Project_sub_actvities", "edit")) {
			
			$rules = Module::validateRules("Project_sub_actvities", $request, true);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();;
			}
			
			$insert_id = Module::updateRow("Project_sub_actvities", $request, $id);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.project_sub_actvities.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Remove the specified project_sub_actvity from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		if(Module::hasAccess("Project_sub_actvities", "delete")) {
			Project_sub_actvity::find($id)->delete();
			
			// Redirecting to index() method
			return redirect()->route(config('laraadmin.adminRoute') . '.project_sub_actvities.index');
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
		$values = DB::table('project_sub_actvities')->select($this->listing_cols)->whereNull('deleted_at');
		$out = Datatables::of($values)->make();
		$data = $out->getData();

		$fields_popup = ModuleFields::getModuleFields('Project_sub_actvities');
		
		for($i=0; $i < count($data->data); $i++) {
			for ($j=0; $j < count($this->listing_cols); $j++) { 
				$col = $this->listing_cols[$j];
				if($fields_popup[$col] != null && starts_with($fields_popup[$col]->popup_vals, "@")) {
					$data->data[$i][$j] = ModuleFields::getFieldValue($fields_popup[$col], $data->data[$i][$j]);
				}
				if($col == $this->view_col) {
					$data->data[$i][$j] = '<a href="'.url(config('laraadmin.adminRoute') . '/project_sub_actvities/'.$data->data[$i][0]).'">'.$data->data[$i][$j].'</a>';
				}
				// else if($col == "author") {
				//    $data->data[$i][$j];
				// }
			}
			
			if($this->show_action) {
				$output = '';
				if(Module::hasAccess("Project_sub_actvities", "edit")) {
					$output .= '<a href="'.url(config('laraadmin.adminRoute') . '/project_sub_actvities/'.$data->data[$i][0].'/edit').'" class="btn btn-warning btn-xs" style="display:inline;padding:2px 5px 3px 5px;"><i class="fa fa-edit"></i></a>';
				}
				
				if(Module::hasAccess("Project_sub_actvities", "delete")) {
					$output .= Form::open(['route' => [config('laraadmin.adminRoute') . '.project_sub_actvities.destroy', $data->data[$i][0]], 'method' => 'delete', 'style'=>'display:inline']);
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
