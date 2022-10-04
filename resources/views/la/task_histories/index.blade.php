@extends("la.layouts.app")
<style type="text/css">
	.excel_form{
		position: relative;
		left: 312px;
		bottom: 44px;
	}
	select#status_id {
	    padding: 6px;
	    margin-right: 10px;
	}
</style>
@section("contentheader_title", "Task histories")
@section("contentheader_description", "Task histories listing")
@section("section", "Task histories")
@section("sub_section", "Listing")
@section("htmlheader_title", "Task histories Listing")

@section("headerElems")
@la_access("Task_histories", "create")
	<button class="btn btn-success btn-sm pull-right" data-toggle="modal" data-target="#AddModal">Add Task history</button>
@endla_access
@endsection

@section("main-content")
<form action="{{ URL::to('download-excel-task-histories') }}" method="POST" class="excel_form">
	<input type="hidden" name="_token" id="csrf-token" value="{{ Session::token() }}" />
	<select name="status_id" id="status_id">
		<option value="select">Select Status All</option>
		<?php if(!empty($statuses_data)){
			foreach($statuses_data as $key =>$row){?>
		<option value="<?php echo $row->id?>"><?php echo $row->status_name?></option>
	<?php } }?>
	</select>
	<button type="submit" class="btn btn-success">Download CSV</button>
</form>
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

@la_access("Task_histories", "create")
<div class="modal fade" id="AddModal" role="dialog" aria-labelledby="myModalLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel">Add Task history</h4>
			</div>
			{!! Form::open(['action' => 'LA\Task_historiesController@store', 'id' => 'task_history-add-form']) !!}
			<div class="modal-body">
				<div class="box-body">
                    @la_form($module)
					
					{{--
					@la_input($module, 'task_id')
					@la_input($module, 'status_id')
					@la_input($module, 'logedin_user_id')
					@la_input($module, 'remark')
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
@if (Session::has('status'))
  <script>
  $(document).ready(function() {
      
      alert("Data not found!")
  });
  </script>
@endif
<script>
$(function () {
	$("#example1").DataTable({
		processing: true,
        serverSide: true,
        ajax: "{{ url(config('laraadmin.adminRoute') . '/task_history_dt_ajax') }}",
		language: {
			lengthMenu: "_MENU_",
			search: "_INPUT_",
			searchPlaceholder: "Search"
		},
		@if($show_actions)
		columnDefs: [ { orderable: false, targets: [-1] }],
		@endif
	});
	$("#task_history-add-form").validate({
		
	});
});
</script>
@endpush
