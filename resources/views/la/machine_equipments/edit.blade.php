@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/machine_equipments') }}">Machine equipment</a> :
@endsection
@section("contentheader_description", $machine_equipment->$view_col)
@section("section", "Machine equipments")
@section("section_url", url(config('laraadmin.adminRoute') . '/machine_equipments'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Machine equipments Edit : ".$machine_equipment->$view_col)

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
				{!! Form::model($machine_equipment, ['route' => [config('laraadmin.adminRoute') . '.machine_equipments.update', $machine_equipment->id ], 'method'=>'PUT', 'id' => 'machine_equipment-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_machine_eqpmnt')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/machine_equipments') }}">Cancel</a></button>
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
	$("#machine_equipment-edit-form").validate({
		
	});
});
</script>
@endpush
