@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/business_vitals') }}">Business vital</a> :
@endsection
@section("contentheader_description", $business_vital->$view_col)
@section("section", "Business vitals")
@section("section_url", url(config('laraadmin.adminRoute') . '/business_vitals'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Business vitals Edit : ".$business_vital->$view_col)

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
				{!! Form::model($business_vital, ['route' => [config('laraadmin.adminRoute') . '.business_vitals.update', $business_vital->id ], 'method'=>'PUT', 'id' => 'business_vital-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'business_vital_test')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/business_vitals') }}">Cancel</a></button>
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
	$("#business_vital-edit-form").validate({
		
	});
});
</script>
@endpush
