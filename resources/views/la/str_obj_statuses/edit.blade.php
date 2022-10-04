@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/str_obj_statuses') }}">Str obj status</a> :
@endsection
@section("contentheader_description", $str_obj_status->$view_col)
@section("section", "Str obj statuses")
@section("section_url", url(config('laraadmin.adminRoute') . '/str_obj_statuses'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Str obj statuses Edit : ".$str_obj_status->$view_col)

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
				{!! Form::model($str_obj_status, ['route' => [config('laraadmin.adminRoute') . '.str_obj_statuses.update', $str_obj_status->id ], 'method'=>'PUT', 'id' => 'str_obj_status-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'max')
					@la_input($module, 'min')
					@la_input($module, 'company_id')
					@la_input($module, 'color_code')
					@la_input($module, 'status_name')
					@la_input($module, 'accuracy_percentage')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/str_obj_statuses') }}">Cancel</a></button>
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
	$("#str_obj_status-edit-form").validate({
		
	});
});
</script>
@endpush
