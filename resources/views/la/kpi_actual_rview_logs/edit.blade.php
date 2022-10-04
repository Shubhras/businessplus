@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/kpi_actual_rview_logs') }}">Kpi actual rview log</a> :
@endsection
@section("contentheader_description", $kpi_actual_rview_log->$view_col)
@section("section", "Kpi actual rview logs")
@section("section_url", url(config('laraadmin.adminRoute') . '/kpi_actual_rview_logs'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Kpi actual rview logs Edit : ".$kpi_actual_rview_log->$view_col)

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
				{!! Form::model($kpi_actual_rview_log, ['route' => [config('laraadmin.adminRoute') . '.kpi_actual_rview_logs.update', $kpi_actual_rview_log->id ], 'method'=>'PUT', 'id' => 'kpi_actual_rview_log-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'kpi_id')
					@la_input($module, 'month')
					@la_input($module, 'actual_year')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/kpi_actual_rview_logs') }}">Cancel</a></button>
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
	$("#kpi_actual_rview_log-edit-form").validate({
		
	});
});
</script>
@endpush
