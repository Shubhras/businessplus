@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/tasks') }}">Task</a> :
@endsection
@section("contentheader_description", $task->$view_col)
@section("section", "Tasks")
@section("section_url", url(config('laraadmin.adminRoute') . '/tasks'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Tasks Edit : ".$task->$view_col)

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
				{!! Form::model($task, ['route' => [config('laraadmin.adminRoute') . '.tasks.update', $task->id ], 'method'=>'PUT', 'id' => 'task-edit-form']) !!}
					<!-- @la_form($module) -->
					
					@la_input($module, 'task_name')
					@la_input($module, 'event_id')
					@la_input($module, 'priority_id')
					@la_input($module, 'project_id')
					<!-- @la_input($module, 'department_master_id')
					@la_input($module, 'unit_id') -->
					<label for="role_id">Select Units :</label><br>
					<select name="unit_id" id="unit_id" style="margin-bottom: 20px;width: 100%;height: 33px;">
					<?php foreach ($units_data as $key=>$row){ ?>
						<option value="<?php echo $row->id?>" <?php if($row->id == $task->unit_id){ echo ' selected="selected"'; }?>><?php echo $row->unit_name?></option>
					<?php }?>
					</select>

					<label for="role_id">Select Department :</label><br>
					<select id="department_master_id" name="department_master_id" style="margin-bottom: 20px;width: 100%;height: 33px;">
						<?php foreach ($dept_data as $key=>$row){ ?>
						<option value="<?php echo $row->id?>"<?php if($row->id == $task->department_master_id){ echo ' selected="selected"'; }?> ><?php echo $row->dept_name?></option>
					<?php }?>
                    </select>
					@la_input($module, 'user_id')
					@la_input($module, 'start_date')
					@la_input($module, 'end_date')
					@la_input($module, 'completion_date')
					@la_input($module, 'status_id')
					@la_input($module, 'enable')
					@la_input($module, 'assign_to')
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/tasks') }}">Cancel</a></button>
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
	$("#task-edit-form").validate({
		
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
		// change_unitto_dept(unit_id);
	}
    $("#unit_id").change(function(){
    	alert("sdfsdf");
        var b = $(this).val();
        /*var a = $('#unit_id').val();*/
       change_unitto_dept(b);
    });
 });
//unit dept select end
</script>
@endpush
