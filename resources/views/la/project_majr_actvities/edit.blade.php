@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/project_majr_actvities') }}">Project majr actvity</a> :
@endsection
@section("contentheader_description", $project_majr_actvity->$view_col)
@section("section", "Project majr actvities")
@section("section_url", url(config('laraadmin.adminRoute') . '/project_majr_actvities'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Project majr actvities Edit : ".$project_majr_actvity->$view_col)

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
				{!! Form::model($project_majr_actvity, ['route' => [config('laraadmin.adminRoute') . '.project_majr_actvities.update', $project_majr_actvity->id ], 'method'=>'PUT', 'id' => 'project_majr_actvity-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'other_responsibility')
					@la_input($module, 'activity_name')
					@la_input($module, 'activity_start_date')
					@la_input($module, 'activity_end_date')
					@la_input($module, 'preceeding_activity')
					@la_input($module, 'next_activity')
					@la_input($module, 'responsibility')
					@la_input($module, 'milestone_id')
					@la_input($module, 'activity_sr_no')
					@la_input($module, 'project_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/project_majr_actvities') }}">Cancel</a></button>
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
	$("#project_majr_actvity-edit-form").validate({
		
	});
});
</script>
@endpush
