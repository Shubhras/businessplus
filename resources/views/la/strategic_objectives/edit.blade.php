@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/strategic_objectives') }}">Strategic objective</a> :
@endsection
@section("contentheader_description", $strategic_objective->$view_col)
@section("section", "Strategic objectives")
@section("section_url", url(config('laraadmin.adminRoute') . '/strategic_objectives'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Strategic objectives Edit : ".$strategic_objective->$view_col)

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
				{!! Form::model($strategic_objective, ['route' => [config('laraadmin.adminRoute') . '.strategic_objectives.update', $strategic_objective->id ], 'method'=>'PUT', 'id' => 'strategic_objective-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'previous_status')
					@la_input($module, 'status')
					@la_input($module, 'unit_of_measurement')
					@la_input($module, 'percentage')
					@la_input($module, 'user_id')
					@la_input($module, 'target')
					@la_input($module, 'start_date')
					@la_input($module, 'end_date')
					@la_input($module, 'unit_id')
					@la_input($module, 'department_id')
					@la_input($module, 'functions_id')
					@la_input($module, 'tracking_frequency')
					@la_input($module, 'description')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/strategic_objectives') }}">Cancel</a></button>
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
	$("#strategic_objective-edit-form").validate({
		
	});
});
</script>
@endpush
