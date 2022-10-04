@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/add_kpis') }}">Add kpi</a> :
@endsection
@section("contentheader_description", $add_kpi->$view_col)
@section("section", "Add kpis")
@section("section_url", url(config('laraadmin.adminRoute') . '/add_kpis'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Add kpis Edit : ".$add_kpi->$view_col)

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
				{!! Form::model($add_kpi, ['route' => [config('laraadmin.adminRoute') . '.add_kpis.update', $add_kpi->id ], 'method'=>'PUT', 'id' => 'add_kpi-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'lead_kpi')
					@la_input($module, 'start_date')
					@la_input($module, 'end_date')
					@la_input($module, 'frequency')
					@la_input($module, 'kpi_performance')
					@la_input($module, 's_o_id')
					@la_input($module, 'initiatives_id')
					@la_input($module, 'performance_dash')
					@la_input($module, 'kpi_name')
					@la_input($module, 'unit_id')
					@la_input($module, 'department_id')
					@la_input($module, 'target_condition')
					@la_input($module, 'ideal_trend')
					@la_input($module, 'kpi_type')
					@la_input($module, 'unit_of_measurement')
					@la_input($module, 'target_range_min')
					@la_input($module, 'target_range_max')
					@la_input($module, 'kpi_definition')
					@la_input($module, 'user_id')
					@la_input($module, 'section_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/add_kpis') }}">Cancel</a></button>
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
	$("#add_kpi-edit-form").validate({
		
	});
});
</script>
@endpush
