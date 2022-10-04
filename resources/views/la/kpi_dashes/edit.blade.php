@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/kpi_dashes') }}">Kpi dash</a> :
@endsection
@section("contentheader_description", $kpi_dash->$view_col)
@section("section", "Kpi dashes")
@section("section_url", url(config('laraadmin.adminRoute') . '/kpi_dashes'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Kpi dashes Edit : ".$kpi_dash->$view_col)

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
				{!! Form::model($kpi_dash, ['route' => [config('laraadmin.adminRoute') . '.kpi_dashes.update', $kpi_dash->id ], 'method'=>'PUT', 'id' => 'kpi_dash-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'permission')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/kpi_dashes') }}">Cancel</a></button>
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
	$("#kpi_dash-edit-form").validate({
		
	});
});
</script>
@endpush
