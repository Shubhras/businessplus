@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/units') }}">Unit</a> :
@endsection
@section("contentheader_description", $unit->$view_col)
@section("section", "Units")
@section("section_url", url(config('laraadmin.adminRoute') . '/units'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Units Edit : ".$unit->$view_col)

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
				{!! Form::model($unit, ['route' => [config('laraadmin.adminRoute') . '.units.update', $unit->id ], 'method'=>'PUT', 'id' => 'unit-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'unit_name')
					@la_input($module, 'unit_address')
					@la_input($module, 'unit_state')
					@la_input($module, 'unit_city')
					@la_input($module, 'company_id')
					@la_input($module, 'enable')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/units') }}">Cancel</a></button>
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
	$("#unit-edit-form").validate({
		
	});
});
</script>
@endpush
