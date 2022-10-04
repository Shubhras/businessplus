@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/swot_analyses') }}">Swot analysis</a> :
@endsection
@section("contentheader_description", $swot_analysis->$view_col)
@section("section", "Swot analyses")
@section("section_url", url(config('laraadmin.adminRoute') . '/swot_analyses'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Swot analyses Edit : ".$swot_analysis->$view_col)

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
				{!! Form::model($swot_analysis, ['route' => [config('laraadmin.adminRoute') . '.swot_analyses.update', $swot_analysis->id ], 'method'=>'PUT', 'id' => 'swot_analysis-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'menu')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/swot_analyses') }}">Cancel</a></button>
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
	$("#swot_analysis-edit-form").validate({
		
	});
});
</script>
@endpush
