<?php
/**
 * Controller genrated using LaraAdmin
 * Help: http://laraadmin.com
 */

namespace App\Http\Controllers\LA;

use App\Http\Controllers\Controller;
use App\Http\Requests;
use Illuminate\Http\Request;
use DB;

/**
 * Class DashboardController
 * @package App\Http\Controllers
 */
class DashboardController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return Response
     */
    public function index()
    {
        $data['total_project']  = DB::table('projects')->where('deleted_at', NULL)->count();
        $data['total_project_complete']  = DB::table('projects')->where('status_id', 3)->count();
        $data['total_task']  = DB::table('tasks')->where('deleted_at', NULL)->count();
        $data['total_task_complete']  = DB::table('tasks')->where('status_id', 3)->count();
        return view('la.dashboard',$data);
    }
}