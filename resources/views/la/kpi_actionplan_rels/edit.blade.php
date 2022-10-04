@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/kpi_actionplan_rels') }}">Kpi actionplan rel</a> :
@endsection
@section("contentheader_description", $kpi_actionplan_rel->$view_col)
@section("section", "Kpi actionplan rels")
@section("section_url", url(config('laraadmin.adminRoute') . '/kpi_actionplan_rels'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Kpi actionplan rels Edit : ".$kpi_actionplan_rel->$view_col)

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
				{!! Form::model($kpi_actionplan_rel, ['route' => [config('laraadmin.adminRoute') . '.kpi_actionplan_rels.update', $kpi_actionplan_rel->id ], 'method'=>'PUT', 'id' => 'kpi_actionplan_rel-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'kpi_id')
					@la_input($module, 'action_plan_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/kpi_actionplan_rels') }}">Cancel</a></button>
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
	$("#kpi_actionplan_rel-edit-form").validate({
		
	});
});
</script>
@endpush
