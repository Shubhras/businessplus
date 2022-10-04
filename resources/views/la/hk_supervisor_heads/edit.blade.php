@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/hk_supervisor_heads') }}">Hk supervisor head</a> :
@endsection
@section("contentheader_description", $hk_supervisor_head->$view_col)
@section("section", "Hk supervisor heads")
@section("section_url", url(config('laraadmin.adminRoute') . '/hk_supervisor_heads'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Hk supervisor heads Edit : ".$hk_supervisor_head->$view_col)

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
				{!! Form::model($hk_supervisor_head, ['route' => [config('laraadmin.adminRoute') . '.hk_supervisor_heads.update', $hk_supervisor_head->id ], 'method'=>'PUT', 'id' => 'hk_supervisor_head-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'hoshin_kanri_id')
					@la_input($module, 'allocation_id')
					@la_input($module, 'assign_user')
					@la_input($module, 'value')
					@la_input($module, 'percent')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/hk_supervisor_heads') }}">Cancel</a></button>
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
	$("#hk_supervisor_head-edit-form").validate({
		
	});
});
</script>
@endpush
