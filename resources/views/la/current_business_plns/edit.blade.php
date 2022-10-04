@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/current_business_plns') }}">Current business pln</a> :
@endsection
@section("contentheader_description", $current_business_pln->$view_col)
@section("section", "Current business plns")
@section("section_url", url(config('laraadmin.adminRoute') . '/current_business_plns'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Current business plns Edit : ".$current_business_pln->$view_col)

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
				{!! Form::model($current_business_pln, ['route' => [config('laraadmin.adminRoute') . '.current_business_plns.update', $current_business_pln->id ], 'method'=>'PUT', 'id' => 'current_business_pln-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_business_plan')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/current_business_plns') }}">Cancel</a></button>
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
	$("#current_business_pln-edit-form").validate({
		
	});
});
</script>
@endpush
