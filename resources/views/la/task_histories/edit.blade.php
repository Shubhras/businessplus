@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/task_histories') }}">Task history</a> :
@endsection
@section("contentheader_description", $task_history->$view_col)
@section("section", "Task histories")
@section("section_url", url(config('laraadmin.adminRoute') . '/task_histories'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Task histories Edit : ".$task_history->$view_col)

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
				{!! Form::model($task_history, ['route' => [config('laraadmin.adminRoute') . '.task_histories.update', $task_history->id ], 'method'=>'PUT', 'id' => 'task_history-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'task_id')
					@la_input($module, 'status_id')
					@la_input($module, 'logedin_user_id')
					@la_input($module, 'remark')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/task_histories') }}">Cancel</a></button>
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
	$("#task_history-edit-form").validate({
		
	});
});
</script>
@endpush
