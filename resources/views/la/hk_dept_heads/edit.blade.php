@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/hk_dept_heads') }}">Hk dept head</a> :
@endsection
@section("contentheader_description", $hk_dept_head->$view_col)
@section("section", "Hk dept heads")
@section("section_url", url(config('laraadmin.adminRoute') . '/hk_dept_heads'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Hk dept heads Edit : ".$hk_dept_head->$view_col)

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
				{!! Form::model($hk_dept_head, ['route' => [config('laraadmin.adminRoute') . '.hk_dept_heads.update', $hk_dept_head->id ], 'method'=>'PUT', 'id' => 'hk_dept_head-edit-form']) !!}
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
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/hk_dept_heads') }}">Cancel</a></button>
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
	$("#hk_dept_head-edit-form").validate({
		
	});
});
</script>
@endpush
