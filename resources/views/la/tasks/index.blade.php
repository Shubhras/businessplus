
@extends("la.layouts.app")
<style type="text/css">
	.excel_form{
		position: relative;
		left: 148px;
		bottom: 44px;
	}
	select#status_id {
	    padding: 6px;
	    margin-right: 10px;
	}
</style>
@section("contentheader_title", "Tasks")
@section("contentheader_description", "Tasks listing")
@section("section", "Tasks")
@section("sub_section", "Listing")
@section("htmlheader_title", "Tasks Listing")

@section("headerElems")
@la_access("Tasks", "create")
	<button class="btn btn-success btn-sm pull-right" data-toggle="modal" data-target="#AddModal">Add Task</button>
@endla_access

@endsection

@section("main-content")
<form action="{{ URL::to('download-excel-task') }}" method="POST" class="excel_form">
	<select name="status_id" id="status_id">
		<option value="select">Select Status All</option>
		<?php if(!empty($statuses_data)){
			foreach($statuses_data as $key =>$row){?>
		<option value="<?php echo $row->id?>"><?php echo $row->status_name?></option>
	<?php } }?>
	</select>
	<button type="submit" class="btn btn-success">Download CSV</button>
</form>
<!-- <form action="{{ URL::to('download-pdf-task') }}" method="POST" style="position: relative;left: 148px;bottom: 44px;">
	<button type="submit" class="btn btn-success">Download PDF</button>
</form> -->
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

@la_access("Tasks", "create")
<div class="modal fade" id="AddModal" role="dialog" aria-labelledby="myModalLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel">Add Task</h4>
			</div>
			{!! Form::open(['action' => 'LA\TasksController@store', 'id' => 'task-add-form']) !!}
			<div class="modal-body">
				<div class="box-body">
                    <!-- @la_form($module) -->
					@la_input($module, 'task_name')
					<!-- @la_input($module, 'department_master_id') -->
					<!-- @la_input($module, 'unit_id') -->
					<label for="role_id">Select Units :</label><br>
					<select name="unit_id" id="unit_id" style="margin-bottom: 20px;width: 100%;height: 33px;">
					<?php foreach ($units as $key=>$row){ ?>
						<option value="<?php echo $row->id?>"><?php echo $row->unit_name?></option>
					<?php }?>
					</select>
					<label for="role_id">Select Department :</label><br>
					<select id="department_master_id" name="department_master_id" style="margin-bottom: 20px;width: 100%;height: 33px;">
                    </select>
                    @la_input($module, 'project_id')
					@la_input($module, 'event_id')
					@la_input($module, 'priority_id')
					@la_input($module, 'user_id')
					@la_input($module, 'start_date')
					@la_input($module, 'end_date')
					@la_input($module, 'completion_date')
					@la_input($module, 'status_id')
					@la_input($module, 'enable')
					@la_input($module, 'assign_to')
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
        ajax: "{{ url(config('laraadmin.adminRoute') . '/task_dt_ajax') }}",
		language: {
			lengthMenu: "_MENU_",
			search: "_INPUT_",
			searchPlaceholder: "Search"
		},
		@if($show_actions)
		columnDefs: [ { orderable: false, targets: [-1] }],
		@endif
	});
	$("#task-add-form").validate({
		
	});
});
//unit dept select start
function change_unitto_dept(val){
	$.ajax({
            type: "GET",
            url: "{{ url('/get_dept_to_unit') }}",
            data: {
            "_token": "{{ csrf_token() }}",
            unit_id : val    },
            
            success : function(res){
             var newData = JSON.stringify(res);
               var myObject=JSON.parse(newData);
                $('#department_master_id').html("");
                 $.each(myObject,function(index,obj){
                  $.each(obj,function(i,v){
                   
                     $('#department_master_id').append($('<option>', {
                       value: v.id,
                       text : v.dept_name 
                       }));
                  });
                 });
            }
    });
}
$(document).ready(function(){
	var unit_id  = $('#unit_id').val();
	if(unit_id){
		 change_unitto_dept(unit_id);
	}
    $("#unit_id").change(function(){
        var b = $(this).val();
        /*var a = $('#unit_id').val();*/
       change_unitto_dept(b);
    });
 });
//unit dept select end
@if (Session::has('loginerror'))
  <script>
  $(document).ready(function() {
      alertify.set({ delay: 1000000 });
      $('.alertify-log').hide();
      alertify.error("Your email and password not valid !");
  });
  </script>
@endif
</script>
@endpush
