@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/facility_details') }}">Facility detail</a> :
@endsection
@section("contentheader_description", $facility_detail->$view_col)
@section("section", "Facility details")
@section("section_url", url(config('laraadmin.adminRoute') . '/facility_details'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Facility details Edit : ".$facility_detail->$view_col)

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
				{!! Form::model($facility_detail, ['route' => [config('laraadmin.adminRoute') . '.facility_details.update', $facility_detail->id ], 'method'=>'PUT', 'id' => 'facility_detail-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'facility_test')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/facility_details') }}">Cancel</a></button>
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
	$("#facility_detail-edit-form").validate({
		
	});
});
</script>
@endpush
