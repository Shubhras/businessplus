@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/business_menuses') }}">Business menus</a> :
@endsection
@section("contentheader_description", $business_menus->$view_col)
@section("section", "Business menuses")
@section("section_url", url(config('laraadmin.adminRoute') . '/business_menuses'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Business menuses Edit : ".$business_menus->$view_col)

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
				{!! Form::model($business_menus, ['route' => [config('laraadmin.adminRoute') . '.business_menuses.update', $business_menus->id ], 'method'=>'PUT', 'id' => 'business_menus-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'permission')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/business_menuses') }}">Cancel</a></button>
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
	$("#business_menus-edit-form").validate({
		
	});
});
</script>
@endpush
