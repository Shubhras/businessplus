@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/prima_processes') }}">Prima process</a> :
@endsection
@section("contentheader_description", $prima_process->$view_col)
@section("section", "Prima processes")
@section("section_url", url(config('laraadmin.adminRoute') . '/prima_processes'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Prima processes Edit : ".$prima_process->$view_col)

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
				{!! Form::model($prima_process, ['route' => [config('laraadmin.adminRoute') . '.prima_processes.update', $prima_process->id ], 'method'=>'PUT', 'id' => 'prima_process-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_prima')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/prima_processes') }}">Cancel</a></button>
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
	$("#prima_process-edit-form").validate({
		
	});
});
</script>
@endpush
