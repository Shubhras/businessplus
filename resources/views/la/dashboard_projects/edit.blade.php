@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/dashboard_projects') }}">Dashboard project</a> :
@endsection
@section("contentheader_description", $dashboard_project->$view_col)
@section("section", "Dashboard projects")
@section("section_url", url(config('laraadmin.adminRoute') . '/dashboard_projects'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Dashboard projects Edit : ".$dashboard_project->$view_col)

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
				{!! Form::model($dashboard_project, ['route' => [config('laraadmin.adminRoute') . '.dashboard_projects.update', $dashboard_project->id ], 'method'=>'PUT', 'id' => 'dashboard_project-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/dashboard_projects') }}">Cancel</a></button>
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
	$("#dashboard_project-edit-form").validate({
		
	});
});
</script>
@endpush
