@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/new_projects') }}">New project</a> :
@endsection
@section("contentheader_description", $new_project->$view_col)
@section("section", "New projects")
@section("section_url", url(config('laraadmin.adminRoute') . '/new_projects'))
@section("sub_section", "Edit")

@section("htmlheader_title", "New projects Edit : ".$new_project->$view_col)

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
				{!! Form::model($new_project, ['route' => [config('laraadmin.adminRoute') . '.new_projects.update', $new_project->id ], 'method'=>'PUT', 'id' => 'new_project-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_new')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/new_projects') }}">Cancel</a></button>
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
	$("#new_project-edit-form").validate({
		
	});
});
</script>
@endpush
