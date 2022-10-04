@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/project_files') }}">Project file</a> :
@endsection
@section("contentheader_description", $project_file->$view_col)
@section("section", "Project files")
@section("section_url", url(config('laraadmin.adminRoute') . '/project_files'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Project files Edit : ".$project_file->$view_col)

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
				{!! Form::model($project_file, ['route' => [config('laraadmin.adminRoute') . '.project_files.update', $project_file->id ], 'method'=>'PUT', 'id' => 'project_file-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'project_id')
					@la_input($module, 'logedin_user_id')
					@la_input($module, 'upload_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/project_files') }}">Cancel</a></button>
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
	$("#project_file-edit-form").validate({
		
	});
});
</script>
@endpush
