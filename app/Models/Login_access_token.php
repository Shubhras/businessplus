<?php
/**
 * Model genrated using LaraAdmin
 * Help: http://laraadmin.com
 */

namespace App\Models;
use DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Login_access_token extends Model
{
    use SoftDeletes;
	
	protected $table = 'login_access_tokens';
	
	protected $hidden = [
        
    ];

	protected $guarded = [];

	protected $dates = ['deleted_at'];

	 public function access_token($login_access_token)
	{
	$tokenData =	DB::table('login_access_tokens')->where('access_token',$login_access_token)->first();
		return $tokenData;
	}
}
