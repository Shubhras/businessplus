@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/project_governances') }}">Project governance</a> :
@endsection
@section("contentheader_description", $project_governance->$view_col)
@section("section", "Project governances")
@section("section_url", url(config('laraadmin.adminRoute') . '/project_governances'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Project governances Edit : ".$project_governance->$view_col)

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
				{!! Form::model($project_governance, ['route' => [config('laraadmin.adminRoute') . '.project_governances.update', $project_governance->id ], 'method'=>'PUT', 'id' => 'project_governance-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'agenda')
					@la_input($module, 'meeting_name')
					@la_input($module, 'chair_person')
					@la_input($module, 'co_chair_person')
					@la_input($module, 'gov_frequency')
					@la_input($module, 'gov_venue')
					@la_input($module, 'gov_duration')
					@la_input($module, 'meeting_day')
					@la_input($module, 'meeting_shedule')
					@la_input($module, 'project_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/project_governances') }}">Cancel</a></button>
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
	$("#project_governance-edit-form").validate({
		
	});
});
</script>
@endpush
