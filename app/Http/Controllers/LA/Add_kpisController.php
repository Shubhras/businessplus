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

use App\Models\Add_kpi;

class Add_kpisController extends Controller
{
	public $show_action = true;
	public $view_col = 'kpi_name';
	public $listing_cols = ['id', 'lead_kpi', 'start_date', 'end_date', 'frequency', 'kpi_performance', 's_o_id', 'initiatives_id', 'performance_dash', 'kpi_name', 'unit_id', 'department_id', 'target_condition', 'ideal_trend', 'kpi_type', 'unit_of_measurement', 'target_range_min', 'target_range_max', 'kpi_definition', 'user_id', 'section_id'];
	
	public function __construct() {
		// Field Access of Listing Columns
		if(\Dwij\Laraadmin\Helpers\LAHelper::laravel_ver() == 5.3) {
			$this->middleware(function ($request, $next) {
				$this->listing_cols = ModuleFields::listingColumnAccessScan('Add_kpis', $this->listing_cols);
				return $next($request);
			});
		} else {
			$this->listing_cols = ModuleFields::listingColumnAccessScan('Add_kpis', $this->listing_cols);
		}
	}
	
	/**
	 * Display a listing of the Add_kpis.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		$module = Module::get('Add_kpis');
		
		if(Module::hasAccess($module->id)) {
			return View('la.add_kpis.index', [
				'show_actions' => $this->show_action,
				'listing_cols' => $this->listing_cols,
				'module' => $module
			]);
		} else {
            return redirect(config('laraadmin.adminRoute')."/");
        }
	}

	/**
	 * Show the form for creating a new add_kpi.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created add_kpi in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		if(Module::hasAccess("Add_kpis", "create")) {
		
			$rules = Module::validateRules("Add_kpis", $request);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();
			}
			
			$insert_id = Module::insert("Add_kpis", $request);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.add_kpis.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Display the specified add_kpi.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		if(Module::hasAccess("Add_kpis", "view")) {
			
			$add_kpi = Add_kpi::find($id);
			if(isset($add_kpi->id)) {
				$module = Module::get('Add_kpis');
				$module->row = $add_kpi;
				
				return view('la.add_kpis.show', [
					'module' => $module,
					'view_col' => $this->view_col,
					'no_header' => true,
					'no_padding' => "no-padding"
				])->with('add_kpi', $add_kpi);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("add_kpi"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Show the form for editing the specified add_kpi.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		if(Module::hasAccess("Add_kpis", "edit")) {			
			$add_kpi = Add_kpi::find($id);
			if(isset($add_kpi->id)) {	
				$module = Module::get('Add_kpis');
				
				$module->row = $add_kpi;
				
				return view('la.add_kpis.edit', [
					'module' => $module,
					'view_col' => $this->view_col,
				])->with('add_kpi', $add_kpi);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("add_kpi"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Update the specified add_kpi in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id)
	{
		if(Module::hasAccess("Add_kpis", "edit")) {
			
			$rules = Module::validateRules("Add_kpis", $request, true);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();;
			}
			
			$insert_id = Module::updateRow("Add_kpis", $request, $id);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.add_kpis.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Remove the specified add_kpi from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		if(Module::hasAccess("Add_kpis", "delete")) {
			Add_kpi::find($id)->delete();
			
			// Redirecting to index() method
			return redirect()->route(config('laraadmin.adminRoute') . '.add_kpis.index');
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
		$values = DB::table('add_kpis')->select($this->listing_cols)->whereNull('deleted_at');
		$out = Datatables::of($values)->make();
		$data = $out->getData();

		$fields_popup = ModuleFields::getModuleFields('Add_kpis');
		
		for($i=0; $i < count($data->data); $i++) {
			for ($j=0; $j < count($this->listing_cols); $j++) { 
				$col = $this->listing_cols[$j];
				if($fields_popup[$col] != null && starts_with($fields_popup[$col]->popup_vals, "@")) {
					$data->data[$i][$j] = ModuleFields::getFieldValue($fields_popup[$col], $data->data[$i][$j]);
				}
				if($col == $this->view_col) {
					$data->data[$i][$j] = '<a href="'.url(config('laraadmin.adminRoute') . '/add_kpis/'.$data->data[$i][0]).'">'.$data->data[$i][$j].'</a>';
				}
				// else if($col == "author") {
				//    $data->data[$i][$j];
				// }
			}
			
			if($this->show_action) {
				$output = '';
				if(Module::hasAccess("Add_kpis", "edit")) {
					$output .= '<a href="'.url(config('laraadmin.adminRoute') . '/add_kpis/'.$data->data[$i][0].'/edit').'" class="btn btn-warning btn-xs" style="display:inline;padding:2px 5px 3px 5px;"><i class="fa fa-edit"></i></a>';
				}
				
				if(Module::hasAccess("Add_kpis", "delete")) {
					$output .= Form::open(['route' => [config('laraadmin.adminRoute') . '.add_kpis.destroy', $data->data[$i][0]], 'method' => 'delete', 'style'=>'display:inline']);
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
