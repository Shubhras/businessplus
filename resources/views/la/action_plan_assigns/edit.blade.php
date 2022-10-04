@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/action_plan_assigns') }}">Action plan assign</a> :
@endsection
@section("contentheader_description", $action_plan_assign->$view_col)
@section("section", "Action plan assigns")
@section("section_url", url(config('laraadmin.adminRoute') . '/action_plan_assigns'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Action plan assigns Edit : ".$action_plan_assign->$view_col)

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
				{!! Form::model($action_plan_assign, ['route' => [config('laraadmin.adminRoute') . '.action_plan_assigns.update', $action_plan_assign->id ], 'method'=>'PUT', 'id' => 'action_plan_assign-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'action_plan_id')
					@la_input($module, 'co_owner_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/action_plan_assigns') }}">Cancel</a></button>
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
	$("#action_plan_assign-edit-form").validate({
		
	});
});
</script>
@endpush
