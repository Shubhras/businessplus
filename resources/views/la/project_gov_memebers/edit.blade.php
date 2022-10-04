@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/project_gov_memebers') }}">Project gov memeber</a> :
@endsection
@section("contentheader_description", $project_gov_memeber->$view_col)
@section("section", "Project gov memebers")
@section("section_url", url(config('laraadmin.adminRoute') . '/project_gov_memebers'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Project gov memebers Edit : ".$project_gov_memeber->$view_col)

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
				{!! Form::model($project_gov_memeber, ['route' => [config('laraadmin.adminRoute') . '.project_gov_memebers.update', $project_gov_memeber->id ], 'method'=>'PUT', 'id' => 'project_gov_memeber-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'project_gov_id')
					@la_input($module, 'member_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/project_gov_memebers') }}">Cancel</a></button>
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
	$("#project_gov_memeber-edit-form").validate({
		
	});
});
</script>
@endpush
