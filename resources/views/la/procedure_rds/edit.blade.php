@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/procedure_rds') }}">Procedure rd</a> :
@endsection
@section("contentheader_description", $procedure_rd->$view_col)
@section("section", "Procedure rds")
@section("section_url", url(config('laraadmin.adminRoute') . '/procedure_rds'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Procedure rds Edit : ".$procedure_rd->$view_col)

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
				{!! Form::model($procedure_rd, ['route' => [config('laraadmin.adminRoute') . '.procedure_rds.update', $procedure_rd->id ], 'method'=>'PUT', 'id' => 'procedure_rd-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_procedure')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/procedure_rds') }}">Cancel</a></button>
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
	$("#procedure_rd-edit-form").validate({
		
	});
});
</script>
@endpush
