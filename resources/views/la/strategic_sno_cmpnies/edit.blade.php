@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/strategic_sno_cmpnies') }}">Strategic sno cmpny</a> :
@endsection
@section("contentheader_description", $strategic_sno_cmpny->$view_col)
@section("section", "Strategic sno cmpnies")
@section("section_url", url(config('laraadmin.adminRoute') . '/strategic_sno_cmpnies'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Strategic sno cmpnies Edit : ".$strategic_sno_cmpny->$view_col)

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
				{!! Form::model($strategic_sno_cmpny, ['route' => [config('laraadmin.adminRoute') . '.strategic_sno_cmpnies.update', $strategic_sno_cmpny->id ], 'method'=>'PUT', 'id' => 'strategic_sno_cmpny-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 's_no')
					@la_input($module, 's_o_id')
					@la_input($module, 'company_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/strategic_sno_cmpnies') }}">Cancel</a></button>
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
	$("#strategic_sno_cmpny-edit-form").validate({
		
	});
});
</script>
@endpush
