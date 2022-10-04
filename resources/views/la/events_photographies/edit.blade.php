@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/events_photographies') }}">Events photography</a> :
@endsection
@section("contentheader_description", $events_photography->$view_col)
@section("section", "Events photographies")
@section("section_url", url(config('laraadmin.adminRoute') . '/events_photographies'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Events photographies Edit : ".$events_photography->$view_col)

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
				{!! Form::model($events_photography, ['route' => [config('laraadmin.adminRoute') . '.events_photographies.update', $events_photography->id ], 'method'=>'PUT', 'id' => 'events_photography-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_events_photo')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/events_photographies') }}">Cancel</a></button>
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
	$("#events_photography-edit-form").validate({
		
	});
});
</script>
@endpush
