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

use App\Models\Projct_extrnal_membr;

class Projct_extrnal_membrsController extends Controller
{
	public $show_action = true;
	public $view_col = 'ex_membar_name';
	public $listing_cols = ['id', 'project_id', 'ex_membar_name', 'department', 'email_id', 'phone_number', 'photo', 'company_name'];
	
	public function __construct() {
		// Field Access of Listing Columns
		if(\Dwij\Laraadmin\Helpers\LAHelper::laravel_ver() == 5.3) {
			$this->middleware(function ($request, $next) {
				$this->listing_cols = ModuleFields::listingColumnAccessScan('Projct_extrnal_membrs', $this->listing_cols);
				return $next($request);
			});
		} else {
			$this->listing_cols = ModuleFields::listingColumnAccessScan('Projct_extrnal_membrs', $this->listing_cols);
		}
	}
	
	/**
	 * Display a listing of the Projct_extrnal_membrs.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		$module = Module::get('Projct_extrnal_membrs');
		
		if(Module::hasAccess($module->id)) {
			return View('la.projct_extrnal_membrs.index', [
				'show_actions' => $this->show_action,
				'listing_cols' => $this->listing_cols,
				'module' => $module
			]);
		} else {
            return redirect(config('laraadmin.adminRoute')."/");
        }
	}

	/**
	 * Show the form for creating a new projct_extrnal_membr.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created projct_extrnal_membr in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		if(Module::hasAccess("Projct_extrnal_membrs", "create")) {
		
			$rules = Module::validateRules("Projct_extrnal_membrs", $request);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();
			}
			
			$insert_id = Module::insert("Projct_extrnal_membrs", $request);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.projct_extrnal_membrs.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Display the specified projct_extrnal_membr.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		if(Module::hasAccess("Projct_extrnal_membrs", "view")) {
			
			$projct_extrnal_membr = Projct_extrnal_membr::find($id);
			if(isset($projct_extrnal_membr->id)) {
				$module = Module::get('Projct_extrnal_membrs');
				$module->row = $projct_extrnal_membr;
				
				return view('la.projct_extrnal_membrs.show', [
					'module' => $module,
					'view_col' => $this->view_col,
					'no_header' => true,
					'no_padding' => "no-padding"
				])->with('projct_extrnal_membr', $projct_extrnal_membr);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("projct_extrnal_membr"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Show the form for editing the specified projct_extrnal_membr.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		if(Module::hasAccess("Projct_extrnal_membrs", "edit")) {			
			$projct_extrnal_membr = Projct_extrnal_membr::find($id);
			if(isset($projct_extrnal_membr->id)) {	
				$module = Module::get('Projct_extrnal_membrs');
				
				$module->row = $projct_extrnal_membr;
				
				return view('la.projct_extrnal_membrs.edit', [
					'module' => $module,
					'view_col' => $this->view_col,
				])->with('projct_extrnal_membr', $projct_extrnal_membr);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("projct_extrnal_membr"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Update the specified projct_extrnal_membr in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id)
	{
		if(Module::hasAccess("Projct_extrnal_membrs", "edit")) {
			
			$rules = Module::validateRules("Projct_extrnal_membrs", $request, true);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();;
			}
			
			$insert_id = Module::updateRow("Projct_extrnal_membrs", $request, $id);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.projct_extrnal_membrs.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Remove the specified projct_extrnal_membr from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		if(Module::hasAccess("Projct_extrnal_membrs", "delete")) {
			Projct_extrnal_membr::find($id)->delete();
			
			// Redirecting to index() method
			return redirect()->route(config('laraadmin.adminRoute') . '.projct_extrnal_membrs.index');
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
		$values = DB::table('projct_extrnal_membrs')->select($this->listing_cols)->whereNull('deleted_at');
		$out = Datatables::of($values)->make();
		$data = $out->getData();

		$fields_popup = ModuleFields::getModuleFields('Projct_extrnal_membrs');
		
		for($i=0; $i < count($data->data); $i++) {
			for ($j=0; $j < count($this->listing_cols); $j++) { 
				$col = $this->listing_cols[$j];
				if($fields_popup[$col] != null && starts_with($fields_popup[$col]->popup_vals, "@")) {
					$data->data[$i][$j] = ModuleFields::getFieldValue($fields_popup[$col], $data->data[$i][$j]);
				}
				if($col == $this->view_col) {
					$data->data[$i][$j] = '<a href="'.url(config('laraadmin.adminRoute') . '/projct_extrnal_membrs/'.$data->data[$i][0]).'">'.$data->data[$i][$j].'</a>';
				}
				// else if($col == "author") {
				//    $data->data[$i][$j];
				// }
			}
			
			if($this->show_action) {
				$output = '';
				if(Module::hasAccess("Projct_extrnal_membrs", "edit")) {
					$output .= '<a href="'.url(config('laraadmin.adminRoute') . '/projct_extrnal_membrs/'.$data->data[$i][0].'/edit').'" class="btn btn-warning btn-xs" style="display:inline;padding:2px 5px 3px 5px;"><i class="fa fa-edit"></i></a>';
				}
				
				if(Module::hasAccess("Projct_extrnal_membrs", "delete")) {
					$output .= Form::open(['route' => [config('laraadmin.adminRoute') . '.projct_extrnal_membrs.destroy', $data->data[$i][0]], 'method' => 'delete', 'style'=>'display:inline']);
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
