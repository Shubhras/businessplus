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

use App\Models\Kpi_actionplan_rel;

class Kpi_actionplan_relsController extends Controller
{
	public $show_action = true;
	public $view_col = 'kpi_id';
	public $listing_cols = ['id', 'kpi_id', 'action_plan_id'];
	
	public function __construct() {
		// Field Access of Listing Columns
		if(\Dwij\Laraadmin\Helpers\LAHelper::laravel_ver() == 5.3) {
			$this->middleware(function ($request, $next) {
				$this->listing_cols = ModuleFields::listingColumnAccessScan('Kpi_actionplan_rels', $this->listing_cols);
				return $next($request);
			});
		} else {
			$this->listing_cols = ModuleFields::listingColumnAccessScan('Kpi_actionplan_rels', $this->listing_cols);
		}
	}
	
	/**
	 * Display a listing of the Kpi_actionplan_rels.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		$module = Module::get('Kpi_actionplan_rels');
		
		if(Module::hasAccess($module->id)) {
			return View('la.kpi_actionplan_rels.index', [
				'show_actions' => $this->show_action,
				'listing_cols' => $this->listing_cols,
				'module' => $module
			]);
		} else {
            return redirect(config('laraadmin.adminRoute')."/");
        }
	}

	/**
	 * Show the form for creating a new kpi_actionplan_rel.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created kpi_actionplan_rel in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		if(Module::hasAccess("Kpi_actionplan_rels", "create")) {
		
			$rules = Module::validateRules("Kpi_actionplan_rels", $request);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();
			}
			
			$insert_id = Module::insert("Kpi_actionplan_rels", $request);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.kpi_actionplan_rels.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Display the specified kpi_actionplan_rel.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		if(Module::hasAccess("Kpi_actionplan_rels", "view")) {
			
			$kpi_actionplan_rel = Kpi_actionplan_rel::find($id);
			if(isset($kpi_actionplan_rel->id)) {
				$module = Module::get('Kpi_actionplan_rels');
				$module->row = $kpi_actionplan_rel;
				
				return view('la.kpi_actionplan_rels.show', [
					'module' => $module,
					'view_col' => $this->view_col,
					'no_header' => true,
					'no_padding' => "no-padding"
				])->with('kpi_actionplan_rel', $kpi_actionplan_rel);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("kpi_actionplan_rel"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Show the form for editing the specified kpi_actionplan_rel.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		if(Module::hasAccess("Kpi_actionplan_rels", "edit")) {			
			$kpi_actionplan_rel = Kpi_actionplan_rel::find($id);
			if(isset($kpi_actionplan_rel->id)) {	
				$module = Module::get('Kpi_actionplan_rels');
				
				$module->row = $kpi_actionplan_rel;
				
				return view('la.kpi_actionplan_rels.edit', [
					'module' => $module,
					'view_col' => $this->view_col,
				])->with('kpi_actionplan_rel', $kpi_actionplan_rel);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("kpi_actionplan_rel"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Update the specified kpi_actionplan_rel in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id)
	{
		if(Module::hasAccess("Kpi_actionplan_rels", "edit")) {
			
			$rules = Module::validateRules("Kpi_actionplan_rels", $request, true);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();;
			}
			
			$insert_id = Module::updateRow("Kpi_actionplan_rels", $request, $id);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.kpi_actionplan_rels.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Remove the specified kpi_actionplan_rel from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		if(Module::hasAccess("Kpi_actionplan_rels", "delete")) {
			Kpi_actionplan_rel::find($id)->delete();
			
			// Redirecting to index() method
			return redirect()->route(config('laraadmin.adminRoute') . '.kpi_actionplan_rels.index');
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
		$values = DB::table('kpi_actionplan_rels')->select($this->listing_cols)->whereNull('deleted_at');
		$out = Datatables::of($values)->make();
		$data = $out->getData();

		$fields_popup = ModuleFields::getModuleFields('Kpi_actionplan_rels');
		
		for($i=0; $i < count($data->data); $i++) {
			for ($j=0; $j < count($this->listing_cols); $j++) { 
				$col = $this->listing_cols[$j];
				if($fields_popup[$col] != null && starts_with($fields_popup[$col]->popup_vals, "@")) {
					$data->data[$i][$j] = ModuleFields::getFieldValue($fields_popup[$col], $data->data[$i][$j]);
				}
				if($col == $this->view_col) {
					$data->data[$i][$j] = '<a href="'.url(config('laraadmin.adminRoute') . '/kpi_actionplan_rels/'.$data->data[$i][0]).'">'.$data->data[$i][$j].'</a>';
				}
				// else if($col == "author") {
				//    $data->data[$i][$j];
				// }
			}
			
			if($this->show_action) {
				$output = '';
				if(Module::hasAccess("Kpi_actionplan_rels", "edit")) {
					$output .= '<a href="'.url(config('laraadmin.adminRoute') . '/kpi_actionplan_rels/'.$data->data[$i][0].'/edit').'" class="btn btn-warning btn-xs" style="display:inline;padding:2px 5px 3px 5px;"><i class="fa fa-edit"></i></a>';
				}
				
				if(Module::hasAccess("Kpi_actionplan_rels", "delete")) {
					$output .= Form::open(['route' => [config('laraadmin.adminRoute') . '.kpi_actionplan_rels.destroy', $data->data[$i][0]], 'method' => 'delete', 'style'=>'display:inline']);
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