@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/sections') }}">Section</a> :
@endsection
@section("contentheader_description", $section->$view_col)
@section("section", "Sections")
@section("section_url", url(config('laraadmin.adminRoute') . '/sections'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Sections Edit : ".$section->$view_col)

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
				{!! Form::model($section, ['route' => [config('laraadmin.adminRoute') . '.sections.update', $section->id ], 'method'=>'PUT', 'id' => 'section-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'section_name')
					@la_input($module, 'dept_id')
					@la_input($module, 'enable')
					@la_input($module, 'unit_id')
					@la_input($module, 'company_id')
					@la_input($module, 'user_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/sections') }}">Cancel</a></button>
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
	$("#section-edit-form").validate({
		
	});
});
</script>
@endpush
