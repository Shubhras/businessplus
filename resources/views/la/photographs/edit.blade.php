@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/photographs') }}">Photograph</a> :
@endsection
@section("contentheader_description", $photograph->$view_col)
@section("section", "Photographs")
@section("section_url", url(config('laraadmin.adminRoute') . '/photographs'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Photographs Edit : ".$photograph->$view_col)

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
				{!! Form::model($photograph, ['route' => [config('laraadmin.adminRoute') . '.photographs.update', $photograph->id ], 'method'=>'PUT', 'id' => 'photograph-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_photograph')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/photographs') }}">Cancel</a></button>
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
	$("#photograph-edit-form").validate({
		
	});
});
</script>
@endpush
