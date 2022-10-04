@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/post_images') }}">Post image</a> :
@endsection
@section("contentheader_description", $post_image->$view_col)
@section("section", "Post images")
@section("section_url", url(config('laraadmin.adminRoute') . '/post_images'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Post images Edit : ".$post_image->$view_col)

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
				{!! Form::model($post_image, ['route' => [config('laraadmin.adminRoute') . '.post_images.update', $post_image->id ], 'method'=>'PUT', 'id' => 'post_image-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'image_path')
					@la_input($module, 'image_name')
					@la_input($module, 'content')
					@la_input($module, 'user_id')
					@la_input($module, 'group_id')
					@la_input($module, 'unit_id')
					@la_input($module, 'company_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/post_images') }}">Cancel</a></button>
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
	$("#post_image-edit-form").validate({
		
	});
});
</script>
@endpush
