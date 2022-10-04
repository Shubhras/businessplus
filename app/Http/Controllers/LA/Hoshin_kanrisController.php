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

use App\Models\Hoshin_kanri;

class Hoshin_kanrisController extends Controller
{
	public $show_action = true;
	public $view_col = 'action_plan_id';
	public $listing_cols = ['id', 'dept_id', 'str_obj_id', 'initiatives_id', 'action_plan_id', 'kpi_id', 'area_manager', 'area_manager_value', 'area_manager_percent', 'dept_head', 'dept_head_value', 'dept_head_percent', 'section_head', 'section_head_value', 'section_head_percent', 'supervisor_head', 'superv_head_value', 'superv_head_percent', 'unit_id'];
	
	public function __construct() {
		// Field Access of Listing Columns
		if(\Dwij\Laraadmin\Helpers\LAHelper::laravel_ver() == 5.3) {
			$this->middleware(function ($request, $next) {
				$this->listing_cols = ModuleFields::listingColumnAccessScan('Hoshin_kanris', $this->listing_cols);
				return $next($request);
			});
		} else {
			$this->listing_cols = ModuleFields::listingColumnAccessScan('Hoshin_kanris', $this->listing_cols);
		}
	}
	
	/**
	 * Display a listing of the Hoshin_kanris.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		$module = Module::get('Hoshin_kanris');
		
		if(Module::hasAccess($module->id)) {
			return View('la.hoshin_kanris.index', [
				'show_actions' => $this->show_action,
				'listing_cols' => $this->listing_cols,
				'module' => $module
			]);
		} else {
            return redirect(config('laraadmin.adminRoute')."/");
        }
	}

	/**
	 * Show the form for creating a new hoshin_kanri.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created hoshin_kanri in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		if(Module::hasAccess("Hoshin_kanris", "create")) {
		
			$rules = Module::validateRules("Hoshin_kanris", $request);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();
			}
			
			$insert_id = Module::insert("Hoshin_kanris", $request);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.hoshin_kanris.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Display the specified hoshin_kanri.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		if(Module::hasAccess("Hoshin_kanris", "view")) {
			
			$hoshin_kanri = Hoshin_kanri::find($id);
			if(isset($hoshin_kanri->id)) {
				$module = Module::get('Hoshin_kanris');
				$module->row = $hoshin_kanri;
				
				return view('la.hoshin_kanris.show', [
					'module' => $module,
					'view_col' => $this->view_col,
					'no_header' => true,
					'no_padding' => "no-padding"
				])->with('hoshin_kanri', $hoshin_kanri);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("hoshin_kanri"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Show the form for editing the specified hoshin_kanri.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		if(Module::hasAccess("Hoshin_kanris", "edit")) {			
			$hoshin_kanri = Hoshin_kanri::find($id);
			if(isset($hoshin_kanri->id)) {	
				$module = Module::get('Hoshin_kanris');
				
				$module->row = $hoshin_kanri;
				
				return view('la.hoshin_kanris.edit', [
					'module' => $module,
					'view_col' => $this->view_col,
				])->with('hoshin_kanri', $hoshin_kanri);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("hoshin_kanri"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Update the specified hoshin_kanri in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id)
	{
		if(Module::hasAccess("Hoshin_kanris", "edit")) {
			
			$rules = Module::validateRules("Hoshin_kanris", $request, true);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();;
			}
			
			$insert_id = Module::updateRow("Hoshin_kanris", $request, $id);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.hoshin_kanris.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Remove the specified hoshin_kanri from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		if(Module::hasAccess("Hoshin_kanris", "delete")) {
			Hoshin_kanri::find($id)->delete();
			
			// Redirecting to index() method
			return redirect()->route(config('laraadmin.adminRoute') . '.hoshin_kanris.index');
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
		$values = DB::table('hoshin_kanris')->select($this->listing_cols)->whereNull('deleted_at');
		$out = Datatables::of($values)->make();
		$data = $out->getData();

		$fields_popup = ModuleFields::getModuleFields('Hoshin_kanris');
		
		for($i=0; $i < count($data->data); $i++) {
			for ($j=0; $j < count($this->listing_cols); $j++) { 
				$col = $this->listing_cols[$j];
				if($fields_popup[$col] != null && starts_with($fields_popup[$col]->popup_vals, "@")) {
					$data->data[$i][$j] = ModuleFields::getFieldValue($fields_popup[$col], $data->data[$i][$j]);
				}
				if($col == $this->view_col) {
					$data->data[$i][$j] = '<a href="'.url(config('laraadmin.adminRoute') . '/hoshin_kanris/'.$data->data[$i][0]).'">'.$data->data[$i][$j].'</a>';
				}
				// else if($col == "author") {
				//    $data->data[$i][$j];
				// }
			}
			
			if($this->show_action) {
				$output = '';
				if(Module::hasAccess("Hoshin_kanris", "edit")) {
					$output .= '<a href="'.url(config('laraadmin.adminRoute') . '/hoshin_kanris/'.$data->data[$i][0].'/edit').'" class="btn btn-warning btn-xs" style="display:inline;padding:2px 5px 3px 5px;"><i class="fa fa-edit"></i></a>';
				}
				
				if(Module::hasAccess("Hoshin_kanris", "delete")) {
					$output .= Form::open(['route' => [config('laraadmin.adminRoute') . '.hoshin_kanris.destroy', $data->data[$i][0]], 'method' => 'delete', 'style'=>'display:inline']);
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
