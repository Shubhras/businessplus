@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/employers') }}">Employer</a> :
@endsection
@section("contentheader_description", $employer->$view_col)
@section("section", "Employers")
@section("section_url", url(config('laraadmin.adminRoute') . '/employers'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Employers Edit : ".$employer->$view_col)

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
				{!! Form::model($employer, ['route' => [config('laraadmin.adminRoute') . '.employers.update', $employer->id ], 'method'=>'PUT', 'id' => 'employer-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'multi_section_id')
					@la_input($module, 'reason_model_name')
					@la_input($module, 'company_id')
					@la_input($module, 'reset_password_token')
					@la_input($module, 'multi_unit_id')
					@la_input($module, 'multi_dept_id')
					@la_input($module, 'name')
					@la_input($module, 'designation')
					@la_input($module, 'gender')
					@la_input($module, 'mobile')
					@la_input($module, 'mobile2')
					@la_input($module, 'email')
					@la_input($module, 'city')
					@la_input($module, 'address')
					@la_input($module, 'date_birth')
					@la_input($module, 'unit_id')
					@la_input($module, 'date_hire')
					@la_input($module, 'dept_master_id')
					@la_input($module, 'section_id')
					@la_input($module, 'role_id')
					@la_input($module, 'pan_card_no')
					@la_input($module, 'user_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/employers') }}">Cancel</a></button>
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
	$("#employer-edit-form").validate({
		
	});
});
</script>
@endpush
