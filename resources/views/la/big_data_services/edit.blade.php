@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/big_data_services') }}">Big data service</a> :
@endsection
@section("contentheader_description", $big_data_service->$view_col)
@section("section", "Big data services")
@section("section_url", url(config('laraadmin.adminRoute') . '/big_data_services'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Big data services Edit : ".$big_data_service->$view_col)

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
				{!! Form::model($big_data_service, ['route' => [config('laraadmin.adminRoute') . '.big_data_services.update', $big_data_service->id ], 'method'=>'PUT', 'id' => 'big_data_service-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_big_data')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/big_data_services') }}">Cancel</a></button>
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
	$("#big_data_service-edit-form").validate({
		
	});
});
</script>
@endpush
