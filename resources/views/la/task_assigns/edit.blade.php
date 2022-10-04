@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/task_assigns') }}">Task assign</a> :
@endsection
@section("contentheader_description", $task_assign->$view_col)
@section("section", "Task assigns")
@section("section_url", url(config('laraadmin.adminRoute') . '/task_assigns'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Task assigns Edit : ".$task_assign->$view_col)

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
				{!! Form::model($task_assign, ['route' => [config('laraadmin.adminRoute') . '.task_assigns.update', $task_assign->id ], 'method'=>'PUT', 'id' => 'task_assign-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'task_id')
					@la_input($module, 'user_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/task_assigns') }}">Cancel</a></button>
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
	$("#task_assign-edit-form").validate({
		
	});
});
</script>
@endpush
