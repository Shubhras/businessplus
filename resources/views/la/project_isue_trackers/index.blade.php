@extends("la.layouts.app")

@section("contentheader_title", "Project isue trackers")
@section("contentheader_description", "Project isue trackers listing")
@section("section", "Project isue trackers")
@section("sub_section", "Listing")
@section("htmlheader_title", "Project isue trackers Listing")

@section("headerElems")
@la_access("Project_isue_trackers", "create")
	<button class="btn btn-success btn-sm pull-right" data-toggle="modal" data-target="#AddModal">Add Project isue tracker</button>
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

@la_access("Project_isue_trackers", "create")
<div class="modal fade" id="AddModal" role="dialog" aria-labelledby="myModalLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel">Add Project isue tracker</h4>
			</div>
			{!! Form::open(['action' => 'LA\Project_isue_trackersController@store', 'id' => 'project_isue_tracker-add-form']) !!}
			<div class="modal-body">
				<div class="box-body">
                    @la_form($module)
					
					{{--
					@la_input($module, 'issue_task_name')
					@la_input($module, 'issue_task_priority')
					@la_input($module, 'issue_task_dept')
					@la_input($module, 'issue_start_date')
					@la_input($module, 'issue_end_date')
					@la_input($module, 'issue_task_owner')
					@la_input($module, 'issue_task_co_owner')
					@la_input($module, 'issue_remindr_freq')
					@la_input($module, 'project_id')
					@la_input($module, 'issue_status')
					@la_input($module, 'completion_date')
					@la_input($module, 'issue_revised_date')
					@la_input($module, 'issue_task_reason')
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
        ajax: "{{ url(config('laraadmin.adminRoute') . '/project_isue_tracker_dt_ajax') }}",
		language: {
			lengthMenu: "_MENU_",
			search: "_INPUT_",
			searchPlaceholder: "Search"
		},
		@if($show_actions)
		columnDefs: [ { orderable: false, targets: [-1] }],
		@endif
	});
	$("#project_isue_tracker-add-form").validate({
		
	});
});
</script>
@endpush
