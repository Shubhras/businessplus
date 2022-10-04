<?php

/**
 * Controller genrated using LaraAdmin
 * Help: http://laraadmin.com
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\Http\Controllers\Controller;
use Auth;


/**
 * Class HomeController
 * @package App\Http\Controllers
 */
class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
    }
    /**
     * Show the application common element over the site.
     *
     * @return Response
     */
    public function common()
    {
        $id = @Auth::user()->id;
        $data['statuses']  = DB::table('statuses')->where('deleted_at', NULL)->get();
        return $data;

        return $data;
    }

    /**
     * Show the application dashboard.
     *
     * @return Response
     */
    public function index()
    {
        $data = $this->common();
        $roleCount = \App\Role::count();
        if ($roleCount != 0) {
            if ($roleCount != 0) {
                return view('home', $data);
            }
        } else {
            return view('errors.error', [
                'title' => 'Migration not completed',
                'message' => 'Please run command <code>php artisan db:seed</code> to generate required table data.',
            ]);
        }
    }
}
