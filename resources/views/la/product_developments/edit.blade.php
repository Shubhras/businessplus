@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/product_developments') }}">Product development</a> :
@endsection
@section("contentheader_description", $product_development->$view_col)
@section("section", "Product developments")
@section("section_url", url(config('laraadmin.adminRoute') . '/product_developments'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Product developments Edit : ".$product_development->$view_col)

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
				{!! Form::model($product_development, ['route' => [config('laraadmin.adminRoute') . '.product_developments.update', $product_development->id ], 'method'=>'PUT', 'id' => 'product_development-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_product')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/product_developments') }}">Cancel</a></button>
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
	$("#product_development-edit-form").validate({
		
	});
});
</script>
@endpush
