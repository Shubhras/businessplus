@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/project_risk_as_logs') }}">Project risk as log</a> :
@endsection
@section("contentheader_description", $project_risk_as_log->$view_col)
@section("section", "Project risk as logs")
@section("section_url", url(config('laraadmin.adminRoute') . '/project_risk_as_logs'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Project risk as logs Edit : ".$project_risk_as_log->$view_col)

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
				{!! Form::model($project_risk_as_log, ['route' => [config('laraadmin.adminRoute') . '.project_risk_as_logs.update', $project_risk_as_log->id ], 'method'=>'PUT', 'id' => 'project_risk_as_log-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'risk_item')
					@la_input($module, 'risk_time_required')
					@la_input($module, 'risk_level')
					@la_input($module, 'risk_responsibility')
					@la_input($module, 'risk_mtiqation_plan')
					@la_input($module, 'project_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/project_risk_as_logs') }}">Cancel</a></button>
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
	$("#project_risk_as_log-edit-form").validate({
		
	});
});
</script>
@endpush
