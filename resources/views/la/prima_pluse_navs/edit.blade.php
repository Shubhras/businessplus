@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/prima_pluse_navs') }}">Prima pluse nav</a> :
@endsection
@section("contentheader_description", $prima_pluse_nav->$view_col)
@section("section", "Prima pluse navs")
@section("section_url", url(config('laraadmin.adminRoute') . '/prima_pluse_navs'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Prima pluse navs Edit : ".$prima_pluse_nav->$view_col)

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
				{!! Form::model($prima_pluse_nav, ['route' => [config('laraadmin.adminRoute') . '.prima_pluse_navs.update', $prima_pluse_nav->id ], 'method'=>'PUT', 'id' => 'prima_pluse_nav-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_prima')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/prima_pluse_navs') }}">Cancel</a></button>
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
	$("#prima_pluse_nav-edit-form").validate({
		
	});
});
</script>
@endpush
