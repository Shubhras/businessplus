@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/project_milestones') }}">Project milestone</a> :
@endsection
@section("contentheader_description", $project_milestone->$view_col)
@section("section", "Project milestones")
@section("section_url", url(config('laraadmin.adminRoute') . '/project_milestones'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Project milestones Edit : ".$project_milestone->$view_col)

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
				{!! Form::model($project_milestone, ['route' => [config('laraadmin.adminRoute') . '.project_milestones.update', $project_milestone->id ], 'method'=>'PUT', 'id' => 'project_milestone-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'milestone_status')
					@la_input($module, 'actual_date')
					@la_input($module, 'comment')
					@la_input($module, 'milestone_name')
					@la_input($module, 'mile_stone_date')
					@la_input($module, 'dependency')
					@la_input($module, 'symbol')
					@la_input($module, 'description')
					@la_input($module, 'project_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/project_milestones') }}">Cancel</a></button>
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
	$("#project_milestone-edit-form").validate({
		
	});
});
</script>
@endpush
