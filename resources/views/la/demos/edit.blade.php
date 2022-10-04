@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/demos') }}">Demo</a> :
@endsection
@section("contentheader_description", $demo->$view_col)
@section("section", "Demos")
@section("section_url", url(config('laraadmin.adminRoute') . '/demos'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Demos Edit : ".$demo->$view_col)

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
				{!! Form::model($demo, ['route' => [config('laraadmin.adminRoute') . '.demos.update', $demo->id ], 'method'=>'PUT', 'id' => 'demo-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_demo')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/demos') }}">Cancel</a></button>
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
	$("#demo-edit-form").validate({
		
	});
});
</script>
@endpush
