@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/str_object_gards') }}">Str object gard</a> :
@endsection
@section("contentheader_description", $str_object_gard->$view_col)
@section("section", "Str object gards")
@section("section_url", url(config('laraadmin.adminRoute') . '/str_object_gards'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Str object gards Edit : ".$str_object_gard->$view_col)

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
				{!! Form::model($str_object_gard, ['route' => [config('laraadmin.adminRoute') . '.str_object_gards.update', $str_object_gard->id ], 'method'=>'PUT', 'id' => 'str_object_gard-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'name')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/str_object_gards') }}">Cancel</a></button>
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
	$("#str_object_gard-edit-form").validate({
		
	});
});
</script>
@endpush
