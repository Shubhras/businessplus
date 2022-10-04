@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/project_bdget_trakigs') }}">Project bdget trakig</a> :
@endsection
@section("contentheader_description", $project_bdget_trakig->$view_col)
@section("section", "Project bdget trakigs")
@section("section_url", url(config('laraadmin.adminRoute') . '/project_bdget_trakigs'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Project bdget trakigs Edit : ".$project_bdget_trakig->$view_col)

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
				{!! Form::model($project_bdget_trakig, ['route' => [config('laraadmin.adminRoute') . '.project_bdget_trakigs.update', $project_bdget_trakig->id ], 'method'=>'PUT', 'id' => 'project_bdget_trakig-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'project_id')
					@la_input($module, 'allocation_dstrbt_vl')
					@la_input($module, 'dept_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/project_bdget_trakigs') }}">Cancel</a></button>
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
	$("#project_bdget_trakig-edit-form").validate({
		
	});
});
</script>
@endpush
