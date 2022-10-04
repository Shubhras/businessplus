<?php

namespace App\Http\Controllers;

use File;


ini_set('upload_max_filesize', '15M');
ini_set('post_max_size', '40M');

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesResources;
use Dwij\Laraadmin\Models\Module;
use stdClass;
use Carbon\Carbon;
use App\Models\Company_profile;
use App\Models\Company_setting;
use App\Models\Department_master;
use App\Models\Unit;
use App\Models\Action_plan;
use PhpParser\Node\Expr\Cast\Int_;
use PhpParser\Node\Expr\Cast\String_;
use Mail;

class Controller extends BaseController
{
    use AuthorizesRequests, AuthorizesResources, DispatchesJobs, ValidatesRequests;

    /**
     * Create File Directory for Image Uploading
     * 
     */
    public function create_file_directory($path)
    {
        File::makeDirectory($path, 0777, true, true);
    }

    /**
     * Dcoad base64 image
     */

    public function decodeBase64($image)
    {
        $image_parts = explode(";base64,", $image);
        $image_type_aux = explode("image/", $image_parts[0]);
        $image_type = $image_type_aux[1];
        $image_base64 = base64_decode($image_parts[1]);
        return [$image_type, $image_base64];
    }

    /**
     * upload base 64 image
     * 
     */
    //upload base 64 image file
    public function fileupoload($image_path, $image_info_type, $ImageId)
    {

        $destination = $image_path;
        $image_info = $image_info_type;
        $file = $destination . uniqid() . '.' . $image_info[0];
        file_put_contents($file, $image_info[1]);
        $name = basename($file);
        $extension = $image_info[0];
        $path = $file;
        $public = 1;
        $string = "123456stringsawexs";
        $hash = str_shuffle($string);
        $img_data = new stdClass();
        $img_data->name = $name;
        $img_data->extension = $extension;
        $img_data->path = $path;
        $img_data->public = $public;
        $img_data->hash = $hash;

        if (!empty($ImageId)) {
            $image_id = Module::updateRow('Uploads', $img_data, $ImageId);
        } else {
            $image_id = Module::insert("uploads", $img_data);
        }

        return $image_id;
    }


    /**
     * Upload File
     */

    public function UploadFile($destination, $image_info, $file_id)
    {
        if (!File::isDirectory($destination)) {
            $this->create_file_directory($destination);
        }
        $FD = new stdClass();
        $FD->name = time() . $image_info->getClientOriginalName();
        $image_info->move($destination, $FD->name);
        $FD->extension = pathinfo($image_info, PATHINFO_EXTENSION);
        $FD->path = $destination . '/' . $FD->name;
        $FD->public  = 1;
        $FD->hash = uniqid();
        if (!empty($file_id)) {
            $image_id = Module::updateRow('Uploads', $FD, $file_id);
        } else {
            $image_id = Module::insert("uploads", $FD);
        }
        return $image_id;
    }

    /**
     * Sending mail
     * 
     * @param array $data 
     * @param array $to
     * @param string $file_path
     * 
     */
    public function sendMail(array $data,  array     $to, string $file_path, $cc, $bcc = Null, $subject = Null)
    {
        if (!empty($cc)) {
            $cc = $cc;
        }
        if (!empty($bcc)) {
            $bcc = $bcc;
        }
        if (!empty($subject)) {
            $subject = $subject;
        }
        if (env('MAIL_USERNAME') != null && env('MAIL_USERNAME') != "null" && env('MAIL_USERNAME') != "") {
            Mail::send($file_path, $data, function ($m) use ($to, $cc, $subject) {
                $m->from(env('MAIL_USERNAME'), 'PrimaPlus');
                $m->to($to, 'Dept Admin')->subject($subject);
                $m->cc($cc, 'Admin')->subject($subject);
            });
        }
    }


    /**
     * make start  date and  end acc. to financial year
     * 
     * @property String $fyear
     */

    public function getFinancialDate(String $fyear,$year)
    {
        
        if ($fyear == 'april-march') {
            $start_date = Carbon::create($year, 04)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($year + 1, 03)->lastOfMonth()->format('Y-m-d');
        } else {
            $start_date = Carbon::create($year, 01)->startOfMonth()->format('Y-m-d');
            $end_date = Carbon::create($year, 12)->lastOfMonth()->format('Y-m-d');
        }
        return ['start_date' => $start_date, 'end_date' => $end_date];
    }


    /**
     * Get Company Data 
     * @param int  $company_id
     */
    public function getCompanyData(int $company_id = Null)
    {
        if (!empty($company_id)) {
            //get data through the company id
            $Company_data = Company_profile::where('id', $company_id)->get()->toarray();
        } else {
            //get all company data
            $Company_data = Company_profile::get()->toarray();
        }

        return $Company_data;
    }

    /***
     * Get Company Setting Data
     * 
     * 
     */

    public function getCompanySetting(Int $Company_id)
    {
        $Company_setting = Company_setting::where('company_id', $Company_id)->get()->toarray();

        return $Company_setting;
    }
    /**
     * Get Unit Data By Comapany Id
     */

    public function getUnitData(Int $Company_id)
    {
        $unit_data = Unit::where('company_id', $Company_id)->get()->toarray();
        return $unit_data;
    }

    /**
     * Get Dept Data Unit Wise and Company Wise
     */
    public function GetDeptData($dept_id, Int $unit_id, Int $company_id)
    {
        
        $dept_data = Department_master::where('unit_id', $unit_id)->whereIn('id', $dept_id)->where('company_id', $company_id)->get()->toarray();
        
        return $dept_data;
    }
    //  Get Action Data Unit Wise
    // public function getActionPlanData(Int $unit_id)
    // {
    //     $Action_data = Action_plan::where('unit_id', $unit_id)->get()->toarray();

    //     return $Action_data;
    // }

    /* default User define Actuals */

    public function defaultActuals($targetYear)
    {
        $totalActuals = ['jan' => NULL, 'feb' => NULL, 'mar' => NULL, 'apr' => NULL, 'may' => NULL, 'jun' => NULL, 'jul' => NULL, 'aug' => NULL, 'sep' => NULL, 'oct' => NULL, 'nov' => NULL, 'dec' => NULL, 'ytd' => 0.0, 'actual_year' => $targetYear];
        return $totalActuals;
    }
}
