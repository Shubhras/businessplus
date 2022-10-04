<?php

namespace App\Http\Middleware;

use App\Models\Login_access_token;
use \Illuminate\Http\Response as Res;
use DB;

use Closure;

class CheckToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        $data['login_access_tokens_data'] = DB::table('login_access_tokens')->where('access_token', $request['login_access_token'])->get();
        if (empty($data['login_access_tokens_data'])) {
            $message = ["status" => "error", "status_code" => Res::HTTP_UNPROCESSABLE_ENTITY, "message" => "Token mismatch",];
            return response($message);
        }
        return $next($request);
    }
}
