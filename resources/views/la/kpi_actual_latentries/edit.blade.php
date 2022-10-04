@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/kpi_actual_latentries') }}">Kpi actual latentry</a> :
@endsection
@section("contentheader_description", $kpi_actual_latentry->$view_col)
@section("section", "Kpi actual latentries")
@section("section_url", url(config('laraadmin.adminRoute') . '/kpi_actual_latentries'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Kpi actual latentries Edit : ".$kpi_actual_latentry->$view_col)

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
				{!! Form::model($kpi_actual_latentry, ['route' => [config('laraadmin.adminRoute') . '.kpi_actual_latentries.update', $kpi_actual_latentry->id ], 'method'=>'PUT', 'id' => 'kpi_actual_latentry-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'months')
					@la_input($module, 'kpi_id')
					@la_input($module, 'status')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/kpi_actual_latentries') }}">Cancel</a></button>
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
	$("#kpi_actual_latentry-edit-form").validate({
		
	});
});
</script>
@endpush
