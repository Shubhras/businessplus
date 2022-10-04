@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/procedure_hrs') }}">Procedure hr</a> :
@endsection
@section("contentheader_description", $procedure_hr->$view_col)
@section("section", "Procedure hrs")
@section("section_url", url(config('laraadmin.adminRoute') . '/procedure_hrs'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Procedure hrs Edit : ".$procedure_hr->$view_col)

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
				{!! Form::model($procedure_hr, ['route' => [config('laraadmin.adminRoute') . '.procedure_hrs.update', $procedure_hr->id ], 'method'=>'PUT', 'id' => 'procedure_hr-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_procedure_hr')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/procedure_hrs') }}">Cancel</a></button>
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
	$("#procedure_hr-edit-form").validate({
		
	});
});
</script>
@endpush
