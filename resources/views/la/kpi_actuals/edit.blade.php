@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/kpi_actuals') }}">Kpi actual</a> :
@endsection
@section("contentheader_description", $kpi_actual->$view_col)
@section("section", "Kpi actuals")
@section("section_url", url(config('laraadmin.adminRoute') . '/kpi_actuals'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Kpi actuals Edit : ".$kpi_actual->$view_col)

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
				{!! Form::model($kpi_actual, ['route' => [config('laraadmin.adminRoute') . '.kpi_actuals.update', $kpi_actual->id ], 'method'=>'PUT', 'id' => 'kpi_actual-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'ytd')
					@la_input($module, 'user_id')
					@la_input($module, 'kpi_id')
					@la_input($module, 'jan')
					@la_input($module, 'feb')
					@la_input($module, 'mar')
					@la_input($module, 'apr')
					@la_input($module, 'may')
					@la_input($module, 'jun')
					@la_input($module, 'jul')
					@la_input($module, 'aug')
					@la_input($module, 'sep')
					@la_input($module, 'oct')
					@la_input($module, 'nov')
					@la_input($module, 'dec')
					@la_input($module, 'actual_year')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/kpi_actuals') }}">Cancel</a></button>
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
	$("#kpi_actual-edit-form").validate({
		
	});
});
</script>
@endpush
