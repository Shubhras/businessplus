@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/u_o_ms') }}">U o m</a> :
@endsection
@section("contentheader_description", $u_o_m->$view_col)
@section("section", "U o ms")
@section("section_url", url(config('laraadmin.adminRoute') . '/u_o_ms'))
@section("sub_section", "Edit")

@section("htmlheader_title", "U o ms Edit : ".$u_o_m->$view_col)

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
				{!! Form::model($u_o_m, ['route' => [config('laraadmin.adminRoute') . '.u_o_ms.update', $u_o_m->id ], 'method'=>'PUT', 'id' => 'u_o_m-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'company_id')
					@la_input($module, 'name')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/u_o_ms') }}">Cancel</a></button>
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
	$("#u_o_m-edit-form").validate({
		
	});
});
</script>
@endpush
