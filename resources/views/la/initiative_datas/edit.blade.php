@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/initiative_datas') }}">Initiative data</a> :
@endsection
@section("contentheader_description", $initiative_data->$view_col)
@section("section", "Initiative datas")
@section("section_url", url(config('laraadmin.adminRoute') . '/initiative_datas'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Initiative datas Edit : ".$initiative_data->$view_col)

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
				{!! Form::model($initiative_data, ['route' => [config('laraadmin.adminRoute') . '.initiative_datas.update', $initiative_data->id ], 'method'=>'PUT', 'id' => 'initiative_data-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'permission')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/initiative_datas') }}">Cancel</a></button>
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
	$("#initiative_data-edit-form").validate({
		
	});
});
</script>
@endpush
