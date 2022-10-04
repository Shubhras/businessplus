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

use App\Models\Prima_pluse_nav;

class Prima_pluse_navsController extends Controller
{
	public $show_action = true;
	public $view_col = 'test_prima';
	public $listing_cols = ['id', 'test_prima'];
	
	public function __construct() {
		// Field Access of Listing Columns
		if(\Dwij\Laraadmin\Helpers\LAHelper::laravel_ver() == 5.3) {
			$this->middleware(function ($request, $next) {
				$this->listing_cols = ModuleFields::listingColumnAccessScan('Prima_pluse_navs', $this->listing_cols);
				return $next($request);
			});
		} else {
			$this->listing_cols = ModuleFields::listingColumnAccessScan('Prima_pluse_navs', $this->listing_cols);
		}
	}
	
	/**
	 * Display a listing of the Prima_pluse_navs.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		$module = Module::get('Prima_pluse_navs');
		
		if(Module::hasAccess($module->id)) {
			return View('la.prima_pluse_navs.index', [
				'show_actions' => $this->show_action,
				'listing_cols' => $this->listing_cols,
				'module' => $module
			]);
		} else {
            return redirect(config('laraadmin.adminRoute')."/");
        }
	}

	/**
	 * Show the form for creating a new prima_pluse_nav.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created prima_pluse_nav in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		if(Module::hasAccess("Prima_pluse_navs", "create")) {
		
			$rules = Module::validateRules("Prima_pluse_navs", $request);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();
			}
			
			$insert_id = Module::insert("Prima_pluse_navs", $request);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.prima_pluse_navs.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Display the specified prima_pluse_nav.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		if(Module::hasAccess("Prima_pluse_navs", "view")) {
			
			$prima_pluse_nav = Prima_pluse_nav::find($id);
			if(isset($prima_pluse_nav->id)) {
				$module = Module::get('Prima_pluse_navs');
				$module->row = $prima_pluse_nav;
				
				return view('la.prima_pluse_navs.show', [
					'module' => $module,
					'view_col' => $this->view_col,
					'no_header' => true,
					'no_padding' => "no-padding"
				])->with('prima_pluse_nav', $prima_pluse_nav);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("prima_pluse_nav"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Show the form for editing the specified prima_pluse_nav.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		if(Module::hasAccess("Prima_pluse_navs", "edit")) {			
			$prima_pluse_nav = Prima_pluse_nav::find($id);
			if(isset($prima_pluse_nav->id)) {	
				$module = Module::get('Prima_pluse_navs');
				
				$module->row = $prima_pluse_nav;
				
				return view('la.prima_pluse_navs.edit', [
					'module' => $module,
					'view_col' => $this->view_col,
				])->with('prima_pluse_nav', $prima_pluse_nav);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("prima_pluse_nav"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Update the specified prima_pluse_nav in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id)
	{
		if(Module::hasAccess("Prima_pluse_navs", "edit")) {
			
			$rules = Module::validateRules("Prima_pluse_navs", $request, true);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();;
			}
			
			$insert_id = Module::updateRow("Prima_pluse_navs", $request, $id);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.prima_pluse_navs.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Remove the specified prima_pluse_nav from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		if(Module::hasAccess("Prima_pluse_navs", "delete")) {
			Prima_pluse_nav::find($id)->delete();
			
			// Redirecting to index() method
			return redirect()->route(config('laraadmin.adminRoute') . '.prima_pluse_navs.index');
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
		$values = DB::table('prima_pluse_navs')->select($this->listing_cols)->whereNull('deleted_at');
		$out = Datatables::of($values)->make();
		$data = $out->getData();

		$fields_popup = ModuleFields::getModuleFields('Prima_pluse_navs');
		
		for($i=0; $i < count($data->data); $i++) {
			for ($j=0; $j < count($this->listing_cols); $j++) { 
				$col = $this->listing_cols[$j];
				if($fields_popup[$col] != null && starts_with($fields_popup[$col]->popup_vals, "@")) {
					$data->data[$i][$j] = ModuleFields::getFieldValue($fields_popup[$col], $data->data[$i][$j]);
				}
				if($col == $this->view_col) {
					$data->data[$i][$j] = '<a href="'.url(config('laraadmin.adminRoute') . '/prima_pluse_navs/'.$data->data[$i][0]).'">'.$data->data[$i][$j].'</a>';
				}
				// else if($col == "author") {
				//    $data->data[$i][$j];
				// }
			}
			
			if($this->show_action) {
				$output = '';
				if(Module::hasAccess("Prima_pluse_navs", "edit")) {
					$output .= '<a href="'.url(config('laraadmin.adminRoute') . '/prima_pluse_navs/'.$data->data[$i][0].'/edit').'" class="btn btn-warning btn-xs" style="display:inline;padding:2px 5px 3px 5px;"><i class="fa fa-edit"></i></a>';
				}
				
				if(Module::hasAccess("Prima_pluse_navs", "delete")) {
					$output .= Form::open(['route' => [config('laraadmin.adminRoute') . '.prima_pluse_navs.destroy', $data->data[$i][0]], 'method' => 'delete', 'style'=>'display:inline']);
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
