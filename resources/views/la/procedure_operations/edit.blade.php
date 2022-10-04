@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/procedure_operations') }}">Procedure operation</a> :
@endsection
@section("contentheader_description", $procedure_operation->$view_col)
@section("section", "Procedure operations")
@section("section_url", url(config('laraadmin.adminRoute') . '/procedure_operations'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Procedure operations Edit : ".$procedure_operation->$view_col)

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
				{!! Form::model($procedure_operation, ['route' => [config('laraadmin.adminRoute') . '.procedure_operations.update', $procedure_operation->id ], 'method'=>'PUT', 'id' => 'procedure_operation-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_operations')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/procedure_operations') }}">Cancel</a></button>
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
	$("#procedure_operation-edit-form").validate({
		
	});
});
</script>
@endpush
