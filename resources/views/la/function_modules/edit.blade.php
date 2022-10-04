@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/function_modules') }}">Function Module</a> :
@endsection
@section("contentheader_description", $function_module->$view_col)
@section("section", "Function Modules")
@section("section_url", url(config('laraadmin.adminRoute') . '/function_modules'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Function Modules Edit : ".$function_module->$view_col)

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
				{!! Form::model($function_module, ['route' => [config('laraadmin.adminRoute') . '.function_modules.update', $function_module->id ], 'method'=>'PUT', 'id' => 'function_module-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'unit_id')
					@la_input($module, 'function_name')
					@la_input($module, 'function_details')
					@la_input($module, 'function_owner')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/function_modules') }}">Cancel</a></button>
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
	$("#function_module-edit-form").validate({
		
	});
});
</script>
@endpush
