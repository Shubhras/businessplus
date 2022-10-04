@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/reflection_past_years') }}">Reflection past year</a> :
@endsection
@section("contentheader_description", $reflection_past_year->$view_col)
@section("section", "Reflection past years")
@section("section_url", url(config('laraadmin.adminRoute') . '/reflection_past_years'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Reflection past years Edit : ".$reflection_past_year->$view_col)

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
				{!! Form::model($reflection_past_year, ['route' => [config('laraadmin.adminRoute') . '.reflection_past_years.update', $reflection_past_year->id ], 'method'=>'PUT', 'id' => 'reflection_past_year-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'menu')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/reflection_past_years') }}">Cancel</a></button>
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
	$("#reflection_past_year-edit-form").validate({
		
	});
});
</script>
@endpush
