@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/project_isue_trackers') }}">Project isue tracker</a> :
@endsection
@section("contentheader_description", $project_isue_tracker->$view_col)
@section("section", "Project isue trackers")
@section("section_url", url(config('laraadmin.adminRoute') . '/project_isue_trackers'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Project isue trackers Edit : ".$project_isue_tracker->$view_col)

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
				{!! Form::model($project_isue_tracker, ['route' => [config('laraadmin.adminRoute') . '.project_isue_trackers.update', $project_isue_tracker->id ], 'method'=>'PUT', 'id' => 'project_isue_tracker-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'issue_task_name')
					@la_input($module, 'issue_task_priority')
					@la_input($module, 'issue_task_dept')
					@la_input($module, 'issue_start_date')
					@la_input($module, 'issue_end_date')
					@la_input($module, 'issue_task_owner')
					@la_input($module, 'issue_task_co_owner')
					@la_input($module, 'issue_remindr_freq')
					@la_input($module, 'project_id')
					@la_input($module, 'issue_status')
					@la_input($module, 'completion_date')
					@la_input($module, 'issue_revised_date')
					@la_input($module, 'issue_task_reason')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/project_isue_trackers') }}">Cancel</a></button>
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
	$("#project_isue_tracker-edit-form").validate({
		
	});
});
</script>
@endpush
