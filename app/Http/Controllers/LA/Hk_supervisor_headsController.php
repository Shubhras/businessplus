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

use App\Models\Hk_supervisor_head;

class Hk_supervisor_headsController extends Controller
{
	public $show_action = true;
	public $view_col = 'hoshin_kanri_id';
	public $listing_cols = ['id', 'hoshin_kanri_id', 'allocation_id', 'assign_user', 'value', 'percent'];
	
	public function __construct() {
		// Field Access of Listing Columns
		if(\Dwij\Laraadmin\Helpers\LAHelper::laravel_ver() == 5.3) {
			$this->middleware(function ($request, $next) {
				$this->listing_cols = ModuleFields::listingColumnAccessScan('Hk_supervisor_heads', $this->listing_cols);
				return $next($request);
			});
		} else {
			$this->listing_cols = ModuleFields::listingColumnAccessScan('Hk_supervisor_heads', $this->listing_cols);
		}
	}
	
	/**
	 * Display a listing of the Hk_supervisor_heads.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		$module = Module::get('Hk_supervisor_heads');
		
		if(Module::hasAccess($module->id)) {
			return View('la.hk_supervisor_heads.index', [
				'show_actions' => $this->show_action,
				'listing_cols' => $this->listing_cols,
				'module' => $module
			]);
		} else {
            return redirect(config('laraadmin.adminRoute')."/");
        }
	}

	/**
	 * Show the form for creating a new hk_supervisor_head.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created hk_supervisor_head in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		if(Module::hasAccess("Hk_supervisor_heads", "create")) {
		
			$rules = Module::validateRules("Hk_supervisor_heads", $request);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();
			}
			
			$insert_id = Module::insert("Hk_supervisor_heads", $request);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.hk_supervisor_heads.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Display the specified hk_supervisor_head.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		if(Module::hasAccess("Hk_supervisor_heads", "view")) {
			
			$hk_supervisor_head = Hk_supervisor_head::find($id);
			if(isset($hk_supervisor_head->id)) {
				$module = Module::get('Hk_supervisor_heads');
				$module->row = $hk_supervisor_head;
				
				return view('la.hk_supervisor_heads.show', [
					'module' => $module,
					'view_col' => $this->view_col,
					'no_header' => true,
					'no_padding' => "no-padding"
				])->with('hk_supervisor_head', $hk_supervisor_head);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("hk_supervisor_head"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Show the form for editing the specified hk_supervisor_head.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		if(Module::hasAccess("Hk_supervisor_heads", "edit")) {			
			$hk_supervisor_head = Hk_supervisor_head::find($id);
			if(isset($hk_supervisor_head->id)) {	
				$module = Module::get('Hk_supervisor_heads');
				
				$module->row = $hk_supervisor_head;
				
				return view('la.hk_supervisor_heads.edit', [
					'module' => $module,
					'view_col' => $this->view_col,
				])->with('hk_supervisor_head', $hk_supervisor_head);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("hk_supervisor_head"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Update the specified hk_supervisor_head in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id)
	{
		if(Module::hasAccess("Hk_supervisor_heads", "edit")) {
			
			$rules = Module::validateRules("Hk_supervisor_heads", $request, true);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();;
			}
			
			$insert_id = Module::updateRow("Hk_supervisor_heads", $request, $id);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.hk_supervisor_heads.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Remove the specified hk_supervisor_head from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		if(Module::hasAccess("Hk_supervisor_heads", "delete")) {
			Hk_supervisor_head::find($id)->delete();
			
			// Redirecting to index() method
			return redirect()->route(config('laraadmin.adminRoute') . '.hk_supervisor_heads.index');
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
		$values = DB::table('hk_supervisor_heads')->select($this->listing_cols)->whereNull('deleted_at');
		$out = Datatables::of($values)->make();
		$data = $out->getData();

		$fields_popup = ModuleFields::getModuleFields('Hk_supervisor_heads');
		
		for($i=0; $i < count($data->data); $i++) {
			for ($j=0; $j < count($this->listing_cols); $j++) { 
				$col = $this->listing_cols[$j];
				if($fields_popup[$col] != null && starts_with($fields_popup[$col]->popup_vals, "@")) {
					$data->data[$i][$j] = ModuleFields::getFieldValue($fields_popup[$col], $data->data[$i][$j]);
				}
				if($col == $this->view_col) {
					$data->data[$i][$j] = '<a href="'.url(config('laraadmin.adminRoute') . '/hk_supervisor_heads/'.$data->data[$i][0]).'">'.$data->data[$i][$j].'</a>';
				}
				// else if($col == "author") {
				//    $data->data[$i][$j];
				// }
			}
			
			if($this->show_action) {
				$output = '';
				if(Module::hasAccess("Hk_supervisor_heads", "edit")) {
					$output .= '<a href="'.url(config('laraadmin.adminRoute') . '/hk_supervisor_heads/'.$data->data[$i][0].'/edit').'" class="btn btn-warning btn-xs" style="display:inline;padding:2px 5px 3px 5px;"><i class="fa fa-edit"></i></a>';
				}
				
				if(Module::hasAccess("Hk_supervisor_heads", "delete")) {
					$output .= Form::open(['route' => [config('laraadmin.adminRoute') . '.hk_supervisor_heads.destroy', $data->data[$i][0]], 'method' => 'delete', 'style'=>'display:inline']);
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
