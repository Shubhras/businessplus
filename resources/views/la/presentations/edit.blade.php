@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/presentations') }}">Presentation</a> :
@endsection
@section("contentheader_description", $presentation->$view_col)
@section("section", "Presentations")
@section("section_url", url(config('laraadmin.adminRoute') . '/presentations'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Presentations Edit : ".$presentation->$view_col)

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
				{!! Form::model($presentation, ['route' => [config('laraadmin.adminRoute') . '.presentations.update', $presentation->id ], 'method'=>'PUT', 'id' => 'presentation-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/presentations') }}">Cancel</a></button>
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
	$("#presentation-edit-form").validate({
		
	});
});
</script>
@endpush
