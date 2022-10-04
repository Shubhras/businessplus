@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/business_priorities') }}">Business priority</a> :
@endsection
@section("contentheader_description", $business_priority->$view_col)
@section("section", "Business priorities")
@section("section_url", url(config('laraadmin.adminRoute') . '/business_priorities'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Business priorities Edit : ".$business_priority->$view_col)

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
				{!! Form::model($business_priority, ['route' => [config('laraadmin.adminRoute') . '.business_priorities.update', $business_priority->id ], 'method'=>'PUT', 'id' => 'business_priority-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'business_priority')
					@la_input($module, 'keywords')
					@la_input($module, 'company_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/business_priorities') }}">Cancel</a></button>
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
	$("#business_priority-edit-form").validate({
		
	});
});
</script>
@endpush
