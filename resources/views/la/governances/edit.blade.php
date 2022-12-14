@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/governances') }}">Governance</a> :
@endsection
@section("contentheader_description", $governance->$view_col)
@section("section", "Governances")
@section("section_url", url(config('laraadmin.adminRoute') . '/governances'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Governances Edit : ".$governance->$view_col)

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
				{!! Form::model($governance, ['route' => [config('laraadmin.adminRoute') . '.governances.update', $governance->id ], 'method'=>'PUT', 'id' => 'governance-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'governances_test')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/governances') }}">Cancel</a></button>
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
	$("#governance-edit-form").validate({
		
	});
});
</script>
@endpush
