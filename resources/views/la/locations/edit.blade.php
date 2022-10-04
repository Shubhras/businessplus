@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/locations') }}">Location</a> :
@endsection
@section("contentheader_description", $location->$view_col)
@section("section", "Locations")
@section("section_url", url(config('laraadmin.adminRoute') . '/locations'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Locations Edit : ".$location->$view_col)

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
				{!! Form::model($location, ['route' => [config('laraadmin.adminRoute') . '.locations.update', $location->id ], 'method'=>'PUT', 'id' => 'location-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_location')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/locations') }}">Cancel</a></button>
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
	$("#location-edit-form").validate({
		
	});
});
</script>
@endpush
