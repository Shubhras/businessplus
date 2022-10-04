@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/project_sub_actvities') }}">Project sub actvity</a> :
@endsection
@section("contentheader_description", $project_sub_actvity->$view_col)
@section("section", "Project sub actvities")
@section("section_url", url(config('laraadmin.adminRoute') . '/project_sub_actvities'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Project sub actvities Edit : ".$project_sub_actvity->$view_col)

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
				{!! Form::model($project_sub_actvity, ['route' => [config('laraadmin.adminRoute') . '.project_sub_actvities.update', $project_sub_actvity->id ], 'method'=>'PUT', 'id' => 'project_sub_actvity-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'responsibility')
					@la_input($module, 'major_activity_id')
					@la_input($module, 'sub_activity_name')
					@la_input($module, 'sb_actvity_strt_date')
					@la_input($module, 'sb_actvity_end_date')
					@la_input($module, 'project_id')
					@la_input($module, 'sub_activity_sr_no')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/project_sub_actvities') }}">Cancel</a></button>
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
	$("#project_sub_actvity-edit-form").validate({
		
	});
});
</script>
@endpush
