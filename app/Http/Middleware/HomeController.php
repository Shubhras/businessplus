<?php

/**
 * Controller genrated using LaraAdmin
 * Help: http://laraadmin.com
 */

namespace App\Http\Controllers;

use \Input as Input;
use App\Http\Requests;
use Illuminate\Http\Request;
use DB;

use Session;
use App\Http\Controllers\Controller;
use Auth;
use Hash;
use Validator;
use Datatables;
use Collective\Html\FormFacade as Form;
use Dwij\Laraadmin\Models\Module;
use Dwij\Laraadmin\Models\ModuleFields;
use Excel;

use Mail;
//use Illuminate\Support\Facades\Storage;
use Storage;
use Carbon\Carbon;

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
	/* user login */
	public function userlogin(Request $request)
	{

		$email = $request->input('email');
		$password = $request->input('password');
		$role = $request->input('role_id');


		$users_context_id = DB::table('users')->where('email', $email)->first();

		if (!empty($users_context_id)) {
			$user_context_id = $users_context_id->context_id;

			$users_role = DB::table('role_user')->where('user_id', $user_context_id)->first();
			$user_role = $users_role->role_id;

			if ($role == $user_role) {
				$checkLogin = DB::table('users')->where(['email' => $email, 'password' => $password])->get();

				// Check validation
				if (auth()->attempt(['email' => $email, 'password' => $password])) {
					Session()->flash('jobseeker_succ_auth', 'welcome');
					return redirect()->back();
				} else {
					Session()->flash('loginerror', 'Your email and password not valid !');
				}
			} else {
				Session()->flash('loginerror', 'User not available');
			}
		} else {
			Session()->flash('loginerror', 'User not available');
		}
		return redirect()->back()->withInput();
	}

	/*user reset password form view*/
	public function changepassword()
	{
		$data = $this->common();

		$context_id = @Auth::user()->context_id;
		if (Auth::check()) {
			return view('header', $data) . view('changepassword', $data) . view('footer', $data);
		}
	}
	/*user reset password update*/
	public function update_changepassword(request $request)
	{
		if (!(Hash::check($request->get('current_password'), Auth::user()->password))) {
			// The passwords matches
			return redirect()->back()->with("error", "Your current password does not matches with the password you provided. Please try again.");
		}

		if (strcmp($request->get('current_password'), $request->get('new_password')) == 0) {
			//Current password and new password are same
			return redirect()->back()->with("error", "New Password cannot be same as your current password. Please choose a different password.");
		}

		$this->validate($request, [
			'new_password' => 'required|min:6|same:confirm_password',
			'confirm_password' => 'required',

		]);

		//Change Password
		$user = Auth::user();
		$user->password = bcrypt($request->get('new_password'));
		$user->save();

		return redirect()->back()->with("success", "Password changed successfully !");
	}

	/**
	 * Store a newly update jobseeker profile update in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function update_profile(Request $request)
	{
		$first_name = trim($request->input('first_name'));
		$mobile = trim($request->input('mobile'));
		$mobile2 = trim($request->input('mobile2'));
		$middle_name = trim($request->input('middle_name'));
		$last_name = trim($request->input('last_name'));
		$door_floatno = trim($request->input('door_floatno'));
		$road = trim($request->input('road'));
		$building_name = trim($request->input('building_name'));
		$locality_area = trim($request->input('locality_area'));
		$landmark = trim($request->input('landmark'));
		$zip_pin = trim($request->input('zip_pin'));
		$salary_cur = trim($request->input('salary_cur'));
		$expected_ctc = trim($request->input('expected_ctc'));
		$fixed = trim($request->input('fixed'));
		$variable = trim($request->input('variable'));
		$request->first_name = $first_name;
		$request->mobile = $mobile;
		$request->mobile2 = $mobile2;
		$request->middle_name = $middle_name;
		$request->last_name = $last_name;
		$request->door_floatno = $door_floatno;
		$request->road = $road;
		$request->building_name = $building_name;
		$request->locality_area = $locality_area;
		$request->landmark = $landmark;
		$request->zip_pin = $zip_pin;
		$request->salary_cur = $salary_cur;
		$request->expected_ctc = $expected_ctc;
		$request->fixed = $fixed;
		$request->variable = $variable;
		$context_id = @Auth::user()->context_id;
		$this->validate($request, [
			/*'first_name' => 'required|max:120',
	    	    	 'last_name' => 'required|max:120',*/
			'variable' => 'numeric',
			'fixed' => 'numeric',
			'mobile' => 'numeric',
			'mobile2' => 'numeric'
		]);
		/*echo "string";
		die;*/
		$expected_ctc = $request->input('expected_ctc');
		$salary_cur = $request->input('salary_cur');
		$variable = $request->input('variable');
		$fixed = $request->input('fixed');
		if ($variable == '') {
			$variable = 0;
		}
		if ($fixed == '') {
			$fixed = 0;
		}
		$total = $variable + $fixed;

		$data['personal_details'] = DB::table('employees')->where('id', $context_id)->get();

		foreach ($data['personal_details'] as $key => $users_id) {
			$user_confirm_id = $users_id->id;
		}

		if ($user_confirm_id == $context_id && Auth::check()) {
			$city_data = $request->input('city');
			$state_id = $request->input('state');
			$city_data_lower = strtolower($city_data);
			$city_acc_data = ucfirst($city_data_lower);
			$data['city_data'] = DB::table('cities')->where('name', $city_acc_data)->first();
			if (empty($data['city_data'])) {
				// $city_id = Module::insert("cities", $request);
				DB::insert('insert into cities (name,state_id) values(?,?)', [$city_acc_data, $state_id]);
				$data['city_data'] = DB::table('cities')->where('name', $city_acc_data)->first();
				$city_id = $data['city_data']->id;
				$city_name = $data['city_data']->name;
				$request->city = $city_id;
			} else {
				$city_id = $data['city_data']->id;
				$city_name = $data['city_data']->name;
				$request->city = $city_id;
			}
			$this->validate($request, [
				'mobile' => 'numeric',
				'mobile2' => 'numeric'
			]);

			$context_id = Auth::user()->context_id;
			$upload_users_id = DB::table('uploads')->where('user_id', $context_id)->first();

			$mobile = $request->input('mobile');
			$mobile2 = $request->input('mobile2');
			if (empty($request->input('mobile')) && empty($request->input('mobile2'))) {
				if ($mobile == $mobile2) {
					Session()->flash('mobile_error', 'Same contact numbet are not allowed!');
					return redirect()->back();
				}
			}
			$looking_change = $request->input('looking_change');
			if ($looking_change == 1) {
				$this->validate($request, [
					'salary_cur' => 'required|numeric',
					'expected_ctc' => 'required|numeric'
				]);
				if ($salary_cur < $total) {
					Session()->flash('current_less_total', 'Fixed + Variable cannot be greater than Current CTC.');
					return redirect()->back();
				}
				if ($salary_cur <= 0) {

					Session()->flash('current_less_zero', '');
					return redirect()->back();
				}
				if ($fixed <= 0) {
					Session()->flash('fixed_less_zero', '');
					return redirect()->back();
				}
			}

			if (!empty($request->file('image'))) {
				$this->validate($request, [
					'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
				]);

				if ($request->hasFile('image')) {

					$image = $request->file('image');
					$name = time() . '.' . $image->getClientOriginalExtension();
					$destination = $_SERVER["DOCUMENT_ROOT"] . '/PrimaPlus/storage/uploads';

					$request->file('image')->move($destination, $name);

					$string = "123456stringsawexs";
					$extension = pathinfo($name, PATHINFO_EXTENSION);
					$path = $destination . '/' . $name;
					$public = 1;
					$user_id = $context_id;
					$hash = str_shuffle($string);

					$request->user_id = $context_id;
					$request->name = $name;
					$request->extension = $extension;
					$request->path = $path;
					$request->public = $public;
					$request->hash = $hash;
					$date = date('Y-m-d h:i:s');
					$image_id = Module::insert("uploads", $request);
					$request->image = $image_id;
					$insert_id = Module::updateRow("Employees", $request, $context_id);

					/*$upload_users_id = DB::table('uploads')->where('user_id',$context_id)->first();
                     if($upload_users_id !=''){
						$image_id =DB::table('uploads')->where('user_id', $context_id)->update([
							'name' => $name,	
							'extension' => $extension, 
							'path' => $path,
							'public' => $public,
							'hash' => $hash,
							'updated_at' =>$date
            			]);
            			 $upload_users_id = DB::table('uploads')->where('user_id',$context_id)->first();
						$request->image = $upload_users_id->id;
            			$insert_id = Module::updateRow("Employees", $request, $context_id);
						
                     }else{
                     	 $image_id = Module::insert("uploads", $request);
                     	 $request->image = $image_id;
                     	 $insert_id = Module::updateRow("Employees", $request, $context_id);

                     }*/
				}
			}
			$context_id = Auth::user()->context_id;
			$insert_id = Module::updateRow("Employees", $request, $context_id);
			DB::table('users')->where('context_id', $context_id)->update([
				'name' => $request->first_name . ' ' . $request->last_name,
			]);

			Session()->flash('edit_profile', 'Your profile is successfully updated!');

			return redirect()->back();
		} else {
			return view('errors.error', [
				'title' => 'Please Login to access restricted area.',
				'message' => 'Please run command <code>php artisan db:seed</code> to generate required table data.',
			]);
		}
		if (Auth::check()) {
			return view('header', $data) . view('profile.detail', $data) . view('footer', $data);
		} else {
			return view('errors.error', [
				'title' => 'Please Login to access restricted area.',
				'message' => 'Please run command <code>php artisan db:seed</code> to generate required table data.',
			]);
		}
	}

	/**
	 * Store a newly update employer profile update in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function update_employer_profile(Request $request)
	{
		if (!empty($request->file('image'))) {
			$file = $request->file('image');
			$name = rand(11111, 99999) . time() . '.' . $file->getClientOriginalExtension();
			$ext = end(explode('.', $name));
			print_r($ext);

			//Move Uploaded File
			$request->file('image')->move("uploads", $name);

			$request->image = $name;
		}

		$context_id = Auth::user()->context_id;
		$insert_id = Module::updateRow("Employees", $request, $context_id);
		Session()->flash('edit_profile', 'Your profile successfully update');

		return redirect()->back();
	}

	/**
    /**
	 * Store a newly created Enrollnment in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store_enrollment(Request $request)
	{

		$rules = Module::validateRules("enrollments", $request);

		$validator = Validator::make($request->all(), $rules);

		if ($validator->fails()) {
			return redirect()->back()->withErrors($validator)->withInput();
		}
		$request->enquiry_date = date('d/m/Y h:i:s');
		$insert_id = Module::insert("enrollments", $request);
		$request->session()->flash('status', 'Your Enrollment has been submitted successfully.');

		return redirect()->back();
	}

	/**
	 * Store a newly created intern in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store_intern(Request $request)
	{
		//  var_dump($request);die;


		$rules = Module::validateRules("internship_enquiries", $request);

		$validator = Validator::make($request->all(), $rules);

		if ($validator->fails()) {
			return redirect()->back()->withErrors($validator)->withInput();
		}
		$request->enquiry_date = date('d/m/Y h:i:s');
		$insert_id = Module::insert("internship_enquiries", $request);
		$request->session()->flash('status', 'Your Feedback has been submitted successfully.');

		return redirect()->back();
	}
	/**
	 * Store a newly created modular course in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store_modular(Request $request)
	{
		//  var_dump($request);die;


		$rules = Module::validateRules("modular_enquiries", $request);

		$validator = Validator::make($request->all(), $rules);

		if ($validator->fails()) {
			return redirect()->back()->withErrors($validator)->withInput();
		}
		$request->enquiry_date = date('d/m/Y h:i:s');
		$insert_id = Module::insert("modular_enquiries", $request);
		$request->session()->flash('status', 'Your Feedback has been submitted successfully.');

		return redirect()->back();
	}
	/**
	 * Store a newly created demo course in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store_demo(Request $request)
	{
		//  var_dump($request);die;


		$rules = Module::validateRules("demo_enquiries", $request);

		$validator = Validator::make($request->all(), $rules);

		if ($validator->fails()) {
			return redirect()->back()->withErrors($validator)->withInput();
		}


		$request->inquiry_date = date('d/m/Y h:i:s');
		$insert_id = Module::insert("demo_enquiries", $request);
		$request->session()->flash('status', 'Your Feedback has been submitted successfully.');

		return redirect()->back();
	}
	/**
	 * Show the application Home page.
	 *
	 * @return Response
	 */
	public function index($slug = '')
	{

		if ($slug) {
			$navigation  = DB::table('navigations')
				->where('navigations.url', $slug)
				->where('navigations.deleted_at', NULL)->first();
			if (empty($navigation)) {
				return view('errors.404', [
					'record_id' => $slug,
					'record_name' => ucfirst("course"),
				]);
			} else {
				$method = $navigation->slug;
				return $this->$method();
			}
		}
		$data = $this->common();
		$data['meta_title']  = $data['settings']->meta_title;
		$data['meta_keyword']  = $data['settings']->meta_keyword;
		$data['meta_description']  = $data['settings']->meta_description;

		//$data['course_advantages']  = array();

		$roleCount = \App\Role::count();
		if ($roleCount != 0) {
			if ($roleCount != 0) {
				return view('header', $data) . view('home', $data) . view('footer', $data);
			}
		} else {
			return view('errors.error', [
				'title' => 'Migration not completed',
				'message' => 'Please run command <code>php artisan db:seed</code> to generate required table data.',
			]);
		}
	}

	/**
	 * Show the application course detail.
	 *
	 * @return Response
	 */
	public function course_detail($slug = '')
	{

		$data = $this->common();
		$data['module'] = Module::get('enrollments');
		$data['course_detail']  = DB::table('courses')
			->where('courses.course_slug', $slug)
			->where('courses.deleted_at', NULL)->first();
		if (empty($data['course_detail'])) {
			return view('errors.404', [
				'record_id' => $slug,
				'record_name' => ucfirst("course"),
			]);
		}
		$id = $data['course_detail']->id;
		$data['meta_title']  = $data['course_detail']->meta_title;
		$data['meta_keyword']  = $data['course_detail']->meta_keyword;
		$data['meta_description']  = $data['course_detail']->meta_description;
		$data['success_msg']  = session('status');
		$data['training_tracks']  = DB::table('training_tracks')
			->where('training_tracks.course', $id)
			->where('training_tracks.deleted_at', NULL)->first();
		$data['durations']  = DB::table('durations')
			->where('durations.course', $id)
			->where('durations.deleted_at', NULL)->first();
		$data['days']  = DB::table('days')
			->where('days.course', $id)
			->where('days.deleted_at', NULL)->first();
		$data['hours']  = DB::table('hours')
			->where('hours.course', $id)
			->where('hours.deleted_at', NULL)->first();

		$data['practicals']  = DB::table('practicals')
			->where('practicals.course', $id)
			->where('practicals.deleted_at', NULL)->first();

		$data['doubts']  = DB::table('doubts')
			->where('doubts.course', $id)
			->where('doubts.deleted_at', NULL)->first();

		$data['certifications']  = DB::table('certifications')
			->where('certifications.course', $id)
			->where('certifications.deleted_at', NULL)->first();

		$data['benefits']  = DB::table('benefits')
			->where('benefits.course', $id)
			->where('benefits.deleted_at', NULL)->get();

		$data['course_contents']  = DB::table('course_contents')
			->where('course_contents.course', $id)
			->where('course_contents.deleted_at', NULL)->orderby('sort_order')->get();

		$data['jobs']  = DB::table('jobs')
			->where('jobs.course', $id)
			->where('jobs.deleted_at', NULL)->get();


		$data['course_banner']  = DB::table('course_banners')
			->join('uploads', 'uploads.id', '=', 'course_banners.image')
			->where('course_banners.id', $data['course_detail']->banner)
			->where('course_banners.deleted_at', NULL)->first();
		$data['course_broucher']  = DB::table('courses')
			->join('uploads', 'uploads.id', '=', 'courses.brochure')
			->where('uploads.id', $data['course_detail']->brochure)
			->where('uploads.deleted_at', NULL)->first();
		$data['course_video']  = DB::table('courses')
			->join('uploads', 'uploads.id', '=', 'courses.about_video')
			->where('uploads.id', $data['course_detail']->about_video)
			->where('uploads.deleted_at', NULL)->first();
		$data['course_advantages']  = array();
		if ($data['course_detail']->advantage != '') {
			$data['course_advantages']  = DB::table('course_advantages')
				->whereIn('course_advantages.id', json_decode($data['course_detail']->advantage))
				->where('course_advantages.deleted_at', NULL)->get();
		}

		$data['training_centers']  = DB::table('training_centers')
			->leftjoin('uploads', 'uploads.id', '=', 'training_centers.image')
			->select('training_centers.id as tcid', 'uploads.name as iname', 'uploads.*', 'training_centers.*')
			->where('training_centers.deleted_at', NULL)->get();
		$data['placemen_tie_ups']  = DB::table('placemen_tie_ups')
			->join('uploads', 'uploads.id', '=', 'placemen_tie_ups.logo')
			->whereIn('placemen_tie_ups.id', json_decode($data['course_detail']->placement_logos))
			->where('placemen_tie_ups.deleted_at', NULL)->get();
		$data['aluminis']  = array();
		if ($data['course_detail']->alumini != '') {
			$data['aluminis']  = DB::table('aluminis')
				->join('uploads', 'uploads.id', '=', 'aluminis.logo')
				->whereIn('aluminis.id', json_decode($data['course_detail']->alumini))
				->where('aluminis.deleted_at', NULL)->get();
		}
		$data['alumini_speaks']  = array();
		if ($data['course_detail']->alumini_speaks != '') {
			$data['alumini_speaks']  = DB::table('alumini_speaks')
				->join('uploads', 'uploads.id', '=', 'alumini_speaks.image')
				->select('alumini_speaks.name as uname', 'uploads.name as iname', 'uploads.*', 'alumini_speaks.*')
				->whereIn('alumini_speaks.id', json_decode($data['course_detail']->alumini_speaks))
				->where('alumini_speaks.deleted_at', NULL)->get();
		}


		$data['trainers']  = array();
		if ($data['course_detail']->trainers != '') {
			$data['trainers']  = DB::table('trainers')
				->join('uploads', 'uploads.id', '=', 'trainers.image')
				->select('trainers.name as uname', 'uploads.name as iname', 'uploads.*', 'trainers.*')
				->whereIn('trainers.id', json_decode($data['course_detail']->trainers))
				->where('trainers.deleted_at', NULL)->get();
		}
		//echo '<pre>';print_r($data['course_detail']);die;
		$data['related_course']  = array();
		if ($data['course_detail']->rel_courses != '') {
			$data['related_course']  = DB::table('courses')
				->join('uploads', 'uploads.id', '=', 'courses.course_image')
				->select('courses.name as uname', 'uploads.name as iname', 'uploads.*', 'courses.*')
				->whereIn('courses.id', json_decode($data['course_detail']->rel_courses))
				->where('courses.deleted_at', NULL)->get();
		}
		//echo '<pre>';print_r($data['related_course']);die;
		$data['video_testimonials']  = array();
		if ($data['course_detail']->video_testimonial != '') {
			$data['video_testimonials']  = DB::table('video_testimonials')
				->join('uploads', 'uploads.id', '=', 'video_testimonials.video')
				//->select('video_testimonials.name as uname', 'uploads.name as iname','uploads.*', 'video_testimonials.*')
				->whereIn('video_testimonials.id', json_decode($data['course_detail']->video_testimonial))
				->where('video_testimonials.deleted_at', NULL)->get();
		}
		$data['locations']  = DB::table('locations')
			//->select('locations.address as info', 'locations.lat','locations.long as lng ')
			->where('locations.deleted_at', NULL)->get();
		$data['rating_submissions']  = DB::table('rating_submissions')
			->where('rating_submissions.status', '=', 'Approved')
			->where('rating_submissions.deleted_at', NULL)->get();
		//echo '<pre>';print_r($data);die;


		$roleCount = \App\Role::count();
		if ($roleCount != 0) {
			if ($roleCount != 0) {
				return view('header', $data) . view('course.detail', $data) . view('footer', $data);
			}
		} else {
			return view('errors.error', [
				'title' => 'Migration not completed',
				'message' => 'Please run command <code>php artisan db:seed</code> to generate required table data.',
			]);
		}
	}

	/**
	 * Show the application company.
	 *
	 * @return Response
	 */
	public function jobseeker()
	{

		$data = $this->common();

		$roleCount = \App\Role::count();
		if ($roleCount != 0) {
			if ($roleCount != 0) {
				$data['role_id'] = 3;
				return view('header', $data) . view('jobseeker.detail', $data) . view('footer', $data);
			}
		} else {
			return view('errors.error', [
				'title' => 'Migration not completed',
				'message' => 'Please run command <code>php artisan db:seed</code> to generate required table data.',
			]);
		}
	}
	/**
	 * Show the application company.
	 *
	 * @return Response
	 */
	public function cvbuilder($cvid = '')
	{

		$data = $this->common();

		$data['categories']  = DB::table('categories')
			->where('categories.deleted_at', NULL)->where('categories.publish', 'yes')->get();
		foreach ($data['categories'] as $key => $row) {
			$data['categories'][$key] = $row;
			$data['categories'][$key]->sub_categories  = DB::table('sub_categories')->where('sub_categories.category_id', $row->id)->where('sub_categories.deleted_at', NULL)->where('sub_categories.Publish', 'yes')->get();
		}

		foreach ($data['categories'] as $key => $row) {
			$data['categories'][$key] = $row;
			$data['categories'][$key]->tools  = DB::table('tools')->where('tools.deleted_at', NULL)->where('tools.category_id', $row->id)->where('tools.publish', 'yes')->get();
		}

		foreach ($data['categories'] as $key => $row) {
			$data['categories'][$key] = $row;
			$data['categories'][$key]->skills  = DB::table('skills')->where('skills.deleted_at', NULL)->where('skills.category_id', $row->id)->where('skills.publish', 'yes')->get();
		}

		$data['hobbies_datas'] = DB::table('hobbies')->where('hobbies.deleted_at', NULL)->where('hobbies.publish', 'yes')->get();

		$context_id = @Auth::user()->context_id;

		/*$data['personal_details']= DB::table('employees')->where('employees.id',$context_id)->get();*/
		$data['personal_details'] = DB::table('employees')->leftJoin('cities', 'cities.id', '=', 'employees.city')->leftJoin('states', 'states.id', '=', 'employees.state')->select('cities.name as citiesname', 'states.name as statename', 'cities.*', 'employees.*', 'states.*')->where('employees.id', $context_id)->get();

		foreach ($data['personal_details'] as $key => $detail_data) {
			$firstNane = $detail_data->first_name;
			$dateBirth =  $detail_data->date_birth;
			$gender =  $detail_data->gender;
			$mobile =  $detail_data->mobile;
		}

		$data['employees_image']  = DB::table('employees')
			->join('uploads', 'uploads.id', '=', 'employees.image')->where('employees.id', $context_id)->get();

		$data['resume_experiences'] = DB::table('resume_experiences')->where('resume_experiences.resume_id', $context_id)->get();

		if (Auth::check()) {
			if (!empty($firstNane && $dateBirth && $gender && $mobile)) {
				return view('header', $data) . view('cvbuilder.detail', $data) . view('footer', $data);
			} else {
				Session::flash('resume_status', 'Please complete your profile to the create your resume.!');
				Session::flash('alert-class', 'alert-danger');
				return view('header', $data) . view('cvbuilder.detail_demo', $data) . view('footer', $data);
			}
		} else {
			return view('errors.error', [
				'title' => 'Please Login to access restricted area.',
				'message' => 'Please run command <code>php artisan db:seed</code> to generate required table data.',
			]);
		}
	}

	public function cvbuilderedit($unique_id)
	{

		$data = $this->common();
		$context_id = @Auth::user()->context_id;

		if (DB::table('resumes')->where('resumes.unique_id', $unique_id)->first() && Auth::check()) {
			$data['personal_data'] = DB::table('resumes')->where('resumes.unique_id', $unique_id)->get();
			foreach ($data['personal_data'] as $key => $users_id) {
				$user_confirm_id = $users_id->user_id;
				$cvid = $users_id->id;
				$array_image_awards = $users_id->image_award;
				$array_image_achives = $users_id->image_achive;
			}

			$array_image_award = explode(',', $array_image_awards);
			$array_resume_images = array();

			foreach ($array_image_award as $array_image_award_value) {
				$data['resume_image']  = DB::table('uploads')->where('uploads.id', $array_image_award_value)->get();

				foreach ($data['resume_image'] as $array_resume_image) {
					$array_resume_images[] = $array_resume_image;
				}
			}
			$data['array_resume_images'] = $array_resume_images;
			/*print_r($data['array_resume_images']);
           		die;*/

			$array_image_achive = explode(',', $array_image_achives);
			$array_resume_imageses = array();
			foreach ($array_image_achive as $array_image_achive_value) {
				$data['resume_images']  = DB::table('uploads')->where('uploads.id', $array_image_achive_value)->get();

				foreach ($data['resume_images'] as $array_resume_images) {
					$array_resume_imageses[] = $array_resume_images;
				}
			}
			$data['array_resume_imageses'] = $array_resume_imageses;



			$data['employees_image']  = DB::table('employees')
				->join('uploads', 'uploads.id', '=', 'employees.image')->where('employees.id', $context_id)->get();

			$data['categories']  = DB::table('categories')
				->where('categories.deleted_at', NULL)->where('categories.publish', 'yes')->get();
			foreach ($data['categories'] as $key => $row) {
				$data['categories'][$key] = $row;
				$data['categories'][$key]->sub_categories  = DB::table('sub_categories')->where('sub_categories.category_id', $row->id)->where('sub_categories.deleted_at', NULL)->where('sub_categories.Publish', 'yes')->get();
			}

			foreach ($data['categories'] as $key => $row) {
				$data['categories'][$key] = $row;
				$data['categories'][$key]->tools  = DB::table('tools')->where('tools.deleted_at', NULL)->where('tools.category_id', $row->id)->where('tools.publish', 'yes')->get();
			}

			foreach ($data['categories'] as $key => $row) {
				$data['categories'][$key] = $row;
				$data['categories'][$key]->skills  = DB::table('skills')->where('skills.deleted_at', NULL)->where('skills.category_id', $row->id)->where('skills.publish', 'yes')->get();
			}

			$data['hobbies_datas'] = DB::table('hobbies')->where('hobbies.deleted_at', NULL)->where('hobbies.publish', 'yes')->get();

			$context_id = @Auth::user()->context_id;

			/*$data['personal_details']= DB::table('employees')->where('employees.id',$context_id)->get();*/
			$data['personal_details'] = DB::table('employees')->leftJoin('cities', 'cities.id', '=', 'employees.city')->leftJoin('states', 'states.id', '=', 'employees.state')->select('cities.name as citiesname', 'states.name as statename', 'cities.*', 'employees.*', 'states.*')->where('employees.id', $context_id)->get();


			$data['resume_datas_selected']  = DB::table('resumes')->where('resumes.id', $cvid)->get();
			foreach ($data['resume_datas_selected'] as $key => $row) {
				$data['resume_datas_selected'][$key] = $row;

				$data['resume_datas_selected'][$key]->resume_categories_select  = DB::table('resume_categories')->where('resume_categories.resume_id', $cvid)->get();

				$data['resume_datas_selected'][$key]->resume_tools_select  = DB::table('resume_tools')->where('resume_tools.resume_id', $cvid)->get();

				$data['resume_datas_selected'][$key]->resume_skills_select = DB::table('resume_skills')->where('resume_skills.resume_id', $cvid)->get();

				$data['resume_datas_selected'][$key]->resume_hobbies_select = DB::table('resume_hobbies')->where('resume_hobbies.resume_id', $cvid)->get();

				$data['resume_datas_selected'][$key]->resume_achievements_select = DB::table('resume_achievements')->where('resume_achievements.resume_id', $cvid)->get();

				$data['resume_datas_selected'][$key]->resume_awards_select = DB::table('resume_awards')->where('resume_awards.resume_id', $cvid)->get();

				$data['resume_datas_selected'][$key]->resume_experiences_select  = DB::table('resume_experiences')->where('resume_experiences.resume_id', $cvid)->get();

				$data['resume_datas_selected'][$key]->resume_detail_select  = DB::table('academic_details')->where('academic_details.resume_id', $cvid)->get();
			}
			$data['resume_commava_tools']  = DB::table('resume_tools')->leftjoin('tools', 'tools.id', '=', 'resume_tools.tools_id')->where('resume_tools.resume_id', $cvid)->where('tools.publish', 'needtoapprove')->get();

			$data['resume_commava_skills']  = DB::table('resume_skills')->leftjoin('skills', 'skills.id', '=', 'resume_skills.skills_id')->where('resume_skills.resume_id', $cvid)->where('skills.publish', 'needtoapprove')->get();

			$data['resume_commava_hobbies']  = DB::table('resume_hobbies')->leftjoin('hobbies', 'hobbies.id', '=', 'resume_hobbies.hobbies_id')->where('resume_hobbies.resume_id', $cvid)->where('hobbies.publish', 'needtoapprove')->get();


			return view('header', $data) . view('cvbuilder.resume_edit', $data) . view('footer', $data);
		} else {
			return view('errors.error', [
				'title' => 'Please Login to access restricted area.',
				'message' => 'Please run command <code>php artisan db:seed</code> to generate required table data.',
			]);
		}
	}

	public function cvresumelistactive(Request $request)
	{
		$data = $this->common();
		$input = $request->all();
		$cvid = $input['cvid'];
		$status = $input['status'];
		$date = date('Y-m-d h:i:s');
		/*print_r($cvid);
    	die;*/
		DB::table('resumes')->where('id', $cvid)->update([
			'status' => $status,
			'updated_at' => $date
		]);
		$data = $this->common();

		$user_id = @Auth::user()->context_id;
		$data['resume_details'] = DB::table('resumes')->where('resumes.user_id', $user_id)->orderby('id', 'desc')->get();

		if (Auth::check()) {
			return redirect('my-resumes');
		} else {
			return view('errors.error', [
				'title' => 'Please Login to access restricted area.',
				'message' => 'Please run command <code>php artisan db:seed</code> to generate required table data.',
			]);
		}
	}

	/*cvbuilder views function*/
	public function cvbuilderview($uniq_ids)
	{
		$data = $this->common();
		$context_id = @Auth::user()->context_id;
		$resume_status = DB::table('resumes')->where('resumes.unique_id', $uniq_ids)->first();

		$data['uniq_ids'] = $uniq_ids;
		$cvid = $resume_status->id;
		$data['resume_about'] = $resume_status->about_me;
		/*    	print_r($data['resume_about']);
    	die;*/
		$data['employees_image']  = DB::table('employees')
			->leftjoin('uploads', 'uploads.id', '=', 'employees.image')->where('employees.id', $resume_status->user_id)->get();

		$data['country_state_city'] = DB::table('employees')->join('states', 'states.id', '=', 'employees.state')->select('states.name as statename', 'employees.*', 'states.*')->where('employees.id', $resume_status->user_id)->get();

		$data['resume_experiences'] = DB::table('resume_experiences')->where('resume_experiences.resume_id', $cvid)->orderby('resume_experiences.experience_from', 'desc')->get();

		$data['personal_data'] = DB::table('resumes')->where('resumes.id', $cvid)->get();
		foreach ($data['personal_data'] as $key => $users_id) {
			$user_confirm_id = $users_id->user_id;
			$cvid = $users_id->id;
			$array_image_awards = $users_id->image_award;
			$array_image_achives = $users_id->image_achive;
		}

		$array_image_award = explode(',', $array_image_awards);
		$array_resume_images = array();

		foreach ($array_image_award as $array_image_award_value) {
			$data['resume_image']  = DB::table('uploads')->where('uploads.id', $array_image_award_value)->get();

			foreach ($data['resume_image'] as $array_resume_image) {
				$array_resume_images[] = $array_resume_image;
			}
		}
		$data['awards_image'] = $array_resume_images;
		/*print_r($data['awards_image']);
           		die;*/

		$array_image_achive = explode(',', $array_image_achives);
		$array_resume_imageses = array();
		foreach ($array_image_achive as $array_image_achive_value) {
			$data['resume_images']  = DB::table('uploads')->where('uploads.id', $array_image_achive_value)->get();

			foreach ($data['resume_images'] as $array_resume_images) {
				$array_resume_imageses[] = $array_resume_images;
			}
		}
		$data['image_achive'] = $array_resume_imageses;

		$data['resume_experiences_view'] = DB::table('resume_experiences')->where('resume_experiences.resume_id', $cvid)->orderby('resume_experiences.experience_from', 'desc')->limit(3)->get();
		/*print_r($data['resume_experiences_view']);
		die;*/
		$data['resume_experiences_designation'] = DB::table('resume_experiences')->where('resume_experiences.resume_id', $cvid)->orderby('resume_experiences.experience_from', 'desc')->limit(1)->get();
		$data['academic_details'] = DB::table('academic_details')->where('academic_details.resume_id', $cvid)->orderby('year', 'desc')->get();

		$data['academic_details_view'] = DB::table('academic_details')->where('academic_details.resume_id', $cvid)->orderby('year', 'desc')->limit(3)->get();

		$data['resume_hobbies'] = DB::table('hobbies')->join('resume_hobbies', 'resume_hobbies.hobbies_id', '=', 'hobbies.id')->where('resume_hobbies.resume_id', $cvid)->get();

		$data['resume_skills'] = DB::table('resume_skills')->leftjoin('skills', 'skills.id', '=', 'resume_skills.skills_id')->where('resume_skills.resume_id', $cvid)->get();

		$data['resume_tools'] = DB::table('resume_tools')->leftjoin('tools', 'tools.id', '=', 'resume_tools.tools_id')->where('resume_tools.resume_id', $cvid)->get();

		$data['sub_categories'] = DB::table('sub_categories')->leftjoin('resume_categories', 'resume_categories.sub_category_id', '=', 'sub_categories.id')->where('resume_categories.resume_id', $cvid)->get();
		$data['resume_achievements'] = DB::table('resume_achievements')->where('resume_achievements.resume_id', $cvid)->get();

		$data['resume_awards_view'] = DB::table('resume_awards')->where('resume_awards.resume_id', $cvid)->limit(2)->orderby('resume_awards.id', 'desc')->get();
		/*print_r($data['resume_awards_view']);
		die;*/
		$data['resume_awards_popup'] = DB::table('resume_awards')->where('resume_awards.resume_id', $cvid)->orderby('resume_awards.id', 'desc')->get();

		$data['experiences_companyname'] = DB::table('resume_experiences')->where('resume_experiences.resume_id', $cvid)->orderby('resume_experiences.id', 'desc')->limit(2)->get();
		$data['experiences_companyname_popup'] = DB::table('resume_experiences')->where('resume_experiences.resume_id', $cvid)->orderby('resume_experiences.id', 'desc')->get();
		/*print_r($data['experiences_companyname']);
    	die;*/

		$data['resume_categories'] = DB::table('resume_categories')->leftjoin('categories', 'categories.id', '=', 'resume_categories.category_id')->where('resume_categories.resume_id', $cvid)->get();
		$data['award_data'] = DB::table('resume_experiences')
			->leftjoin('resume_awards', 'resume_awards.id', '=', 'resume_experiences.id')
			->select('resume_experiences.company_name', 'resume_awards.awards_title', 'resume_awards.id')
			->where('resume_experiences.resume_id', $cvid)->get();
		/*print_r($data['award_data']);
		die;*/
		$data['personal_datas'] = DB::table('resumes')->where('id', $cvid)->get();
		foreach ($data['personal_datas'] as $key => $users_id) {
			$user_confirm_id = $users_id->user_id;
			$array_image_awards = $users_id->image_award;
			$array_image_achives = $users_id->image_achive;
		}
		$array_image_award = explode(',', $array_image_awards);
		$array_resume_images = array();
		foreach ($array_image_award as $array_image_award_value) {
			$data['resume_image']  = DB::table('uploads')->where('uploads.id', $array_image_award_value)->get();

			foreach ($data['resume_image'] as $array_resume_image) {
				$array_resume_images[] = $array_resume_image;
			}
		}
		$data['array_resume_awards'] = $array_resume_images;

		$array_image_achive = explode(',', $array_image_achives);
		$array_resume_imageses = array();
		foreach ($array_image_achive as $array_image_achive_value) {
			$data['resume_images']  = DB::table('uploads')->where('uploads.id', $array_image_achive_value)->get();

			foreach ($data['resume_images'] as $array_resume_images) {
				$array_resume_imageses[] = $array_resume_images;
			}
		}
		$data['array_resume_achievements'] = $array_resume_imageses;


		if (($resume_status->status == 0 || $resume_status->status == 1) && $resume_status->user_id == $context_id) {
			return view('header', $data) . view('cvbuilder.cvbuilderview', $data) . view('footer', $data);
		} elseif ($resume_status->status == 1) {
			return view('header', $data) . view('cvbuilder.cvbuilderview', $data) . view('footer', $data);
		} elseif ($resume_status->status == 2) {
			return view('header', $data) . view('cvbuilder.cvbuilderview', $data) . view('footer', $data);
		} else {
			return view('errors.error', [
				'title' => 'This contant not publish',
				'message' => 'Please run command <code>php artisan db:seed</code> to generate required table data.',
			]);
		}
	}

	/*cvbuilder update function*/
	public function cvbuilderupdate_publish(Request $request)
	{
		$this->validate($request, [
			/*		'title' => 'required',
		'category_id' => 'required',
		'sub_category_id' => 'required',
		'first_name' => 'required',
		'gender' => 'required',
		'married' => 'required',
		'mobile' => 'required|min:10|numeric',
		'date_birth' => 'required',
		'address' => 'required',
		'notice_period' => 'required',
		'tools_id' => 'required',
		'tools_id' => 'required',
		'skills_id' => 'required',
		'degree' => 'required',
	    'year' => 'required',
		'board' => 'required',
		'college' => 'required',
		'city' => 'required',*/], [
			'title.required' => ' The title field is required.',

		]);

		$this->cvbuilderupdate($request);
		Session::flash('resume_status', 'Your Resume has been update successfully.!');
		Session::flash('alert-class', 'alert-success');
		return redirect('my-resumes');
	}

	public function cvbuilderupdate_Draft(Request $request)
	{
		$this->validate($request, [
			'title' => 'required'

		], [
			'title.required' => ' The title field is required.',

		]);

		$this->cvbuilderupdate($request);
		Session::flash('resume_status', 'Your Resume has been Draft successfully.!');
		Session::flash('alert-class', 'alert-success');
		return redirect('my-resumes');
	}

	public function cvbuilderupdate(Request $request)
	{
		$input = $request->all();
		/*         	print_r($input);
         	die;*/
		$category_id = '';

		if (!empty($input['category_id'])) {
			$category_id = $input['category_id'];
		}

		$image_award = array();
		if (!empty($input['image_award'])) {
			$image_award = $input['image_award'];
		}

		$old_award_image = array();
		$old_award_image_value = '';
		if (!empty($input['old_award_image'])) {
			$old_award_image = $input['old_award_image'];
			foreach ($old_award_image as $key => $old_award_image_value) {
			}
		}

		$old_achive_image = array();
		$old_achive_image_value = '';
		if (!empty($input['old_achive_image'])) {
			$old_achive_image = $input['old_achive_image'];
			foreach ($old_achive_image as $key => $old_achive_image_value) {
			}
		}

		$image_achive = array();
		if (!empty($input['image_achive'])) {
			$image_achive = $input['image_achive'];
		}

		$sub_category_id = array();
		if (!empty($input['sub_category_id'])) {
			$sub_category_id = $input['sub_category_id'];
		}

		$tools_id = array();
		if (!empty($input['tools_id'])) {
			$tools_id = $input['tools_id'];
		}

		$skills_id = array();
		if (!empty($input['skills_id'])) {
			$skills_id = $input['skills_id'];
		}

		$hobbies_id = array();
		if (!empty($input['hobbies_id'])) {
			$hobbies_id = $input['hobbies_id'];
		}
		$tools_star = array();
		if (!empty($input['tools_star'])) {
			$tools_star = $input['tools_star'];
		}

		$skills_star = array();
		if (!empty($input['skills_star'])) {
			$skills_star = $input['skills_star'];
		}

		$tools_other = $input['tools_other'];
		$skills_other = $input['skills_other'];
		$hobbies = $input['hobbies'];
		$resume_id = $input['resume_id'];
		$title = $input['title'];
		$first_name = $input['first_name'];
		$gender = $input['gender'];
		$married = $input['married'];
		$mobile = $input['mobile'];
		$date_birth = $input['date_birth'];
		$address = $input['address'];
		$salary_cur = $input['salary_cur'];
		$notice_period = $input['notice_period'];
		$status = $input['status'];
		$about_me = $input['about_me'];

		$tools_otherArray = explode(',', $tools_other);
		$skills_otherArray = explode(',', $skills_other);
		$hobbiesArray = explode(',', $hobbies);
		$date = date('Y-m-d h:i:s');

		$data = $this->common();

		$context_id = @Auth::user()->context_id;

		$data['personal_details'] = DB::table('resumes')->where('id', $resume_id)->get();

		foreach ($data['personal_details'] as $key => $users_id) {
			$user_confirm_id = $users_id->user_id;
		}

		if ($context_id == $user_confirm_id) {
			if ($request->hasFile('image_award')) {
				$id_array_award = array();
				foreach ($request->image_award as $file) {
					$name = $file->getClientOriginalName();
					$destination = $_SERVER["DOCUMENT_ROOT"] . '/PrimaPlus/storage/uploads';
					$file->move($destination, $name);
					$string = "123456stringsawexs";
					$extension = pathinfo($name, PATHINFO_EXTENSION);
					$path = $destination . '/' . $name;
					$public = 1;
					$user_id = $context_id;
					$hash = str_shuffle($string);

					$request->user_id = $context_id;
					$request->name = $name;
					$request->extension = $extension;
					$request->path = $path;
					$request->public = $public;
					$request->hash = $hash;
					$date = date('Y-m-d h:i:s');

					$image_id = Module::insert("uploads", $request);
					$id_array_award[] = $image_id;
					$output_award = array_merge($old_award_image, $id_array_award);
					$insert_award_id = implode(", ", $output_award);
				}
			} else {
				$insert_award_id = $old_award_image_value;
			}

			if ($request->hasFile('image_achive')) {

				$id_array_achive = array();
				foreach ($request->image_achive as $files) {
					$name = $files->getClientOriginalName();;
					$destination = $_SERVER["DOCUMENT_ROOT"] . '/PrimaPlus/storage/uploads';
					$files->move($destination, $name);
					$string = "123456stringsawexs";
					$extension = pathinfo($name, PATHINFO_EXTENSION);
					$path = $destination . '/' . $name;
					$public = 1;
					$user_id = $context_id;
					$hash = str_shuffle($string);

					$request->user_id = $context_id;
					$request->name = $name;
					$request->extension = $extension;
					$request->path = $path;
					$request->public = $public;
					$request->hash = $hash;
					$date = date('Y-m-d h:i:s');

					$image_achive_id = Module::insert("uploads", $request);

					$id_array_achive[] = $image_achive_id;
					$output_achive = array_merge($old_achive_image, $id_array_achive);
					$insert_achive_id = implode(", ", $output_achive);
				}
			} else {
				$insert_achive_id =  $old_achive_image_value;
			}

			DB::table('resumes')->where('id', $resume_id)->update([
				'title' => $title,
				'first_name' => $first_name,
				'gender' => $gender,
				'married' => $married,
				'mobile' => $mobile,
				'date_birth' => $date_birth,
				'address' => $address,
				'salary_cur' => $salary_cur,
				'notice_period' => $notice_period,
				'status' => $status,
				'about_me' => $about_me,
				'image_award' => $insert_award_id,
				'image_achive' => $insert_achive_id,
				'updated_at' => $date
			]);

			DB::table('resume_categories')->where('resume_id', $resume_id)->delete();

			foreach ($sub_category_id as $key => $sub_category_values) {

				DB::insert('insert into resume_categories (category_id,resume_id,sub_category_id,created_at,updated_at) values(?,?,?,?,?)', [$category_id, $resume_id, $sub_category_values, $date, $date]);
			}

			DB::table('resume_tools')->where('resume_id', $resume_id)->delete();
			foreach ($tools_id as $key => $tools_id_value) {
				if (isset($tools_star[$key])  && $tools_star[$key] != '') {
					$tools_star_value = $tools_star[$key];
				} else {
					$tools_star_value = '';
				}

				DB::insert('insert into resume_tools (resume_id,tools_id,tools_star,created_at,updated_at) values(?,?,?,?,?)', [$request->resume_id, $tools_id_value, $tools_star_value, $date, $date]);
			}
			DB::table('resume_skills')->where('resume_id', $resume_id)->delete();
			foreach ($skills_id as $key => $skills_id_value) {

				if (isset($skills_star[$key]) && $skills_star[$key] != '') {
					$skills_star_value = $skills_star[$key];
				} else {
					$skills_star_value = '';
				}
				DB::insert('insert into resume_skills (resume_id,skills_id,skills_star,created_at,updated_at) values(?,?,?,?,?)', [$request->resume_id, $skills_id_value, $skills_star_value, $date, $date]);
			}

			DB::table('resume_hobbies')->where('resume_id', $resume_id)->delete();
			foreach ($hobbies_id as $key => $hobbies_id_value) {
				DB::insert('insert into resume_hobbies (resume_id,hobbies_id,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $hobbies_id_value, $date, $date]);
			}
			DB::table('resume_experiences')->where('resume_experiences.resume_id', $resume_id)->delete();
			if (!empty($input['experience_from']) && !empty($input['experience_to']) && !empty($input['company_name']) && !empty($input['designation']) && !empty($input['work_city']) && !empty($input['roles_and_resp'])) {

				$experience_from = $input['experience_from'];
				$experience_to = $input['experience_to'];
				$company_name = $input['company_name'];
				$designation = $input['designation'];
				$work_city = $input['work_city'];
				$roles_and_resp = $input['roles_and_resp'];
				$current_working = $input['current_working'];
				foreach ($input['experience_from'] as $key => $experience_from_value) {

					$experience_to_value = $input['experience_to'][$key];
					$company_name_value = $input['company_name'][$key];
					$designation_value = $input['designation'][$key];
					$work_city_value = $input['work_city'][$key];
					$roles_and_resp_value = $input['roles_and_resp'][$key];
					$current_working_value = $input['current_working'][$key];
					$experience_fromstr = date('Y-m-d', strtotime($experience_from_value));

					DB::insert('insert into  resume_experiences (resume_id,experience_from,experience_to,company_name,designation, work_city,roles_and_resp,current_working,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?)', [$request->resume_id, $experience_fromstr, $experience_to_value, $company_name_value, $designation_value, $work_city_value, $roles_and_resp_value, $current_working_value, $date, $date]);
				}
			}
			DB::table('academic_details')->where('academic_details.resume_id', $resume_id)->delete();
			if (!empty($input['degree']) && !empty($input['year']) && !empty($input['board']) && !empty($input['college']) && !empty($input['city'])) {
				$degree = $input['degree'];
				$year = $input['year'];
				$board = $input['board'];
				$college = $input['college'];
				$city = $input['city'];
				foreach ($input['degree'] as $key => $degree_value) {

					$year_value = $input['year'][$key];
					$board_value = $input['board'][$key];
					$college_value = $input['college'][$key];
					$city_value = $input['city'][$key];
					DB::insert('insert into academic_details (resume_id,degree,year,board,college,city,created_at,updated_at) values(?,?,?,?,?,?,?,?)', [$request->resume_id, $degree_value, $year_value, $board_value, $college_value, $city_value, $date, $date]);
				}
			}

			if (!empty($input['achievements'])) {
				DB::table('resume_achievements')->where('resume_id', $resume_id)->delete();
				$achievements = $input['achievements'];
				foreach ($achievements as $key => $achievements_value) {
					DB::insert('insert into resume_achievements (resume_id,achievements_title,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $achievements_value, $date, $date]);
				}
			}

			if (!empty($input['awards'])) {
				DB::table('resume_awards')->where('resume_id', $resume_id)->delete();
				$awards = $input['awards'];
				foreach ($awards as $key => $awards_value) {
					DB::insert('insert into resume_awards (resume_id,awards_title,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $awards_value, $date, $date]);
				}
			}

			if ($input['tools_other'] != '') {

				foreach ($tools_otherArray as $key => $tools_other_value) {
					$tools_other_lower = strtolower($tools_other_value);
					$datasese = DB::table('tools')->where('tools_title', $tools_other_lower)->first();
					if (empty($datasese)) { //new value need to insert in both table
						$request->category_id = $category_id;
						$request->tools_title = $tools_other_lower;
						$request->publish = 'needtoapprove';
						$request->created_at = $date;
						$request->updated_at = $date;
						$last_lools_id = Module::insert("tools", $request);

						DB::insert('insert into resume_tools (resume_id,tools_id,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $last_lools_id, $date, $date]);
					} else { //value already exist insert in resume tools table

						DB::insert('insert into resume_tools (resume_id,tools_id,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $datasese->id, $date, $date]);
					}
				}
			}

			if ($input['skills_other'] != '') {
				foreach ($skills_otherArray as $key => $skills_other_value) {
					$skills_other_lower = strtolower($skills_other_value);
					$array_data_skills = DB::table('skills')->where('skill_title', $skills_other_lower)->first();
					if (empty($array_data_skills)) { //new value need to insert in both table
						$request->category_id = $category_id;
						$request->skill_title = $skills_other_lower;
						$request->publish = 'needtoapprove';
						$request->created_at = $date;
						$request->updated_at = $date;
						$last_skills_id = Module::insert("skills", $request);
						DB::insert('insert into resume_skills (resume_id,skills_id,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $last_skills_id, $date, $date]);
					} else {

						DB::insert('insert into resume_skills (resume_id,skills_id,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $array_data_skills->id, $date, $date]);
					}
				}
			}
			if ($input['hobbies'] != '') {
				foreach ($hobbiesArray as $key => $hobbies_value) {
					$hobbies_value_lower = strtolower($hobbies_value);
					$array_data_hobbies = DB::table('hobbies')->where('hobbies_title', $hobbies_value_lower)->first();

					if (empty($array_data_hobbies)) {

						$request->hobbies_title = $hobbies_value_lower;
						$request->publish = 'needtoapprove';
						$request->created_at = $date;
						$request->updated_at = $date;
						$last_hobbies_id = Module::insert("hobbies", $request);

						DB::insert('insert into resume_hobbies (resume_id,hobbies_id,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $last_hobbies_id, $date, $date]);
					} else {
						DB::insert('insert into resume_hobbies (resume_id,hobbies_id,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $array_data_hobbies->id, $date, $date]);
					}
				}
			}

			Session::flash('resume_status', 'Your Resume has been update successfully.!');
			Session::flash('alert-class', 'alert-success');

			return;
		} else {
			Session::flash('resume_delete_error', 'Do not permision delete thid Cv.!');
			Session::flash('alert-class', 'alert-success');
			return redirect()->back();
		}
	}
	/**
	 * Show the application jobseeker profile view page.
	 *
	 * @return Response
	 */
	public function profile()
	{
		$data = $this->common();

		$context_id = @Auth::user()->context_id;
		$data['personal_details'] = DB::table('employees')->where('employees.id', $context_id)->get();
		$data['country_state_city'] = DB::table('employees')->join('states', 'states.id', '=', 'employees.state')->select('states.name as statename', 'employees.*', 'states.*')->where('employees.id', $context_id)->get();
		/*print_r($data['country_state_city']);
			 die;*/
		$data['employees_image']  = DB::table('employees')
			->join('uploads', 'uploads.id', '=', 'employees.image')->where('employees.id', $context_id)->get();
		$citys_datas = $data['personal_details'];
		foreach ($citys_datas as $key => $city_row) {
			$city_id = $city_row->city;
			$country_id = $city_row->country;
		}

		$data['cities_emp'] = @DB::table('cities')->where('cities.id', $city_id)->get();
		$data['state'] = @DB::table('states')->where('states.country_id', $country_id)->get();

		if (Auth::check()) {
			return view('header', $data) . view('profile.detail', $data) . view('footer', $data);
		} else {
			return view('errors.error', [
				'title' => 'Please Login to access restricted area.',
				'message' => 'Please run command <code>php artisan db:seed</code> to generate required table data.',
			]);
		}
	}


	/**
	 * Show the application employer profile view .
	 *
	 * @return Response
	 */
	public function employer_profile()
	{

		$data = $this->common();

		$context_id = @Auth::user()->context_id;
		$data['personal_details'] = DB::table('employees')->where('employees.id', $context_id)->get();
		// $data['success_msg']  = session('status');
		if (Auth::check()) {
			return view('header', $data) . view('employer_profile.detail', $data) . view('footer', $data);
		} else {
			return view('errors.error', [
				'title' => 'Please Login to access restricted area.',
				'message' => 'Please run command <code>php artisan db:seed</code> to generate required table data.',
			]);
		}
	}

	public function my_resumes()
	{

		$data = $this->common();

		$user_id = @Auth::user()->context_id;
		$data['resume_details'] = DB::table('resumes')->where('resumes.user_id', $user_id)->where('resumes.deleted_at', NULL)->orderby('id', 'desc')->get();

		if (Auth::check()) {
			return view('header', $data) . view('cvbuilder.resumedetails', $data) . view('footer', $data);
		} else {
			return view('errors.error', [
				'title' => 'Please Login to access restricted area.',
				'message' => 'Please run command <code>php artisan db:seed</code> to generate required table data.',
			]);
		}
	}
	public function cvbuilderdelete($unique_id)
	{
		$data = $this->common();

		$context_id = @Auth::user()->context_id;

		$date = date('Y-m-d h:i:s');

		if (DB::table('resumes')->where('resumes.unique_id', $unique_id)->first() && Auth::check()) {
			$datas = DB::table('resumes')->where('resumes.unique_id', $unique_id)->first();
			if ($datas->status == 0) {
				DB::table('resumes')->where('resumes.unique_id', $unique_id)->update(['deleted_at' => $date]);

				DB::table('resume_categories')->where('resume_id', $datas->id)->update(['deleted_at' => $date]);

				DB::table('resume_tools')->where('resume_id', $datas->id)->update(['deleted_at' => $date]);

				DB::table('resume_skills')->where('resume_id', $datas->id)->update(['deleted_at' => $date]);

				DB::table('resume_experiences')->where('resume_id', $datas->id)->update(['deleted_at' => $date]);

				DB::table('resume_achievements')->where('resume_id', $datas->id)->update(['deleted_at' => $date]);

				DB::table('resume_awards')->where('resume_id', $datas->id)->update(['deleted_at' => $date]);

				Session::flash('resume_delete', 'Your Resume has been delete successfully.!');
				Session::flash('alert-class', 'alert-success');

				return redirect('my-resumes');
			} elseif ($datas->status == 2) {
				DB::table('resumes')->where('resumes.unique_id', $unique_id)->update(['deleted_at' => $date]);

				DB::table('resume_categories')->where('resume_id', $datas->id)->update(['deleted_at' => $date]);

				DB::table('resume_tools')->where('resume_id', $datas->id)->update(['deleted_at' => $date]);

				DB::table('resume_skills')->where('resume_id', $datas->id)->update(['deleted_at' => $date]);

				DB::table('resume_experiences')->where('resume_id', $datas->id)->update(['deleted_at' => $date]);

				DB::table('resume_achievements')->where('resume_id', $datas->id)->update(['deleted_at' => $date]);

				DB::table('resume_awards')->where('resume_id', $datas->id)->update(['deleted_at' => $date]);

				Session::flash('resume_delete', 'Your Resume has been delete successfully.!');
				Session::flash('alert-class', 'alert-success');

				return redirect('my-resumes');
			} else {
				Session::flash('resume_delete', 'Please Deactive your resume and than delete your resume.!');
				Session::flash('alert-class', 'alert-success');

				return redirect()->back();
			}
		} else {
			return view('errors.error', [
				'title' => 'Please Login to access restricted area.',
				'message' => 'Please run command <code>php artisan db:seed</code> to generate required table data.',
			]);
		}
	}


	/**
	 * Show the application company.
	 *
	 * @return Response
	 */
	public function employer()
	{
		$data = $this->common();

		$roleCount = \App\Role::count();
		if ($roleCount != 0) {
			if ($roleCount != 0) {
				$data['role_id'] = 2;
				return view('header', $data) . view('employer.detail', $data) . view('footer', $data);
			}
		} else {
			return view('errors.error', [
				'title' => 'Migration not completed',
				'message' => 'Please run command <code>php artisan db:seed</code> to generate required table data.',
			]);
		}
	}

	/**
	 * Show the application common element over the site.
	 *
	 * @return Response
	 */
	public function common()
	{
		$data["total_jobseeker"] = DB::table('role_user')
			->join('users', 'role_user.user_id', '=', 'users.context_id')
			->where("role_user.role_id", 3)->where("users.deleted_at", NULL)
			->count();
		$data["total_employer"] = DB::table('role_user')
			->join('users', 'role_user.user_id', '=', 'users.context_id')
			->where("role_user.role_id", 2)->where("users.deleted_at", NULL)
			->count();
		$data["total_jobseeker_hyd"] = DB::table('role_user')
			->join('employees', 'role_user.user_id', '=', 'employees.id')
			->where("role_user.role_id", 3)->where("employees.deleted_at", NULL)->where("employees.city", 'Hyderabad')
			->orwhere("employees.city", '4460')
			->count();
		/*print_r($data["total_employer"]); die;*/



		$data['courses']  = DB::table('courses')->where('deleted_at', NULL)->get();
		$data['navigations']  = DB::table('navigations')->where('deleted_at', NULL)->where('enable', '=', 'Yes')->orderby('sort_order')->get();
		$data['settings']  = DB::table('settings')->where('id', '1')->first();

		$data['logo']  = DB::table('uploads')->where('id', $data['settings']->logo)->first();
		$data['employer_logo']  = DB::table('uploads')->where('id', $data['settings']->employer_logo)->first();
		$data['cvbuilder_image']  = DB::table('uploads')->where('id', $data['settings']->cvbuilder_image)->first();
		$data['footer_logo']  = DB::table('uploads')->where('id', $data['settings']->footer_logo)->first();
		$data['employer_footer_logo']  = DB::table('uploads')->where('id', $data['settings']->employer_footer)->first();
		$data['employer_banner']  = DB::table('uploads')->where('id', $data['settings']->employer_banner)->first();

		$data['latest_blog_news']  = DB::table('latest_blog_news')
			->leftjoin('uploads', 'uploads.id', '=', 'latest_blog_news.image')->select('latest_blog_news.id AS blogid', 'latest_blog_news.*', 'uploads.*')->where('latest_blog_news.deleted_at', NULL)->orderby('blogid', 'desc')->limit(3)->get();
		$data['latest_blog_news_1']  = DB::table('latest_blog_news')
			->leftjoin('uploads', 'uploads.id', '=', 'latest_blog_news.image')->select('latest_blog_news.id AS blogid', 'latest_blog_news.*', 'uploads.*')->where('latest_blog_news.deleted_at', NULL)->orderby('blogid', 'desc')->limit(1)->get();

		$data['our__success_mils']  = DB::table('our__success_mils')
			->join('uploads', 'uploads.id', '=', 'our__success_mils.image')->where('our__success_mils.deleted_at', NULL)->limit(6)->get();
		/*print_r($data['our__success_mils']);
		die;*/
		$data['banners']  = DB::table('home_banners')->join('uploads', 'uploads.id', '=', 'home_banners.image')->where('home_banners.deleted_at', NULL)->orderby('display_order')->get();
		$data['employer_banners']  = DB::table('employer_banners')->join('uploads', 'uploads.id', '=', 'employer_banners.image')->where('employer_banners.deleted_at', NULL)->get();
		$data['training_banners']  = DB::table('training_banners')->join('uploads', 'uploads.id', '=', 'training_banners.image')->where('training_banners.deleted_at', NULL)->get();
		$data['blog_banners']  = DB::table('blog_banners')->join('uploads', 'uploads.id', '=', 'blog_banners.image')->where('blog_banners.deleted_at', NULL)->get();
		/*print_r($data['blog_banners']);die;*/
		$context_id = @Auth::user()->context_id;
		$data['role_users'] = DB::table('role_user')->where('role_user.user_id', $context_id)->first();
		$data['user_name'] = DB::table('employees')->where('employees.id', $context_id)->first();
		$data['veryify_link'] = DB::table('users')->select('status', 'context_id')->where('users.context_id', $context_id)->first();
		$data['trainings'] = DB::table('trainings')
			->where('deleted_at', NULL)->first();
		$data['trainings_img1']  = DB::table('uploads')->where('id', $data['trainings']->img1)->first();
		$data['trainings_img2']  = DB::table('uploads')->where('id', $data['trainings']->img2)->first();
		$data['trainings_img3']  = DB::table('uploads')->where('id', $data['trainings']->img3)->first();
		$data['trainings_img4']  = DB::table('uploads')->where('id', $data['trainings']->img4)->first();
		$data['trainings_img5']  = DB::table('uploads')->where('id', $data['trainings']->img5)->first();
		$data['trainings_img6']  = DB::table('uploads')->where('id', $data['trainings']->img6)->first();
		$data['trainings_img7']  = DB::table('uploads')->where('id', $data['trainings']->img7)->first();
		$data['trainings_img8']  = DB::table('uploads')->where('id', $data['trainings']->img8)->first();
		$data['term_conditions'] = DB::table('term_conditions')->where('deleted_at', NULL)->first();
		$data['privacy_policies'] = DB::table('privacy_policies')->where('deleted_at', NULL)->first();
		$data['cookie_policies'] = DB::table('cookie_policies')->where('deleted_at', NULL)->first();
		$data['about_us'] = DB::table('about_uses')->where('deleted_at', NULL)->first();
		$data['about_teams'] = DB::table('about_teams')->select('about_teams.name', 'about_teams.designation', 'about_teams.contant', 'uploads.name as img_name', 'uploads.hash')
			->leftjoin('uploads', 'about_teams.img', '=', 'uploads.id')
			->where('about_teams.deleted_at', NULL)->limit(3)->get();
		//print_r($data['about_teams']); die;
		return $data;
	}

	/*  */
	/**
	 * Store a newly user signuup in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */

	public function signup_store(Request $request)
	{

		$email = $request->input('email');
		$this->validate($request, [
			'email' => 'required|email',
			'password' => 'required|min:6'
		]);
		$rules = Module::validateRules("users", $request);
		$rules = array('email' => 'unique:users,email');
		$validator = Validator::make($request->all(), $rules);

		if ($validator->fails()) {

			Session::flash('statuss', 'The email already exists!');
			return redirect()->back()->withErrors($validator)->withInput();
		}
		$confirmation_code = str_random(30) . time();
		$date = date('Y-m-d h:i:s');
		$insert_id = Module::insert("employees", $request);
		$request->context_id = $insert_id;
		$request->confirmation_code = $confirmation_code;
		$context_id = Module::insert("users", $request);
		// $context_id = Module::insert("users", $request);
		$request->user_id = $request->context_id;

		DB::insert('insert into role_user (role_id,user_id,created_at,updated_at) values(?,?,?,?)', [$request->role_id, $request->user_id, $date, $date]);

		// Send mail to User his new Password
		$userEmail = $request->input('email');

		if (env('MAIL_USERNAME') != null && env('MAIL_USERNAME') != "null" && env('MAIL_USERNAME') != "") {
			// Send mail to User his new Password
			Mail::send('emails.send_login_veryfication_cred', ['confirmation_code' => $confirmation_code], function ($m) use ($userEmail) {
				$m->from(env('MAIL_USERNAME'), 'PrimaPlus');
				$m->to($userEmail, 'Admin')->subject('Verify your email address');
			});
		}
		Session::flash('success_signup', 'Thanks for signing up! A verification link has been send to your email account');

		if ($request->role_id == 2) {
			return redirect('page/employer');
		} elseif ($request->role_id == 3) {
			return redirect('page/job-seeker');
		} else {
			return redirect('/home');
		}
	}
	/*verification link after login*/
	public function veryify_link($context_id)
	{
		$context_id = @Auth::user()->context_id;
		$data['user_data'] = DB::table('users')->select('email', 'confirmation_code')->where('users.context_id', $context_id)->first();
		$email = $data['user_data']->email;
		$confirmation_code = $data['user_data']->confirmation_code;

		if (env('MAIL_USERNAME') != null && env('MAIL_USERNAME') != "null" && env('MAIL_USERNAME') != "") {
			// Send mail to User his new Password
			Mail::send('emails.send_login_veryfication_cred', ['confirmation_code' => $confirmation_code], function ($m) use ($email) {
				-$m->from(env('MAIL_USERNAME'), 'PrimaPlus');
				$m->to($email, 'Admin')->subject('Verify your email address');
			});
		}
		Session::flash('resend_varify_link', '');
		return redirect()->back();
	}

	/*this function store subscribe email in database */
	public function subscribe(Request $request)
	{

		$subscribes_email = $request->input('subscribes_email');
		$data['subscribes_data'] = DB::table('subscribes')->where('subscribes_email', $subscribes_email)->get();

		if (empty($data['subscribes_data'])) {
			$insert_id = Module::insert("subscribes", $request);

			Session::flash('subscribe_success', 'Thanks for subscribing!');
			die;
		} else {
			echo 'true';
			die;
		}
		// $rules = Module::validateRules("users", $request);
		// $rules = array('email' => 'unique:subscribes,email');
		/*$this->validate($request,[
		         'subscribes_email'=>'required|email|unique:subscribes',
		      ],
		      [
		      	// 'subscribes_email.required'    => 'Please Provide Your Email Addre',
		      	// 'subscribes_email.email'    => 'Please Provide Your Email Address For Better Commun',
		      	'subscribes_email.unique'    => 'This email is already on our subscribers list. Thanks!',
		      ]
		  	);*/
		//   	 $rules = Module::validateRules("users", $request);
		//   	 $rules = array('subscribes_email' => 'unique:subscribes,subscribes_email');
		// $validator = Validator::make($request->all(), $rules);

		// if ($validator->fails()) {

		// 	Session::flash('subscribe_error', 'This email is already exist for subscribe');
		// 	return redirect()->back()->withErrors($validator)->withInput();
		// }	

		/*$insert_id = Module::insert("subscribes", $request);
				
				Session::flash('subscribe_success', 'Thanks for subscribing!'); */

		// return redirect()->back();

	}
	/*  */
	/**
	 * Store a newly resume exprience in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function resume_store_publish(Request $request)
	{

		$this->validate($request, [
			/*'title' => 'required',
			'category_id' => 'required',
			'sub_category_id' => 'required',
			'first_name' => 'required',
			'gender' => 'required',
			'married' => 'required',
			'mobile' => 'required|min:10|numeric',
			'date_birth' => 'required',
			'address' => 'required',
			'salary_cur' => 'required',
			'notice_period' => 'required',
			'tools_id' => 'required',
			'tools_id' => 'required',
			'skills_id' => 'required',
			'degree' => 'required',
			'year' => 'required',
			'board' => 'required',
			'college' => 'required',
			'city' => 'required',*/], [
			'title.required' => ' The title field is required.',

		]);
		$this->resume_store($request);
		Session::flash('resume_status', 'Your Resume has been submitted successfully.!');
		Session::flash('alert-class', 'alert-success');
		return redirect('my-resumes');
	}

	public function resume_store_draft(Request $request, $confirmPopup)
	{


		$this->validate($request, [
			'title' => 'required'

		], [
			'title.required' => ' The title field is required.',

		]);
		$this->resume_store($request);

		Session::flash('resume_status', 'Your Resume has been Drafted successfully.!');
		Session::flash('alert-class', 'alert-success');
		if ($confirmPopup == 'sss') {
			return redirect('profile');
		} else {
			return redirect('my-resumes');
		}
	}

	public function resume_store(Request $request)
	{

		$input = $request->all();

		$category_id = '';
		if (!empty($input['category_id'])) {
			$category_id = $input['category_id'];
		}

		$image_award = array();
		if (!empty($input['image_award'])) {
			$image_award = $input['image_award'];
		}

		$image_achive = array();
		if (!empty($input['image_achive'])) {
			$image_achive = $input['image_achive'];
		}

		$sub_category_id = array();
		if (!empty($input['sub_category_id'])) {
			$sub_category_id = $input['sub_category_id'];
		}

		$tools_id = array();
		if (!empty($input['tools_id'])) {
			$tools_id = $input['tools_id'];
		}

		$skills_id = array();
		if (!empty($input['skills_id'])) {
			$skills_id = $input['skills_id'];
		}

		$tools_star = array();
		if (!empty($input['tools_star'])) {
			$tools_star = $input['tools_star'];
		}

		$skills_star = array();
		if (!empty($input['skills_star'])) {
			$skills_star = $input['skills_star'];
		}

		$hobbies_id = array();
		if (!empty($input['hobbies_id'])) {
			$hobbies_id = $input['hobbies_id'];
		}

		$date = date('Y-m-d h:i:s');

		$context_id = Auth::user()->context_id;

		if ($request->hasFile('image_award')) {
			$id_array_award = array();
			foreach ($request->image_award as $file) {
				$name = $file->getClientOriginalName();
				$destination = $_SERVER["DOCUMENT_ROOT"] . '/PrimaPlus/storage/uploads';
				$file->move($destination, $name);
				$string = "123456stringsawexs";
				$extension = pathinfo($name, PATHINFO_EXTENSION);
				$path = $destination . '/' . $name;
				$public = 1;
				$user_id = $context_id;
				$hash = str_shuffle($string);

				$request->user_id = $context_id;
				$request->name = $name;
				$request->extension = $extension;
				$request->path = $path;
				$request->public = $public;
				$request->hash = $hash;
				$date = date('Y-m-d h:i:s');

				$image_id = Module::insert("uploads", $request);
				$id_array_award[] = $image_id;
				$insert_award_id = implode(", ", $id_array_award);
				$request->image_award = $insert_award_id;
			}
		} else {
			$request->image_award = '';
		}

		if ($request->hasFile('image_achive')) {
			$id_array_achive = array();
			foreach ($request->image_achive as $files) {
				$name = $files->getClientOriginalName();;
				$destination = $_SERVER["DOCUMENT_ROOT"] . '/PrimaPlus/storage/uploads';
				$files->move($destination, $name);
				$string = "123456stringsawexs";
				$extension = pathinfo($name, PATHINFO_EXTENSION);
				$path = $destination . '/' . $name;
				$public = 1;
				$user_id = $context_id;
				$hash = str_shuffle($string);

				$request->user_id = $context_id;
				$request->name = $name;
				$request->extension = $extension;
				$request->path = $path;
				$request->public = $public;
				$request->hash = $hash;
				$date = date('Y-m-d h:i:s');

				$image_achive_id = Module::insert("uploads", $request);

				$id_array_achive[] = $image_achive_id;
				$insert_achive_id = implode(", ", $id_array_achive);
				$request->image_achive = $insert_achive_id;
			}
		} else {
			$request->image_achive = '';
		}
		$request->user_id = $context_id;
		$request->unique_id = uniqid();
		$insert_id = Module::insert("resumes", $request);
		$request->resume_id = $insert_id;


		foreach ($sub_category_id as $key => $sub_category_value) {

			DB::insert('insert into resume_categories (category_id,resume_id,sub_category_id,created_at,updated_at) values(?,?,?,?,?)', [$category_id, $request->resume_id, $sub_category_value, $date, $date]);
		}

		foreach ($tools_id as $key => $tools_id_value) {
			if (isset($tools_star[$key])  && $tools_star[$key] != '') {
				$tools_star_value = $tools_star[$key];
			} else {
				$tools_star_value = '';
			}

			DB::insert('insert into resume_tools (resume_id,tools_id,tools_star,created_at,updated_at) values(?,?,?,?,?)', [$request->resume_id, $tools_id_value, $tools_star_value, $date, $date]);
		}

		foreach ($skills_id as $key => $skills_id_value) {

			if (isset($skills_star[$key]) && $skills_star[$key] != '') {
				$skills_star_value = $skills_star[$key];
			} else {
				$skills_star_value = '';
			}
			DB::insert('insert into resume_skills (resume_id,skills_id,skills_star,created_at,updated_at) values(?,?,?,?,?)', [$request->resume_id, $skills_id_value, $skills_star_value, $date, $date]);
		}

		foreach ($hobbies_id as $key => $hobbies_id_value) {
			DB::insert('insert into resume_hobbies (resume_id,hobbies_id,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $hobbies_id_value, $date, $date]);
		}

		if (!empty($input['experience_from']) && !empty($input['experience_to']) && !empty($input['company_name']) && !empty($input['designation']) && !empty($input['work_city']) && !empty($input['roles_and_resp'])) {

			$experience_from = $input['experience_from'];
			$experience_to = $input['experience_to'];
			$company_name = $input['company_name'];
			$designation = $input['designation'];
			$work_city = $input['work_city'];
			$roles_and_resp = $input['roles_and_resp'];
			$current_working = $input['current_working'];
			foreach ($input['experience_from'] as $key => $experience_from_value) {

				$experience_to_value = $input['experience_to'][$key];
				$company_name_value = $input['company_name'][$key];
				$designation_value = $input['designation'][$key];
				$work_city_value = $input['work_city'][$key];
				$roles_and_resp_value = $input['roles_and_resp'][$key];
				$current_working_value = $input['current_working'][$key];
				$experience_fromstr = date('Y-m-d', strtotime($experience_from_value));
				DB::insert('insert into  resume_experiences (resume_id,experience_from,experience_to,company_name,designation, work_city,roles_and_resp,current_working,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?)', [$request->resume_id, $experience_fromstr, $experience_to_value, $company_name_value, $designation_value, $work_city_value, $roles_and_resp_value, $current_working_value, $date, $date]);
			}
		}

		if (!empty($input['degree']) && !empty($input['year']) && !empty($input['board']) && !empty($input['college']) && !empty($input['city'])) {

			$degree = $input['degree'];
			$year = $input['year'];
			$board = $input['board'];
			$college = $input['college'];
			$city = $input['city'];
			foreach ($input['degree'] as $key => $degree_value) {

				$year_value = $input['year'][$key];
				$board_value = $input['board'][$key];
				$college_value = $input['college'][$key];
				$city_value = $input['city'][$key];
				DB::insert('insert into academic_details (resume_id,degree,year,board,college,city,created_at,updated_at) values(?,?,?,?,?,?,?,?)', [$request->resume_id, $degree_value, $year_value, $board_value, $college_value, $city_value, $date, $date]);
			}
		}

		if (!empty($input['achievements'])) {
			$achievements = $input['achievements'];
			foreach ($achievements as $key => $achievements_value) {
				DB::insert('insert into resume_achievements (resume_id,achievements_title,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $achievements_value, $date, $date]);
			}
		}

		if (!empty($input['awards'])) {
			$awards = $input['awards'];
			foreach ($awards as $key => $awards_value) {
				DB::insert('insert into resume_awards (resume_id,awards_title,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $awards_value, $date, $date]);
			}
		}

		$tools_other = $input['tools_other'];
		$skills_other = $input['skills_other'];
		$hobbies = $input['hobbies'];
		$tools_otherArray = explode(',', $tools_other);
		$skills_otherArray = explode(',', $skills_other);
		$hobbiesArray = explode(',', $hobbies);

		if ($input['tools_other'] != '') { //if tools not blank

			foreach ($tools_otherArray as $key => $tools_other_value) {
				$tools_other_lower = strtolower($tools_other_value);
				$datasese = DB::table('tools')->where('tools_title', $tools_other_lower)->first();
				if (empty($datasese)) { //new value need to insert in both table
					$request->category_id = $category_id;
					$request->tools_title = $tools_other_lower;
					$request->publish = 'needtoapprove';
					$request->created_at = $date;
					$request->updated_at = $date;
					$last_lools_id = Module::insert("tools", $request);

					DB::insert('insert into resume_tools (resume_id,tools_id,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $last_lools_id, $date, $date]);
				} else { //value already exist insert in resume tools table

					DB::insert('insert into resume_tools (resume_id,tools_id,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $datasese->id, $date, $date]);
				}
			}
		}

		if ($input['skills_other'] != '') { //if tools not blank

			foreach ($skills_otherArray as $key => $skills_other_value) {
				$skills_other_lower = strtolower($skills_other_value);
				$array_data_skills = DB::table('skills')->where('skill_title', $skills_other_lower)->first();
				if (empty($array_data_skills)) { //new value need to insert in both table
					$request->category_id = $category_id;
					$request->skill_title = $skills_other_lower;
					$request->publish = 'needtoapprove';
					$request->created_at = $date;
					$request->updated_at = $date;
					$last_skills_id = Module::insert("skills", $request);
					DB::insert('insert into resume_skills (resume_id,skills_id,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $last_skills_id, $date, $date]);
				} else {

					DB::insert('insert into resume_skills (resume_id,skills_id,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $array_data_skills->id, $date, $date]);
				}
			}
		}

		if ($input['hobbies'] != '') {
			foreach ($hobbiesArray as $key => $hobbies_value) {
				$hobbies_value_lower = strtolower($hobbies_value);
				$array_data_hobbies = DB::table('hobbies')->where('hobbies_title', $hobbies_value_lower)->first();

				if (empty($array_data_hobbies)) {

					$request->hobbies_title = $hobbies_value_lower;
					$request->publish = 'needtoapprove';
					$request->created_at = $date;
					$request->updated_at = $date;
					$last_hobbies_id = Module::insert("hobbies", $request);

					DB::insert('insert into resume_hobbies (resume_id,hobbies_id,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $last_hobbies_id, $date, $date]);
				} else {
					DB::insert('insert into resume_hobbies (resume_id,hobbies_id,created_at,updated_at) values(?,?,?,?)', [$request->resume_id, $array_data_hobbies->id, $date, $date]);
				}
			}
		}
		Session::flash('resume_status', 'Your Resume has been submitted successfully.!');
		Session::flash('alert-class', 'alert-success');
		return;
	}

	/*verified user change the states in database*/
	public function confirm($confirmation_code)
	{
		if (!$confirmation_code) {
			throw new InvalidConfirmationCodeException;
		}
		$data['userss']  = DB::table('users')->where('confirmation_code', $confirmation_code)->first();
		$user_id = $data['userss']->context_id;

		if (!$data['userss']->confirmation_code) {
			throw new InvalidConfirmationCodeException;
		}

		$status = 1;
		DB::table('users')->where('context_id', $user_id)->update([
			'status' => $status
		]);
		Session::flash('success_veryify', 'You have successfully verified your account.');
		return redirect()->back();
	}

	public function getstate(request $request)
	{
		$countryid = $request->input('countryid');
		$data['states_list']  = DB::table('states')->where('country_id', $countryid)->get();
		return $data;
	}

	public function getcity(request $request)
	{
		/*$stateid = $request->input('stateid');
    	$term = $request->input('term');
    	$data  = DB::table('cities')->select('cities.*','cities.name as label', 'cities.name as value')->where('state_id', $stateid)->where('name', 'like', $term.'%')->get(); 
    	return json_encode($data);*/
		$stateid = $request->input('stateid');
		$datas  = DB::table('cities')->select('cities.name')->where('state_id', $stateid)->get();

		foreach ($datas as $key => $val) {
			$data[] = $val->name;
		}

		return $data;
	}

	public function getuseremail(request $request)
	{
		$user_email = $request->input('user_email');
		$data['user_data'] = DB::table('users')->where('email', $user_email)->first();

		if (empty($data['user_data'])) {
			echo 'false';
			die;
		} else {
			echo 'true';
			die;
		}
	}

	public function sendResumeLinkMail(Request $request)
	{
		$useremail = Auth::user()->email;
		$confirmation_code = $request->input('resumeurl');
		$resumeEmailto = $request->input('resumeEmail');


		$emailto = "sumitupkart100@gmail.com";
		if (env('MAIL_USERNAME') != null && env('MAIL_USERNAME') != "null" && env('MAIL_USERNAME') != "") {
			// Send mail to User his new Password
			Mail::send('emails.sendResumeUrlMail', ['confirmation_code' => $confirmation_code], function ($m) use ($resumeEmailto) {
				$m->from(env('MAIL_USERNAME'), 'PrimaPlus');
				$m->to($resumeEmailto, 'Admin');
				$m->subject('Resume link');
			});
		}
	}
	public function blog($id)
	{
		$data = $this->common();

		if (Auth::user()) {
			$context_id = @Auth::user()->context_id;
			$data['personal_details'] = DB::table('employees')->where('employees.id', $context_id)->first();

			$data['cities_emp'] = @DB::table('cities')->where('cities.id', $data['personal_details']->city)->first();
			/*print_r($data['cities_emp']);
		die;*/
		}

		$data['latest_blog_news_details'] = DB::table('latest_blog_news')
			->leftjoin('uploads', 'uploads.id', '=', 'latest_blog_news.image')->select('latest_blog_news.id AS blogid', 'latest_blog_news.url AS slug', 'latest_blog_news.*', 'uploads.*')->where('latest_blog_news.url', $id)->first();
		$data['meta_title'] = $data['latest_blog_news_details']->meta_title;
		$sata['meta_keyword'] = $data['latest_blog_news_details']->meta_keyword;
		$data['meta_description'] = $data['latest_blog_news_details']->meta_description;
		$data['container_img']  = DB::table('uploads')->where('id', $data['latest_blog_news_details']->container_img)->first();
		$blog_id = $data['latest_blog_news_details']->blogid;
		$data['blog_comments'] = DB::table('blog_comments')->where('is_approve', 'yes')->where('blog_id', $blog_id)->orderby('id', 'desc')->get();
		/*print_r($data['blog_comments']); die;*/
		$data['blog_id'] = $blog_id;
		return view('header', $data) . view('blog.detail', $data) . view('footer', $data);
	}
	public function blogComment(Request $request)
	{
		/*$email = $request->input('email');
    	$password = $request->input('password');*/
		/*$this->validate($request,[
	    	    	 'blog_id' =>'required',
	    	    	 'name' =>'required',
	    	    	 'email' => 'required',
	    	    	 'mobile' => 'required',
	    	    	 'city' => 'required',
	    	    	 'comment' => 'required'
			   ]);*/
		/*$insert_id = Module::insert("blog_comments", $request);
			Session()->flash('blogCommentsuccess', '');
			
			return redirect()->back();*/

		$blog_id = $request->input('blog_id');
		$email = $request->input('email');
		$comment = $request->input('comment');
		$request->is_approve = 'no';

		if (!empty($blog_id) && !empty($email) && !empty($comment)) {
			$date = date('Y-m-d h:i:s');
			/*DB::insert('insert into blog_comments (blog_id,name,email,mobile,city,comment,is_approve,created_at,updated_at) values(?,?,?,?,?,?,?,?,?)',$request->blog_id,$request->name,$request->email,$request->mobile,$request->city,$request->comment,$request->is_approve,$date,$date);*/
			DB::insert('insert into blog_comments (blog_id,name,email,mobile,city,comment,is_approve,created_at,updated_at) values(?,?,?,?,?,?,?,?,?)', [$request->blog_id, $request->name, $request->email, $request->mobile, $request->city, $request->comment, $request->is_approve, $date, $date]);
			/*$insert_id = Module::insert("blog_comments", $request);*/
			die();
			/*Session::flash('subscribe_success', 'Thanks for subscribing!'); 
			die;*/
		} else {
			echo 'true';
			die;
		}
	}

	public function blogListing()
	{

		$data = $this->common();
		$data['blog_listing_seos'] = DB::table('blog_listing_seos')->where('deleted_at', NULL)->where('id', 1)->first();
		$data['meta_title'] = $data['blog_listing_seos']->meta_title;
		$data['meta_keyword'] = $data['blog_listing_seos']->meta_keyword;
		$data['meta_description'] = $data['blog_listing_seos']->meta_description;
		$data['latest_blog_news_listing']  = DB::table('latest_blog_news')
			->leftjoin('uploads', 'uploads.id', '=', 'latest_blog_news.image')->select('latest_blog_news.id AS blogid', 'latest_blog_news.url AS slug', 'latest_blog_news.*', 'uploads.*')->where('latest_blog_news.deleted_at', NULL)->orderby('blogid', 'desc')->get();
		/*$roleCount = \App\Role::count();
		if($roleCount != 0) {
			if($roleCount != 0) {
				$data['role_id']=3;*/

		return view('header', $data) . view('blog.blogListing', $data) . view('footer', $data);
		/*}
		} else {
			return view('errors.error', [
				'title' => 'Migration not completed',
				'message' => 'Please run command <code>php artisan db:seed</code> to generate required table data.',
			]);
		}*/
	}
	public function training()
	{
		$data = $this->common();
		//print_r($data['trainings']); die;
		$data['meta_title'] = $data['trainings']->meta_title;
		$data['meta_keyword'] = $data['trainings']->meta_keyword;
		$data['meta_description'] = $data['trainings']->meta_description;
		return view('header', $data) . view('training.detail', $data) . view('footer', $data);
	}
	public function term_condition()
	{
		$data = $this->common();
		$data['term_condition_seos'] = DB::table('term_condition_seos')->where('deleted_at', NULL)->where('id', 1)->first();
		$data['meta_title'] = $data['term_condition_seos']->meta_title;
		$data['meta_keyword'] = $data['term_condition_seos']->meta_keyword;
		$data['meta_description'] = $data['term_condition_seos']->meta_description;
		return view('header', $data) . view('terms_conditions.terms_conditions', $data) . view('footer', $data);
	}

	public function about_us()
	{
		$data = $this->common();
		//print_r($data['about_us']); die;
		$data['meta_title'] = $data['about_us']->meta_title;
		$data['meta_keyword'] = $data['about_us']->meta_keyword;
		$data['meta_description'] = $data['about_us']->meta_description;
		return view('header', $data) . view('about_us.detail', $data) . view('footer', $data);
	}
	public function contacts(Request $request)
	{
		$name = $request->input('name');
		$email = $request->input('email');
		$subject = $request->input('subject');
		$message = $request->input('message');

		if (!empty($request->all())) {
			$insert_id = Module::insert("contacts", $request);
			Session::flash('contact_succ', 'Thanks for contact!');
			die();
		} else {
			echo 'true';
			die;
		}
	}
	/**
	 * Download excel to KPI.
	 *
	 * @return Response
	 */
	public function download_excel_contact(Request $request)
	{
		$id = @Auth::user()->id;
		$type = "csv";
		$excel_name = "Contact Form Data";
		$data = DB::table('contacts')->select('name', 'email', 'subject', 'message', 'created_at as date')
			->where('contacts.deleted_at', NULL)
			->orderBy('contacts.id', 'desc')
			->get();
		if (!empty($data)) {
			$data = collect($data)->map(function ($x) {
				return (array) $x;
			})->toArray();
			return Excel::create($excel_name, function ($excel) use ($data) {
				$excel->sheet('mySheet', function ($sheet) use ($data) {
					$sheet->fromArray($data);
				});
			})->download($type);
		} else {
			Session()->flash('status', 'User not available');
			return redirect()->back()->with('lead_data_not_found', 'Data not Found!');
		}
	}
	/**
	 * Download excel to KPI.
	 *
	 * @return Response
	 */
	public function download_excel_subscribes(Request $request)
	{
		$id = @Auth::user()->id;
		$type = "csv";
		$excel_name = "Subscribes Form Data";
		$data = DB::table('subscribes')->select('subscribes_email', 'created_at as date')
			->where('subscribes.deleted_at', NULL)
			->orderBy('subscribes.id', 'desc')
			->get();
		if (!empty($data)) {
			$data = collect($data)->map(function ($x) {
				return (array) $x;
			})->toArray();
			return Excel::create($excel_name, function ($excel) use ($data) {
				$excel->sheet('mySheet', function ($sheet) use ($data) {
					$sheet->fromArray($data);
				});
			})->download($type);
		} else {
			Session()->flash('status', 'User not available');
			return redirect()->back()->with('lead_data_not_found', 'Data not Found!');
		}
	}
	/**
	 * Download excel to KPI.
	 *
	 * @return Response
	 */
	public function subscribes_send_mail(Request $request)
	{
		$data = DB::table('subscribes')->select('subscribes_email as email')
			->where('subscribes.deleted_at', NULL)
			->orderBy('subscribes.id', 'desc')
			->get();
		if (!empty($data)) {
			foreach ($data as $key => $row) {
				if (env('MAIL_USERNAME') != null && env('MAIL_USERNAME') != "null" && env('MAIL_USERNAME') != "") {
					$userEmail = $row->email;
					// Send mail to User his new Password
					Mail::send('emails.subscribes_mail', function ($m) use ($userEmail) {
						$m->from(env('MAIL_USERNAME'), 'PrimaPlus');
						$m->to($userEmail, 'Admin')->subject('Subscribes mail PrimaPlus');
					});
				}
			}
		} else {
			Session()->flash('status', 'User not available');
			return redirect()->back()->with('lead_data_not_found', 'Data not Found!');
		}
	}
}
