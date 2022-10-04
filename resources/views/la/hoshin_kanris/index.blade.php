@extends("la.layouts.app")

@section("contentheader_title", "Hoshin kanris")
@section("contentheader_description", "Hoshin kanris listing")
@section("section", "Hoshin kanris")
@section("sub_section", "Listing")
@section("htmlheader_title", "Hoshin kanris Listing")

@section("headerElems")
@la_access("Hoshin_kanris", "create")
	<button class="btn btn-success btn-sm pull-right" data-toggle="modal" data-target="#AddModal">Add Hoshin kanri</button>
@endla_access
@endsection

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

<div class="box box-success">
	<!--<div class="box-header"></div>-->
	<div class="box-body">
		<table id="example1" class="table table-bordered">
		<thead>
		<tr class="success">
			@foreach( $listing_cols as $col )
			<th>{{ $module->fields[$col]['label'] or ucfirst($col) }}</th>
			@endforeach
			@if($show_actions)
			<th>Actions</th>
			@endif
		</tr>
		</thead>
		<tbody>
			
		</tbody>
		</table>
	</div>
</div>

@la_access("Hoshin_kanris", "create")
<div class="modal fade" id="AddModal" role="dialog" aria-labelledby="myModalLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel">Add Hoshin kanri</h4>
			</div>
			{!! Form::open(['action' => 'LA\Hoshin_kanrisController@store', 'id' => 'hoshin_kanri-add-form']) !!}
			<div class="modal-body">
				<div class="box-body">
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
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				{!! Form::submit( 'Submit', ['class'=>'btn btn-success']) !!}
			</div>
			{!! Form::close() !!}
		</div>
	</div>
</div>
@endla_access

@endsection

@push('styles')
<link rel="stylesheet" type="text/css" href="{{ asset('la-assets/plugins/datatables/datatables.min.css') }}"/>
@endpush

@push('scripts')
<script src="{{ asset('la-assets/plugins/datatables/datatables.min.js') }}"></script>
<script>
$(function () {
	$("#example1").DataTable({
		processing: true,
        serverSide: true,
        ajax: "{{ url(config('laraadmin.adminRoute') . '/hoshin_kanri_dt_ajax') }}",
		language: {
			lengthMenu: "_MENU_",
			search: "_INPUT_",
			searchPlaceholder: "Search"
		},
		@if($show_actions)
		columnDefs: [ { orderable: false, targets: [-1] }],
		@endif
	});
	$("#hoshin_kanri-add-form").validate({
		
	});
});
</script>
@endpush
