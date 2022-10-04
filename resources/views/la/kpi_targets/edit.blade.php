@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/kpi_targets') }}">Kpi target</a> :
@endsection
@section("contentheader_description", $kpi_target->$view_col)
@section("section", "Kpi targets")
@section("section_url", url(config('laraadmin.adminRoute') . '/kpi_targets'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Kpi targets Edit : ".$kpi_target->$view_col)

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
				{!! Form::model($kpi_target, ['route' => [config('laraadmin.adminRoute') . '.kpi_targets.update', $kpi_target->id ], 'method'=>'PUT', 'id' => 'kpi_target-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'sep')
					@la_input($module, 'year_end')
					@la_input($module, 'user_id')
					@la_input($module, 'ytd')
					@la_input($module, 'target_condition')
					@la_input($module, 'target_year')
					@la_input($module, 'dec')
					@la_input($module, 'nov')
					@la_input($module, 'oct')
					@la_input($module, 'kpi_id')
					@la_input($module, 'aug')
					@la_input($module, 'jul')
					@la_input($module, 'jun')
					@la_input($module, 'may')
					@la_input($module, 'apr')
					@la_input($module, 'mar')
					@la_input($module, 'feb')
					@la_input($module, 'jan')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/kpi_targets') }}">Cancel</a></button>
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
	$("#kpi_target-edit-form").validate({
		
	});
});
</script>
@endpush
