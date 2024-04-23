<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $response = $next($request);
        $response->header('path','api/*');
        $response->header('Access-Control-Allow-Origin', '*');
        $response->header('Access-Control-Allow-Methods', '*');
        $response->header('Access-Control-Allow-Headers', '*');
        $response->header('Access-Control-Expose-Headers', '');
        $response->header('Access-Control-Max-Age', '0');
        $response->header('Access-Control-Allow-Credentials', 'false');
        return $next($request);
    }
}
