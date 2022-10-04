<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class headerset
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        
        return $next($request)->header('X-Powered-By', 'Digiprima')
                        ->header('Access-Control-Allow-Origin', '*')
                        ->header('Access-Control-Allow-Headers', 'Content-Type, x-xsrf-token, text/html, x_csrftoken')->header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS'); 
    }
}
