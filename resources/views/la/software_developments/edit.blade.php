@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/software_developments') }}">Software development</a> :
@endsection
@section("contentheader_description", $software_development->$view_col)
@section("section", "Software developments")
@section("section_url", url(config('laraadmin.adminRoute') . '/software_developments'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Software developments Edit : ".$software_development->$view_col)

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
				{!! Form::model($software_development, ['route' => [config('laraadmin.adminRoute') . '.software_developments.update', $software_development->id ], 'method'=>'PUT', 'id' => 'software_development-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_software')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/software_developments') }}">Cancel</a></button>
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
	$("#software_development-edit-form").validate({
		
	});
});
</script>
@endpush
