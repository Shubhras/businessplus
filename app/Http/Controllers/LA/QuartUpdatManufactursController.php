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

use App\Models\QuartUpdatManufactur;

class QuartUpdatManufactursController extends Controller
{
	public $show_action = true;
	public $view_col = 'highlight';
	public $listing_cols = ['id', 'highlight', 'majorgaps', 'challenges', 'priorities', 'photo', 'year', 'quarterly', 'dept_id', 'unit_id', 'remark'];
	
	public function __construct() {
		// Field Access of Listing Columns
		if(\Dwij\Laraadmin\Helpers\LAHelper::laravel_ver() == 5.3) {
			$this->middleware(function ($request, $next) {
				$this->listing_cols = ModuleFields::listingColumnAccessScan('QuartUpdatManufacturs', $this->listing_cols);
				return $next($request);
			});
		} else {
			$this->listing_cols = ModuleFields::listingColumnAccessScan('QuartUpdatManufacturs', $this->listing_cols);
		}
	}
	
	/**
	 * Display a listing of the QuartUpdatManufacturs.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		$module = Module::get('QuartUpdatManufacturs');
		
		if(Module::hasAccess($module->id)) {
			return View('la.quartupdatmanufacturs.index', [
				'show_actions' => $this->show_action,
				'listing_cols' => $this->listing_cols,
				'module' => $module
			]);
		} else {
            return redirect(config('laraadmin.adminRoute')."/");
        }
	}

	/**
	 * Show the form for creating a new quartupdatmanufactur.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created quartupdatmanufactur in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		if(Module::hasAccess("QuartUpdatManufacturs", "create")) {
		
			$rules = Module::validateRules("QuartUpdatManufacturs", $request);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();
			}
			
			$insert_id = Module::insert("QuartUpdatManufacturs", $request);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.quartupdatmanufacturs.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Display the specified quartupdatmanufactur.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		if(Module::hasAccess("QuartUpdatManufacturs", "view")) {
			
			$quartupdatmanufactur = QuartUpdatManufactur::find($id);
			if(isset($quartupdatmanufactur->id)) {
				$module = Module::get('QuartUpdatManufacturs');
				$module->row = $quartupdatmanufactur;
				
				return view('la.quartupdatmanufacturs.show', [
					'module' => $module,
					'view_col' => $this->view_col,
					'no_header' => true,
					'no_padding' => "no-padding"
				])->with('quartupdatmanufactur', $quartupdatmanufactur);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("quartupdatmanufactur"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Show the form for editing the specified quartupdatmanufactur.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		if(Module::hasAccess("QuartUpdatManufacturs", "edit")) {			
			$quartupdatmanufactur = QuartUpdatManufactur::find($id);
			if(isset($quartupdatmanufactur->id)) {	
				$module = Module::get('QuartUpdatManufacturs');
				
				$module->row = $quartupdatmanufactur;
				
				return view('la.quartupdatmanufacturs.edit', [
					'module' => $module,
					'view_col' => $this->view_col,
				])->with('quartupdatmanufactur', $quartupdatmanufactur);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("quartupdatmanufactur"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Update the specified quartupdatmanufactur in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id)
	{
		if(Module::hasAccess("QuartUpdatManufacturs", "edit")) {
			
			$rules = Module::validateRules("QuartUpdatManufacturs", $request, true);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();;
			}
			
			$insert_id = Module::updateRow("QuartUpdatManufacturs", $request, $id);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.quartupdatmanufacturs.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Remove the specified quartupdatmanufactur from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		if(Module::hasAccess("QuartUpdatManufacturs", "delete")) {
			QuartUpdatManufactur::find($id)->delete();
			
			// Redirecting to index() method
			return redirect()->route(config('laraadmin.adminRoute') . '.quartupdatmanufacturs.index');
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
		$values = DB::table('quartupdatmanufacturs')->select($this->listing_cols)->whereNull('deleted_at');
		$out = Datatables::of($values)->make();
		$data = $out->getData();

		$fields_popup = ModuleFields::getModuleFields('QuartUpdatManufacturs');
		
		for($i=0; $i < count($data->data); $i++) {
			for ($j=0; $j < count($this->listing_cols); $j++) { 
				$col = $this->listing_cols[$j];
				if($fields_popup[$col] != null && starts_with($fields_popup[$col]->popup_vals, "@")) {
					$data->data[$i][$j] = ModuleFields::getFieldValue($fields_popup[$col], $data->data[$i][$j]);
				}
				if($col == $this->view_col) {
					$data->data[$i][$j] = '<a href="'.url(config('laraadmin.adminRoute') . '/quartupdatmanufacturs/'.$data->data[$i][0]).'">'.$data->data[$i][$j].'</a>';
				}
				// else if($col == "author") {
				//    $data->data[$i][$j];
				// }
			}
			
			if($this->show_action) {
				$output = '';
				if(Module::hasAccess("QuartUpdatManufacturs", "edit")) {
					$output .= '<a href="'.url(config('laraadmin.adminRoute') . '/quartupdatmanufacturs/'.$data->data[$i][0].'/edit').'" class="btn btn-warning btn-xs" style="display:inline;padding:2px 5px 3px 5px;"><i class="fa fa-edit"></i></a>';
				}
				
				if(Module::hasAccess("QuartUpdatManufacturs", "delete")) {
					$output .= Form::open(['route' => [config('laraadmin.adminRoute') . '.quartupdatmanufacturs.destroy', $data->data[$i][0]], 'method' => 'delete', 'style'=>'display:inline']);
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
