@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/task_dashes') }}">Task dash</a> :
@endsection
@section("contentheader_description", $task_dash->$view_col)
@section("section", "Task dashes")
@section("section_url", url(config('laraadmin.adminRoute') . '/task_dashes'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Task dashes Edit : ".$task_dash->$view_col)

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
				{!! Form::model($task_dash, ['route' => [config('laraadmin.adminRoute') . '.task_dashes.update', $task_dash->id ], 'method'=>'PUT', 'id' => 'task_dash-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'permission')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/task_dashes') }}">Cancel</a></button>
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
	$("#task_dash-edit-form").validate({
		
	});
});
</script>
@endpush
