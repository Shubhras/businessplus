@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/action_plans') }}">Action plan</a> :
@endsection
@section("contentheader_description", $action_plan->$view_col)
@section("section", "Action plans")
@section("section_url", url(config('laraadmin.adminRoute') . '/action_plans'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Action plans Edit : ".$action_plan->$view_col)

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
				{!! Form::model($action_plan, ['route' => [config('laraadmin.adminRoute') . '.action_plans.update', $action_plan->id ], 'method'=>'PUT', 'id' => 'action_plan-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'end_date')
					@la_input($module, 'sr_no')
					@la_input($module, 'previous_status')
					@la_input($module, 'reminder_date')
					@la_input($module, 'reminder_frequency')
					@la_input($module, 'definition')
					@la_input($module, 'target')
					@la_input($module, 'start_date')
					@la_input($module, 'control_point')
					@la_input($module, 'owner')
					@la_input($module, 'co_owner')
					@la_input($module, 'status')
					@la_input($module, 'unit_id')
					@la_input($module, 'user_id')
					@la_input($module, 'initiatives_id')
					@la_input($module, 'dept_id')
					@la_input($module, 'percentage')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/action_plans') }}">Cancel</a></button>
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
	$("#action_plan-edit-form").validate({
		
	});
});
</script>
@endpush
