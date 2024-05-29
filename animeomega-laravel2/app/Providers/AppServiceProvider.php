<?php

namespace App\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
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
            $event->extendSocialite('discord', \SocialiteProviders\Discord\Provider::class);
        });


        Gate::define('admin-access', function ($user){
            return $user->hasRole('Administrador');
        });

        Gate::define('usuario-access', function ($user){
            return $user->hasRole('Usuario');
        });

        Gate::define('moderador-access', function ($user){
            return $user->hasRole('Moderador');
        });

    }
}
