@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/action_plan_schedules') }}">Action plan schedule</a> :
@endsection
@section("contentheader_description", $action_plan_schedule->$view_col)
@section("section", "Action plan schedules")
@section("section_url", url(config('laraadmin.adminRoute') . '/action_plan_schedules'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Action plan schedules Edit : ".$action_plan_schedule->$view_col)

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
				{!! Form::model($action_plan_schedule, ['route' => [config('laraadmin.adminRoute') . '.action_plan_schedules.update', $action_plan_schedule->id ], 'method'=>'PUT', 'id' => 'action_plan_schedule-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'comment')
					@la_input($module, 'implement_data')
					@la_input($module, 'recovery_plan')
					@la_input($module, 'responsibility')
					@la_input($module, 'action_plan_id')
					@la_input($module, 'month_date')
					@la_input($module, 'owner_id')
					@la_input($module, 'status')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/action_plan_schedules') }}">Cancel</a></button>
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
	$("#action_plan_schedule-edit-form").validate({
		
	});
});
</script>
@endpush
