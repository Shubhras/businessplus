@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/company_steps') }}">Company step</a> :
@endsection
@section("contentheader_description", $company_step->$view_col)
@section("section", "Company steps")
@section("section_url", url(config('laraadmin.adminRoute') . '/company_steps'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Company steps Edit : ".$company_step->$view_col)

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
				{!! Form::model($company_step, ['route' => [config('laraadmin.adminRoute') . '.company_steps.update', $company_step->id ], 'method'=>'PUT', 'id' => 'company_step-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'step_no')
					@la_input($module, 'step_name')
					@la_input($module, 'company_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/company_steps') }}">Cancel</a></button>
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
	$("#company_step-edit-form").validate({
		
	});
});
</script>
@endpush
