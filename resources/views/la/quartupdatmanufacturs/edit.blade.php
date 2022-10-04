@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/quartupdatmanufacturs') }}">QuartUpdatManufactur</a> :
@endsection
@section("contentheader_description", $quartupdatmanufactur->$view_col)
@section("section", "QuartUpdatManufacturs")
@section("section_url", url(config('laraadmin.adminRoute') . '/quartupdatmanufacturs'))
@section("sub_section", "Edit")

@section("htmlheader_title", "QuartUpdatManufacturs Edit : ".$quartupdatmanufactur->$view_col)

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
				{!! Form::model($quartupdatmanufactur, ['route' => [config('laraadmin.adminRoute') . '.quartupdatmanufacturs.update', $quartupdatmanufactur->id ], 'method'=>'PUT', 'id' => 'quartupdatmanufactur-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'highlight')
					@la_input($module, 'majorgaps')
					@la_input($module, 'challenges')
					@la_input($module, 'priorities')
					@la_input($module, 'photo')
					@la_input($module, 'year')
					@la_input($module, 'quarterly')
					@la_input($module, 'dept_id')
					@la_input($module, 'unit_id')
					@la_input($module, 'remark')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/quartupdatmanufacturs') }}">Cancel</a></button>
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
	$("#quartupdatmanufactur-edit-form").validate({
		
	});
});
</script>
@endpush
