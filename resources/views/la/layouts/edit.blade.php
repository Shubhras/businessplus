@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/layouts') }}">Layout</a> :
@endsection
@section("contentheader_description", $layout->$view_col)
@section("section", "Layouts")
@section("section_url", url(config('laraadmin.adminRoute') . '/layouts'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Layouts Edit : ".$layout->$view_col)

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
				{!! Form::model($layout, ['route' => [config('laraadmin.adminRoute') . '.layouts.update', $layout->id ], 'method'=>'PUT', 'id' => 'layout-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_layout')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/layouts') }}">Cancel</a></button>
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
	$("#layout-edit-form").validate({
		
	});
});
</script>
@endpush
