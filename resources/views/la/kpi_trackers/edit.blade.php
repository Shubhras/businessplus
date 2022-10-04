@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/kpi_trackers') }}">Kpi tracker</a> :
@endsection
@section("contentheader_description", $kpi_tracker->$view_col)
@section("section", "Kpi trackers")
@section("section_url", url(config('laraadmin.adminRoute') . '/kpi_trackers'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Kpi trackers Edit : ".$kpi_tracker->$view_col)

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
				{!! Form::model($kpi_tracker, ['route' => [config('laraadmin.adminRoute') . '.kpi_trackers.update', $kpi_tracker->id ], 'method'=>'PUT', 'id' => 'kpi_tracker-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'permission')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/kpi_trackers') }}">Cancel</a></button>
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
	$("#kpi_tracker-edit-form").validate({
		
	});
});
</script>
@endpush
