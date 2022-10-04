@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/hoshin_kanris') }}">Hoshin kanri</a> :
@endsection
@section("contentheader_description", $hoshin_kanri->$view_col)
@section("section", "Hoshin kanris")
@section("section_url", url(config('laraadmin.adminRoute') . '/hoshin_kanris'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Hoshin kanris Edit : ".$hoshin_kanri->$view_col)

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
				{!! Form::model($hoshin_kanri, ['route' => [config('laraadmin.adminRoute') . '.hoshin_kanris.update', $hoshin_kanri->id ], 'method'=>'PUT', 'id' => 'hoshin_kanri-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'dept_id')
					@la_input($module, 'str_obj_id')
					@la_input($module, 'initiatives_id')
					@la_input($module, 'action_plan_id')
					@la_input($module, 'kpi_id')
					@la_input($module, 'area_manager')
					@la_input($module, 'area_manager_value')
					@la_input($module, 'area_manager_percent')
					@la_input($module, 'dept_head')
					@la_input($module, 'dept_head_value')
					@la_input($module, 'dept_head_percent')
					@la_input($module, 'section_head')
					@la_input($module, 'section_head_value')
					@la_input($module, 'section_head_percent')
					@la_input($module, 'supervisor_head')
					@la_input($module, 'superv_head_value')
					@la_input($module, 'superv_head_percent')
					@la_input($module, 'unit_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/hoshin_kanris') }}">Cancel</a></button>
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
	$("#hoshin_kanri-edit-form").validate({
		
	});
});
</script>
@endpush
