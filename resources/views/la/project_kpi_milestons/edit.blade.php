@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/project_kpi_milestons') }}">Project kpi mileston</a> :
@endsection
@section("contentheader_description", $project_kpi_mileston->$view_col)
@section("section", "Project kpi milestons")
@section("section_url", url(config('laraadmin.adminRoute') . '/project_kpi_milestons'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Project kpi milestons Edit : ".$project_kpi_mileston->$view_col)

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
				{!! Form::model($project_kpi_mileston, ['route' => [config('laraadmin.adminRoute') . '.project_kpi_milestons.update', $project_kpi_mileston->id ], 'method'=>'PUT', 'id' => 'project_kpi_mileston-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'project_kpi_sr_no')
					@la_input($module, 'milestone_id')
					@la_input($module, 'projct_kpi_dstrbt_vl')
					@la_input($module, 'project_kpi_id')
					@la_input($module, 'project_id')
					@la_input($module, 'project_kpi_actual')
					@la_input($module, 'project_kpi_reason')
					@la_input($module, 'project_kpi_solution')
					@la_input($module, 'project_kpi_status')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/project_kpi_milestons') }}">Cancel</a></button>
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
	$("#project_kpi_mileston-edit-form").validate({
		
	});
});
</script>
@endpush
