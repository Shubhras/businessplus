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

use App\Models\Strategic_obj_status;

class Strategic_obj_statusesController extends Controller
{
	public $show_action = true;
	public $view_col = 's_o_id';
	public $listing_cols = ['id', 's_o_id', 'status_id', 'percentage'];
	
	public function __construct() {
		// Field Access of Listing Columns
		if(\Dwij\Laraadmin\Helpers\LAHelper::laravel_ver() == 5.3) {
			$this->middleware(function ($request, $next) {
				$this->listing_cols = ModuleFields::listingColumnAccessScan('Strategic_obj_statuses', $this->listing_cols);
				return $next($request);
			});
		} else {
			$this->listing_cols = ModuleFields::listingColumnAccessScan('Strategic_obj_statuses', $this->listing_cols);
		}
	}
	
	/**
	 * Display a listing of the Strategic_obj_statuses.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		$module = Module::get('Strategic_obj_statuses');
		
		if(Module::hasAccess($module->id)) {
			return View('la.strategic_obj_statuses.index', [
				'show_actions' => $this->show_action,
				'listing_cols' => $this->listing_cols,
				'module' => $module
			]);
		} else {
            return redirect(config('laraadmin.adminRoute')."/");
        }
	}

	/**
	 * Show the form for creating a new strategic_obj_status.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created strategic_obj_status in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		if(Module::hasAccess("Strategic_obj_statuses", "create")) {
		
			$rules = Module::validateRules("Strategic_obj_statuses", $request);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();
			}
			
			$insert_id = Module::insert("Strategic_obj_statuses", $request);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.strategic_obj_statuses.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Display the specified strategic_obj_status.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		if(Module::hasAccess("Strategic_obj_statuses", "view")) {
			
			$strategic_obj_status = Strategic_obj_status::find($id);
			if(isset($strategic_obj_status->id)) {
				$module = Module::get('Strategic_obj_statuses');
				$module->row = $strategic_obj_status;
				
				return view('la.strategic_obj_statuses.show', [
					'module' => $module,
					'view_col' => $this->view_col,
					'no_header' => true,
					'no_padding' => "no-padding"
				])->with('strategic_obj_status', $strategic_obj_status);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("strategic_obj_status"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Show the form for editing the specified strategic_obj_status.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		if(Module::hasAccess("Strategic_obj_statuses", "edit")) {			
			$strategic_obj_status = Strategic_obj_status::find($id);
			if(isset($strategic_obj_status->id)) {	
				$module = Module::get('Strategic_obj_statuses');
				
				$module->row = $strategic_obj_status;
				
				return view('la.strategic_obj_statuses.edit', [
					'module' => $module,
					'view_col' => $this->view_col,
				])->with('strategic_obj_status', $strategic_obj_status);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("strategic_obj_status"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Update the specified strategic_obj_status in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id)
	{
		if(Module::hasAccess("Strategic_obj_statuses", "edit")) {
			
			$rules = Module::validateRules("Strategic_obj_statuses", $request, true);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();;
			}
			
			$insert_id = Module::updateRow("Strategic_obj_statuses", $request, $id);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.strategic_obj_statuses.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Remove the specified strategic_obj_status from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		if(Module::hasAccess("Strategic_obj_statuses", "delete")) {
			Strategic_obj_status::find($id)->delete();
			
			// Redirecting to index() method
			return redirect()->route(config('laraadmin.adminRoute') . '.strategic_obj_statuses.index');
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
		$values = DB::table('strategic_obj_statuses')->select($this->listing_cols)->whereNull('deleted_at');
		$out = Datatables::of($values)->make();
		$data = $out->getData();

		$fields_popup = ModuleFields::getModuleFields('Strategic_obj_statuses');
		
		for($i=0; $i < count($data->data); $i++) {
			for ($j=0; $j < count($this->listing_cols); $j++) { 
				$col = $this->listing_cols[$j];
				if($fields_popup[$col] != null && starts_with($fields_popup[$col]->popup_vals, "@")) {
					$data->data[$i][$j] = ModuleFields::getFieldValue($fields_popup[$col], $data->data[$i][$j]);
				}
				if($col == $this->view_col) {
					$data->data[$i][$j] = '<a href="'.url(config('laraadmin.adminRoute') . '/strategic_obj_statuses/'.$data->data[$i][0]).'">'.$data->data[$i][$j].'</a>';
				}
				// else if($col == "author") {
				//    $data->data[$i][$j];
				// }
			}
			
			if($this->show_action) {
				$output = '';
				if(Module::hasAccess("Strategic_obj_statuses", "edit")) {
					$output .= '<a href="'.url(config('laraadmin.adminRoute') . '/strategic_obj_statuses/'.$data->data[$i][0].'/edit').'" class="btn btn-warning btn-xs" style="display:inline;padding:2px 5px 3px 5px;"><i class="fa fa-edit"></i></a>';
				}
				
				if(Module::hasAccess("Strategic_obj_statuses", "delete")) {
					$output .= Form::open(['route' => [config('laraadmin.adminRoute') . '.strategic_obj_statuses.destroy', $data->data[$i][0]], 'method' => 'delete', 'style'=>'display:inline']);
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
