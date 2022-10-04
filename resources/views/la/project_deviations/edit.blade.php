@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/project_deviations') }}">Project deviation</a> :
@endsection
@section("contentheader_description", $project_deviation->$view_col)
@section("section", "Project deviations")
@section("section_url", url(config('laraadmin.adminRoute') . '/project_deviations'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Project deviations Edit : ".$project_deviation->$view_col)

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
				{!! Form::model($project_deviation, ['route' => [config('laraadmin.adminRoute') . '.project_deviations.update', $project_deviation->id ], 'method'=>'PUT', 'id' => 'project_deviation-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'deviation_name')
					@la_input($module, 'deviation_region')
					@la_input($module, 'deviation_risk')
					@la_input($module, 'deviation_start_date')
					@la_input($module, 'deviation_end_date')
					@la_input($module, 'deviation_qty')
					@la_input($module, 'deviation_dept')
					@la_input($module, 'deviation_aprove_usr')
					@la_input($module, 'file_id')
					@la_input($module, 'project_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/project_deviations') }}">Cancel</a></button>
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
	$("#project_deviation-edit-form").validate({
		
	});
});
</script>
@endpush
