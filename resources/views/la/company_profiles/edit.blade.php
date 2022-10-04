@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/company_profiles') }}">Company profile</a> :
@endsection
@section("contentheader_description", $company_profile->$view_col)
@section("section", "Company profiles")
@section("section_url", url(config('laraadmin.adminRoute') . '/company_profiles'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Company profiles Edit : ".$company_profile->$view_col)

@section("main-content")

@if (count($errors) > 0)
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="box">
	<div class="box-header">
		
	</div>
	<div class="box-body">
		<div class="row">
			<div class="col-md-8 col-md-offset-2">
				{!! Form::model($company_profile, ['route' => [config('laraadmin.adminRoute') . '.company_profiles.update', $company_profile->id ], 'method'=>'PUT', 'id' => 'company_profile-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'company_name')
					@la_input($module, 'company_address')
					@la_input($module, 'enable')
					@la_input($module, 'company_logo')
					@la_input($module, 'user_id')
					@la_input($module, 'company_step_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/company_profiles') }}">Cancel</a></button>
					</div>
				{!! Form::close() !!}
			</div>
		</div>
	</div>
</div>

@endsection

@push('scripts')
<script>
$(function () {
	$("#company_profile-edit-form").validate({
		
	});
});
</script>
@endpush
