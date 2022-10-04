@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/objectives_steps') }}">Objectives Step</a> :
@endsection
@section("contentheader_description", $objectives_step->$view_col)
@section("section", "Objectives Steps")
@section("section_url", url(config('laraadmin.adminRoute') . '/objectives_steps'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Objectives Steps Edit : ".$objectives_step->$view_col)

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
				{!! Form::model($objectives_step, ['route' => [config('laraadmin.adminRoute') . '.objectives_steps.update', $objectives_step->id ], 'method'=>'PUT', 'id' => 'objectives_step-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'step_id')
					@la_input($module, 'step_name')
					@la_input($module, 'unit_id')
					@la_input($module, 'company_id')
					@la_input($module, 'user_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/objectives_steps') }}">Cancel</a></button>
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
	$("#objectives_step-edit-form").validate({
		
	});
});
</script>
@endpush
