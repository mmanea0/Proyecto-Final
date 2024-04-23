<?php

namespace App\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;
use SocialiteProviders\Discord\Provider;
use SocialiteProviders\Manager\SocialiteWasCalled;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(function (SocialiteWasCalled $event) {
            $event->extendSocialite('discord', Provider::class);
        });

        Passport::tokensExpireIn(now()->addDays(15));
        Passport::refreshTokensExpireIn(now()->addDays(30));
        Passport::personalAccessTokensExpireIn(now()->addMonths(6));


        Gate::define('admin-access', function ($user){
            return $user->hasRole('ROLE_ADMIN');
        });

        Gate::define('cliente-access', function ($user){
            return $user->hasRole('ROLE_USER') || $user->hasRole('ROLE_MODERADOR') || $user->hasRole('ROLE_ADMIN');
        });

        Gate::define('empleado-access', function ($user){
            return $user->hasRole('ROLE_MODERADOR') || $user->hasRole('ROLE_ADMIN');
        });
    }
}
