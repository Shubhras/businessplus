@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/projects') }}">Project</a> :
@endsection
@section("contentheader_description", $project->$view_col)
@section("section", "Projects")
@section("section_url", url(config('laraadmin.adminRoute') . '/projects'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Projects Edit : ".$project->$view_col)

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
				{!! Form::model($project, ['route' => [config('laraadmin.adminRoute') . '.projects.update', $project->id ], 'method'=>'PUT', 'id' => 'project-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'project_step_id')
					@la_input($module, 'currency')
					@la_input($module, 'project_logo')
					@la_input($module, 'key_objective')
					@la_input($module, 'project_mission')
					@la_input($module, 'company_id')
					@la_input($module, 'project_cost')
					@la_input($module, 'project_duration')
					@la_input($module, 'project_name')
					@la_input($module, 'unit_id')
					@la_input($module, 'department_id')
					@la_input($module, 'category_id')
					@la_input($module, 'event_id')
					@la_input($module, 'start_date')
					@la_input($module, 'end_date')
					@la_input($module, 'user_id')
					@la_input($module, 'status_id')
					@la_input($module, 'business_init_id')
					@la_input($module, 'enable')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/projects') }}">Cancel</a></button>
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
	$("#project-edit-form").validate({
		
	});
});
</script>
@endpush
