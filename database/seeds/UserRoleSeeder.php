<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Dwij\Laraadmin\Models\Module;


class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {  
         $cdate = date("Y-m-d h:s:i", time());
         DB::table('roles')->insert([
            ['id' => 2 , 'name' => 'Admin','display_name'=>'company_admin','description'=>'admin','parent'=>1,'dept'=>1,'created_at'=>$cdate,'updated_at'=>$cdate],
            ['id' => 3 , 'name' => 'MANAGER','display_name'=>'Top Management (L1)','description'=>'MANAGER','parent'=>1,'dept'=>1,'created_at'=>$cdate,'updated_at'=>$cdate],
            ['id' => 4 , 'name' => 'DEPARTMENT_HEAD','display_name'=>'Department Admin (L2)','description'=>'DEPARTMENT_HEAD','parent'=>1,'dept'=>1,'created_at'=>$cdate,'updated_at'=>$cdate],
            ['id' => 5 , 'name' => 'MANAGEMENT_TEAM','display_name'=>'Management Admin (L3)','description'=>'Senior Management personal','parent'=>1,'dept'=>1,'created_at'=>$cdate,'updated_at'=>$cdate],
            ['id' => 6 , 'name' => 'SECTION_HEAD','display_name'=>'Section Admin (L4)','description'=>'SECTION_HEAD','parent'=>1,'dept'=>1,'created_at'=>$cdate,'updated_at'=>$cdate],
            ['id' => 7 , 'name' => 'USER','display_name'=>'User','description'=>'USER','parent'=>1,'dept'=>1,'created_at'=>$cdate,'updated_at'=>$cdate],
            

            
        ]);
    }
}
