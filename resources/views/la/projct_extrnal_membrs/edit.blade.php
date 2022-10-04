@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/projct_extrnal_membrs') }}">Projct extrnal membr</a> :
@endsection
@section("contentheader_description", $projct_extrnal_membr->$view_col)
@section("section", "Projct extrnal membrs")
@section("section_url", url(config('laraadmin.adminRoute') . '/projct_extrnal_membrs'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Projct extrnal membrs Edit : ".$projct_extrnal_membr->$view_col)

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
				{!! Form::model($projct_extrnal_membr, ['route' => [config('laraadmin.adminRoute') . '.projct_extrnal_membrs.update', $projct_extrnal_membr->id ], 'method'=>'PUT', 'id' => 'projct_extrnal_membr-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'project_id')
					@la_input($module, 'ex_membar_name')
					@la_input($module, 'department')
					@la_input($module, 'email_id')
					@la_input($module, 'phone_number')
					@la_input($module, 'photo')
					@la_input($module, 'company_name')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/projct_extrnal_membrs') }}">Cancel</a></button>
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
	$("#projct_extrnal_membr-edit-form").validate({
		
	});
});
</script>
@endpush
