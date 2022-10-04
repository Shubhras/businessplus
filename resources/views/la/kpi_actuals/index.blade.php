@extends("la.layouts.app")

@section("contentheader_title", "Kpi actuals")
@section("contentheader_description", "Kpi actuals listing")
@section("section", "Kpi actuals")
@section("sub_section", "Listing")
@section("htmlheader_title", "Kpi actuals Listing")

@section("headerElems")
@la_access("Kpi_actuals", "create")
	<button class="btn btn-success btn-sm pull-right" data-toggle="modal" data-target="#AddModal">Add Kpi actual</button>
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

@la_access("Kpi_actuals", "create")
<div class="modal fade" id="AddModal" role="dialog" aria-labelledby="myModalLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel">Add Kpi actual</h4>
			</div>
			{!! Form::open(['action' => 'LA\Kpi_actualsController@store', 'id' => 'kpi_actual-add-form']) !!}
			<div class="modal-body">
				<div class="box-body">
                    @la_form($module)
					
					{{--
					@la_input($module, 'ytd')
					@la_input($module, 'user_id')
					@la_input($module, 'kpi_id')
					@la_input($module, 'jan')
					@la_input($module, 'feb')
					@la_input($module, 'mar')
					@la_input($module, 'apr')
					@la_input($module, 'may')
					@la_input($module, 'jun')
					@la_input($module, 'jul')
					@la_input($module, 'aug')
					@la_input($module, 'sep')
					@la_input($module, 'oct')
					@la_input($module, 'nov')
					@la_input($module, 'dec')
					@la_input($module, 'actual_year')
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
        ajax: "{{ url(config('laraadmin.adminRoute') . '/kpi_actual_dt_ajax') }}",
		language: {
			lengthMenu: "_MENU_",
			search: "_INPUT_",
			searchPlaceholder: "Search"
		},
		@if($show_actions)
		columnDefs: [ { orderable: false, targets: [-1] }],
		@endif
	});
	$("#kpi_actual-add-form").validate({
		
	});
});
</script>
@endpush