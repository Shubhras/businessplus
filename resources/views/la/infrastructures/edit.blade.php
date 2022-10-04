@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/infrastructures') }}">Infrastructure</a> :
@endsection
@section("contentheader_description", $infrastructure->$view_col)
@section("section", "Infrastructures")
@section("section_url", url(config('laraadmin.adminRoute') . '/infrastructures'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Infrastructures Edit : ".$infrastructure->$view_col)

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
				{!! Form::model($infrastructure, ['route' => [config('laraadmin.adminRoute') . '.infrastructures.update', $infrastructure->id ], 'method'=>'PUT', 'id' => 'infrastructure-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_infrastructure')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/infrastructures') }}">Cancel</a></button>
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
	$("#infrastructure-edit-form").validate({
		
	});
});
</script>
@endpush
