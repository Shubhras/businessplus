@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/action_plan_statuses') }}">Action plan status</a> :
@endsection
@section("contentheader_description", $action_plan_status->$view_col)
@section("section", "Action plan statuses")
@section("section_url", url(config('laraadmin.adminRoute') . '/action_plan_statuses'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Action plan statuses Edit : ".$action_plan_status->$view_col)

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
				{!! Form::model($action_plan_status, ['route' => [config('laraadmin.adminRoute') . '.action_plan_statuses.update', $action_plan_status->id ], 'method'=>'PUT', 'id' => 'action_plan_status-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'action_plan_id')
					@la_input($module, 'status_id')
					@la_input($module, 'percentage')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/action_plan_statuses') }}">Cancel</a></button>
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
	$("#action_plan_status-edit-form").validate({
		
	});
});
</script>
@endpush
