@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/project_resources') }}">Project resource</a> :
@endsection
@section("contentheader_description", $project_resource->$view_col)
@section("section", "Project resources")
@section("section_url", url(config('laraadmin.adminRoute') . '/project_resources'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Project resources Edit : ".$project_resource->$view_col)

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
				{!! Form::model($project_resource, ['route' => [config('laraadmin.adminRoute') . '.project_resources.update', $project_resource->id ], 'method'=>'PUT', 'id' => 'project_resource-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'resource_uesr')
					@la_input($module, 'week')
					@la_input($module, 'actual')
					@la_input($module, 'project_id')
					@la_input($module, 'target')
					@la_input($module, 'externl_user')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/project_resources') }}">Cancel</a></button>
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
	$("#project_resource-edit-form").validate({
		
	});
});
</script>
@endpush
