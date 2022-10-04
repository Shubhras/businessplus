@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/kpi_performance_dashes') }}">Kpi performance dash</a> :
@endsection
@section("contentheader_description", $kpi_performance_dash->$view_col)
@section("section", "Kpi performance dashes")
@section("section_url", url(config('laraadmin.adminRoute') . '/kpi_performance_dashes'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Kpi performance dashes Edit : ".$kpi_performance_dash->$view_col)

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
				{!! Form::model($kpi_performance_dash, ['route' => [config('laraadmin.adminRoute') . '.kpi_performance_dashes.update', $kpi_performance_dash->id ], 'method'=>'PUT', 'id' => 'kpi_performance_dash-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'name')
					@la_input($module, 'slug')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/kpi_performance_dashes') }}">Cancel</a></button>
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
	$("#kpi_performance_dash-edit-form").validate({
		
	});
});
</script>
@endpush
