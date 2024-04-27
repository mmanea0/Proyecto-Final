<?php

namespace App\Traits;

use App\Models\Role;

trait RolesTrait
{

    //añade devuelve los nombre de los roles en una array
    public function roleNames()
    {
        return $this->roles->pluck('name')->toArray();
    }

    //devuelve tu si tiene el rol. Segun el nombre
    public function hasRole($roleName)
    {
        return $this->roles->contains('name', $roleName);
    }
   //Devuelve si tiene el rol. Segun el id
    public function hasRoleId($roleId)
    {
        return $this->roles->contains('id', $roleId);
    }
    //añade el rol segun el id
    public function addRoleId($roleId)
    {
        $this->roles()->attach($roleId);
    }
    //añade el rol segun el nombre
    public function addRole($roleName)
    {
        $role = Role::where('name', $roleName)->first();

        if ($role) {
            $this->roles()->attach($role->id);
        }
    }
    //elimina el rol segun el id
    public function removeRoleId($roleId)
    {
        $this->roles()->detach($roleId);
    }
    //elimina el rol segun el nombre
    public function removeRole($roleName)
    {
        $role = Role::where('name', $roleName)->first();

        if ($role) {
            $this->roles()->detach($role->id);
        }
    }
    //sincroniza* los roles

    //*añade los roles segun los ids del array y borra el resto
    public function syncRolesIds(array $roleIds)
    {
        $this->roles()->sync($roleIds);
    }
    //*añade los roles segun los nombres del array y borra el resto
    public function syncRoles(array $roleNames)
    {
        $rolesIds = [];

        foreach ($roleNames as $roleName) {
            $role = Role::where('name', $roleName)->first();

            if ($role) {
                $rolesIds[] = $role->id;
            }
        }
        $this->roles()->sync($rolesIds);
    }
}
