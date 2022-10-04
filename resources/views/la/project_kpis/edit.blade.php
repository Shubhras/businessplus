@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/project_kpis') }}">Project kpi</a> :
@endsection
@section("contentheader_description", $project_kpi->$view_col)
@section("section", "Project kpis")
@section("section_url", url(config('laraadmin.adminRoute') . '/project_kpis'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Project kpis Edit : ".$project_kpi->$view_col)

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
				{!! Form::model($project_kpi, ['route' => [config('laraadmin.adminRoute') . '.project_kpis.update', $project_kpi->id ], 'method'=>'PUT', 'id' => 'project_kpi-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'project_kpi_name')
					@la_input($module, 'project_kpi_dept')
					@la_input($module, 'project_kpi_uom')
					@la_input($module, 'project_kpi_value')
					@la_input($module, 'project_id')
					@la_input($module, 'project_kpi_def')
					@la_input($module, 'project_kpi_trend')
					@la_input($module, 'project_kpi_yr_targt')
					@la_input($module, 'project_kpi_freqency')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/project_kpis') }}">Cancel</a></button>
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
	$("#project_kpi-edit-form").validate({
		
	});
});
</script>
@endpush
